import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/db';
import { randomUUID, createHmac, timingSafeEqual } from 'crypto';
import { sendOrderApprovedEmail } from '@/lib/email';
import { approveAffiliateCommission } from '@/lib/affiliate';
import { getSiteSettings } from '@/lib/settings';
import { broadcastTelegramMessage } from '@/lib/telegram';

/**
 * SEPAY WEBHOOK ENDPOINT FOR TUHOCAI.TOP
 * Tự động kiểm tra biến động số dư ngân hàng VIB và kích hoạt đơn hàng 100% tự động
 * URL Webhook: https://www.tuhocai.top/api/webhook/sepay
 */

interface SePayWebhookPayload {
  id?: number;
  gateway?: string;
  transactionDate?: string;
  accountNumber?: string;
  code?: string | null;
  content?: string;
  transferType?: 'in' | 'out';
  transferAmount?: number;
  accumulated?: number;
  subAccount?: string | null;
  referenceCode?: string;
  description?: string;
}

function safeCompare(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
  } catch {
    return false;
  }
}

function verifySepaySignature(rawBody: string, signatureHeader: string, timestampHeader: string, secret: string): boolean {
  if (!secret) return true;
  if (!signatureHeader) return false;

  let providedHash = signatureHeader.trim();
  if (providedHash.startsWith('sha256=')) {
    providedHash = providedHash.slice(7).trim();
  } else if (providedHash.includes('v1=')) {
    const match = providedHash.match(/v1=([a-fA-F0-9]+)/);
    if (match) providedHash = match[1];
  }

  // Phương án 1: Ký `${timestamp}.${rawBody}` (chuẩn SePay HMAC)
  if (timestampHeader) {
    const hmacWithTimestamp = createHmac('sha256', secret).update(`${timestampHeader}.${rawBody}`).digest('hex');
    if (safeCompare(hmacWithTimestamp, providedHash)) return true;
  }

  // Phương án 2: Ký trực tiếp rawBody
  const hmacDirect = createHmac('sha256', secret).update(rawBody).digest('hex');
  if (safeCompare(hmacDirect, providedHash)) return true;

  return false;
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    let payload: SePayWebhookPayload;

    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON payload' }, { status: 400 });
    }

    console.log('[SePay Webhook] Nhận dữ liệu biến động số dư:', JSON.stringify(payload));

    // 1. Kiểm tra xác thực SePay (HMAC-SHA256 hoặc API Key)
    const sepaySecret = process.env.SEPAY_WEBHOOK_SECRET || 'whsec_Mb3fdTLikFj3RKluA4iyHRyMYxyXITZB';
    const signatureHeader = req.headers.get('x-sepay-signature') || req.headers.get('x-signature') || '';
    const timestampHeader = req.headers.get('x-sepay-timestamp') || '';
    const authHeader = req.headers.get('authorization') || '';
    const configuredApiKey = process.env.SEPAY_API_KEY;

    if (signatureHeader) {
      const isValid = verifySepaySignature(rawBody, signatureHeader, timestampHeader, sepaySecret);
      if (!isValid) {
        console.warn('[SePay Webhook] HMAC-SHA256 signature không khớp:', signatureHeader);
        return NextResponse.json({ success: false, message: 'Invalid HMAC signature' }, { status: 401 });
      }
      console.log('[SePay Webhook] Xác thực chữ ký HMAC-SHA256 thành công!');
    } else if (configuredApiKey) {
      const token = authHeader.replace(/^Apikey\s+/i, '').trim();
      if (token !== configuredApiKey) {
        console.warn('[SePay Webhook] Sai hoặc thiếu API Key xác thực:', authHeader);
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
    }

    // 2. Chỉ xử lý giao dịch tiền vào (transferType: "in")
    if (payload.transferType && payload.transferType !== 'in') {
      return NextResponse.json({ success: true, message: 'Ignored outbound transfer' });
    }

    const anyPayload = payload as any;
    const amount = Number(payload.transferAmount || anyPayload.amountIn || anyPayload.amount || 0);
    const content = (payload.content || anyPayload.transactionContent || payload.description || '').trim();
    const gateway = payload.gateway || anyPayload.bank_brand_name || 'ACB';
    const accountNo = payload.accountNumber || anyPayload.account_number || '4747827';

    if (amount <= 0) {
      return NextResponse.json({ success: false, message: 'Transfer amount must be greater than 0' });
    }

    // 3. THUẬT TOÁN ĐỐI SOÁT & KHỚP ĐƠN THÔNG MINH (SMART MATCHING)
    let matchedOrder: any = null;

    // Cách 1: Tìm theo mã đơn hàng có trong nội dung (vd: THAI123456, ORD-12345)
    const codeMatch = content.match(/THAI\d{5,8}/i) || content.match(/ORD-[A-Z0-9]+/i);
    if (codeMatch) {
      const extractedCode = codeMatch[0].toUpperCase();
      const orders = await query<any>(
        `SELECT o.*, p.download_url, p.name as prod_title 
         FROM orders o 
         LEFT JOIN products p ON o.product_id = p.id 
         WHERE UPPER(o.order_code) = ? AND o.payment_status = 'PENDING'
         LIMIT 1`,
        [extractedCode]
      );
      if (orders.length > 0 && amount >= Number(orders[0].price || 0)) {
        matchedOrder = orders[0];
      }
    }

    // Cách 2: Tìm theo số điện thoại của khách hàng có trong nội dung chuyển khoản
    if (!matchedOrder) {
      const phoneMatch = content.match(/0\d{9}/);
      if (phoneMatch) {
        const phone = phoneMatch[0];
        const orders = await query<any>(
          `SELECT o.*, p.download_url, p.name as prod_title 
           FROM orders o 
           LEFT JOIN products p ON o.product_id = p.id 
           WHERE o.customer_phone LIKE ? AND o.payment_status = 'PENDING' AND o.price <= ?
           ORDER BY o.created_at DESC LIMIT 1`,
          [`%${phone}%`, amount]
        );
        if (orders.length > 0) {
          matchedOrder = orders[0];
        }
      }
    }

    // Cách 3: Khớp theo từ khóa sản phẩm trên 3 Landing Page và số tiền tương ứng
    if (!matchedOrder) {
      const contentLower = content.toLowerCase();

      // Đơn 69K: Mini Drama gia đình nhỏ
      if (amount === 69000 || contentLower.includes('tra sua') || contentLower.includes('drama')) {
        const orders = await query<any>(
          `SELECT o.*, p.download_url, p.name as prod_title 
           FROM orders o 
           LEFT JOIN products p ON o.product_id = p.id 
           WHERE (o.product_id = 'WF-DRAMA-069' OR o.price = 69000) 
             AND o.payment_status = 'PENDING'
             AND o.created_at >= NOW() - INTERVAL 2 DAY
           ORDER BY o.created_at DESC LIMIT 1`
        );
        if (orders.length > 0) matchedOrder = orders[0];
      }
      // Đơn 99K: Sao chép landing page
      else if (amount === 99000 || contentLower.includes('landing page') || contentLower.includes('copy')) {
        const orders = await query<any>(
          `SELECT o.*, p.download_url, p.name as prod_title 
           FROM orders o 
           LEFT JOIN products p ON o.product_id = p.id 
           WHERE (o.product_id = 'SKILL-CLONE-099' OR o.price = 99000) 
             AND o.payment_status = 'PENDING'
             AND o.created_at >= NOW() - INTERVAL 2 DAY
           ORDER BY o.created_at DESC LIMIT 1`
        );
        if (orders.length > 0) matchedOrder = orders[0];
      }
      // Đơn 297K: Video AI VIP từ 1 ảnh
      else if (amount === 297000 || contentLower.includes('video ai') || contentLower.includes('1 anh')) {
        const orders = await query<any>(
          `SELECT o.*, p.download_url, p.name as prod_title 
           FROM orders o 
           LEFT JOIN products p ON o.product_id = p.id 
           WHERE (o.product_id = 'WF-VIP-297' OR o.price = 297000) 
             AND o.payment_status = 'PENDING'
             AND o.created_at >= NOW() - INTERVAL 2 DAY
           ORDER BY o.created_at DESC LIMIT 1`
        );
        if (orders.length > 0) matchedOrder = orders[0];
      }
      // Khớp dự phòng: Bất kỳ đơn PENDING nào khớp chính xác số tiền gần nhất trong 24 giờ
      else {
        const orders = await query<any>(
          `SELECT o.*, p.download_url, p.name as prod_title 
           FROM orders o 
           LEFT JOIN products p ON o.product_id = p.id 
           WHERE o.price = ? AND o.payment_status = 'PENDING'
             AND o.created_at >= NOW() - INTERVAL 1 DAY
           ORDER BY o.created_at DESC LIMIT 1`,
          [amount]
        );
        if (orders.length > 0) matchedOrder = orders[0];
      }
    }

    // Load site settings để lấy cấu hình Telegram
    const siteSettings = await getSiteSettings();
    const telegramToken = siteSettings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = siteSettings.telegram_chat_id;

    // 4. NẾU KHỚP ĐƠN HÀNG THÀNH CÔNG -> TỰ ĐỘNG DUYỆT ĐƠN & GỬI TÀI LIỆU
    if (matchedOrder) {
      const orderId = matchedOrder.id;

      // Cập nhật trạng thái đơn hàng thành APPROVED
      await execute(
        `UPDATE orders 
         SET payment_status = 'APPROVED', 
             approved_at = NOW(), 
             approved_by = 'SePay Auto' 
         WHERE id = ?`,
        [orderId]
      );

      // Liên kết và mở khóa sản phẩm trong user_library
      let userId = matchedOrder.user_id;
      if (!userId && matchedOrder.customer_email) {
        const users = await query<any>('SELECT id FROM users WHERE email = ? LIMIT 1', [matchedOrder.customer_email]);
        if (users.length > 0) {
          userId = users[0].id;
          await execute('UPDATE orders SET user_id = ? WHERE id = ?', [userId, orderId]);
        }
      }

      if (userId) {
        await execute(
          'INSERT IGNORE INTO user_library (id, user_id, product_id, order_id) VALUES (?, ?, ?, ?)',
          [randomUUID(), userId, matchedOrder.product_id, orderId]
        );
      }

      // Duyệt hoa hồng Affiliate (nếu có)
      const affComm = await approveAffiliateCommission(orderId).catch(() => null);

      // Tự động gửi Email chứa link tải Drive tốc độ cao cho khách hàng
      const downloadLink = matchedOrder.download_url || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing';
      let emailStatusText = 'Chưa gửi';

      if (matchedOrder.customer_email) {
        const mailRes = await sendOrderApprovedEmail({
          customerName: matchedOrder.customer_name,
          customerEmail: matchedOrder.customer_email,
          orderCode: matchedOrder.order_code,
          productName: matchedOrder.product_name,
          downloadUrl: downloadLink,
        }).catch((err) => ({ success: false, error: String(err) }));

        emailStatusText = mailRes?.success ? '✓ Đã gửi thành công' : '⚠️ Lỗi gửi email';
      }

      // Bắn tin nhắn chúc mừng qua Telegram theo các kênh cấu hình
      await broadcastTelegramMessage({
        type: 'order_approved',
        variables: {
          order_code: matchedOrder.order_code,
          customer_name: matchedOrder.customer_name,
          customer_email: matchedOrder.customer_email,
          customer_phone: matchedOrder.customer_phone || 'Không có',
          product_name: matchedOrder.product_name,
          amount: new Intl.NumberFormat('vi-VN').format(amount) + ' đ',
          bank_name: gateway,
          account_no: accountNo,
          transfer_content: content,
          created_at: payload.transactionDate || new Date().toLocaleString('vi-VN'),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Order matched and approved automatically',
        orderCode: matchedOrder.order_code,
        customerEmail: matchedOrder.customer_email,
        amount,
      });
    }

    // 5. NẾU NHẬN TIỀN NHƯNG CHƯA KHỚP ĐƠN NÀO TRONG HỆ THỐNG
    console.warn(`[SePay Webhook] Tiền vào ${amount} đ với nội dung "${content}" nhưng chưa tìm thấy đơn PENDING khớp.`);

    await broadcastTelegramMessage({
      type: 'unmatched_payment',
      variables: {
        order_code: 'CHƯA_KHỚP',
        customer_name: 'Khách chuyển khoản',
        customer_email: 'Chưa xác định',
        customer_phone: 'Chưa xác định',
        product_name: 'Chưa xác định',
        amount: new Intl.NumberFormat('vi-VN').format(amount) + ' đ',
        bank_name: gateway,
        account_no: accountNo,
        transfer_content: content,
        created_at: payload.transactionDate || new Date().toLocaleString('vi-VN'),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment received but no matching pending order found. Alerted admin.',
      amount,
      content,
    });
  } catch (error: any) {
    console.error('[SePay Webhook] Lỗi xử lý:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
