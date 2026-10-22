import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const SENDER_EMAIL = process.env.EMAIL_FROM || 'Tự Học AI <hotro@tuhocai.top>';

interface SendOrderApprovalParams {
  customerName: string;
  customerEmail: string;
  orderCode: string;
  productName: string;
  downloadUrl: string;
}

interface SendFreeResourceParams {
  customerName: string;
  customerEmail: string;
  orderCode: string;
  productName: string;
  downloadUrl: string;
}

/**
 * Gửi email bàn giao tài liệu / khóa học khi đơn hàng được duyệt
 */
export async function sendOrderApprovedEmail({
  customerName,
  customerEmail,
  orderCode,
  productName,
  downloadUrl,
}: SendOrderApprovalParams) {
  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY chưa được cấu hình. Bỏ qua gửi email bàn giao.');
    return { success: false, reason: 'MISSING_API_KEY' };
  }

  try {
    const zaloSupport = process.env.NEXT_PUBLIC_ZALO_SUPPORT || '0938494303';
    const zaloGroup = process.env.NEXT_PUBLIC_ZALO_GROUP || 'https://zalo.me/g/tuhocai';

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kích hoạt đơn hàng thành công - Tự Học AI</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 24px; }
        .container { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 8px 0 0; color: #e0e7ff; font-size: 14px; }
        .content { padding: 32px 24px; }
        .greeting { font-size: 16px; color: #e5e7eb; margin-bottom: 20px; line-height: 1.6; }
        .card { background: #1f2937; border-radius: 12px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #3b82f6; }
        .card-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
        .card-row:last-child { margin-bottom: 0; }
        .label { color: #9ca3af; }
        .value { color: #f9fafb; font-weight: 600; text-align: right; }
        .btn-box { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #2563eb, #3b82f6); color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 16px; padding: 14px 32px; border-radius: 9999px; box-shadow: 0 4px 14px rgba(37,99,235,0.4); }
        .guide-box { background: rgba(59, 130, 246, 0.08); border: 1px dashed rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 14px; line-height: 1.6; color: #d1d5db; }
        .footer { border-top: 1px solid #1f2937; padding: 20px 24px; text-align: center; font-size: 12px; color: #6b7280; line-height: 1.5; }
        .footer a { color: #60a5fa; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 KÍCH HOẠT ĐƠN HÀNG THÀNH CÔNG</h1>
          <p>Cảm ơn bạn đã đồng hành cùng Tự Học AI</p>
        </div>
        <div class="content">
          <p class="greeting">
            Xin chào <strong>${customerName}</strong>,<br>
            Thanh toán cho đơn hàng của bạn đã được xác thực thành công. Dưới đây là thông tin chi tiết và link tải tài nguyên của bạn:
          </p>

          <div class="card">
            <div class="card-row">
              <span class="label">Mã đơn hàng:</span>
              <span class="value">${orderCode}</span>
            </div>
            <div class="card-row">
              <span class="label">Sản phẩm / Khóa học:</span>
              <span class="value">${productName}</span>
            </div>
            <div class="card-row">
              <span class="label">Trạng thái:</span>
              <span class="value" style="color: #34d399;">✓ Đã thanh toán &amp; Kích hoạt</span>
            </div>
          </div>

          <div class="btn-box">
            <a href="${downloadUrl}" class="btn" target="_blank">📥 MỞ LINK TÀI LIỆU / WORKFLOW</a>
          </div>

          <div class="guide-box">
            <strong style="color: #60a5fa;">💡 Hướng dẫn nhận hỗ trợ &amp; thảo luận:</strong><br>
            • Tham gia cộng đồng hỗ trợ Zalo: <a href="${zaloGroup}" style="color: #60a5fa; font-weight: 600;" target="_blank">${zaloGroup}</a><br>
            • Hotline / Zalo Admin hỗ trợ trực tiếp: <strong>${zaloSupport}</strong><br>
            • Nếu bạn đã tạo tài khoản, toàn bộ khóa học/workflow đã được tự động mở khóa trong mục <strong>Thư viện cá nhân</strong> tại <a href="https://www.tuhocai.top/dashboard" style="color: #60a5fa;">tuhocai.top/dashboard</a>.
          </div>
        </div>

        <div class="footer">
          <p>© 2026 Tự Học AI (tuhocai.top) - Nền tảng học AI Ứng dụng &amp; Tự động hóa n8n thực chiến.</p>
          <p>Mọi thắc mắc vui lòng liên hệ Zalo: ${zaloSupport} hoặc email hotro@tuhocai.top</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [customerEmail],
      subject: `[Tự Học AI] Kích hoạt thành công đơn hàng #${orderCode} - ${productName}`,
      html: htmlContent,
    });

    console.log('[Resend] Sent approval email success:', result);
    return { success: true, result };
  } catch (error: any) {
    console.error('[Resend] Error sending approval email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Gửi email khi khách nhận tài nguyên miễn phí
 */
export async function sendFreeResourceEmail({
  customerName,
  customerEmail,
  orderCode,
  productName,
  downloadUrl,
}: SendFreeResourceParams) {
  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY chưa được cấu hình. Bỏ qua gửi email miễn phí.');
    return { success: false, reason: 'MISSING_API_KEY' };
  }

  try {
    const zaloSupport = process.env.NEXT_PUBLIC_ZALO_SUPPORT || '0938494303';
    const zaloGroup = process.env.NEXT_PUBLIC_ZALO_GROUP || 'https://zalo.me/g/tuhocai';

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Link tải tài nguyên miễn phí - Tự Học AI</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 24px; }
        .container { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #059669, #10b981); padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; }
        .content { padding: 32px 24px; }
        .greeting { font-size: 16px; color: #e5e7eb; line-height: 1.6; margin-bottom: 20px; }
        .btn-box { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 16px; padding: 14px 32px; border-radius: 9999px; }
        .guide-box { background: rgba(16, 185, 129, 0.08); border: 1px dashed rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 14px; line-height: 1.6; color: #d1d5db; }
        .footer { border-top: 1px solid #1f2937; padding: 20px 24px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎁 TÀI NGUYÊN MIỄN PHÍ CỦA BẠN ĐÃ SẴN SÀNG</h1>
        </div>
        <div class="content">
          <p class="greeting">
            Xin chào <strong>${customerName}</strong>,<br>
            Cảm ơn bạn đã quan tâm đến tài liệu <strong>${productName}</strong> từ Tự Học AI. Bạn có thể bấm vào nút bên dưới để tải và sử dụng ngay:
          </p>

          <div class="btn-box">
            <a href="${downloadUrl}" class="btn" target="_blank">📥 MỞ LINK TÀI LIỆU MIỄN PHÍ</a>
          </div>

          <div class="guide-box">
            <strong style="color: #34d399;">💡 Tham gia cộng đồng:</strong><br>
            • Nhóm trao đổi Zalo: <a href="${zaloGroup}" style="color: #34d399;" target="_blank">${zaloGroup}</a><br>
            • Hotline / Zalo: <strong>${zaloSupport}</strong>
          </div>
        </div>

        <div class="footer">
          <p>© 2026 Tự Học AI (tuhocai.top)</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [customerEmail],
      subject: `[Tự Học AI] Link tải miễn phí: ${productName}`,
      html: htmlContent,
    });

    console.log('[Resend] Sent free resource email success:', result);
    return { success: true, result };
  } catch (error: any) {
    console.error('[Resend] Error sending free resource email:', error);
    return { success: false, error: error.message };
  }
}
