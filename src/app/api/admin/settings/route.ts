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

// POST: Test Telegram notification
export async function POST(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { token, chatId } = await req.json();
    const botToken = token || (await getSiteSettings()).telegram_bot_token;
    const targetChatId = chatId || (await getSiteSettings()).telegram_chat_id;

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

Từ bây giờ, mọi đơn hàng mới và ảnh bill VietQR sẽ được tự động gửi về đây tức thì!`;

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
    return NextResponse.json({ error: error.message || 'Lỗi kiểm tra Telegram' }, { status: 500 });
  }
}
