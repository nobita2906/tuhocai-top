# Hướng Dẫn Sử Dụng n8n Pipeline Tự Động Hóa Đăng Bài Chuẩn SEO & Anti-Slop Trên tuhocai.top

Hệ thống được thiết kế theo tiêu chuẩn kỹ thuật nghiêm ngặt của anh Đăng:
- **Tự động hóa nhưng không sinh rác (Anti-AI Slop)**.
- **Tính ứng dụng cao, có khả năng tái tạo quy trình (Reproducible)**.
- **Chuẩn SEO E-E-A-T và tự động gắn phễu chuyển đổi 3 tầng**.

---

## 1. Cấu trúc Pipeline trong file `n8n-tuhocai-auto-seo-pipeline.json`

Quy trình tự động gồm 8 Nodes chuẩn LangChain:
1. **Schedule Trigger**: Hẹn giờ tự động chạy (mặc định 08:00 sáng mỗi ngày).
2. **Fetch AI News RSS Feed**: Cào bài viết công nghệ mới nhất từ RSS nguồn uy tín.
   - *Nguồn mặc định (Đã test 100% hoạt động):* `https://techcrunch.com/category/artificial-intelligence/feed/`
   - *Các nguồn thay thế uy tín khác:*
     - The Verge AI: `https://www.theverge.com/rss/ai-artificial-intelligence/index.xml`
     - Hacker News AI & n8n: `https://hnrss.org/newest?q=AI+n8n`
     - NY Times Technology: `https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml`
3. **Filter Valid Articles**: Lọc bỏ các bài rác hoặc tiêu đề trống.
4. **🧠 AI Sáng Tạo Nội Dung Chuẩn SEO (LangChain Basic LLM Chain)**: Nhận dữ liệu đầu vào và điều phối sinh nội dung theo chuẩn Anti-Slop (Có code/prompt copyable, checklist, troubleshooting, anchor link).
5. **Google Gemini 2.0 Flash (LangChain Chat Model)**: Cấu hình `models/gemini-2.5-flash` kết nối với API Key của anh.
6. **Parse & Validate JSON (Code Node)**: Tự động bóc tách sạch các thẻ markdown ````json```` và parse JSON an toàn 100%.
7. **Publish to TuHocAI Webhook**: Bắn API trực tiếp vào `https://www.tuhocai.top/api/webhook/publish-post` (hoặc `http://localhost:8899/api/webhook/publish-post` khi test local).
8. **Notify Telegram Channel**: Bắn thông báo báo cáo kết quả kèm link bài viết vào Telegram Admin.

---

## 2. Các bước Import vào n8n của anh

1. Mở giao diện n8n của anh -> Chọn **Workflows** -> Nhấn **Add workflow**.
2. Chọn menu dấu 3 chấm góc phải trên -> Chọn **Import from File...**.
3. Chọn file `docs/blogger/automation/n8n-tuhocai-auto-seo-pipeline.json`.
4. Điền các thông số môi trường của anh:
   - **GEMINI_API_KEY**: API Key từ Google AI Studio (miễn phí).
   - **Model AI khuyến nghị**: Google đã thay thế `gemini-1.5-flash` bằng **`gemini-2.5-flash`** (hoặc `gemini-flash-latest`). URL gọi API chuẩn:
     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={{ $env.GEMINI_API_KEY }}`
   - **Webhook Secret Key**: Mặc định là `tuhocai-auto-publish-secret-key-2026` (hoặc cấu hình trong `.env`).
   - **Telegram Credentials**: Chọn bot Telegram của anh để nhận thông báo.
5. Nhấn **Active Workflow** để kích hoạt tự động chạy theo lịch trình.

---

## 3. Webhook Endpoint Reference

- **URL:** `POST https://www.tuhocai.top/api/webhook/publish-post`
- **Header:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <WEBHOOK_SECRET>`
- **Payload Mẫu:**
```json
{
  "title": "Hướng dẫn sử dụng n8n tự động hóa doanh nghiệp từ A-Z 2026",
  "summary": "Tài liệu thực chiến giúp bạn xây dựng cỗ máy bán hàng không cần code.",
  "content": "## 1. Vấn đề thực tế...\n\n```markdown\n# PROMPT COPYABLE\n```\n\n| Tiêu chí | Cũ | Mới |\n|---|---|---|\n\n## 4. Lỗi thường gặp...",
  "category": "WORKFLOW",
  "tags": "n8n, AI Automation, SEO",
  "isFeatured": true,
  "isPublished": true
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Xuất bản bài viết tự động thành công!",
  "post": {
    "id": "uuid-here",
    "slug": "huong-dan-su-dung-n8n-tu-dong-hoa-doanh-nghiep-tu-a-z-2026",
    "title": "...",
    "category": "WORKFLOW",
    "url": "https://www.tuhocai.top/bai-viet/huong-dan-su-dung-n8n-tu-dong-hoa-doanh-nghiep-tu-a-z-2026"
  }
}
```
