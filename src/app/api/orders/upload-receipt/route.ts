import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/db';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8781006384:AAHDfcnSsIiwDpycoY9G-fd7ug5-Ne2Oq0Y';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '6580812076';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const orderId = (formData.get('orderId') || formData.get('orderCode')) as string;
    const file = formData.get('receipt') as File | null;
    const receiptUrlParam = formData.get('receiptUrl') as string | null;

    if (!orderId) {
      return NextResponse.json({ error: 'Thiếu mã đơn hàng' }, { status: 400 });
    }

    const orders = await query<any>('SELECT * FROM orders WHERE id = ? OR order_code = ? LIMIT 1', [orderId, orderId]);
    if (orders.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    const order = orders[0];
    let receiptUrl = receiptUrlParam || '';

    // Handle file in memory without saving to read-only disk on Vercel
    let fileBuffer: Buffer | null = null;
    let fileName = `receipt_${order.order_code}.jpg`;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      fileBuffer = Buffer.from(bytes);
      fileName = file.name || fileName;
      receiptUrl = `telegram_uploaded_${Date.now()}`;
    }

    // Update order with receipt marker
    await execute('UPDATE orders SET receipt_image_url = ? WHERE id = ?', [receiptUrl, order.id]);

    // Send Telegram Notification with Inline Buttons
    const priceFormatted = new Intl.NumberFormat('vi-VN').format(order.price) + ' đ';
    const caption = `🔥 *ĐÃ CÓ BIÊN LAI THANH TOÁN MỚI!*

📦 *Mã đơn:* \`${order.order_code}\`
👤 *Khách hàng:* ${order.customer_name}
📧 *Email:* ${order.customer_email}
📞 *SĐT:* ${order.customer_phone || 'Không có'}
💎 *Sản phẩm:* ${order.product_name}
💰 *Số tiền:* ${priceFormatted}

👉 *Vui lòng kiểm tra tài khoản VPBank và bấm DUYỆT để gửi link:*`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '✅ DUYỆT (Gửi Link)', callback_data: `APPROVE:${order.id}` },
          { text: '❌ TỪ CHỐI', callback_data: `REJECT:${order.id}` },
        ]
      ]
    };

    if (fileBuffer) {
      // Send Photo with Multipart Form directly to Telegram
      const tgFormData = new FormData();
      tgFormData.append('chat_id', TELEGRAM_CHAT_ID);
      tgFormData.append('caption', caption);
      tgFormData.append('parse_mode', 'Markdown');
      tgFormData.append('reply_markup', JSON.stringify(inlineKeyboard));
      
      const blob = new Blob([new Uint8Array(fileBuffer)], { type: file?.type || 'image/jpeg' });
      tgFormData.append('photo', blob, fileName);

      const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: tgFormData,
      });

      const tgJson = await tgRes.json();
      if (!tgJson.ok) {
        console.error('Telegram sendPhoto failed, falling back to sendMessage:', tgJson);
        // Fallback to text message if photo format wasn't accepted
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: caption,
            parse_mode: 'Markdown',
            reply_markup: inlineKeyboard,
          }),
        });
      }
    } else {
      // Send Text Message
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: caption,
          parse_mode: 'Markdown',
          reply_markup: inlineKeyboard,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Đã gửi biên lai thành công. Đơn hàng đang chờ Admin kiểm duyệt!',
      receiptUrl,
    });
  } catch (err: any) {
    console.error('Upload receipt error:', err);
    return NextResponse.json({ error: 'Lỗi gửi biên lai: ' + (err.message || 'Lỗi máy chủ') }, { status: 500 });
  }
}
