# Bộ Template Bài Đăng Chuẩn Hóa Cho Blogger "Nguyen Dang AI"

Bộ template này được thiết kế chuyên biệt để đảm bảo các bài đăng trên **Nguyen Dang AI** (`nguyendangai.blogspot.com`) hiển thị chuẩn 100%, đồng bộ phong cách thẩm mỹ cao cấp của **workflowfree.com**, tối ưu cho cả máy tính và điện thoại di động.

---

## 📂 Danh Sách 4 Mẫu Template Sẵn Dùng

| Mẫu | File Template | Mục đích sử dụng | Nhãn (Labels) tương ứng |
| :---: | :--- | :--- | :--- |
| **1** | [1-template-ban-hang.html](file:///d:/ai-website-cloner-template/docs/blogger/templates/1-template-ban-hang.html) | Bán kịch bản n8n, FLOW App, khóa học AI, có **mã VietQR tự động & nút Chat Zalo** | `Cửa hàng`, `Sản phẩm n8n` |
| **2** | [2-template-workflow-free.html](file:///d:/ai-website-cloner-template/docs/blogger/templates/2-template-workflow-free.html) | Chia sẻ Workflow n8n miễn phí, có nút **Tải JSON + nút Copy Code JSON 1-click** | `Template n8n`, `Workflow n8n` |
| **3** | [3-template-huong-dan.html](file:///d:/ai-website-cloner-template/docs/blogger/templates/3-template-huong-dan.html) | Bài viết hướng dẫn từng bước (Step-by-step), thủ thuật, lệnh terminal, callout box | `Hướng dẫn`, `Học n8n` |
| **4** | [4-template-image-prompt.html](file:///d:/ai-website-cloner-template/docs/blogger/templates/4-template-image-prompt.html) | Thư viện Prompt AI (Midjourney, Flux, Gemini) có **nút Copy Prompt 1-click** | `Image Prompt`, `Công cụ hình ảnh Ai` |

---

## 🚀 Cách 1: Cài "Mẫu Bài Đăng Mặc Định" Trên Blogger (Khuyên Dùng)

Bạn có thể cài đặt để mỗi lần bấm nút **"+ BÀI ĐĂNG MỚI"**, Blogger sẽ **tự động điền sẵn khung mẫu** vào ô soạn thảo:

1. Vào trang quản trị Blogger > chọn **Cài đặt (Settings)**.
2. Cuộn xuống mục **Bài đăng (Posts)** > tìm dòng **Mẫu bài đăng (Post template)**.
3. Bấm vào và dán toàn bộ mã HTML của mẫu bạn hay dùng nhất (ví dụ: mẫu chia sẻ workflow [2-template-workflow-free.html](file:///d:/ai-website-cloner-template/docs/blogger/templates/2-template-workflow-free.html) hoặc mẫu bán hàng).
4. Bấm **Lưu (Save)**.
5. Từ bây giờ, mỗi khi bạn bấm nút **+ BÀI ĐĂNG MỚI**, khung mẫu sẽ tự động có sẵn, bạn chỉ việc gõ nội dung vào!

---

## ✍️ Cách 2: Sử Dụng Khi Đăng Bài Bất Kỳ Lúc Nào

1. Bấm **+ BÀI ĐĂNG MỚI** trong Blogger.
2. Ở góc trên bên trái thanh công cụ soạn thảo, bấm vào biểu tượng chiếc bút / cây cọ > chọn **Chế độ xem HTML (<>)**.
3. Mở file template bạn muốn dùng (từ thư mục `docs/blogger/templates/`), copy toàn bộ nội dung và dán vào.
4. Chuyển lại sang **Chế độ xem Soạn thảo (Bút chì)**:
   - Bạn sẽ thấy toàn bộ khung giá, nút bấm, bảng thông số hiển thị trực quan ngay trước mắt!
   - Chỉ cần nhấp chuột vào chữ để sửa lại Tiêu đề, Giá bán, Nội dung theo bài viết của bạn.
5. Đặt tiêu đề bài viết, chọn Nhãn (Labels) ở cột bên phải và bấm **Xuất bản (Publish)**!

---

## 💳 Tùy Biến Thông Tin Nhận Tiền VietQR (Cho Mẫu Bán Hàng)

Trong mẫu [1-template-ban-hang.html](file:///d:/ai-website-cloner-template/docs/blogger/templates/1-template-ban-hang.html), bạn chỉ cần thay link ảnh mã QR:

```html
<img src="https://img.vietqr.io/image/MB-0987654321-compact2.png?amount=199000&addInfo=WF11538&accountName=NGUYEN%20DANG" />
```
- Đổi `MB` thành mã ngân hàng của bạn: `VCB`, `TCB`, `ACB`, `TPB`...
- Đổi `0987654321` thành số tài khoản nhận tiền của bạn.
- Đổi `199000` thành số tiền tương ứng.
- Đổi `WF11538` thành mã đơn hàng bạn muốn.
- Đổi `NGUYEN%20DANG` thành tên chủ tài khoản (viết hoa không dấu, dấu cách thay bằng `%20`).
- Đổi `https://zalo.me/0987654321` thành số Zalo của bạn.
