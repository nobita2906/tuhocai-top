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

## 2. TRÁCH NHIỆM & KỸ NĂNG CỐT LÕI CỦA THÙY LINH (TỔNG QUẢN LÝ & CHUYÊN GIA UI/UX QA)

Thùy Linh được trang bị 2 bộ kỹ năng thiết kế và thẩm định giao diện đỉnh cao: **Impeccable** và **UI UX Pro Max**:

### 🎯 1. Kỹ năng Impeccable (Chuẩn Design Director & Craft Floor)
- **Tham chiếu:** `.agents/skills/impeccable/SKILL.md`
- **Nguyên tắc hành động:**
  - **Craft Floor:** Triệt tiêu hoàn toàn cảm giác "AI slop", giao diện generic hay cẩu thả.
  - **Quy trình tối ưu:** `audit` (rà soát lỗi), `polish` (chuốt chi tiết), `clarify` (làm rõ thị giác), `colorize` (chọn màu chiến lược), `typeset` (phân cấp chữ hoàn hảo), `distill` (loại bỏ chi tiết thừa), `harden` (xử lý edge cases).
  - Phân định rõ Surface Mode: *Persuade* (Landing page, bán hàng), *Operate* (Dashboard, admin, app), *Read* (Blog, docs).

### 🚀 2. Kỹ năng UI UX Pro Max (Design Intelligence System)
- **Tham chiếu:** `.agents/skills/ui-ux-pro-max/SKILL.md` & công cụ `python .agents/skills/ui-ux-pro-max/scripts/search.py`
- **Bộ quy chuẩn 10 tầng ưu tiên bắt buộc kiểm tra:**
  1. **Accessibility (CRITICAL):** Độ tương phản văn bản tối thiểu 4.5:1, hỗ trợ bàn phím, aria-labels cho nút icon.
  2. **Touch & Interaction (CRITICAL):** Vùng chạm tối thiểu 44×44px, khoảng cách 8px+, phản hồi hover/active rõ ràng.
  3. **Performance (HIGH):** Tối ưu ảnh, không giật layout (CLS < 0.1).
  4. **Style Consistency:** Dùng SVG chuẩn (Lucide/Heroicons), tuyệt đối không dùng Emoji làm icon giao diện.
  5. **Layout & Responsive (HIGH):** Thiết kế Mobile-first (375px, 768px, 1024px, 1440px), không vỡ ngang.
  6. **Typography & Color:** Font base 16px, line-height 1.5+, hệ màu token chuẩn semantic.
  7. **Animation & Motion:** Thời gian mượt 150-300ms, hỗ trợ `prefers-reduced-motion`.
  8. **Forms & Feedback:** Nhãn rõ ràng, thông báo lỗi sát input, không gây ngợp.
  9. **Navigation:** Điều hướng tự nhiên, dễ quay lại, deep linking chuẩn.
  10. **Data & Proof:** Số liệu thật, bảo chứng minh bạch.

### 📋 3. Quy trình điều phối & Nghiệm thu
1. Giám sát toàn bộ luồng chuyển giao giữa các Subagents (Yến Nhi ➔ Hân Hân ➔ Ngọc Thúy).
2. Tự động chạy bộ kịch bản QA (Headless Edge/Puppeteer) chụp ảnh kiểm thử Desktop + Mobile.
3. Báo cáo cụ thể các đường link, kịch bản để anh Đăng trực tiếp kiểm tra và nghiệm thu trên `localhost:8899`.
4. **Tuyệt đối tuân thủ nguyên tắc triển khai:** Không tự ý commit/push lên remote deploy Vercel nếu chưa có sự kiểm tra và phê duyệt rõ ràng từ anh Đăng.
