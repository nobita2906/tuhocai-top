import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { signJWT } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderCode = searchParams.get('orderCode');
    const orderId = searchParams.get('orderId');

    if (!orderCode && !orderId) {
      return NextResponse.json({ error: 'Thiếu mã đơn' }, { status: 400 });
    }

    const orders = await query<any>(
      `SELECT o.id, o.order_code, o.payment_status, o.approved_at, o.user_id, o.customer_email, o.customer_name, p.download_url 
       FROM orders o 
       LEFT JOIN products p ON o.product_id = p.id 
       WHERE o.order_code = ? OR o.id = ? LIMIT 1`,
      [orderCode || '', orderId || '']
    );

    if (orders.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    const order = orders[0];
    const isApproved = order.payment_status === 'APPROVED';

    const resData: any = {
      success: true,
      orderCode: order.order_code,
      status: order.payment_status,
      downloadUrl: isApproved ? order.download_url : null,
      autoLoggedIn: false,
    };

    const response = NextResponse.json(resData);

    // Tự động đăng nhập khách hàng ngay khi thanh toán thành công
    if (isApproved && (order.user_id || order.customer_email)) {
      try {
        const users = await query<any>(
          'SELECT id, name, email, role FROM users WHERE id = ? OR LOWER(email) = ? LIMIT 1',
          [order.user_id || '', String(order.customer_email || '').toLowerCase()]
        );

        if (users.length > 0) {
          const user = users[0];
          const token = await signJWT({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          });

          response.cookies.set('tuhocai_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
          });

          resData.autoLoggedIn = true;
          resData.user = { id: user.id, name: user.name, email: user.email };
          // Return new response with updated data and cookie
          return NextResponse.json(resData, {
            headers: response.headers,
          });
        }
      } catch (e) {
        console.error('Error auto-logging in user on order approval:', e);
      }
    }

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Lỗi kiểm tra trạng thái' }, { status: 500 });
  }
}
