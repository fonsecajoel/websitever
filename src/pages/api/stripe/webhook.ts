import type { APIRoute } from 'astro';
import type Stripe from 'stripe';
import { env } from '../../../lib/env';
import { stripe } from '../../../lib/server/stripe';
import { supabaseService } from '../../../lib/server/supabase';

async function markPaid(orderId: string, paymentIntent: string | null): Promise<void> {
  const db = supabaseService();
  const { data: order } = await db.from('orders').select('payment_status').eq('id', orderId).maybeSingle();
  if (!order || order.payment_status === 'paid') return;
  await db.from('orders').update({ status: 'paid', payment_status: 'paid', stripe_payment_intent: paymentIntent }).eq('id', orderId);
  await db.from('order_events').insert({ order_id: orderId, status: 'paid', note: 'Pagamento confirmado pelo Stripe' });
}

async function cancelAndRestock(orderId: string, note: string): Promise<void> {
  const db = supabaseService();
  const { data: order } = await db.from('orders').select('status, payment_status').eq('id', orderId).maybeSingle();
  if (!order || order.payment_status === 'paid' || order.status === 'cancelled') return;
  const { data: items } = await db.from('order_items').select('product_id, size, quantity').eq('order_id', orderId);
  for (const it of (items ?? []) as { product_id: string | null; size: string; quantity: number }[]) {
    if (it.product_id) await db.rpc('decrement_stock', { p_product: it.product_id, p_size: it.size, p_qty: -it.quantity });
  }
  await db.from('orders').update({ status: 'cancelled', payment_status: 'failed' }).eq('id', orderId);
  await db.from('order_events').insert({ order_id: orderId, status: 'cancelled', note });
}

export const POST: APIRoute = async ({ request }) => {
  const sig = request.headers.get('stripe-signature');
  if (!sig || !env.stripeWebhookSecret) return new Response('missing signature', { status: 400 });
  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = await stripe().webhooks.constructEventAsync(raw, sig, env.stripeWebhookSecret);
  } catch (e) {
    console.error('[stripe] assinatura inválida', e);
    return new Response('invalid signature', { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.order_id ?? session.client_reference_id ?? null;
  const pi = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null;

  switch (event.type) {
    case 'checkout.session.completed':
      if (orderId && session.payment_status === 'paid') await markPaid(orderId, pi);
      break;
    case 'checkout.session.async_payment_succeeded':
      if (orderId) await markPaid(orderId, pi);
      break;
    case 'checkout.session.async_payment_failed':
      if (orderId) await cancelAndRestock(orderId, 'Pagamento assíncrono falhou (Stripe)');
      break;
    case 'checkout.session.expired':
      if (orderId) await cancelAndRestock(orderId, 'Sessão de pagamento expirou (Stripe)');
      break;
    default:
      break;
  }
  return new Response('ok');
};
