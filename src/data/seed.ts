/** Catálogo de demonstração — usado quando o Supabase ainda não está configurado e para gerar supabase/seed.sql. */
import { products as legacy, collections as legacyCollections, categoryLabels } from './legacy-products.ts';
import type { Category, Collection, Product, StoreSettings } from '../lib/types.ts';

export const seedSettings: StoreSettings = {
  announcement: 'Frete grátis acima de R$ 499 · Até 6x sem juros · Troca grátis em 30 dias',
  freeShippingThreshold: 499,
  pixDiscountPercent: 5,
  pixKey: '56.159.388/0001-22',
  pixKeyRaw: '56159388000122',
  whatsapp: '5511910828374',
  email: 'santosaltovendas@gmail.com',
  instagram: 'https://www.instagram.com/santosaltostore',
};

const accessoryCategories: Record<string, string> = { cinto: 'Cintos', carteira: 'Carteiras', bijuteria: 'Bijuterias', lenco: 'Lenços & Xales', oculos: 'Óculos' };
export const seedCategories: Category[] = Object.entries({ ...categoryLabels, ...accessoryCategories }).map(([slug, label], i) => ({ slug, label, sortOrder: i }));

export const seedCollections: Collection[] = Object.entries(legacyCollections).map(([slug, c], i) => ({
  slug,
  name: c.name,
  tagline: c.tagline,
  description: c.description,
  coverUrl: c.cover,
  sortOrder: i,
}));

/** UUID determinístico para os produtos demo (p01 → 00000000-0000-4000-8000-000000000001). */
export const seedUuid = (legacyId: string): string =>
  `00000000-0000-4000-8000-${legacyId.replace(/\D/g, '').padStart(12, '0')}`;

export const seedProducts: Product[] = legacy.map((p, i) => ({
  id: seedUuid(p.id),
  slug: p.slug,
  name: p.name,
  category: p.category,
  collection: p.collection,
  price: p.price,
  oldPrice: p.oldPrice ?? null,
  shortDescription: p.shortDescription,
  description: p.description,
  details: p.details,
  materials: p.materials,
  origin: p.origin,
  heelHeight: p.heelHeight ?? null,
  colors: p.colors,
  sizes: p.sizes.map((s, j) => ({ label: s.label, stock: s.available ? 3 + ((i + j) % 6) : 0 })),
  images: p.images,
  badges: p.badges ?? [],
  isNew: Boolean(p.isNew),
  active: true,
  sortOrder: i,
}));
