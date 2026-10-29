import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import { execute, query } from '@/lib/db';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { sendFreeResourceEmail } from '@/lib/email';
import { getSiteSettings } from '@/lib/settings';
import { attachAffiliateToOrder } from '@/lib/affiliate';
import { broadcastTelegramMessage } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const { 
      productId, 
      customerName, 
      customerEmail, 
      customerPhone, 
      affiliateRef,
      landingSlug,
      utmSource,
      utmMedium,
      utmCampaign
    } = await req.json();

    const session = await getCurrentUser();
    let userId = session?.id || null;
    const isLoggedIn = !!userId;

    if (!productId || !customerName || !customerEmail || (!isLoggedIn && !customerPhone)) {
      return NextResponse.json({ error: 'Vui lòng cung cấp đầy đủ thông tin đặt hàng' }, { status: 400 });
    }

    const cleanEmail = String(customerEmail).trim().toLowerCase();
    const cleanName = String(customerName).trim();
    let cleanPhone = customerPhone ? String(customerPhone).replace(/\s+/g, '').trim() : '';

    // 1. Kiểm tra định dạng Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ 
        error: 'Email không đúng định dạng. Vui lòng nhập email hợp lệ (ví dụ: name@gmail.com)' 
      }, { status: 400 });
    }

    // 2. Nếu là khách mới (chưa đăng nhập), bắt buộc Số điện thoại phải đúng 10 chữ số
    if (!isLoggedIn) {
      const phoneRegex = /^0[0-9]{9}$/;
      if (!phoneRegex.test(cleanPhone)) {
        return NextResponse.json({ 
          error: 'Số điện thoại phải bao gồm đúng 10 chữ số (bắt đầu bằng 0, ví dụ: 0912345678)' 
        }, { status: 400 });
      }
    }

    const cleanLandingSlug = landingSlug ? String(landingSlug).trim() : null;
    const cleanUtmSource = utmSource ? String(utmSource).trim() : null;
    const cleanUtmMedium = utmMedium ? String(utmMedium).trim() : null;
    const cleanUtmCampaign = utmCampaign ? String(utmCampaign).trim() : null;

    // Determine affiliate referral code (from body or fallback to cookie)
    let finalAffiliateCode = (typeof affiliateRef === 'string' && affiliateRef.trim()) ? affiliateRef.trim() : null;
    if (!finalAffiliateCode) {
      try {
        const cookieStore = await cookies();
        const cookieRef = cookieStore.get('tuhocai_aff_ref')?.value;
        if (cookieRef && cookieRef.trim().length > 0) {
          finalAffiliateCode = cookieRef.trim();
        }
      } catch (_) {
        // Fallback to request header
      }
      if (!finalAffiliateCode) {
        const cookieHeader = req.headers.get('cookie') || '';
        const match = cookieHeader.match(/tuhocai_aff_ref=([^;]+)/);
        if (match) {
          finalAffiliateCode = decodeURIComponent(match[1].trim());
        }
      }
    }

    // Lookup product
    const products = await query<any>('SELECT * FROM products WHERE id = ? OR pid = ? LIMIT 1', [productId, productId]);
    if (products.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    const product = products[0];

    // Check logged in user or auto-create customer user account with default password = phone
    if (!userId) {
      const existingUsers = await query<any>('SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1', [cleanEmail]);
      if (existingUsers.length > 0) {
        userId = existingUsers[0].id;
      } else {
        userId = randomUUID();
        const hashedPassword = await hashPassword(cleanPhone);
        await execute(
          'INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
          [userId, cleanName, cleanEmail, hashedPassword, 'USER']
        );
      }
    }

    // Load dynamic site settings
    const siteSettings = await getSiteSettings();

    // Free Product
    if (product.price === 0) {
      const orderId = randomUUID();
      const orderCode = `FREE-${Math.floor(100000 + Math.random() * 900000)}`;

      await execute(
        `INSERT INTO orders (id, order_code, user_id, customer_name, customer_email, customer_phone, product_id, product_name, landing_slug, utm_source, utm_medium, utm_campaign, price, payment_status, payment_method, approved_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'APPROVED', 'FREE', NOW())`,
        [orderId, orderCode, userId, cleanName, cleanEmail, customerPhone || null, product.id, product.name, cleanLandingSlug, cleanUtmSource, cleanUtmMedium, cleanUtmCampaign]
      );

      if (cleanLandingSlug) {
        execute('UPDATE landing_pages SET conversions = conversions + 1 WHERE slug = ?', [cleanLandingSlug]).catch(() => {});
      }

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
      `INSERT INTO orders (id, order_code, user_id, customer_name, customer_email, customer_phone, product_id, product_name, landing_slug, utm_source, utm_medium, utm_campaign, price, payment_status, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'VIETQR')`,
      [orderId, orderCode, userId, cleanName, cleanEmail, customerPhone || null, product.id, product.name, cleanLandingSlug, cleanUtmSource, cleanUtmMedium, cleanUtmCampaign, product.price]
    );

    if (cleanLandingSlug) {
      execute('UPDATE landing_pages SET conversions = conversions + 1 WHERE slug = ?', [cleanLandingSlug]).catch(() => {});
    }

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

    // Generate VietQR URL with dynamic course prefix and settings
    function getCoursePrefix(pid: string, pname: string): string {
      const text = `${pid} ${pname}`.toLowerCase();
      if (text.includes('drama')) return 'DRAMA';
      if (text.includes('sao-chep') || text.includes('landing') || text.includes('clone')) return 'CLONELP';
      if (text.includes('video-ai') || text.includes('vip') || text.includes('1 anh')) return 'VIDEOAI';
      if (text.includes('n8n') || text.includes('facebook') || text.includes('fb')) return 'N8NFB';
      if (text.includes('prompt')) return 'PROMPT';
      const clean = pid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 7).toUpperCase();
      return clean || 'THAI';
    }

    const coursePrefix = getCoursePrefix(product.id, product.name);
    const transferContent = `${coursePrefix} ${orderCode}`;

    const bankId = siteSettings.bank_id || 'ACB';
    const accountNo = siteSettings.account_no || '4747827';
    const accountName = siteSettings.account_name || 'NGUYEN VAN DANG';

    const encodedName = encodeURIComponent(accountName);
    const encodedContent = encodeURIComponent(transferContent);
    const vietQrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${product.price}&addInfo=${encodedContent}&accountName=${encodedName}`;

    // Immediately notify Telegram Bot Admin
    const telegramToken = siteSettings.telegram_bot_token;
    const telegramChatId = siteSettings.telegram_chat_id;
    const priceFormatted = new Intl.NumberFormat('vi-VN').format(product.price) + ' đ';

    let affText = '';
    if (affResult?.partner) {
      const commFormatted = new Intl.NumberFormat('vi-VN').format(affResult.commissionAmount) + ' đ';
      affText = `\n🤝 *Affiliate:* ${affResult.partner.name} (\`${affResult.partner.code}\`)\n🎁 *Hoa hồng:* ${commFormatted} (${affResult.rate}%)`;
    }

    const lpInfo = cleanLandingSlug ? `\n🌐 *Nguồn Landing Page:* \`${cleanLandingSlug}\`` : '';
    const utmInfo = cleanUtmSource ? `\n🎯 *Chiến dịch:* \`${cleanUtmSource}\` ${cleanUtmCampaign ? `(${cleanUtmCampaign})` : ''}` : '';

    const caption = `🛒 *CÓ ĐƠN HÀNG MỚI KHỞI TẠO!*

📦 *Mã đơn:* \`${orderCode}\`
👤 *Khách hàng:* ${cleanName}
📧 *Email:* ${cleanEmail}
📞 *SĐT:* ${customerPhone || 'Không có'}
💎 *Sản phẩm:* ${product.name}
💰 *Số tiền:* ${priceFormatted}
🏦 *Ngân hàng:* ${bankId} - STK: \`${accountNo}\`
📝 *Nội dung CK:* \`${transferContent}\`${lpInfo}${utmInfo}${affText}

👉 *Khách hàng đang xem mã VietQR. Bạn có thể bấm DUYỆT ngay nếu tài khoản ${bankId} đã nhận được tiền:*`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '✅ DUYỆT (Gửi Link)', callback_data: `APPROVE:${orderId}` },
          { text: '❌ TỪ CHỐI', callback_data: `REJECT:${orderId}` },
        ]
      ]
    };

    await broadcastTelegramMessage({
      type: 'order_created',
      variables: {
        order_code: orderCode,
        customer_name: cleanName,
        customer_email: cleanEmail,
        customer_phone: cleanPhone || 'Không có',
        product_name: product.name,
        amount: priceFormatted,
        bank_name: bankId,
        account_no: accountNo,
        transfer_content: transferContent,
        created_at: new Date().toLocaleString('vi-VN'),
      },
      replyMarkup: inlineKeyboard,
    });

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
        bankName: bankId === 'ACB' ? 'ACB (Ngân hàng TMCP Á Châu)' : `${bankId} (Ngân hàng thụ hưởng)`,
        bankId,
        accountNo,
        accountName,
        amount: product.price,
        content: transferContent,
        orderCode,
        landingSlug: cleanLandingSlug || null,
        productId: product.id,
      },
      vietQrUrl,
    });

  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Lỗi tạo đơn hàng: ' + (err.message || 'Lỗi máy chủ') }, { status: 500 });
  }
}
