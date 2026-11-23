import { isSupabaseConfigured } from '../env';
import { supabasePublic } from './supabase';
import { seedCategories, seedCollections, seedProducts, seedSettings } from '../../data/seed';
import type { Badge, Category, Collection, Product, ProductColor, ProductImage, ProductSize, StoreSettings } from '../types';

export interface ProductRow {
  id: string; slug: string; name: string; category: string; collection: string | null;
  price: number | string; old_price: number | string | null;
  short_description: string; description: string; details: string[] | null;
  materials: string; origin: string; heel_height: string | null;
  colors: ProductColor[] | null; sizes: ProductSize[] | null; images: ProductImage[] | null;
  badges: string[] | null; is_new: boolean; active: boolean; sort_order: number;
}

export function mapProduct(r: ProductRow): Product {
  return {
    id: r.id, slug: r.slug, name: r.name, category: r.category, collection: r.collection,
    price: Number(r.price), oldPrice: r.old_price === null ? null : Number(r.old_price),
    shortDescription: r.short_description, description: r.description, details: r.details ?? [],
    materials: r.materials, origin: r.origin, heelHeight: r.heel_height,
    colors: r.colors ?? [], sizes: (r.sizes ?? []).map((s) => ({ label: String(s.label), stock: Number(s.stock) || 0 })),
    images: r.images ?? [], badges: (r.badges ?? []) as Badge[], isNew: r.is_new, active: r.active, sortOrder: r.sort_order,
  };
}

export function productToRow(p: Omit<Product, 'id'>): Omit<ProductRow, 'id'> {
  return {
    slug: p.slug, name: p.name, category: p.category, collection: p.collection,
    price: p.price, old_price: p.oldPrice, short_description: p.shortDescription, description: p.description,
    details: p.details, materials: p.materials, origin: p.origin, heel_height: p.heelHeight,
    colors: p.colors, sizes: p.sizes, images: p.images, badges: p.badges, is_new: p.isNew, active: p.active, sort_order: p.sortOrder,
  };
}

const useDb = isSupabaseConfigured;

export async function getProducts(): Promise<Product[]> {
  if (!useDb()) return seedProducts;
  const { data, error } = await supabasePublic().from('products').select('*').eq('active', true).order('sort_order').order('created_at', { ascending: false });
  if (error) { console.error('[catalog] products', error.message); return []; }
  return (data as ProductRow[]).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!useDb()) return seedProducts.find((p) => p.slug === slug) ?? null;
  const { data } = await supabasePublic().from('products').select('*').eq('slug', slug).eq('active', true).maybeSingle();
  return data ? mapProduct(data as ProductRow) : null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  if (!useDb()) return seedProducts.filter((p) => ids.includes(p.id));
  const { data } = await supabasePublic().from('products').select('*').in('id', ids);
  return ((data ?? []) as ProductRow[]).map(mapProduct);
}

export async function getCollections(): Promise<Collection[]> {
  if (!useDb()) return seedCollections;
  const { data } = await supabasePublic().from('collections').select('*').eq('active', true).order('sort_order');
  return ((data ?? []) as { slug: string; name: string; tagline: string; description: string; cover_url: string; sort_order: number }[])
    .map((c) => ({ slug: c.slug, name: c.name, tagline: c.tagline, description: c.description, coverUrl: c.cover_url, sortOrder: c.sort_order }));
}

export async function getCategories(): Promise<Category[]> {
  if (!useDb()) return seedCategories;
  const { data } = await supabasePublic().from('categories').select('*').order('sort_order');
  return ((data ?? []) as { slug: string; label: string; sort_order: number }[]).map((c) => ({ slug: c.slug, label: c.label, sortOrder: c.sort_order }));
}

export async function getSettings(): Promise<StoreSettings> {
  if (!useDb()) return seedSettings;
  const { data } = await supabasePublic().from('settings').select('value').eq('key', 'store').maybeSingle();
  return { ...seedSettings, ...((data?.value ?? {}) as Partial<StoreSettings>) };
}

export const totalStock = (p: Product): number => p.sizes.reduce((s, x) => s + x.stock, 0);
