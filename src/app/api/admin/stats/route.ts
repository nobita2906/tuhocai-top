import { NextResponse } from 'next/server';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { query } from '@/lib/db';

export async function GET() {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const [
      postsCount,
      usersCount,
      ordersStats,
      productsCount,
      leadsCount,
      recentOrders,
      recentUsers,
    ] = await Promise.all([
      query<any>('SELECT COUNT(*) as total, SUM(CASE WHEN is_published = 1 THEN 1 ELSE 0 END) as published FROM posts'),
      query<any>('SELECT COUNT(*) as total, SUM(CASE WHEN role = "ADMIN" THEN 1 ELSE 0 END) as admins FROM users'),
      query<any>(`
        SELECT 
          COUNT(*) as total, 
          SUM(CASE WHEN payment_status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN payment_status = 'PENDING' THEN 1 ELSE 0 END) as pending,
          COALESCE(SUM(CASE WHEN payment_status = 'APPROVED' THEN price ELSE 0 END), 0) as revenue
        FROM orders
      `),
      query<any>('SELECT COUNT(*) as total FROM products WHERE is_active = 1'),
      query<any>('SELECT COUNT(*) as total FROM leads'),
      query<any>(`
        SELECT id, order_code, customer_name, customer_email, product_name, price, payment_status, created_at
        FROM orders
        ORDER BY created_at DESC
        LIMIT 6
      `),
      query<any>(`
        SELECT id, name, email, role, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 6
      `),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        posts: {
          total: postsCount[0]?.total || 0,
          published: postsCount[0]?.published || 0,
        },
        users: {
          total: usersCount[0]?.total || 0,
          admins: usersCount[0]?.admins || 0,
        },
        orders: {
          total: ordersStats[0]?.total || 0,
          approved: ordersStats[0]?.approved || 0,
          pending: ordersStats[0]?.pending || 0,
          revenue: Number(ordersStats[0]?.revenue || 0),
        },
        products: {
          total: productsCount[0]?.total || 0,
        },
        leads: {
          total: leadsCount[0]?.total || 0,
        },
      },
      recentOrders,
      recentUsers,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi truy xuất thống kê' }, { status: 500 });
  }
}
