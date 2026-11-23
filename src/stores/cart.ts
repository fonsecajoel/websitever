import { persistentAtom } from '@nanostores/persistent';
import { atom, computed } from 'nanostores';

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

const decodeItems = (v: string): CartItem[] => {
  try {
    const parsed: unknown = JSON.parse(v);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const cartItems = persistentAtom<CartItem[]>('santosalto:cart', [], { encode: JSON.stringify, decode: decodeItems });
export const cartOpen = atom(false);

export const cartCount = computed(cartItems, (items) => items.reduce((s, i) => s + i.quantity, 0));
export const cartSubtotal = computed(cartItems, (items) => items.reduce((s, i) => s + i.price * i.quantity, 0));

export const lineId = (productId: string, size: string, color: string): string => `${productId}-${size}-${color}`;

export function addToCart(item: Omit<CartItem, 'id'>, open = true): void {
  const id = lineId(item.productId, item.size, item.color);
  const current = cartItems.get();
  const existing = current.find((i) => i.id === id);
  cartItems.set(
    existing
      ? current.map((i) => (i.id === id ? { ...i, quantity: Math.min(10, i.quantity + item.quantity) } : i))
      : [...current, { ...item, id }],
  );
  if (open) cartOpen.set(true);
}

export function removeFromCart(id: string): void {
  cartItems.set(cartItems.get().filter((i) => i.id !== id));
}

export function updateQuantity(id: string, quantity: number): void {
  if (quantity < 1) return removeFromCart(id);
  cartItems.set(cartItems.get().map((i) => (i.id === id ? { ...i, quantity: Math.min(10, quantity) } : i)));
}

export function clearCart(): void {
  cartItems.set([]);
}
