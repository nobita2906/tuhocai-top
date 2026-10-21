import { query } from '@/lib/db';
import { Product } from '@/types';
import ProductsCatalogClient from './ProductsCatalogClient';

export const metadata = {
  title: 'Kho Workflow n8n & Kỹ Năng AI - Tự Học AI (tuhocai.top)',
  description: 'Danh sách các hệ thống n8n tự động hóa, kỹ năng AI chuyên sâu và bộ prompt thương mại có phí và miễn phí.',
};

export const revalidate = 60;

export default async function SanPhamPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; free?: string }>;
}) {
  const { cat, free } = await searchParams;

  let sql = 'SELECT * FROM products WHERE is_active = TRUE';
  const params: any[] = [];

  if (cat && cat !== 'all') {
    sql += ' AND category LIKE ?';
    params.push(`%${cat}%`);
  }

  if (free === 'true') {
    sql += ' AND price = 0';
  }

  sql += ' ORDER BY sales_count DESC, created_at DESC';

  const products = await query<Product>(sql, params);

  return <ProductsCatalogClient initialProducts={products} activeCategory={cat || 'all'} />;
}
