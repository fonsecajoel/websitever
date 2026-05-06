import { put, del, head } from '@vercel/blob';
import type { Product } from '../data/products';

const PRODUCTS_BLOB_KEY = 'data/products.json';

export async function getProductsFromDB(): Promise<Product[]> {
  try {
    const blob = await head(PRODUCTS_BLOB_KEY);
    const response = await fetch(blob.url);
    return await response.json();
  } catch {
    const { products } = await import('../data/products');
    return products;
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  await put(PRODUCTS_BLOB_KEY, JSON.stringify(products, null, 2), {
    access: 'public',
    addRandomSuffix: false,
  });
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProductsFromDB();
  return products.find(p => p.id === id);
}

export async function createProduct(product: Product): Promise<void> {
  const products = await getProductsFromDB();
  products.push(product);
  await saveProducts(products);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const products = await getProductsFromDB();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Produto não encontrado');
  products[index] = { ...products[index], ...data };
  await saveProducts(products);
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await getProductsFromDB();
  const filtered = products.filter(p => p.id !== id);
  await saveProducts(filtered);
}

export async function uploadImage(file: File): Promise<string> {
  const blob = await put(`images/${Date.now()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
  }
}
