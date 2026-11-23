import type { APIRoute } from 'astro';
import { getCategories, getProducts } from '../../lib/server/catalog';

export interface SearchItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  categorySlug: string;
  collection: string | null;
  image: string;
  heel: string | null;
  colors: string[];
  isNew: boolean;
  bestSeller: boolean;
}

export const GET: APIRoute = async () => {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const labels = new Map(categories.map((c) => [c.slug, c.label]));
  const body: SearchItem[] = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    category: labels.get(p.category) ?? p.category,
    categorySlug: p.category,
    collection: p.collection,
    image: p.images[0]?.src ?? '',
    heel: p.heelHeight,
    colors: p.colors.map((c) => c.name),
    isNew: p.isNew,
    bestSeller: p.badges.includes('best-seller'),
  }));
  return new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=60, s-maxage=300' },
  });
};
