# Hướng Dẫn Tích Hợp SePay Tự Động Kiểm Tra Giao Dịch VIB Cho Tự Học AI (tuhocai.top)

## 1. Thông Tin Cấu Hình Webhook
- **Webhook URL:** `https://www.tuhocai.top/api/webhook/sepay`
- **Phương thức:** `POST`
- **Kiểu dữ liệu:** `application/json`
- **Ngân hàng thụ hưởng:** VIB (Ngân hàng Quốc Tế)
- **Số tài khoản:** `0934434101`
- **Chủ tài khoản:** `NGUYEN VAN DANG`

---

## 2. 3 Bước Kích Hoạt Nhanh Trong 3 Phút

### Bước 1: Tạo tài khoản SePay
1. Truy cập [my.sepay.vn](https://my.sepay.vn) và đăng ký tài khoản miễn phí.
2. Tại thanh menu bên trái, chọn **Ngân hàng** -> Bấm **Thêm ngân hàng**.
3. Chọn ngân hàng **VIB** -> Nhập số tài khoản `0934434101`.
4. Làm theo hướng dẫn của SePay để liên kết thông báo biến động số dư (qua App SePay hoặc kết nối MyVIB).

### Bước 2: Cài Đặt Webhook Bắn Về Website
1. Trong trang quản trị SePay, vào mục **Tích hợp Webhook** (hoặc **Cấu hình Webhook**).
2. Bấm **Tạo Webhook mới**:
   - **Tên gợi nhớ:** `TuHocAI Production`
   - **URL Webhook:** `https://www.tuhocai.top/api/webhook/sepay`
   - **Sự kiện:** Chọn `Giao dịch tiền vào (Inbound / Money In)`
   - **Tài khoản áp dụng:** Chọn tài khoản VIB `0934434101`
3. (Tùy chọn bảo mật) Nếu SePay cấp **API Key**, copy mã đó và lưu vào biến môi trường `.env` trên Vercel:
   ```env
   SEPAY_API_KEY=ma_api_key_cua_sepay_o_day
   ```
4. Bấm **Lưu Webhook**.

### Bước 3: Kiểm Tra Giao Dịch (Test)
1. Thử chuyển 1.000đ hoặc 69.000đ vào tài khoản VIB `0934434101`.
2. Trong vòng 1 - 3 giây:
   - SePay gửi thông báo về webhook `https://www.tuhocai.top/api/webhook/sepay`.
   - Hệ thống tự động khớp đơn và gửi email cho khách.
   - Bot Telegram tự động gửi thông báo chúc mừng về máy anh Đăng!

---

## 3. Cơ Chế Khớp Đơn Thông Minh (Smart Matching)
Hệ thống tự động nhận diện theo các cấp độ:
1. **Khớp mã đơn:** Khách chuyển khoản có chứa mã đơn `THAI123456`.
2. **Khớp từ khóa & số tiền trên 3 Landing Page:**
   - Số tiền **69.000đ** hoặc nội dung chứa `tra sua` / `drama` -> Khớp đơn Mini Drama gia đình nhỏ.
   - Số tiền **99.000đ** hoặc nội dung chứa `landing page` / `copy` -> Khớp đơn Skill sao chép landing page.
   - Số tiền **297.000đ** hoặc nội dung chứa `video ai` / `1 anh` -> Khớp đơn Video AI VIP từ 1 ảnh.
3. **Khớp theo SĐT khách:** Nội dung có chứa số điện thoại trùng với SĐT đặt đơn hàng.
