import type { Coupon, PaymentMethod, ShippingMethod } from './types';

export const SHIPPING_OPTIONS: Record<ShippingMethod, { label: string; eta: string; price: number }> = {
  standard: { label: 'Standard', eta: '5 a 8 dias úteis', price: 29.9 },
  express: { label: 'Express', eta: '2 a 3 dias úteis', price: 49.9 },
  'same-day': { label: 'Same-day SP', eta: 'Hoje, capital', price: 89.9 },
};

export const round2 = (n: number): number => Math.round(n * 100) / 100;

export function shippingCost(method: ShippingMethod, subtotal: number, freeThreshold: number): number {
  if (method === 'standard' && subtotal >= freeThreshold) return 0;
  return SHIPPING_OPTIONS[method].price;
}

export type CouponCheck = { ok: true; discount: number } | { ok: false; reason: string };

export function evaluateCoupon(coupon: Coupon | null, subtotal: number, now: Date = new Date()): CouponCheck {
  if (!coupon || !coupon.active) return { ok: false, reason: 'Cupão inválido.' };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) return { ok: false, reason: 'Cupão expirado.' };
  if (coupon.maxUses !== null && coupon.uses >= coupon.maxUses) return { ok: false, reason: 'Cupão esgotado.' };
  if (subtotal < coupon.minSubtotal) return { ok: false, reason: `Mínimo de compra: ${formatBRL(coupon.minSubtotal)}.` };
  const raw = coupon.kind === 'percent' ? subtotal * (coupon.value / 100) : coupon.value;
  return { ok: true, discount: round2(Math.min(raw, subtotal)) };
}

export interface Totals { subtotal: number; discount: number; pixDiscount: number; shipping: number; total: number }

export function computeTotals(input: {
  lines: { unitPrice: number; quantity: number }[];
  couponDiscount: number;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  freeShippingThreshold: number;
  pixDiscountPercent: number;
}): Totals {
  const subtotal = round2(input.lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0));
  const discount = round2(Math.min(input.couponDiscount, subtotal));
  const afterCoupon = subtotal - discount;
  const pixDiscount = input.paymentMethod === 'pix' ? round2(afterCoupon * (input.pixDiscountPercent / 100)) : 0;
  const shipping = shippingCost(input.shippingMethod, subtotal, input.freeShippingThreshold);
  const total = round2(afterCoupon - pixDiscount + shipping);
  return { subtotal, discount: round2(discount + pixDiscount), pixDiscount, shipping, total };
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function installments(price: number, max = 6): string {
  return `${max}x de ${formatBRL(price / max)} sem juros`;
}
