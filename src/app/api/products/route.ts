import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Product } from '@/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const freeOnly = searchParams.get('free') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let sql = 'SELECT * FROM products WHERE is_active = TRUE';
    const params: any[] = [];

    if (category && category !== 'all') {
      sql += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }

    if (freeOnly) {
      sql += ' AND price = 0';
    }

    sql += ' ORDER BY sales_count DESC, created_at DESC LIMIT ?';
    params.push(limit);

    const products = await query<Product>(sql, params);
    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    console.error('Fetch products error:', err);
    return NextResponse.json({ error: 'Lỗi tải danh sách sản phẩm' }, { status: 500 });
  }
}
