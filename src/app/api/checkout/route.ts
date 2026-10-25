import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { execute, query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { sendFreeResourceEmail } from '@/lib/email';
import { getSiteSettings } from '@/lib/settings';
import { attachAffiliateToOrder } from '@/lib/affiliate';

export async function POST(req: Request) {
  try {
    const { productId, customerName, customerEmail, customerPhone, affiliateRef } = await req.json();

    if (!productId || !customerName || !customerEmail) {
      return NextResponse.json({ error: 'Vui lòng cung cấp đầy đủ thông tin đặt hàng' }, { status: 400 });
    }

    // Determine affiliate referral code (from body or fallback to cookie)
    let finalAffiliateCode = (typeof affiliateRef === 'string' && affiliateRef.trim()) ? affiliateRef.trim() : null;
    if (!finalAffiliateCode) {
      const cookieHeader = req.headers.get('cookie') || '';
      const match = cookieHeader.match(/tuhocai_aff_ref=([^;]+)/);
      if (match) {
        finalAffiliateCode = decodeURIComponent(match[1].trim());
      }
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
    const userId = session?.id || null;

    // Load dynamic site settings
    const siteSettings = await getSiteSettings();

    // Free Product
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

      const freeDownloadUrl = product.download_url || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing';

      // Send email confirmation with download link via Resend
      await sendFreeResourceEmail({
        customerName: cleanName,
        customerEmail: cleanEmail,
        orderCode,
        productName: product.name,
        downloadUrl: freeDownloadUrl,
      }).catch((err) => console.error('Lỗi gửi email tài nguyên miễn phí qua Resend:', err));

      return NextResponse.json({
        success: true,
        isFree: true,
        orderCode,
        downloadUrl: freeDownloadUrl,
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

    // Gắn Affiliate và tạo hoa hồng PENDING nếu có mã giới thiệu
    let affResult: any = null;
    if (finalAffiliateCode) {
      affResult = await attachAffiliateToOrder({
        orderId,
        orderCode,
        orderAmount: product.price,
        affiliateCode: finalAffiliateCode,
      });
    }

    // Generate VietQR URL with dynamic settings
    const bankId = siteSettings.bank_id || 'VPB';
    const accountNo = siteSettings.account_no || '0934434101';
    const accountName = siteSettings.account_name || 'NGUYEN VAN DANG';

    const encodedName = encodeURIComponent(accountName);
    const vietQrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${product.price}&addInfo=${orderCode}&accountName=${encodedName}`;

    // Immediately notify Telegram Bot Admin
    const telegramToken = siteSettings.telegram_bot_token;
    const telegramChatId = siteSettings.telegram_chat_id;
    const priceFormatted = new Intl.NumberFormat('vi-VN').format(product.price) + ' đ';

    let affText = '';
    if (affResult?.partner) {
      const commFormatted = new Intl.NumberFormat('vi-VN').format(affResult.commissionAmount) + ' đ';
      affText = `\n🤝 *Affiliate:* ${affResult.partner.name} (\`${affResult.partner.code}\`)\n🎁 *Hoa hồng:* ${commFormatted} (${affResult.rate}%)`;
    }

    const caption = `🛒 *CÓ ĐƠN HÀNG MỚI KHỞI TẠO!*

📦 *Mã đơn:* \`${orderCode}\`
👤 *Khách hàng:* ${cleanName}
📧 *Email:* ${cleanEmail}
📞 *SĐT:* ${customerPhone || 'Không có'}
💎 *Sản phẩm:* ${product.name}
💰 *Số tiền:* ${priceFormatted}${affText}

👉 *Khách hàng đang xem mã VietQR. Bạn có thể bấm DUYỆT ngay nếu tài khoản ${bankId} đã nhận được tiền:*`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '✅ DUYỆT (Gửi Link)', callback_data: `APPROVE:${orderId}` },
          { text: '❌ TỪ CHỐI', callback_data: `REJECT:${orderId}` },
        ]
      ]
    };

    if (telegramToken && telegramChatId) {
      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: caption,
          parse_mode: 'Markdown',
          reply_markup: inlineKeyboard,
        }),
      }).catch((e) => console.error('Error sending Telegram notification on checkout:', e));
    }

    return NextResponse.json({
      success: true,
      isFree: false,
      orderId,
      orderCode,
      affiliate: affResult ? { code: affResult.partner.code, name: affResult.partner.name } : null,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
      },
      bankInfo: {
        bankName: `${bankId} (Ngân hàng thụ hưởng)`,
        accountNo,
        accountName,
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
