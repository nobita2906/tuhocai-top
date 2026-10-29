import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { broadcastTelegramMessage } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const { orderCode } = await req.json();

    if (!orderCode) {
      return NextResponse.json({ success: false, error: 'Thiếu mã đơn hàng' }, { status: 400 });
    }

    const cleanCode = String(orderCode).trim().toUpperCase();

    // Tìm đơn hàng
    const orders = await query<any>(
      `SELECT o.*, p.name as prod_name, p.download_url 
       FROM orders o 
       LEFT JOIN products p ON o.product_id = p.id 
       WHERE UPPER(o.order_code) = ? LIMIT 1`,
      [cleanCode]
    );

    if (orders.length === 0) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    const order = orders[0];

    // Nếu đơn hàng đã được duyệt trước đó
    if (order.payment_status === 'APPROVED') {
      return NextResponse.json({
        success: true,
        alreadyApproved: true,
        message: 'Đơn hàng này đã được phê duyệt thành công!',
        downloadUrl: order.download_url,
      });
    }

    const priceFormatted = new Intl.NumberFormat('vi-VN').format(order.price) + ' đ';

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '✅ DUYỆT ĐƠN & MỞ KHÓA NGAY', callback_data: `APPROVE:${order.id}` },
          { text: '❌ TỪ CHỐI', callback_data: `REJECT:${order.id}` },
        ]
      ]
    };

    await broadcastTelegramMessage({
      type: 'manual_review',
      variables: {
        order_code: order.order_code,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone || 'Không có',
        product_name: order.product_name || order.prod_name,
        amount: priceFormatted,
        bank_name: 'ACB',
        account_no: '4747827',
        transfer_content: order.order_code,
        created_at: new Date().toLocaleString('vi-VN'),
      },
      replyMarkup: inlineKeyboard,
    });

    return NextResponse.json({
      success: true,
      message: 'Đã gửi mã đơn yêu cầu duyệt thành công tới quản trị viên qua Telegram!',
      orderCode: order.order_code,
    });
  } catch (err: any) {
    console.error('[Manual Review] Lỗi:', err);
    return NextResponse.json({ success: false, error: err.message || 'Lỗi máy chủ' }, { status: 500 });
  }
}
