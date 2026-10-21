# Cẩm Nang Tự Động Hóa Blog 100% Bằng AI (Auto-Pilot) Cho "Nguyen Dang AI"

Giải pháp này biến blog **Nguyen Dang AI** (`nguyendangai.blogspot.com`) thành một cỗ máy tự xuất bản hoàn toàn tự động:
- **Tự động 100%:** Hàng ngày (ví dụ 8:00 AM) n8n tự chạy, gọi AI viết bài, tự sinh ảnh minh họa nghệ thuật, tự ráp khung giao diện và tự đăng lên Blogger.
- **Không tốn chi phí:** Kết hợp **Gemini 2.0 Flash (Free API)** và **Pollinations FLUX AI (Free Image API)** -> Chi phí vận hành hàng tháng là **0 đồng**!
- **Theo dõi từ điện thoại:** Mỗi khi xuất bản xong, Telegram Bot sẽ gửi ngay thông báo kèm đường link bài viết trực tiếp cho bạn.

---

## 🏗️ Sơ Đồ Kiến Trúc Quy Trình

```text
[⏰ Hẹn Giờ 8:00 AM] hoặc [📱 Lệnh Telegram /auto_post]
                 │
                 ▼
[🧠 Google Gemini 2.0 Flash] ──> Tự động viết nội dung chuẩn SEO & trích xuất JSON
                 │
                 ▼
[🎨 Pollinations FLUX Engine] ──> Tự sinh ảnh minh họa 4K đúng theo bối cảnh bài viết
                 │
                 ▼
[⚙️ Template Assembler (Code)] ──> Ráp đúng cấu trúc HTML (Nút Copy, Badge, Bảng thông số)
                 │
                 ▼
[🚀 Blogger REST API v3] ──> Xuất bản bài viết lên blog nguyendangai.blogspot.com
                 │
                 ▼
[📱 Telegram Bot Notification] ──> Báo cáo bài viết mới lên điện thoại kèm link
```

---

## 📂 Tệp Quy Trình n8n Sẵn Dùng

📁 **[n8n-auto-ai-blogger-workflow.json](file:///d:/ai-website-cloner-template/docs/blogger/automation/n8n-auto-ai-blogger-workflow.json)**

---

## 🚀 Hướng Dẫn Kích Hoạt 3 Bước Trong n8n

### BƯỚC 1: Lấy API Key Google Gemini (Miễn Phí 100%)
1. Truy cập [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Đăng nhập tài khoản Google và bấm **Create API Key**.
3. Copy khóa API (dạng `AIzaSy...`).

### BƯỚC 2: Import Quy Trình Vào n8n
1. Mở n8n của bạn > bấm `Workflows > Import from File`.
2. Chọn file [n8n-auto-ai-blogger-workflow.json](file:///d:/ai-website-cloner-template/docs/blogger/automation/n8n-auto-ai-blogger-workflow.json).
3. Thiết lập thông tin kết nối trên 3 Node:
   - **Node Google Gemini:** Tạo credential mới và dán khóa API đã lấy ở Bước 1.
   - **Node Blogger:** Kết nối tài khoản Google có quyền quản trị blog `2562876275428955705`.
   - **Node Telegram:** Điền Bot Token và Chat ID của bạn.

### BƯỚC 3: Kích Hoạt Quy Trình
- Bấm nút **Save** và gạt công tắc **Active** (màu xanh lá) ở góc trên bên phải n8n.
- **XONG!** Từ bây giờ, mỗi ngày hệ thống sẽ tự động đăng 1 bài viết chất lượng cao lên blog của bạn.

---

## 📱 Cách Kích Hoạt Đăng Bài Thủ Công Tức Thì Từ Điện Thoại

Ngoài lịch hẹn giờ cố định 8h sáng, bất kỳ lúc nào bạn muốn blog có thêm bài viết ngay lập tức:
1. Mở ứng dụng Telegram trên điện thoại.
2. Nhắn tin cho Bot của bạn:
   ```text
   /auto_post
   ```
3. Sau khoảng 15-20 giây, Bot sẽ trả lời:
   ```text
   🤖 HỆ THỐNG AUTO-AI VỪA ĐĂNG BÀI MỚI!
   📌 Tiêu đề: Prompt Chân Dung Điện Ảnh Ánh Sáng Hoàng Hôn 8K
   🏷 Chuyên mục: Image Prompt, Công cụ hình ảnh Ai
   🔗 Link bài viết: https://nguyendangai.blogspot.com/...
   [🌐 Mở Xem Bài Viết Trực Tuyến]
   ```

---

## 🎯 Tùy Biến Chủ Đề Theo Ý Thích Của Bạn

Trong node **🧠 AI Sáng Tạo Nội Dung Chuẩn SEO**, bạn có thể dễ dàng điều chỉnh câu nhắc (Prompt) để AI tập trung viết theo các định hướng mà bạn mong muốn:
- **Nếu muốn nhiều bài về n8n hơn:** Thêm vào prompt: *"Ưu tiên viết các bài hướng dẫn kịch bản n8n tự động hóa thực chiến cho doanh nghiệp hoặc người làm affiliate."*
- **Nếu muốn nhiều bài về Prompt ảnh:** Thêm vào prompt: *"Ưu tiên tạo các prompt phong cách Cyberpunk, Anime, hoặc Chân dung Studio cao cấp."*
