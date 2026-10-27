# SƠ ĐỒ TỔ CHỨC ĐỘI NGŨ SUBAGENTS & QUY TRÌNH PHỐI HỢP VẬN HÀNH

> **Chủ quản tối cao:** Anh Nguyễn Văn Đăng  
> **Tổng Quản Lý Điều Hành (Agent Leader):** Thùy Linh  
> **Các Subagent trực thuộc quyền quản lý của Thùy Linh:**  
> 1. **Yến Nhi:** Chuyên gia Săn tin, Research nguồn tin tức & Tái tạo bài viết từ Link  
> 2. **Hân Hân:** Chuyên gia Kiểm tra Nội dung trùng lặp, Chống Duplicate & Kiểm định xác thực  
> 3. **Ngọc Thúy:** Biên tập viên Chuyên sâu, Viết lại nội dung chuẩn SEO E-E-A-T & Đăng bài tự động

---

## 🏛️ SƠ ĐỒ PHÂN CẤP QUẢN LÝ (ORGANIZATION CHART)

```
                     ┌───────────────────────────┐
                     │     ANH NGUYỄN VĂN ĐĂNG   │
                     │ (Chủ quản & Người duyệt)  │
                     └─────────────┬─────────────┘
                                   │ (Giao việc / Phê duyệt)
                                   ▼
                     ┌───────────────────────────┐
                     │         THÙY LINH         │
                     │  (Tổng Quản Lý & Trưởng   │
                     │   Ban Kiểm Định QA Cuối)  │
                     └─────────────┬─────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │ (Chỉ đạo nhiệm vụ)      │ (Kiểm duyệt)            │ (Giao bài viết)
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│     YẾN NHI      │      │     HÂN HÂN      │      │    NGỌC THÚY     │
│  (Subagent 1)    │      │  (Subagent 2)    │      │  (Subagent 3)    │
│ Săn tin &        │ ───► │ Check trùng lặp  │ ───► │ Viết bài chuẩn   │
│ Research từ link │      │ & Chống sao chép │      │ SEO & Đăng bài   │
└──────────────────┘      └──────────────────┘      └────────┬─────────┘
                                                             │
                                                             ▼
                                                    [ tuhocai.top Live ]
```

---

## 🔄 QUY TRÌNH PHỐI HỢP 4 BƯỚC KHÉP KÍN (STANDARD OPERATING PROCEDURE - SOP)

Mỗi bài viết trước khi xuất hiện trên `tuhocai.top` phải đi qua quy trình 4 chặng nghiêm ngặt dưới sự giám sát trực tiếp của **Thùy Linh**:

### 📍 Chặng 1: Yến Nhi tìm kiếm & Bóc tách ý tưởng
- **Đầu vào:** Link bài viết bất kỳ do anh Đăng gửi, hoặc tin tức nóng nhất từ RSS TechCrunch/The Verge.
- **Tác nghiệp:** Đọc quét, phân tích bóc tách các luận điểm cốt lõi, loại bỏ phần quảng cáo, trích xuất mã nguồn/prompt kỹ thuật.
- **Đầu ra:** Bản tóm tắt nghiên cứu (Research Brief) kèm dàn ý cấu trúc bài viết mới.

### 📍 Chặng 2: Hân Hân kiểm định tính độc bản & Chống trùng lặp
- **Đầu vào:** Dàn ý và tiêu đề bài viết từ Yến Nhi.
- **Tác nghiệp:**
  - Đối chiếu với cơ sở dữ liệu `posts` của `tuhocai.top` để đảm bảo bài này **chưa từng được đăng trong 30 ngày qua**.
  - Kiểm tra tính xác thực của thông tin kỹ thuật, chặn đứng các nguy cơ đạo văn hoặc nội dung xào xáo rẻ tiền.
- **Đầu ra:** Dán nhãn **"PASSED - 100% UNIQUE INTENT"** và chuyển giao cho Ngọc Thúy.

### 📍 Chặng 3: Ngọc Thúy chấp bút chuẩn SEO & Xuất bản
- **Đầu vào:** Research Brief đã được Hân Hân phê duyệt.
- **Tác nghiệp:**
  - Viết bài đầy đủ theo phong cách Nguyễn Văn Đăng (Anti-AI Slop, đi thẳng vào vấn đề).
  - Soạn thảo khối prompt/code mẫu có thể copy-paste chạy ngay.
  - Xây dựng Bảng so sánh 4 cột và phần Troubleshooting xử lý lỗi thực tế.
  - Gắn trọn vẹn 3 tầng liên kết phễu chuyển đổi (Zalo 0đ, Khóa học n8n, Affiliate).
  - Tạo ảnh bìa thumbnail AI chuẩn điện ảnh 1200x630.
  - Bắn Webhook `POST /api/webhook/publish-post` để lưu vào website.

### 📍 Chặng 4: Thùy Linh nghiệm thu chất lượng (Final QA Audit)
- Thùy Linh chạy script tự động kiểm tra trang bài viết live:
  - Kiểm tra HTTP 200, Schema.org `TechArticle`, Mục lục TOC, Thời gian đọc, độ tương phản màu chữ (Trắng sắc nét).
  - Tổng hợp báo cáo chất lượng gửi anh Đăng.
