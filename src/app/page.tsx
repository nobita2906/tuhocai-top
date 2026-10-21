import { query } from '@/lib/db';
import { Product, Post } from '@/types';
import HomePageClient from './HomePageClient';

export const revalidate = 60; // revalidate every minute

export default async function HomePage() {
  // Query products from MySQL
  const products = await query<Product>(
    'SELECT * FROM products WHERE is_active = TRUE ORDER BY sales_count DESC, created_at DESC'
  );

  // Query latest articles
  const posts = await query<Post>(
    'SELECT id, slug, title, summary, category, tags, thumbnail, is_featured, views, created_at FROM posts WHERE is_published = TRUE ORDER BY created_at DESC LIMIT 6'
  );

  return <HomePageClient initialProducts={products} initialPosts={posts} />;
}
