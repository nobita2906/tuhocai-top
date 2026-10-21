# Báo Cáo Triển Khai Hệ Thống Tự Học AI (tuhocai.top)

## 1. Thông Tin Tổng Quan
- **Domain chính thức:** [https://www.tuhocai.top](https://www.tuhocai.top) & [https://tuhocai.top](https://tuhocai.top)
- **Vercel Project:** `tuhocai-top` (Hosting miễn phí $0/tháng)
- **Mã nguồn GitHub:** [https://github.com/nobita2906/tuhocai-top](https://github.com/nobita2906/tuhocai-top) (nhánh `master`)
- **Cơ sở dữ liệu:** MySQL 8.0 tại `103.127.195.56:3306/tuhocai_top` (User: `postgress_user`)
- **Telegram Bot duyệt đơn:** `@blogger_tuhocai_bot` (Token: `8781006384:AAHDfcnSsIiwDpycoY9G-fd7ug5-Ne2Oq0Y`, Chat ID: `6580812076`)
- **Telegram Webhook URL:** `https://www.tuhocai.top/api/telegram-webhook` (Trực tiếp HTTP 200 OK)

---

## 2. Kiến Trúc & Luồng Hoạt Động

### A. Luồng Chia Sẻ Miễn Phí (Lead Magnet)
1. Khách truy cập mục **Tài liệu Miễn Phí** trên trang chủ hoặc cuối bài viết.
2. Khách điền Họ tên, Email, SĐT.
3. API `/api/leads` lưu thông tin vào bảng `leads` của MySQL.
4. Trả về link Google Drive tải tài liệu trực tiếp + Nút tham gia nhóm Zalo cộng đồng `https://zalo.me/g/tuhocai`.
5. Nếu khách đã hoặc sẽ tạo tài liệu trên web, hệ thống tự động gắn tài liệu này vào mục **Kho tài liệu của tôi** trong Dashboard.

### B. Luồng Bán Sản Phẩm Số (Workflow / Skill / Prompt)
1. Khách bấm mua tại `/thanh-toan?pid=WF-THAI-099` (hoặc bất kỳ sản phẩm nào).
2. Hệ thống tạo đơn hàng trong bảng `orders` (trạng thái `PENDING`), tạo mã đơn duy nhất (ví dụ: `THAI123456`).
3. Sinh mã VietQR tự động qua VPBank:
   - Số tài khoản: `0934434101`
   - Tên tài khoản: `NGUYEN VAN DANG`
   - Số tiền: Đúng theo giá sản phẩm
   - Nội dung chuyển khoản: Mã đơn hàng
4. Khách quét mã chuyển tiền $\rightarrow$ đính kèm ảnh biên lai $\rightarrow$ Bấm gửi biên lai.
5. API `/api/orders/upload-receipt` gửi tin nhắn + ảnh biên lai đến bot Telegram của Admin kèm 2 nút bấm Inline:
   - `[ ✅ DUYỆT (Gửi Link) ]`
   - `[ ❌ TỪ CHỐI ]`

### C. Luồng Phê Duyệt Tự Động Qua Telegram
1. Admin kiểm tra tài khoản ngân hàng và bấm nút `✅ DUYỆT` ngay trên Telegram.
2. Telegram gửi callback POST đến `https://www.tuhocai.top/api/telegram-webhook`.
3. Endpoint phản hồi `HTTP 200 OK` ngay lập tức + hiển thị Popup Alert: *"🚀 ĐÃ DUYỆT THÀNH CÔNG! Link tải đã mở khóa."*
4. Cập nhật bảng `orders.payment_status = 'APPROVED'`.
5. Tự động mở khóa sản phẩm vào bảng `user_library` cho khách hàng.
6. Trang thanh toán của khách hàng tự động nhận diện và hiển thị link Google Drive mà không cần tải lại trang.

### D. Hệ Thống Tài Khoản Thành Viên & Dashboard
1. Người dùng đăng ký tại `/register` hoặc đăng nhập tại `/login`.
2. Phiên làm việc được quản lý bằng JWT cookie bảo mật (HttpOnly, 7 ngày).
3. Trang Dashboard tại `/dashboard` cho phép người dùng quản lý vĩnh viễn toàn bộ file đã mua/tải và xem lại lịch sử đơn hàng.

---

## 3. Cấu Hình Biến Môi Trường (Environment Variables)
```env
DATABASE_URL=mysql://postgress_user:Nvdang%401@103.127.195.56:3306/tuhocai_top
JWT_SECRET=tuhocai-super-secret-jwt-token-2026-secure-key
TELEGRAM_BOT_TOKEN=8781006384:AAHDfcnSsIiwDpycoY9G-fd7ug5-Ne2Oq0Y
TELEGRAM_CHAT_ID=6580812076
NEXT_PUBLIC_APP_URL=https://www.tuhocai.top
NEXT_PUBLIC_ZALO_SUPPORT=0938494303
NEXT_PUBLIC_ZALO_GROUP=https://zalo.me/g/tuhocai
```
