# Hướng dẫn cài đặt Blog "Nguyễn Đăng AI" lên Blogger

Trọn bộ file giao diện và nội dung cho blog **Nguyễn Đăng AI — Nền tảng AI & Workflow**, đã được xây dựng sẵn trong thư mục này.

## 📦 Danh sách file

| File | Mô tả |
| :--- | :--- |
| [`workflowfree-blogger-theme.xml`](./workflowfree-blogger-theme.xml) | **Theme chính** — Header (logo text, menu 5 mục), Hero banner, Card Grid bài viết, Shop Engine VietQR, Sidebar, Footer, Responsive mobile |
| [`workflowfree-blogger-posts.xml`](./workflowfree-blogger-posts.xml) | **122 bài viết** — Template n8n, Hướng dẫn, Workflow, Image Prompt (kèm ảnh và HTML đầy đủ) |
| [`workflowfree-blogger-products.xml`](./workflowfree-blogger-products.xml) | **Sản phẩm bán hàng** — Workflow & Prompt cao cấp có giá, tích hợp VietQR |
| [`workflowfree-ALL-POSTS-AND-PRODUCTS.xml`](./workflowfree-ALL-POSTS-AND-PRODUCTS.xml) | Tổng hợp tất cả bài viết + sản phẩm (import 1 lần) |
| [`VIETQR-GLOBAL-SETUP.md`](./VIETQR-GLOBAL-SETUP.md) | Hướng dẫn cài đặt số tài khoản VietQR dùng chung |
| [`E-COMMERCE-GUIDE.md`](./E-COMMERCE-GUIDE.md) | Hướng dẫn danh mục Sản phẩm (Shop Engine) |
| [`templates/`](./templates/) | 4 mẫu HTML cho từng loại bài viết mới |
| [`automation/`](./automation/) | Google Apps Script + n8n workflow tự động đăng bài |

---

## 🆕 Cấu trúc Danh Mục Mới (Sau khi tái định vị)

Blog đã chuyển từ "n8n-focused" sang nền tảng AI tổng hợp:

| Nhãn (Label) Blogger | Mô tả | Menu |
| :--- | :--- | :--- |
| `Prompt` | Prompt ChatGPT, Claude, Gemini thực chiến | ✅ |
| `Skill` | Kỹ năng sử dụng AI, hướng dẫn tool | ✅ |
| `Workflow` | Automation: n8n, Google Apps Script, Make.com | ✅ |
| `Image Prompt` | Prompt tạo ảnh AI (Midjourney, FLUX, SDXL...) | ✅ |
| `Sản phẩm` | Workflow & Prompt cao cấp có giá bán + VietQR | ✅ |
| `Template n8n` | (giữ lại) Dưới nhãn Workflow hoặc dùng song song | Phụ |

---

## 🚀 Bước 1: Import Nội Dung Bài Viết

1. Vào trang quản trị Blogger > chọn **Cài đặt (Settings)**.
2. Cuộn xuống **Quản lý blog > Nhập nội dung (Import content)**.
3. Tải lên file: `workflowfree-ALL-POSTS-AND-PRODUCTS.xml` (bao gồm tất cả).
4. Đợi khoảng 30 giây → Blogger tự động nạp toàn bộ bài và nhãn.

---

## 🎨 Bước 2: Cài Đặt Theme

1. Vào **Chủ đề (Theme)** > bấm mũi tên cạnh **Tùy chỉnh** > chọn **Khôi phục (Restore)**.
2. Tải lên file: `workflowfree-blogger-theme.xml`.
3. Đợi thông báo *Đã khôi phục chủ đề thành công*.

---

## ⚙️ Bước 3: Cài Đặt Tài Khoản VietQR

Xem hướng dẫn chi tiết tại [`VIETQR-GLOBAL-SETUP.md`](./VIETQR-GLOBAL-SETUP.md).

Cách nhanh nhất — thêm tiện ích HTML/JavaScript trong **Bố cục (Layout)**:

```html
<script>
  window.VIETQR_CONFIG = {
    bankId: 'MB',              // Mã ngân hàng của bạn
    accountNo: '0987654321',   // Số tài khoản
    accountName: 'NGUYEN DANG',// Tên chủ tài khoản (viết hoa không dấu)
    zaloPhone: '0987654321'    // Số Zalo tư vấn
  };
</script>
```

---

## 📱 Bước 4: Tắt Giao Diện Mobile Cũ

1. Vào **Chủ đề > Cài đặt thiết bị di động**.
2. Chọn **Máy tính để bàn (Desktop)** — theme đã có responsive riêng.
3. Bấm **Lưu**.

---

## 🎉 Hoàn Tất!

Bấm **Xem blog** để xem kết quả. Blog sẽ có:
- Header với logo **Nguyễn Đăng AI**, menu 5 mục
- Hero banner: *"Prompt · Skill · Workflow · Sản phẩm"*
- Grid bài viết, sidebar, footer đầy đủ
- Trang sản phẩm với mã QR thanh toán tự động

> **Lưu ý:** Cần cập nhật nhãn (Label) của các bài viết cũ từ `Template n8n`, `Hướng dẫn`... sang `Workflow`, `Skill`, `Prompt` theo cấu trúc mới để hiển thị đúng menu.
