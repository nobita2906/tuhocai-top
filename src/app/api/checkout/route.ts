import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { execute, query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const BANK_ID = 'VPB';
const ACCOUNT_NO = '0934434101';
const ACCOUNT_NAME = 'NGUYEN VAN DANG';

export async function POST(req: Request) {
  try {
    const { productId, customerName, customerEmail, customerPhone } = await req.json();

    if (!productId || !customerName || !customerEmail) {
      return NextResponse.json({ error: 'Vui lòng cung cấp đầy đủ thông tin đặt hàng' }, { status: 400 });
    }

    // Lookup product
    const products = await query<any>('SELECT * FROM products WHERE id = ? OR pid = ? LIMIT 1', [productId, productId]);
    if (products.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    const product = products[0];
    const cleanEmail = customerEmail.trim().toLowerCase();
    const cleanName = customerName.trim();

    // Check logged in user
    const session = await getCurrentUser();
    let userId = session?.id || null;
    if (!userId) {
      const users = await query<any>('SELECT id FROM users WHERE email = ? LIMIT 1', [cleanEmail]);
      if (users.length > 0) {
        userId = users[0].id;
      }
    }

    // If product is 0đ (Free)
    if (product.price === 0) {
      const orderId = randomUUID();
      const orderCode = `FREE-${Math.floor(100000 + Math.random() * 900000)}`;

      await execute(
        `INSERT INTO orders (id, order_code, user_id, customer_name, customer_email, customer_phone, product_id, product_name, price, payment_status, payment_method, approved_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'APPROVED', 'FREE', NOW())`,
        [orderId, orderCode, userId, cleanName, cleanEmail, customerPhone || null, product.id, product.name]
      );

      // Unlock in library if user exists
      if (userId) {
        await execute(
          'INSERT IGNORE INTO user_library (id, user_id, product_id, order_id) VALUES (?, ?, ?, ?)',
          [randomUUID(), userId, product.id, orderId]
        );
      }

      return NextResponse.json({
        success: true,
        isFree: true,
        orderCode,
        downloadUrl: product.download_url || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
        message: 'Kích hoạt tài nguyên miễn phí thành công!'
      });
    }

    // Paid Product
    const orderId = randomUUID();
    const orderCode = `THAI${Math.floor(100000 + Math.random() * 900000)}`;

    await execute(
      `INSERT INTO orders (id, order_code, user_id, customer_name, customer_email, customer_phone, product_id, product_name, price, payment_status, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'VIETQR')`,
      [orderId, orderCode, userId, cleanName, cleanEmail, customerPhone || null, product.id, product.name, product.price]
    );

    // Generate VietQR URL
    const encodedName = encodeURIComponent(ACCOUNT_NAME);
    const vietQrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${product.price}&addInfo=${orderCode}&accountName=${encodedName}`;

    // Immediately notify Telegram Bot Admin
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8781006384:AAHDfcnSsIiwDpycoY9G-fd7ug5-Ne2Oq0Y';
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '6580812076';
    const priceFormatted = new Intl.NumberFormat('vi-VN').format(product.price) + ' đ';

    const caption = `🛒 *CÓ ĐƠN HÀNG MỚI KHỞI TẠO!*

📦 *Mã đơn:* \`${orderCode}\`
👤 *Khách hàng:* ${cleanName}
📧 *Email:* ${cleanEmail}
📞 *SĐT:* ${customerPhone || 'Không có'}
💎 *Sản phẩm:* ${product.name}
💰 *Số tiền:* ${priceFormatted}

👉 *Khách hàng đang xem mã VietQR. Bạn có thể bấm DUYỆT ngay nếu tài khoản VPBank đã nhận được tiền:*`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '✅ DUYỆT (Gửi Link)', callback_data: `APPROVE:${orderId}` },
          { text: '❌ TỪ CHỐI', callback_data: `REJECT:${orderId}` },
        ]
      ]
    };

    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: caption,
        parse_mode: 'Markdown',
        reply_markup: inlineKeyboard,
      }),
    }).catch((e) => console.error('Error sending Telegram notification on checkout:', e));

    return NextResponse.json({
      success: true,
      isFree: false,
      orderId,
      orderCode,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
      },
      bankInfo: {
        bankName: 'VPBank (Ngân hàng Việt Nam Thịnh Vượng)',
        accountNo: ACCOUNT_NO,
        accountName: ACCOUNT_NAME,
        amount: product.price,
        content: orderCode,
      },
      vietQrUrl,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Lỗi tạo đơn hàng: ' + (err.message || 'Lỗi máy chủ') }, { status: 500 });
  }
}
