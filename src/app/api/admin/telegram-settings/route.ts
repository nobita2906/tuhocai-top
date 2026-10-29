import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getTelegramConfig, DEFAULT_TELEGRAM_TEMPLATES } from '@/lib/telegram';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await getTelegramConfig();
    return NextResponse.json({ success: true, ...config });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi lấy cấu hình Telegram' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // 1. Action Test tin nhắn
    if (body.action === 'TEST') {
      const { targetChatId, testMessage, botToken } = body;
      const effectiveToken = botToken || process.env.TELEGRAM_BOT_TOKEN;

      if (!targetChatId || !effectiveToken) {
        return NextResponse.json({ error: 'Thiếu Chat ID hoặc Bot Token' }, { status: 400 });
      }

      const res = await fetch(`https://api.telegram.org/bot${effectiveToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: testMessage || '🔔 *KIỂM TRA KẾT NỐI TELEGRAM THÀNH CÔNG!*\nHệ thống Tự Học AI đã kết nối thành công với kênh này.',
          parse_mode: 'Markdown',
        }),
      });

      const resJson = await res.json();
      if (!resJson.ok) {
        return NextResponse.json({ error: `Telegram Bot trả về lỗi: ${resJson.description}` }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: 'Đã gửi tin nhắn thử nghiệm thành công lên Telegram!' });
    }

    // 2. Action Lưu cấu hình
    const { botToken, channels, templates } = body;

    if (botToken) {
      await execute(
        `INSERT INTO site_settings (skey, svalue) VALUES ('telegram_bot_token', ?) 
         ON DUPLICATE KEY UPDATE svalue = VALUES(svalue)`,
        [String(botToken).trim()]
      );
    }

    if (Array.isArray(channels)) {
      await execute(
        `INSERT INTO site_settings (skey, svalue) VALUES ('telegram_channels', ?) 
         ON DUPLICATE KEY UPDATE svalue = VALUES(svalue)`,
        [JSON.stringify(channels)]
      );
    }

    if (templates) {
      await execute(
        `INSERT INTO site_settings (skey, svalue) VALUES ('telegram_templates', ?) 
         ON DUPLICATE KEY UPDATE svalue = VALUES(svalue)`,
        [JSON.stringify(templates)]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lưu cấu hình thông báo Telegram thành công!',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi lưu cấu hình' }, { status: 500 });
  }
}
