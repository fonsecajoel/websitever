import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';

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

export const cartItems = persistentAtom<CartItem[]>('aurelia:cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const cartOpen = persistentAtom<boolean>('aurelia:cart-open', false, {
  encode: String,
  decode: (v) => v === 'true',
});

export const cartCount = computed(cartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);

export const cartSubtotal = computed(cartItems, (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

export function addToCart(item: Omit<CartItem, 'id'>) {
  const id = `${item.productId}-${item.size}-${item.color}`;
  const current = cartItems.get();
  const existing = current.find((i) => i.id === id);
  if (existing) {
    cartItems.set(
      current.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
      )
    );
  } else {
    cartItems.set([...current, { ...item, id }]);
  }
  cartOpen.set(true);
}

export function removeFromCart(id: string) {
  cartItems.set(cartItems.get().filter((i) => i.id !== id));
}

export function updateQuantity(id: string, quantity: number) {
  if (quantity < 1) return removeFromCart(id);
  cartItems.set(
    cartItems.get().map((i) => (i.id === id ? { ...i, quantity } : i))
  );
}

export function clearCart() {
  cartItems.set([]);
}

export function openCart() {
  cartOpen.set(true);
}

export function closeCart() {
  cartOpen.set(false);
}
