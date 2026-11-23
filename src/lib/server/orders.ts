import { z } from 'astro/zod';
import { computeTotals, evaluateCoupon, round2 } from '../pricing';
import type { Coupon, PaymentMethod, Product, ShippingMethod, StoreSettings } from '../types';

export const checkoutSchema = z.object({
  customer: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.email().trim().toLowerCase().max(160),
    phone: z.string().trim().min(8).max(30),
    cpf: z.string().trim().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido'),
  }),
  address: z.object({
    zip: z.string().trim().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
    state: z.string().trim().min(2).max(40),
    city: z.string().trim().min(1).max(80),
    neighborhood: z.string().trim().min(1).max(80),
    address: z.string().trim().min(1).max(160),
    number: z.string().trim().min(1).max(20),
    complement: z.string().trim().max(80).default(''),
  }),
  shippingMethod: z.enum(['standard', 'express', 'same-day']),
  paymentMethod: z.enum(['pix', 'stripe']),
  couponCode: z.string().trim().toUpperCase().max(40).optional().nullable(),
  items: z.array(z.object({
    productId: z.uuid(),
    size: z.string().min(1).max(20),
    color: z.string().max(40),
    quantity: z.number().int().min(1).max(10),
  })).min(1).max(30),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export interface PricedLine {
  product: Product;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
}

export type PriceResult =
  | { ok: true; lines: PricedLine[]; totals: ReturnType<typeof computeTotals>; couponApplied: string | null }
  | { ok: false; error: string };

/** Recalcula TUDO no servidor a partir da BD — nunca confiar em preços do browser. */
export function priceOrder(input: {
  items: CheckoutInput['items'];
  products: Product[];
  coupon: Coupon | null;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  settings: StoreSettings;
}): PriceResult {
  const lines: PricedLine[] = [];
  const wanted = new Map<string, number>();
  for (const item of input.items) {
    const product = input.products.find((p) => p.id === item.productId && p.active);
    if (!product) return { ok: false, error: 'Um dos produtos já não está disponível.' };
    const size = product.sizes.find((s) => s.label === item.size);
    if (!size) return { ok: false, error: `Tamanho ${item.size} indisponível em ${product.name}.` };
    const key = `${product.id}|${item.size}`;
    const qty = (wanted.get(key) ?? 0) + item.quantity;
    if (qty > size.stock) return { ok: false, error: `Só temos ${size.stock} unid. de ${product.name} no ${item.size}.` };
    wanted.set(key, qty);
    lines.push({ product, size: item.size, color: item.color, quantity: item.quantity, unitPrice: round2(product.price) });
  }
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  let couponDiscount = 0;
  let couponApplied: string | null = null;
  if (input.coupon) {
    const res = evaluateCoupon(input.coupon, subtotal);
    if (!res.ok) return { ok: false, error: res.reason };
    couponDiscount = res.discount;
    couponApplied = input.coupon.code;
  }
  const totals = computeTotals({
    lines: lines.map((l) => ({ unitPrice: l.unitPrice, quantity: l.quantity })),
    couponDiscount,
    shippingMethod: input.shippingMethod,
    paymentMethod: input.paymentMethod,
    freeShippingThreshold: input.settings.freeShippingThreshold,
    pixDiscountPercent: input.settings.pixDiscountPercent,
  });
  return { ok: true, lines, totals, couponApplied };
}

export interface CouponRow { code: string; kind: 'percent' | 'fixed'; value: number | string; min_subtotal: number | string; max_uses: number | null; uses: number; expires_at: string | null; active: boolean }
export const mapCoupon = (r: CouponRow): Coupon => ({
  code: r.code, kind: r.kind, value: Number(r.value), minSubtotal: Number(r.min_subtotal),
  maxUses: r.max_uses, uses: r.uses, expiresAt: r.expires_at, active: r.active,
});
