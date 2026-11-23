import { persistentAtom } from '@nanostores/persistent';

const decode = (v: string): string[] => {
  try {
    const parsed: unknown = JSON.parse(v);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

/** Slugs dos produtos favoritos. */
export const wishlist = persistentAtom<string[]>('santosalto:wishlist', [], { encode: JSON.stringify, decode });

export function toggleWishlist(slug: string): boolean {
  const list = wishlist.get();
  const has = list.includes(slug);
  wishlist.set(has ? list.filter((s) => s !== slug) : [...list, slug]);
  return !has;
}
