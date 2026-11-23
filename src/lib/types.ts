export type Badge = 'novo' | 'best-seller' | 'edicao-limitada' | 'ultimas-pecas';

export interface ProductColor { name: string; hex: string }
export interface ProductSize { label: string; stock: number }
export interface ProductImage { src: string; alt: string }

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  collection: string | null;
  price: number;
  oldPrice: number | null;
  shortDescription: string;
  description: string;
  details: string[];
  materials: string;
  origin: string;
  heelHeight: string | null;
  colors: ProductColor[];
  sizes: ProductSize[];
  images: ProductImage[];
  badges: Badge[];
  isNew: boolean;
  active: boolean;
  sortOrder: number;
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coverUrl: string;
  sortOrder: number;
}

export interface Category { slug: string; label: string; sortOrder: number }

export interface StoreSettings {
  announcement: string;
  freeShippingThreshold: number;
  pixDiscountPercent: number;
  pixKey: string;
  pixKeyRaw: string;
  whatsapp: string;
  email: string;
  instagram: string;
}

export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentMethod = 'pix' | 'stripe';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export type ShippingMethod = 'standard' | 'express' | 'same-day';

export interface Coupon {
  code: string;
  kind: 'percent' | 'fixed';
  value: number;
  minSubtotal: number;
  maxUses: number | null;
  uses: number;
  expiresAt: string | null;
  active: boolean;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Aguarda pagamento',
  paid: 'Pago',
  preparing: 'Em preparação',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
};

export const BADGE_LABEL: Record<Badge, string> = {
  'novo': 'Novo',
  'best-seller': 'Best-seller',
  'edicao-limitada': 'Edição limitada',
  'ultimas-pecas': 'Últimas peças',
};
