import type { APIRoute } from 'astro';
import type Stripe from 'stripe';
import { env, isStripeConfigured, isSupabaseConfigured } from '../../lib/env';
import { json, readJson } from '../../lib/server/http';
import { checkoutSchema, mapCoupon, priceOrder, type CouponRow } from '../../lib/server/orders';
import { mapProduct, getSettings, type ProductRow } from '../../lib/server/catalog';
import { supabaseService, supabaseForRequest } from '../../lib/server/supabase';
import { stripe } from '../../lib/server/stripe';
import { SHIPPING_OPTIONS } from '../../lib/pricing';

const cents = (n: number): number => Math.round(n * 100);

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isSupabaseConfigured() || !env.supabaseServiceKey) {
    return json({ error: 'A loja ainda não está ligada à base de dados. Contacte-nos pelo WhatsApp.' }, 503);
  }
  const parsed = checkoutSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return json({ error: first ? `${first.path.join('.')}: ${first.message}` : 'Dados inválidos.' }, 400);
  }
  const input = parsed.data;
  if (input.paymentMethod === 'stripe' && !isStripeConfigured()) return json({ error: 'Pagamento com cartão indisponível de momento. Use Pix.' }, 503);

  const db = supabaseService();
  const settings = await getSettings();

  const ids = [...new Set(input.items.map((i) => i.productId))];
  const { data: rows, error: pErr } = await db.from('products').select('*').in('id', ids);
  if (pErr) return json({ error: 'Erro a carregar produtos.' }, 500);
  const products = (rows as ProductRow[]).map(mapProduct);

  let coupon = null;
  if (input.couponCode) {
    const { data: c } = await db.from('coupons').select('*').eq('code', input.couponCode).maybeSingle();
    coupon = c ? mapCoupon(c as CouponRow) : null;
    if (!coupon) return json({ error: 'Cupão inválido.' }, 400);
  }

  const priced = priceOrder({ items: input.items, products, coupon, shippingMethod: input.shippingMethod, paymentMethod: input.paymentMethod, settings });
  if (!priced.ok) return json({ error: priced.error }, 409);

  // Utilizador autenticado (opcional) — associa a encomenda à conta
  let userId: string | null = null;
  try {
    const { data } = await supabaseForRequest(request, cookies).auth.getUser();
    userId = data.user?.id ?? null;
  } catch { /* sem sessão */ }

  const { customer, address } = input;
  const { data: cust, error: cErr } = await db.from('customers').upsert({
    email: customer.email, first_name: customer.firstName, last_name: customer.lastName, phone: customer.phone, cpf: customer.cpf.replace(/\D/g, ''),
    ...(userId ? { user_id: userId } : {}),
  }, { onConflict: 'email' }).select('id').single();
  if (cErr) return json({ error: 'Erro ao registar cliente.' }, 500);

  const { totals } = priced;
  const { data: order, error: oErr } = await db.from('orders').insert({
    customer_id: cust.id, user_id: userId, email: customer.email, payment_method: input.paymentMethod,
    subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, total: totals.total,
    coupon_code: priced.couponApplied, shipping_method: input.shippingMethod, shipping_address: address,
    customer_snapshot: { firstName: customer.firstName, lastName: customer.lastName, phone: customer.phone, cpf: customer.cpf },
  }).select('id, number, access_token').single();
  if (oErr || !order) return json({ error: 'Não foi possível criar a encomenda.' }, 500);

  await db.from('order_items').insert(priced.lines.map((l) => ({
    order_id: order.id, product_id: l.product.id, name: l.product.name, slug: l.product.slug,
    image: l.product.images[0]?.src ?? '', size: l.size, color: l.color, unit_price: l.unitPrice, quantity: l.quantity,
  })));
  await db.from('order_events').insert({ order_id: order.id, status: 'pending', note: `Encomenda criada (${input.paymentMethod === 'pix' ? 'Pix' : 'Cartão/Stripe'})` });
  // Reserva de stock
  await Promise.all(priced.lines.map((l) => db.rpc('decrement_stock', { p_product: l.product.id, p_size: l.size, p_qty: l.quantity })));
  if (coupon) await db.from('coupons').update({ uses: coupon.uses + 1 }).eq('code', coupon.code);

  const trackUrl = `/pedido/${order.id}?t=${order.access_token}`;

  if (input.paymentMethod === 'pix') {
    return json({ ok: true, orderId: order.id, number: order.number, redirect: `/checkout/pix?order=${order.id}&t=${order.access_token}` });
  }

  // ── Stripe Checkout ──
  try {
    const site = env.siteUrl.replace(/\/$/, '');
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priced.lines.map((l) => {
      const img = l.product.images[0]?.src;
      return {
        quantity: l.quantity,
        price_data: {
          currency: 'brl',
          unit_amount: cents(l.unitPrice),
          product_data: { name: `${l.product.name} · ${l.color} · ${l.size}`, ...(img?.startsWith('http') ? { images: [img] } : {}) },
        },
      };
    });
    if (totals.shipping > 0) {
      lineItems.push({ quantity: 1, price_data: { currency: 'brl', unit_amount: cents(totals.shipping), product_data: { name: `Frete ${SHIPPING_OPTIONS[input.shippingMethod].label}` } } });
    }
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (totals.discount > 0) {
      const c = await stripe().coupons.create({ amount_off: cents(totals.discount), currency: 'brl', duration: 'once', name: priced.couponApplied ?? 'Desconto', max_redemptions: 1 });
      discounts.push({ coupon: c.id });
    }
    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      discounts,
      customer_email: customer.email,
      client_reference_id: order.id,
      metadata: { order_id: order.id, order_number: String(order.number) },
      payment_intent_data: { metadata: { order_id: order.id } },
      locale: 'pt-BR',
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
      success_url: `${site}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/checkout?cancelado=1`,
    });
    await db.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id);
    return json({ ok: true, orderId: order.id, number: order.number, redirect: session.url ?? trackUrl });
  } catch (e) {
    console.error('[checkout] stripe', e);
    await db.from('orders').update({ status: 'cancelled', payment_status: 'failed' }).eq('id', order.id);
    await Promise.all(priced.lines.map((l) => db.rpc('decrement_stock', { p_product: l.product.id, p_size: l.size, p_qty: -l.quantity })));
    return json({ error: 'Não foi possível iniciar o pagamento com cartão. Tente Pix.' }, 502);
  }
};
