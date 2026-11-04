import { NextResponse } from 'next/server';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { getSiteSettings, saveSiteSettings } from '@/lib/settings';

export async function GET() {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi tải cấu hình' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const body = await req.json();
    await saveSiteSettings(body);
    const updated = await getSiteSettings();
    return NextResponse.json({
      success: true,
      settings: updated,
      message: 'Cập nhật cài đặt website thành công!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi lưu cấu hình' }, { status: 500 });
  }
}

// POST: Test & Action handler for Telegram Bot and SePay
export async function POST(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const body = await req.json();
    const action = body.action || 'test_telegram';
    const siteSettings = await getSiteSettings();

    // 1. Kiểm tra kết nối SePay API Token
    if (action === 'test_sepay') {
      const rawKey = body.apiKey || siteSettings.sepay_api_key || '';
      const cleanKey = rawKey.replace(/^(?:Bearer|Apikey)\s+/i, '').trim();

      if (!cleanKey) {
        return NextResponse.json(
          { error: 'Vui lòng nhập API Token SePay trước khi kiểm tra kết nối' },
          { status: 400 }
        );
      }

      try {
        // Gọi endpoint chính thức SePay v2 với Authorization: Bearer
        let sepayRes = await fetch('https://userapi.sepay.vn/v2/transactions?per_page=1', {
          headers: {
            Authorization: `Bearer ${cleanKey}`,
            'Content-Type': 'application/json',
          },
        });

        // Fallback sang endpoint my.sepay.vn nếu cần
        if (sepayRes.status === 401) {
          sepayRes = await fetch('https://my.sepay.vn/userapi/transactions/list?limit=1', {
            headers: {
              Authorization: `Bearer ${cleanKey}`,
              'Content-Type': 'application/json',
            },
          });
        }

        if (sepayRes.status === 200) {
          const resData = await sepayRes.json().catch(() => null);
          return NextResponse.json({
            success: true,
            message: '🎉 KẾT NỐI SEPAY THÀNH CÔNG! Token API của anh Đăng hoàn toàn chính xác và đã liên kết tài khoản SePay.',
            data: resData,
          });
        } else if (sepayRes.status === 401 || sepayRes.status === 403) {
          return NextResponse.json(
            { error: 'Mã lỗi 401: Token SePay không hợp lệ hoặc đã hết hạn trên my.sepay.vn. Vui lòng kiểm tra lại token đã sao chép.' },
            { status: 400 }
          );
        } else {
          return NextResponse.json(
            { error: `SePay phản hồi mã trạng thái HTTP ${sepayRes.status}. Vui lòng thử lại sau ít phút.` },
            { status: 400 }
          );
        }
      } catch (err: any) {
        return NextResponse.json(
          { error: `Không thể kết nối đến máy chủ SePay: ${err.message || err}` },
          { status: 500 }
        );
      }
    }

    // 2. Kích hoạt Webhook Telegram Bot (setWebhook)
    if (action === 'set_telegram_webhook') {
      const botToken = body.token || siteSettings.telegram_bot_token;
      if (!botToken) {
        return NextResponse.json({ error: 'Chưa có Telegram Bot Token' }, { status: 400 });
      }

      const webhookUrl = body.webhookUrl || 'https://www.tuhocai.top/api/telegram-webhook';
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query'],
          drop_pending_updates: false,
        }),
      });

      const data = await tgRes.json();
      if (!tgRes.ok || !data.ok) {
        return NextResponse.json(
          { error: data.description || 'Không thể thiết lập Webhook cho Bot Telegram' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `✓ Đã kích hoạt Webhook thành công! Bot Telegram đã sẵn sàng nhận lệnh bấm [DUYỆT ĐƠN] từ điện thoại.`,
        webhookUrl,
      });
    }

    // 3. Lấy thông tin trạng thái Webhook Telegram Bot
    if (action === 'get_telegram_webhook_info') {
      const botToken = body.token || siteSettings.telegram_bot_token;
      if (!botToken) {
        return NextResponse.json({ success: true, info: { url: '', active: false } });
      }

      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
      const data = await tgRes.json();
      if (data.ok && data.result) {
        return NextResponse.json({
          success: true,
          info: {
            url: data.result.url || '',
            active: Boolean(data.result.url),
            pendingUpdates: data.result.pending_update_count || 0,
            lastErrorMessage: data.result.last_error_message || null,
          },
        });
      }
      return NextResponse.json({ success: false, error: 'Không lấy được thông tin Webhook' });
    }

    // 4. Gửi thử nghiệm đơn hàng mẫu có nút Duyệt (Mock Order Notification)
    if (action === 'test_order_bot') {
      const botToken = body.token || siteSettings.telegram_bot_token;
      const targetChatId = body.chatId || siteSettings.telegram_chat_id;

      if (!botToken || !targetChatId) {
        return NextResponse.json(
          { error: 'Vui lòng cung cấp Bot Token và Chat ID để gửi đơn mẫu' },
          { status: 400 }
        );
      }

      const mockOrderCode = `DEMO${Math.floor(100000 + Math.random() * 900000)}`;
      const mockOrderMsg = `🛒 *CÓ ĐƠN HÀNG MẪU KHỞI TẠO (THỬ NGHIỆM)!*

📦 *Mã đơn:* \`${mockOrderCode}\`
👤 *Khách hàng:* Nguyễn Văn Test (0987.654.321)
📧 *Email:* \`test@tuhocai.top\`
💎 *Sản phẩm:* Khóa Học & Quy Trình Làm Video AI Bán Hàng Triệu View Từ 1 Ảnh
💰 *Số tiền:* 297.000 đ
🏦 *Ngân hàng:* ${siteSettings.bank_id || 'ACB'} - STK: \`${siteSettings.account_no || '4747827'}\`
📝 *Nội dung CK:* \`VIDEOAI ${mockOrderCode}\`
⏰ *Thời gian:* ${new Date().toLocaleString('vi-VN')}

👉 *Khách hàng đang xem mã VietQR. Bạn có thể bấm DUYỆT ngay dưới đây để kiểm tra tương tác bot:*`;

      const inlineKeyboard = {
        inline_keyboard: [
          [
            { text: '✅ DUYỆT THỬ (Demo)', callback_data: `APPROVE:${mockOrderCode}` },
            { text: '❌ TỪ CHỐI THỬ', callback_data: `REJECT:${mockOrderCode}` },
          ],
        ],
      };

      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: mockOrderMsg,
          parse_mode: 'Markdown',
          reply_markup: inlineKeyboard,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        return NextResponse.json(
          { error: data.description || 'Không thể gửi đơn hàng mẫu Telegram' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '🎉 Đã gửi đơn hàng mẫu có nút Duyệt về Telegram của bạn! Hãy mở Telegram để kiểm tra tương tác nhé.',
      });
    }

    // 5. Mặc định: Gửi tin nhắn test kiểm tra kết nối thông thường
    const botToken = body.token || siteSettings.telegram_bot_token;
    const targetChatId = body.chatId || siteSettings.telegram_chat_id;

    if (!botToken || !targetChatId) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp Bot Token và Chat ID để kiểm tra' },
        { status: 400 }
      );
    }

    const testMessage = `🤖 *THÔNG BÁO THỬ NGHIỆM TỪ TỰ HỌC AI* 🚀
━━━━━━━━━━━━━━━━━━━━
✅ Kết nối giữa website *tuhocai.top* và Telegram của bạn đã thành công!
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
👤 Quản trị viên: ${admin.email}

Từ bây giờ, mọi đơn hàng mới và thông báo tiền vào SePay sẽ được tự động gửi về đây tức thì!`;

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: testMessage,
        parse_mode: 'Markdown',
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      return NextResponse.json(
        { error: data.description || 'Không thể gửi tin nhắn Telegram. Vui lòng kiểm tra lại Token hoặc Chat ID.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đã gửi tin nhắn test thành công! Vui lòng kiểm tra ứng dụng Telegram trên điện thoại của bạn.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi xử lý yêu cầu' }, { status: 500 });
  }
}
