import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/db';
import { randomUUID } from 'crypto';
import { sendOrderApprovedEmail } from '@/lib/email';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8781006384:AAHDfcnSsIiwDpycoY9G-fd7ug5-Ne2Oq0Y';

export async function POST(req: Request) {
  try {
    const update = await req.json();

    // 1. Check if this is a callback_query (inline button click)
    if (update.callback_query) {
      const cq = update.callback_query;
      const callbackId = cq.id;
      const data = cq.data || '';
      const messageId = cq.message?.message_id;
      const chatId = cq.message?.chat?.id;

      if (data.startsWith('APPROVE:') || data.startsWith('REJECT:')) {
        const [action, orderId] = data.split(':');
        const isApprove = action === 'APPROVE';

        // Fetch Order & Product
        const orders = await query<any>(
          `SELECT o.*, p.download_url, p.name as prod_title 
           FROM orders o 
           LEFT JOIN products p ON o.product_id = p.id 
           WHERE o.id = ? LIMIT 1`,
          [orderId]
        );

        if (orders.length === 0) {
          await answerCallback(callbackId, '❌ Không tìm thấy đơn hàng trong hệ thống!');
          return NextResponse.json({ ok: true });
        }

        const order = orders[0];

        if (isApprove) {
          // Update Order Status
          await execute(
            `UPDATE orders 
             SET payment_status = 'APPROVED', approved_at = NOW(), approved_by = 'Telegram Admin' 
             WHERE id = ?`,
            [orderId]
          );

          // Find user by customer_email or order.user_id
          let userId = order.user_id;
          if (!userId) {
            const users = await query<any>('SELECT id FROM users WHERE email = ? LIMIT 1', [order.customer_email]);
            if (users.length > 0) {
              userId = users[0].id;
              await execute('UPDATE orders SET user_id = ? WHERE id = ?', [userId, orderId]);
            }
          }

          // Unlock in user_library if user exists
          if (userId) {
            await execute(
              'INSERT IGNORE INTO user_library (id, user_id, product_id, order_id) VALUES (?, ?, ?, ?)',
              [randomUUID(), userId, order.product_id, orderId]
            );
          }

          // Answer Callback query with Alert Popup
          await answerCallback(callbackId, '🚀 ĐÃ DUYỆT THÀNH CÔNG! Link tải đã mở khóa.', true);

          const downloadLink = order.download_url || 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing';

          // Edit original message to remove buttons and show approval
          if (chatId && messageId) {
            const approvedText = `✅ *ĐƠN HÀNG ĐÃ ĐƯỢC PHÊ DUYỆT!*

📦 *Mã đơn:* \`${order.order_code}\`
👤 *Khách hàng:* ${order.customer_name} (${order.customer_email})
💎 *Sản phẩm:* ${order.product_name}
💰 *Số tiền:* ${new Intl.NumberFormat('vi-VN').format(order.price)} đ
📂 *Link Drive:* [Bấm vào để mở link](${downloadLink})

✨ *Tài khoản:* ${userId ? 'Đã liên kết và mở khóa trong Dashboard khách hàng' : 'Khách vãng lai (link sẵn sàng gửi qua email/Zalo)'}`;

            await editMessageText(chatId, messageId, approvedText);
          }

          // Send confirmation message to admin chat
          if (chatId) {
            await sendTelegramMessage(chatId, `🚀 *THÔNG BÁO TỰ HỌC AI:*
Đã duyệt thành công đơn *${order.order_code}* cho khách hàng *${order.customer_name}*!
Link tài liệu: ${downloadLink}`);
          }

          // Tự động gửi email bàn giao link tải cho khách qua Resend
          if (order.customer_email) {
            sendOrderApprovedEmail({
              customerName: order.customer_name,
              customerEmail: order.customer_email,
              orderCode: order.order_code,
              productName: order.product_name,
              downloadUrl: downloadLink,
            }).catch((err) => console.error('Lỗi gửi email Resend sau duyệt:', err));
          }
        } else {
          // Reject order
          await execute(
            `UPDATE orders 
             SET payment_status = 'REJECTED', approved_at = NOW(), approved_by = 'Telegram Admin' 
             WHERE id = ?`,
            [orderId]
          );

          await answerCallback(callbackId, '❌ Đã từ chối đơn hàng.', true);

          if (chatId && messageId) {
            const rejectedText = `❌ *ĐƠN HÀNG ĐÃ BỊ TỪ CHỐI!*

📦 *Mã đơn:* \`${order.order_code}\`
👤 *Khách hàng:* ${order.customer_name} (${order.customer_email})
💎 *Sản phẩm:* ${order.product_name}
⚠️ *Trạng thái:* Biên lai không hợp lệ hoặc chưa nhận được tiền.`;

            await editMessageText(chatId, messageId, rejectedText);
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

async function answerCallback(callbackQueryId: string, text: string, showAlert = false) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
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

async function editMessageText(chatId: number | string, messageId: number, text: string) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageCaption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        caption: text,
        parse_mode: 'Markdown',
      }),
    }).catch(async () => {
      // Fallback if message was text rather than photo
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text,
          parse_mode: 'Markdown',
        }),
      });
    });
  } catch (e) {
    console.error('Error editing message:', e);
  }
}

async function sendTelegramMessage(chatId: number | string, text: string) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });
  } catch (e) {
    console.error('Error sending tg message:', e);
  }
}
