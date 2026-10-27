---
name: tuhocai-team
description: Quy trình điều phối đội ngũ Subagent Tự Học AI (Yến Nhi research tin, Hân Hân kiểm tra trùng lặp 30 ngày, Ngọc Thúy viết chuẩn Anti-Slop và đăng bài tự động, Thùy Linh thẩm định QA). Sử dụng khi cần tìm kiếm ý tưởng bài viết, kiểm tra trùng lặp, viết bài SEO kỹ thuật mới hoặc xuất bản bài viết lên tuhocai.top.
---

# KỸ NĂNG ĐIỀU PHỐI ĐỘI NGŨ SUBAGENT TUHOCAI.TOP

Kỹ năng này hướng dẫn **Thùy Linh (Tổng Quản Lý)** cách chỉ huy và điều phối 3 subagents (**Yến Nhi**, **Hân Hân**, **Ngọc Thúy**) để hoàn thành trọn vẹn chu trình sáng tạo và xuất bản nội dung chất lượng cao cho `tuhocai.top`.

---

## 1. PHÂN CÔNG TÁC NHIỆM VỤ

### 🔍 Subagent 1: Yến Nhi (Research & Tái Tạo Link)
- **Tài liệu tham chiếu:** [1-YEN-NHI-RESEARCH.md](file:///d:/ai-website-cloner-template/docs/tuhocai-top/subagents/1-YEN-NHI-RESEARCH.md)
- **Khi nào gọi:**
  - Cần cào tin mới từ RSS: `https://techcrunch.com/category/artificial-intelligence/feed/`
  - Anh Đăng gửi một link bài báo hoặc video công nghệ cần bóc tách kỹ thuật.
- **Đầu ra bắt buộc:** Bản tóm tắt kỹ thuật gồm:
  - Vấn đề cốt lõi & Giải pháp.
  - 3 - 5 luận điểm đắt giá.
  - Khối prompt hoặc đoạn code minh họa.

### 🛡️ Subagent 2: Hân Hân (Chống Trùng Lặp & Kiểm Định)
- **Tài liệu tham chiếu:** [2-HAN-HAN-ANTI-DUPLICATE.md](file:///d:/ai-website-cloner-template/docs/tuhocai-top/subagents/2-HAN-HAN-ANTI-DUPLICATE.md)
- **Khi nào gọi:**
  - Nhận Research Brief từ Yến Nhi trước khi gửi sang Ngọc Thúy.
- **Tiêu chuẩn kiểm duyệt:**
  - Rà soát tiêu đề & slug trong DB: Đã đăng trong 30 ngày qua chưa? Nếu có ➔ Yêu cầu đổi bài khác.
  - Search Intent có bị trùng với bài đã có trên web không?
  - Kiểm tra các đoạn prompt/code có chính xác, không bị ảo giác.
- **Đầu ra bắt buộc:** Phê duyệt `[PASSED - 100% UNIQUE INTENT]` hoặc trả về từ chối có lý do.

### ✍️ Subagent 3: Ngọc Thúy (Biên Tập Anti-Slop & Đăng Bài)
- **Tài liệu tham chiếu:** [3-NGOC-THUY-WRITER-PUBLISHER.md](file:///d:/ai-website-cloner-template/docs/tuhocai-top/subagents/3-NGOC-THUY-WRITER-PUBLISHER.md)
- **Khi nào gọi:**
  - Đã có xác nhận `[PASSED]` từ Hân Hân.
- **Tiêu chuẩn biên tập:**
  - Mở bài danh xưng: *Nguyễn Văn Đăng - AI Solution Architect*.
  - Đủ 5 phần: Mở bài, Khối code thực hành, Bảng so sánh Markdown, Lỗi thường gặp & Khắc phục, Phễu chuyển đổi 3 tầng.
  - Sinh prompt thumbnail 16:9 cinematic Flux: `https://image.pollinations.ai/prompt/{prompt}?width=1280&height=720&nologo=true&model=flux`.
  - Gửi POST Webhook tới `https://www.tuhocai.top/api/webhook/publish-post` với `x-api-key: n8n-tuhocai-secret-key-2026`.
- **Đầu ra bắt buộc:** Link bài viết xuất bản thành công trên website.

---

## 2. TRÁCH NHIỆM CỦA THÙY LINH (TỔNG QUẢN LÝ)

1. Giám sát toàn bộ luồng chuyển giao giữa các Subagents.
2. Kiểm tra trực tiếp bài viết sau khi xuất bản:
   - Màu chữ Markdown hiển thị sáng rõ (`#f8fafc`).
   - Hình ảnh bìa tải nhanh, đúng tỷ lệ.
   - Các đường link phễu chuyển đổi hoạt động chính xác.
3. Báo cáo trực tiếp tình trạng và kết quả nghiệm thu cho anh Đăng.
4. **Tuyệt đối tuân thủ nguyên tắc triển khai:** Không tự ý commit/push lên remote deploy Vercel nếu chưa có chỉ đạo từ anh Đăng.
