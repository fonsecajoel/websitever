// Gera supabase/seed.sql a partir do catálogo demo: `pnpm db:seed-sql`
import { seedCategories, seedCollections, seedProducts } from '../src/data/seed.ts';

const q = (v: string | null): string => (v === null ? 'null' : `'${v.replace(/'/g, "''")}'`);
const j = (v: unknown): string => `${q(JSON.stringify(v))}::jsonb`;
const arr = (v: string[]): string => `array[${v.map(q).join(',')}]::text[]`;

const out: string[] = ['-- Catálogo inicial Santo Salto (gerado por scripts/generate-seed.ts)', 'begin;'];
for (const c of seedCategories)
  out.push(`insert into public.categories (slug,label,sort_order) values (${q(c.slug)},${q(c.label)},${c.sortOrder}) on conflict (slug) do nothing;`);
for (const c of seedCollections)
  out.push(`insert into public.collections (slug,name,tagline,description,cover_url,sort_order) values (${q(c.slug)},${q(c.name)},${q(c.tagline)},${q(c.description)},${q(c.coverUrl)},${c.sortOrder}) on conflict (slug) do nothing;`);
for (const p of seedProducts)
  out.push(`insert into public.products (id,slug,name,category,collection,price,old_price,short_description,description,details,materials,origin,heel_height,colors,sizes,images,badges,is_new,active,sort_order) values (${q(p.id)},${q(p.slug)},${q(p.name)},${q(p.category)},${q(p.collection)},${p.price},${p.oldPrice ?? 'null'},${q(p.shortDescription)},${q(p.description)},${arr(p.details)},${q(p.materials)},${q(p.origin)},${q(p.heelHeight)},${j(p.colors)},${j(p.sizes)},${j(p.images)},${arr(p.badges)},${p.isNew},${p.active},${p.sortOrder}) on conflict (slug) do nothing;`);
out.push(`insert into public.coupons (code,description,kind,value,min_subtotal) values ('BEMVINDA10','10% na primeira compra','percent',10,0) on conflict do nothing;`);
out.push('commit;');
console.log(out.join('\n'));
