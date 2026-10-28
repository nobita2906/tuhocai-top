import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/db';
import { randomUUID } from 'crypto';
import { sendOrderApprovedEmail } from '@/lib/email';
import { approveAffiliateCommission } from '@/lib/affiliate';
import { getSiteSettings } from '@/lib/settings';

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

    // 1. Kiểm tra xác thực SePay API Key (nếu có cấu hình)
    const authHeader = req.headers.get('authorization') || '';
    const configuredApiKey = process.env.SEPAY_API_KEY;

    if (configuredApiKey) {
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

    const amount = Number(payload.transferAmount || 0);
    const content = (payload.content || payload.description || '').trim();
    const gateway = payload.gateway || 'VIB';
    const accountNo = payload.accountNumber || '';

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
             approved_by = 'SePay VIB Auto' 
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

      // Bắn tin nhắn chúc mừng qua Telegram cho anh Đăng
      if (telegramToken && telegramChatId) {
        const affMsg = affComm
          ? `\n🤝 *Hoa hồng đối tác:* +${new Intl.NumberFormat('vi-VN').format(affComm.commission_amount)} đ`
          : '';

        const tgText = `🤖 *SEPAY ĐÃ TỰ ĐỘNG KHỚP TIỀN VIB & DUYỆT ĐƠN THÀNH CÔNG!*

📦 *Mã đơn:* \`${matchedOrder.order_code}\`
👤 *Khách hàng:* ${matchedOrder.customer_name} (\`${matchedOrder.customer_email}\`)
📞 *SĐT/Zalo:* ${matchedOrder.customer_phone || 'Không có'}
💎 *Sản phẩm:* ${matchedOrder.product_name}
💰 *Tiền vào VIB:* +${new Intl.NumberFormat('vi-VN').format(amount)} đ
📝 *Nội dung CK:* "${content}"
📂 *Link tài liệu:* [Mở Google Drive](${downloadLink})
📧 *Email khách hàng:* ${emailStatusText}${affMsg}

✨ *Trạng thái:* Hệ thống đã tự động mở khóa tài nguyên cho khách hàng 100%!`;

        fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: tgText,
            parse_mode: 'Markdown',
          }),
        }).catch(() => {});
      }

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

    if (telegramToken && telegramChatId) {
      const alertMsg = `⚠️ *THÔNG BÁO TIỀN VÀO VIB (CHƯA KHỚP ĐƠN):*

💰 *Số tiền:* +${new Intl.NumberFormat('vi-VN').format(amount)} đ
🏦 *Ngân hàng:* ${gateway} (${accountNo})
📝 *Nội dung CK:* "${content}"
⏰ *Thời gian:* ${payload.transactionDate || new Date().toLocaleString('vi-VN')}

👉 *Ghi chú:* Hệ thống chưa tìm thấy đơn PENDING trùng khớp. Anh Đăng vui lòng kiểm tra mục Quản lý đơn hàng trên trang Admin nhé!`;

      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: alertMsg,
          parse_mode: 'Markdown',
        }),
      }).catch(() => {});
    }

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
