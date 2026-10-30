import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/db';
import { randomUUID } from 'crypto';
import { sendOrderApprovedEmail } from '@/lib/email';
import { approveAffiliateCommission, cancelAffiliateCommission } from '@/lib/affiliate';
import { getSiteSettings } from '@/lib/settings';

const DEFAULT_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8781006384:AAHDfcnSsIiwDpycoY9G-fd7ug5-Ne2Oq0Y';

export async function POST(req: Request) {
  try {
    const update = await req.json();
    const siteSettings = await getSiteSettings();
    const botToken = siteSettings.telegram_bot_token || DEFAULT_BOT_TOKEN;

    // 1. Check if this is a callback_query (inline button click)
    if (update.callback_query) {
      const cq = update.callback_query;
      const callbackId = cq.id;
      const data = cq.data || '';
      const messageId = cq.message?.message_id;
      const chatId = cq.message?.chat?.id;

      if (data.startsWith('APPROVE:') || data.startsWith('REJECT:')) {
        const [action, rawId] = data.split(':');
        const isApprove = action === 'APPROVE';

        // Trả lời callback ngay lập tức để tắt trạng thái loading trên giao diện Telegram
        await answerCallback(botToken, callbackId, isApprove ? '⚡ Đang kích hoạt đơn hàng...' : 'Đang xử lý...');

        // Fetch Order & Product by id OR order_code
        const orders = await query<any>(
          `SELECT o.*, p.download_url, p.name as prod_title 
           FROM orders o 
           LEFT JOIN products p ON o.product_id = p.id 
           WHERE o.id = ? OR o.order_code = ? LIMIT 1`,
          [rawId, rawId]
        );

        if (orders.length === 0) {
          await answerCallback(botToken, callbackId, '❌ Không tìm thấy đơn hàng trong hệ thống!', true);
          return NextResponse.json({ ok: true });
        }

        const order = orders[0];
        const orderId = order.id;

        if (isApprove) {
          // Update Order Status
          await execute(
            `UPDATE orders 
             SET payment_status = 'APPROVED', approved_at = NOW(), approved_by = 'Telegram Admin' 
             WHERE id = ?`,
            [orderId]
          );

          // Find or create user
          let userId = order.user_id;
          if (!userId && order.customer_email) {
            const users = await query<any>('SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1', [order.customer_email.toLowerCase()]);
            if (users.length > 0) {
              userId = users[0].id;
              await execute('UPDATE orders SET user_id = ? WHERE id = ?', [userId, orderId]);
            }
          }

          // Unlock in user_library
          if (userId && order.product_id) {
            await execute(
              'INSERT IGNORE INTO user_library (id, user_id, product_id, order_id) VALUES (?, ?, ?, ?)',
              [randomUUID(), userId, order.product_id, orderId]
            );
          }

          // Thông báo thành công lên màn hình Telegram
          await answerCallback(botToken, callbackId, '🚀 ĐÃ DUYỆT THÀNH CÔNG! Đơn hàng đã mở khóa.', true);

          // Edit original message to remove buttons and show approval
          if (chatId && messageId) {
            const approvedHtml = `<b>✅ ĐƠN HÀNG ĐÃ ĐƯỢC PHÊ DUYỆT!</b>\n\n` +
              `📦 <b>Mã đơn:</b> <code>${order.order_code}</code>\n` +
              `👤 <b>Khách hàng:</b> ${order.customer_name} (${order.customer_email})\n` +
              `💎 <b>Sản phẩm:</b> ${order.product_name}\n` +
              `💰 <b>Số tiền:</b> ${new Intl.NumberFormat('vi-VN').format(order.price)} đ\n` +
              `✨ <b>Trạng thái:</b> Đã kích hoạt vào tài khoản khách hàng trên tuhocai.top`;

            await editMessageHtml(botToken, chatId, messageId, approvedHtml);
          }

          // Duyệt hoa hồng Affiliate nếu có
          const affComm = await approveAffiliateCommission(orderId).catch((e) => {
            console.error('Lỗi duyệt hoa hồng Affiliate từ Telegram:', e);
            return null;
          });

          // Send confirmation message to admin chat
          if (chatId) {
            const affMsg = affComm
              ? `\n🎁 <b>Hoa hồng Affiliate:</b> Đã cộng ${new Intl.NumberFormat('vi-VN').format(affComm.commission_amount)} đ vào ví đối tác!`
              : '';

            await sendTelegramHtml(botToken, chatId, `🚀 <b>THÔNG BÁO TỰ HỌC AI:</b>\n` +
              `Đã duyệt thành công đơn <code>${order.order_code}</code> cho khách hàng <b>${order.customer_name}</b>!\n` +
              `Đơn hàng đã được mở khóa trong mục Kho của tôi.${affMsg}`);
          }

          // Tự động gửi email bàn giao cho khách qua Resend
          if (order.customer_email) {
            sendOrderApprovedEmail({
              customerName: order.customer_name,
              customerEmail: order.customer_email,
              orderCode: order.order_code,
              productName: order.product_name,
              downloadUrl: 'https://www.tuhocai.top/dashboard',
            }).catch((err) => console.error('Lỗi gửi email bàn giao:', err));
          }
        } else {
          // Reject order
          await execute(
            `UPDATE orders 
             SET payment_status = 'REJECTED', approved_at = NOW(), approved_by = 'Telegram Admin' 
             WHERE id = ?`,
            [orderId]
          );

          // Hủy hoa hồng nếu có
          await cancelAffiliateCommission(orderId).catch((e) =>
            console.error('Lỗi hủy hoa hồng Telegram:', e)
          );

          await answerCallback(botToken, callbackId, '❌ Đã từ chối đơn hàng.', true);

          if (chatId && messageId) {
            const rejectedHtml = `<b>❌ ĐƠN HÀNG ĐÃ BỊ TỪ CHỐI!</b>\n\n` +
              `📦 <b>Mã đơn:</b> <code>${order.order_code}</code>\n` +
              `👤 <b>Khách hàng:</b> ${order.customer_name} (${order.customer_email})\n` +
              `💎 <b>Sản phẩm:</b> ${order.product_name}\n` +
              `⚠️ <b>Trạng thái:</b> Biên lai không hợp lệ hoặc chưa nhận được tiền.`;

            await editMessageHtml(botToken, chatId, messageId, rejectedHtml);
          }
        }
      }
    }

    // Direct HTTP 200 OK for Telegram Webhook
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Telegram webhook error:', err);
    return NextResponse.json({ ok: true, error: err.message });
  }
}

async function answerCallback(botToken: string, callbackQueryId: string, text: string, showAlert = false) {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert,
      }),
    });
  } catch (e) {
    console.error('Error answering callback:', e);
  }
}

async function editMessageHtml(botToken: string, chatId: number | string, messageId: number, htmlText: string) {
  try {
    // Thử edit caption nếu là ảnh biên lai
    const res = await fetch(`https://api.telegram.org/bot${botToken}/editMessageCaption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        caption: htmlText,
        parse_mode: 'HTML',
      }),
    });
    const d = await res.json();
    if (!d.ok) {
      // Fallback nếu tin nhắn gốc là text thuần
      await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text: htmlText,
          parse_mode: 'HTML',
        }),
      });
    }
  } catch (e) {
    console.error('Error editing message:', e);
  }
}

async function sendTelegramHtml(botToken: string, chatId: number | string, htmlText: string) {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlText,
        parse_mode: 'HTML',
      }),
    });
  } catch (e) {
    console.error('Error sending tg message:', e);
  }
}
