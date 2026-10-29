export interface TelegramChannel {
  id: string;
  name: string;
  chatId: string;
  type: 'ALL' | 'ORDERS_ONLY' | 'MANUAL_REVIEW_ONLY' | 'SUCCESS_ONLY';
  enabled: boolean;
}

export interface TelegramTemplates {
  order_created?: string;
  order_approved?: string;
  manual_review?: string;
  unmatched_payment?: string;
}

export const DEFAULT_TELEGRAM_TEMPLATES: TelegramTemplates = {
  order_created: `🛒 *CÓ ĐƠN HÀNG MỚI KHỞI TẠO!*

📦 *Mã đơn:* \`{order_code}\`
👤 *Khách hàng:* {customer_name}
📧 *Email:* \`{customer_email}\`
📞 *SĐT:* {customer_phone}
💎 *Sản phẩm:* {product_name}
💰 *Số tiền:* {amount}
🏦 *Ngân hàng:* {bank_name} - STK: \`{account_no}\`
📝 *Nội dung CK:* \`{transfer_content}\`

👉 *Khách hàng đang xem mã VietQR. Bạn có thể bấm DUYỆT ngay nếu tài khoản {bank_name} đã nhận được tiền:*`,

  order_approved: `🤖 *SEPAY ĐÃ TỰ ĐỘNG KHỚP TIỀN & DUYỆT ĐƠN THÀNH CÔNG!*

📦 *Mã đơn:* \`{order_code}\`
👤 *Khách hàng:* {customer_name} (\`{customer_email}\`)
📞 *SĐT/Zalo:* {customer_phone}
💎 *Sản phẩm:* {product_name}
💰 *Tiền vào:* +{amount}
📝 *Nội dung CK:* "{transfer_content}"

✨ *Trạng thái:* Hệ thống đã tự động mở khóa tài nguyên trong Kho của khách hàng 100%!`,

  manual_review: `⚡ *KHÁCH YÊU CẦU DUYỆT TAY QUA TELEGRAM!*
*(Khách bấm sau 60s chưa thấy màn hình tự chuyển)*

📦 *Mã đơn:* \`{order_code}\`
👤 *Khách hàng:* {customer_name}
📧 *Email:* \`{customer_email}\`
📞 *SĐT/Zalo:* \`{customer_phone}\`
💎 *Khóa học:* {product_name}
💰 *Số tiền:* {amount}
🏦 *Ngân hàng thụ hưởng:* {bank_name} - STK: \`{account_no}\`

👉 *Anh Đăng kiểm tra tiền vào {bank_name} và bấm DUYỆT ngay dưới đây để hệ thống tự động mở khóa và chuyển trang cho khách:*`,

  unmatched_payment: `⚠️ *THÔNG BÁO TIỀN VÀO (CHƯA KHỚP ĐƠN):*

💰 *Số tiền:* +{amount}
🏦 *Ngân hàng:* {bank_name} ({account_no})
📝 *Nội dung CK:* "{transfer_content}"
⏰ *Thời gian:* {created_at}

👉 *Ghi chú:* Hệ thống chưa tìm thấy đơn PENDING trùng khớp. Anh Đăng vui lòng kiểm tra Quản lý đơn hàng nhé!`,
};
