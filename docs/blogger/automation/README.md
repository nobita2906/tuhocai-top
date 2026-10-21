# Hệ Thống Đăng Bài Tự Động Kết Hợp: Google Sheets + n8n + Telegram Bot

Hệ thống kết hợp giữa **Google Sheets (Quản lý nội dung tập trung)**, **n8n (Động cơ tự động hóa)** và **Telegram Bot (Điều khiển từ điện thoại)** giúp bạn đăng bài lên **Nguyen Dang AI** (`nguyendangai.blogspot.com`) cực nhanh mà không cần chạm vào giao diện Blogger!

---

## 🏗️ Kiến Trúc Hoạt Động

```text
[Bạn nhập bài trên Google Sheets] ──┐
                                     ├──> [n8n Workflow] ──> [Blogger API] ──> [Đăng bài lên Web]
[Bạn gửi lệnh qua Telegram Bot] ────┘          │
                                                └──> [Cập nhật lại link vào Sheets & Báo cáo Telegram]
```

1. **Google Sheets**: Nơi bạn lưu trữ hàng chục, hàng trăm bài viết dạng bảng (chọn mẫu Template, gõ Tiêu đề, Giá, Ảnh, Mô tả).
2. **n8n Workflow**: Tự động đọc Sheets > Ráp đúng mẫu HTML chuẩn (VietQR, Nút Zalo, Code box) > Gọi Blogger API đăng bài > Báo cáo về Telegram.
3. **Telegram Bot**: Cho phép bạn chỉ cần gửi tin nhắn `/publish` từ điện thoại là n8n tự động đăng toàn bộ bài viết sẵn sàng!

---

## 📂 Các Tệp Trong Gói Tự Động Hóa

