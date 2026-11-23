import type { APIRoute } from 'astro';
import { isSupabaseConfigured } from '../../lib/env';
import { json } from '../../lib/server/http';
import { mapCoupon, type CouponRow } from '../../lib/server/orders';
import { supabaseService } from '../../lib/server/supabase';
import { evaluateCoupon } from '../../lib/pricing';

export const GET: APIRoute = async ({ url }) => {
  const code = (url.searchParams.get('code') ?? '').trim().toUpperCase();
  const subtotal = Number(url.searchParams.get('subtotal') ?? 0);
  if (!code) return json({ ok: false, reason: 'Indique um cupão.' });
  if (!isSupabaseConfigured()) return json({ ok: false, reason: 'Cupões indisponíveis.' });
  const { data } = await supabaseService().from('coupons').select('*').eq('code', code).maybeSingle();
  const res = evaluateCoupon(data ? mapCoupon(data as CouponRow) : null, subtotal);
  return json(res.ok ? { ok: true, code, discount: res.discount } : res);
};
