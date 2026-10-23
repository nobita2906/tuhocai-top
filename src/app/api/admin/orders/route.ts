import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { query, execute } from '@/lib/db';

export async function GET(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const search = searchParams.get('q') || '';

    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'ALL') {
      sql += ' AND payment_status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (order_code LIKE ? OR customer_email LIKE ? OR customer_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY created_at DESC';

    const orders = await query(sql, params);
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Thiếu thông tin đơn hàng hoặc trạng thái' }, { status: 400 });
    }

    const orders = await query<any>('SELECT * FROM orders WHERE id = ? OR order_code = ? LIMIT 1', [orderId, orderId]);
    if (orders.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    const order = orders[0];

    await execute(
      `UPDATE orders SET payment_status = ?, approved_at = CASE WHEN ? = 'APPROVED' THEN NOW() ELSE approved_at END, approved_by = ? WHERE id = ?`,
      [status, status, admin.name, order.id]
    );

    // If approved, automatically grant to user's library if account exists
    if (status === 'APPROVED') {
      const users = await query<any>('SELECT id FROM users WHERE email = ? LIMIT 1', [order.customer_email]);
      if (users.length > 0) {
        const userId = users[0].id;
        await execute(
          'INSERT IGNORE INTO user_library (id, user_id, product_id, order_id) VALUES (?, ?, ?, ?)',
          [randomUUID(), userId, order.product_id, order.id]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật trạng thái đơn hàng ${order.order_code} thành ${status}!`,
    });
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
