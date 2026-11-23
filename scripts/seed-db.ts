// Carrega o catálogo inicial no Supabase via service role: `node --env-file=.env scripts/seed-db.ts`
import { createClient } from '@supabase/supabase-js';
import { seedCategories, seedCollections, seedProducts } from '../src/data/seed.ts';

const url = process.env.PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Defina PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env');
const db = createClient(url, key, { auth: { persistSession: false } });

const check = (label: string, error: { message: string } | null): void => {
  if (error) throw new Error(`${label}: ${error.message}`);
  console.log(`✓ ${label}`);
};

check('categorias', (await db.from('categories').upsert(seedCategories.map((c) => ({ slug: c.slug, label: c.label, sort_order: c.sortOrder })), { onConflict: 'slug' })).error);
check('coleções', (await db.from('collections').upsert(seedCollections.map((c) => ({ slug: c.slug, name: c.name, tagline: c.tagline, description: c.description, cover_url: c.coverUrl, sort_order: c.sortOrder })), { onConflict: 'slug' })).error);
check('produtos', (await db.from('products').upsert(seedProducts.map((p) => ({
  id: p.id, slug: p.slug, name: p.name, category: p.category, collection: p.collection, price: p.price, old_price: p.oldPrice,
  short_description: p.shortDescription, description: p.description, details: p.details, materials: p.materials, origin: p.origin,
  heel_height: p.heelHeight, colors: p.colors, sizes: p.sizes, images: p.images, badges: p.badges, is_new: p.isNew, active: p.active, sort_order: p.sortOrder,
})), { onConflict: 'slug', ignoreDuplicates: true })).error);
check('cupão BEMVINDA10', (await db.from('coupons').upsert({ code: 'BEMVINDA10', description: '10% na primeira compra', kind: 'percent', value: 10, min_subtotal: 0 }, { onConflict: 'code', ignoreDuplicates: true })).error);

const { count } = await db.from('products').select('*', { count: 'exact', head: true });
console.log(`Produtos na base de dados: ${count}`);
