import { describe, expect, it } from 'vitest';
import { computeTotals, evaluateCoupon, formatBRL, installments, shippingCost } from '../src/lib/pricing';
import type { Coupon } from '../src/lib/types';

const coupon = (o: Partial<Coupon> = {}): Coupon => ({ code: 'X', kind: 'percent', value: 10, minSubtotal: 0, maxUses: null, uses: 0, expiresAt: null, active: true, ...o });

describe('shippingCost', () => {
  it('standard é grátis acima do limite', () => expect(shippingCost('standard', 500, 499)).toBe(0));
  it('standard cobra abaixo do limite', () => expect(shippingCost('standard', 100, 499)).toBe(29.9));
  it('express cobra sempre', () => expect(shippingCost('express', 1000, 499)).toBe(49.9));
});

describe('evaluateCoupon', () => {
  it('rejeita nulo/inativo', () => {
    expect(evaluateCoupon(null, 100).ok).toBe(false);
    expect(evaluateCoupon(coupon({ active: false }), 100).ok).toBe(false);
  });
  it('rejeita expirado e esgotado', () => {
    expect(evaluateCoupon(coupon({ expiresAt: '2000-01-01' }), 100).ok).toBe(false);
    expect(evaluateCoupon(coupon({ maxUses: 1, uses: 1 }), 100).ok).toBe(false);
  });
  it('rejeita abaixo do mínimo', () => expect(evaluateCoupon(coupon({ minSubtotal: 200 }), 100)).toMatchObject({ ok: false }));
  it('percentual e fixo, limitado ao subtotal', () => {
    expect(evaluateCoupon(coupon(), 200)).toEqual({ ok: true, discount: 20 });
    expect(evaluateCoupon(coupon({ kind: 'fixed', value: 500 }), 100)).toEqual({ ok: true, discount: 100 });
  });
});

describe('computeTotals', () => {
  const base = { lines: [{ unitPrice: 300, quantity: 2 }], couponDiscount: 60, shippingMethod: 'standard' as const, freeShippingThreshold: 499, pixDiscountPercent: 5 };
  it('aplica desconto Pix após cupão', () => {
    const t = computeTotals({ ...base, paymentMethod: 'pix' });
    expect(t).toEqual({ subtotal: 600, discount: 87, pixDiscount: 27, shipping: 0, total: 513 });
  });
  it('sem desconto Pix no Stripe', () => {
    const t = computeTotals({ ...base, paymentMethod: 'stripe', shippingMethod: 'express' });
    expect(t.total).toBe(589.9);
  });
});

describe('formatação', () => {
  it('BRL e parcelas', () => {
    expect(formatBRL(10)).toContain('10,00');
    expect(installments(600)).toContain('6x');
  });
});
