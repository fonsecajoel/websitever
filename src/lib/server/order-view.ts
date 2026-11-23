import { supabaseService } from './supabase';
import type { OrderStatus, PaymentMethod, PaymentStatus } from '../types';

export interface OrderView {
  id: string; number: number; email: string; status: OrderStatus; payment_method: PaymentMethod; payment_status: PaymentStatus;
  subtotal: number; discount: number; shipping: number; total: number; tracking_code: string | null; created_at: string; access_token: string;
  shipping_address: { city: string; state: string; address: string; number: string };
  customer_snapshot: { firstName: string };
  order_items: { name: string; slug: string; image: string; size: string; color: string; unit_price: number; quantity: number }[];
  order_events: { status: string; note: string; created_at: string }[];
}

const SELECT = '*, order_items(name, slug, image, size, color, unit_price, quantity), order_events(status, note, created_at)';

/** Lê uma encomenda pública apenas com id + token secreto. */
export async function getOrderByToken(id: string | null, token: string | null): Promise<OrderView | null> {
  if (!id || !token || !/^[0-9a-f-]{36}$/i.test(id) || !/^[0-9a-f-]{36}$/i.test(token)) return null;
  const { data } = await supabaseService().from('orders').select(SELECT).eq('id', id).eq('access_token', token).maybeSingle();
  return (data as OrderView | null) ?? null;
}

export async function getOrderByStripeSession(sessionId: string | null): Promise<OrderView | null> {
  if (!sessionId || !sessionId.startsWith('cs_')) return null;
  const { data } = await supabaseService().from('orders').select(SELECT).eq('stripe_session_id', sessionId).maybeSingle();
  return (data as OrderView | null) ?? null;
}
