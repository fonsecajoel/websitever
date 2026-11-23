import { describe, expect, it } from 'vitest';
import { checkoutSchema, mapCoupon, priceOrder } from '../src/lib/server/orders';
import { seedProducts, seedSettings } from '../src/data/seed';

const p = seedProducts[0];
const size = p.sizes.find((s) => s.stock > 0)!;

describe('priceOrder', () => {
  const base = { products: seedProducts, coupon: null, shippingMethod: 'standard' as const, paymentMethod: 'stripe' as const, settings: seedSettings };
  it('calcula a partir dos preços da BD', () => {
    const r = priceOrder({ ...base, items: [{ productId: p.id, size: size.label, color: 'x', quantity: 1 }] });
    expect(r.ok && r.totals.subtotal).toBe(p.price);
  });
  it('produto inexistente', () => expect(priceOrder({ ...base, items: [{ productId: '00000000-0000-4000-8000-999999999999', size: '36', color: 'x', quantity: 1 }] }).ok).toBe(false));
  it('tamanho inexistente', () => expect(priceOrder({ ...base, items: [{ productId: p.id, size: '99', color: 'x', quantity: 1 }] }).ok).toBe(false));
  it('sem stock suficiente (somando linhas)', () => {
    const items = [{ productId: p.id, size: size.label, color: 'a', quantity: size.stock }, { productId: p.id, size: size.label, color: 'b', quantity: 1 }];
    expect(priceOrder({ ...base, items }).ok).toBe(false);
  });
  it('cupão válido e inválido', () => {
    const items = [{ productId: p.id, size: size.label, color: 'x', quantity: 1 }];
    const c = mapCoupon({ code: 'A', kind: 'fixed', value: '50', min_subtotal: '0', max_uses: null, uses: 0, expires_at: null, active: true });
    const ok = priceOrder({ ...base, items, coupon: c });
    expect(ok.ok && ok.couponApplied).toBe('A');
    expect(priceOrder({ ...base, items, coupon: { ...c, active: false } }).ok).toBe(false);
  });
});

describe('checkoutSchema', () => {
  it('rejeita CPF inválido', () => {
    const r = checkoutSchema.safeParse({ customer: { firstName: 'a', lastName: 'b', email: 'a@b.com', phone: '11999999999', cpf: '123' }, address: {}, shippingMethod: 'standard', paymentMethod: 'pix', items: [] });
    expect(r.success).toBe(false);
  });
});
