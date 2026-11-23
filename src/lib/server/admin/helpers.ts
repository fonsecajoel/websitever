import type { Badge, Product, ProductColor, ProductImage, ProductSize, OrderStatus, PaymentMethod, PaymentStatus } from '../../types';

export const str = (fd: FormData, k: string): string => {
  const v = fd.get(k);
  return typeof v === 'string' ? v.trim() : '';
};

export const num = (fd: FormData, k: string): number | null => {
  const raw = str(fd, k).replace(',', '.');
  if (raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

export const bool = (fd: FormData, k: string): boolean => fd.get(k) === 'on' || fd.get(k) === 'true';

export const all = (fd: FormData, k: string): string[] =>
  fd.getAll(k).map((v) => (typeof v === 'string' ? v.trim() : ''));

export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export const BADGES: Badge[] = ['novo', 'best-seller', 'edicao-limitada', 'ultimas-pecas'];

export type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

export function parseProductForm(fd: FormData): ParseResult<Omit<Product, 'id'>> {
  const name = str(fd, 'name');
  if (!name) return { ok: false, error: 'O nome é obrigatório.' };
  const slug = slugify(str(fd, 'slug') || name);
  const category = str(fd, 'category');
  if (!category) return { ok: false, error: 'Escolha uma categoria.' };
  const price = num(fd, 'price');
  if (price === null || price < 0) return { ok: false, error: 'Preço inválido.' };
  const oldPrice = num(fd, 'old_price');

  const colorNames = all(fd, 'color_name');
  const colorHex = all(fd, 'color_hex');
  const colors: ProductColor[] = colorNames
    .map((n, i) => ({ name: n, hex: colorHex[i] || '#000000' }))
    .filter((c) => c.name !== '');

  const sizeLabels = all(fd, 'size_label');
  const sizeStock = all(fd, 'size_stock');
  const sizes: ProductSize[] = sizeLabels
    .map((l, i) => ({ label: l, stock: Math.max(0, Math.floor(Number(sizeStock[i]) || 0)) }))
    .filter((s) => s.label !== '');

  const imgSrc = all(fd, 'image_src');
  const imgAlt = all(fd, 'image_alt');
  const images: ProductImage[] = imgSrc
    .map((src, i) => ({ src, alt: imgAlt[i] || name }))
    .filter((im) => im.src !== '');

  const badges = BADGES.filter((b) => fd.getAll('badges').includes(b));
  const details = str(fd, 'details').split('\n').map((d) => d.trim()).filter(Boolean);

  return {
    ok: true,
    value: {
      slug,
      name,
      category,
      collection: str(fd, 'collection') || null,
      price,
      oldPrice: oldPrice !== null && oldPrice > 0 ? oldPrice : null,
      shortDescription: str(fd, 'short_description'),
      description: str(fd, 'description'),
      details,
      materials: str(fd, 'materials'),
      origin: str(fd, 'origin'),
      heelHeight: str(fd, 'heel_height') || null,
      colors,
      sizes,
      images,
      badges,
      isNew: bool(fd, 'is_new'),
      active: bool(fd, 'active'),
      sortOrder: Math.floor(num(fd, 'sort_order') ?? 0),
    },
  };
}

export interface OrderItemRow {
  id: string; product_id: string | null; name: string; slug: string; image: string;
  size: string; color: string; unit_price: number | string; quantity: number;
}
export interface OrderEventRow { id: number; status: string; note: string; created_at: string }
export interface OrderRow {
  id: string; number: number; customer_id: string | null; email: string;
  status: OrderStatus; payment_method: PaymentMethod; payment_status: PaymentStatus;
  stripe_session_id: string | null;
  subtotal: number | string; discount: number | string; shipping: number | string; total: number | string;
  coupon_code: string | null; shipping_method: string;
  shipping_address: { zip?: string; state?: string; city?: string; neighborhood?: string; address?: string; number?: string; complement?: string };
  customer_snapshot: { firstName?: string; lastName?: string; phone?: string; cpf?: string };
  tracking_code: string | null; admin_notes: string; created_at: string;
  order_items?: OrderItemRow[]; order_events?: OrderEventRow[];
}

export const fmtDate = (iso: string, withTime = true): string =>
  new Intl.DateTimeFormat('pt-BR', withTime
    ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));

export const STATUS_TONE: Record<OrderStatus, string> = {
  pending: 'tone-amber', paid: 'tone-green', preparing: 'tone-blue', shipped: 'tone-violet',
  delivered: 'tone-green', cancelled: 'tone-gray', refunded: 'tone-gray',
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  unpaid: 'Por pagar', paid: 'Pago', failed: 'Falhou', refunded: 'Reembolsado',
};

export const errMsg = (e: unknown): string => (e instanceof Error ? e.message : String(e));
