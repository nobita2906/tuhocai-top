import { query } from '@/lib/db';
import { Product } from '@/types';
import CheckoutClient from './CheckoutClient';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ pid?: string; product?: string }>;
}) {
  const { pid, product: productParam } = await searchParams;
  const target = pid || productParam;

  // Fetch product from DB
  let product: Product | null = null;
  if (target) {
    const prods = await query<Product>(
      'SELECT * FROM products WHERE pid = ? OR id = ? OR slug = ? LIMIT 1',
      [target, target, target]
    );
    if (prods.length > 0) {
      product = prods[0];
    }
  }

  // Fallback to default flagship product if none provided
  if (!product) {
    const defaultProds = await query<Product>(
      'SELECT * FROM products WHERE pid = "WF-THAI-099" OR price > 0 ORDER BY created_at ASC LIMIT 1'
    );
    if (defaultProds.length > 0) {
      product = defaultProds[0];
    }
  }

  return <CheckoutClient initialProduct={product} />;
}
