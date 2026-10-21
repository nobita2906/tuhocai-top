import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderCode = searchParams.get('orderCode');
    const orderId = searchParams.get('orderId');

    if (!orderCode && !orderId) {
      return NextResponse.json({ error: 'Thiếu mã đơn' }, { status: 400 });
    }

    const orders = await query<any>(
      `SELECT o.id, o.order_code, o.payment_status, o.approved_at, p.download_url 
       FROM orders o 
       LEFT JOIN products p ON o.product_id = p.id 
       WHERE o.order_code = ? OR o.id = ? LIMIT 1`,
      [orderCode || '', orderId || '']
    );

    if (orders.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    const order = orders[0];
    return NextResponse.json({
      success: true,
      orderCode: order.order_code,
      status: order.payment_status,
      downloadUrl: order.payment_status === 'APPROVED' ? order.download_url : null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Lỗi kiểm tra trạng thái' }, { status: 500 });
  }
}
