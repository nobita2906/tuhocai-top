import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { UserLibraryItem } from '@/types';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const items = await query<UserLibraryItem>(
      `SELECT 
        l.id, 
        l.user_id, 
        l.product_id, 
        l.order_id, 
        l.unlocked_at,
        p.name as product_name,
        p.slug as product_slug,
        p.category,
        p.download_url,
        p.thumbnail
      FROM user_library l
      JOIN products p ON l.product_id = p.id
      WHERE l.user_id = ?
      ORDER BY l.unlocked_at DESC`,
      [session.id]
    );

    // Also get order history
    const orders = await query<any>(
      `SELECT id, order_code, product_name, price, payment_status, created_at, approved_at 
       FROM orders 
       WHERE user_id = ? OR customer_email = ? 
       ORDER BY created_at DESC`,
      [session.id, session.email]
    );

    return NextResponse.json({
      success: true,
      library: items,
      orders,
    });
  } catch (err: any) {
    console.error('Fetch library error:', err);
    return NextResponse.json({ error: 'Lỗi tải kho tài liệu' }, { status: 500 });
  }
}