1. [google-sheets-schema.csv](file:///d:/ai-website-cloner-template/docs/blogger/automation/google-sheets-schema.csv): File mẫu cấu trúc các cột trong Google Sheets.
2. [n8n-blogger-sheets-telegram-workflow.json](file:///d:/ai-website-cloner-template/docs/blogger/automation/n8n-blogger-sheets-telegram-workflow.json): Kịch bản n8n Workflow hoàn chỉnh sẵn sàng Import.
3. [google-apps-script.js](file:///d:/ai-website-cloner-template/docs/blogger/automation/google-apps-script.js): Mã Google Apps Script chạy trực tiếp trong Sheets (dự phòng khi không bật n8n).

---

## 🚀 Hướng Dẫn Cài Đặt 3 Bước:

### BƯỚC 1: Tạo Bảng Tính Quản Lý Trên Google Sheets

1. Truy cập [sheets.google.com](https://sheets.google.com/) và tạo một bảng tính mới (đặt tên: `Quản Lý Bài Đăng - Nguyen Dang AI`).
2. Nhập các tiêu đề cột từ dòng 1 (hoặc bấm `Tệp > Nhập` và tải file [google-sheets-schema.csv](file:///d:/ai-website-cloner-template/docs/blogger/automation/google-sheets-schema.csv)):

| Cột | Tên Cột | Ý nghĩa |
| :---: | :--- | :--- |
| **A** | `ID` | Số thứ tự bài (1, 2, 3...) |
| **B** | `Template` | Loại mẫu: `Bán hàng`, `Workflow Free`, `Hướng dẫn`, `Prompt AI` |
| **C** | `Tieu_De` | Tiêu đề bài viết hiển thị trên blog |
| **D** | `Nhan_Labels` | Nhãn phân loại (vd: `Cửa hàng, Sản phẩm n8n` hoặc `Template n8n`) |
| **E** | `Anh_Dai_Dien` | URL ảnh minh họa (link web hoặc Google Drive) |
| **F** | `Gia_Sale` | Giá bán khuyến mãi (chỉ nhập số, vd: `199000`) |
| **G** | `Gia_Goc` | Giá gốc gạch ngang (chỉ nhập số, vd: `350000`) |
| **H** | `Link_Tai_Code` | Link Google Drive tải workflow hoặc Mã đơn hàng (`WF11157`) |
| **I** | `Prompt_AI` | Câu lệnh Prompt tiếng Anh (cho bài Prompt AI) |
| **J** | `Mo_Ta_Chi_Tiet` | Nội dung mô tả, tính năng hoặc các bước thực hiện |
| **K** | `Trang_Thai` | Để chữ `Sẵn sàng đăng` khi muốn xuất bản |
| **L** | `Link_Bai_Viet` | *(n8n sẽ tự động điền link bài viết sau khi đăng)* |
| **M** | `Thoi_Gian_Dang` | *(n8n sẽ tự động điền thời gian đăng)* |

---

### BƯỚC 2: Cài Đặt Google Apps Script 1-Click (Dùng trực tiếp trên Sheets)

Nếu bạn muốn bấm nút đăng bài ngay trong Google Sheets mà không cần mở n8n:
1. Trên thanh menu Google Sheets, chọn **Tiện ích mở rộng (Extensions) > Apps Script**.
2. Xóa code mặc định, copy toàn bộ mã trong file [google-apps-script.js](file:///d:/ai-website-cloner-template/docs/blogger/automation/google-apps-script.js) và dán vào.
3. Bấm biểu tượng chiếc đĩa mềm **Lưu (Save)**.
4. F5 lại trang Google Sheets: Bạn sẽ thấy xuất hiện một menu mới có tên **"🚀 Blogger Nguyen Dang AI"**:
   - Bấm **"⚡ Đăng các bài 'Sẵn sàng đăng'"**: Tự động duyệt và đăng toàn bộ bài viết có trạng thái sẵn sàng!
   - Bấm **"📝 Đăng bài ở hàng đang chọn"**: Chỉ đăng đúng bài viết bạn đang click chuột!

---

### BƯỚC 3: Cài Đặt n8n Workflow + Telegram Bot

1. **Tạo Bot Telegram (trong 30 giây):**
   - Mở Telegram, tìm bot `@BotFather` và gõ `/newbot`.
   - Đặt tên cho bot (vd: `NguyenDangAI_Poster_Bot`).
   - Lưu lại mã `BOT_TOKEN` (dạng `7123456789:AAH...`).
   - Lấy Chat ID của bạn qua bot `@userinfobot`.

2. **Import Workflow vào n8n:**
   - Mở giao diện n8n của bạn.
   - Bấm menu `Workflows > Import from File` và chọn file [n8n-blogger-sheets-telegram-workflow.json](file:///d:/ai-website-cloner-template/docs/blogger/automation/n8n-blogger-sheets-telegram-workflow.json).
   - Điền thông tin kết nối:
     * **Node Telegram:** Điền Bot Token & Chat ID của bạn.
     * **Node Google Sheets:** Chọn tài khoản Google của bạn và dán `Sheet ID` (lấy từ link URL của bảng tính).
     * **Node Blogger API:** Kết nối tài khoản Google có quyền quản trị blog `2562876275428955705`.
   - Bấm **Active** bật quy trình!

---

## 📱 Trải Nghiệm Sử Dụng Thực Tế Hàng Ngày:

1. Bạn có thể mở Google Sheets trên máy tính hoặc điện thoại, nhập sẵn 5 - 10 bài viết theo các cột và để trạng thái `Sẵn sàng đăng`.
2. Bất kỳ lúc nào, bạn chỉ cần mở Telegram trên điện thoại và gửi lệnh:
   `/publish`
3. n8n sẽ tự động:
   - Đọc Google Sheets.
   - Ráp đúng khung HTML (tự động tạo mã VietQR, nút Zalo, khung code n8n).
   - Đăng lên Blogger `nguyendangai.blogspot.com`.
   - Ghi lại Link bài viết vào Google Sheets.
   - Bắn tin nhắn về Telegram cho bạn: *"🎉 Đã xuất bản thành công! [Bấm để xem bài viết]"*.
