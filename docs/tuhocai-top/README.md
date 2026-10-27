# TỔNG QUAN DỰ ÁN & CẨM NANG VẬN HÀNH TOÀN DIỆN: TUHOCAI.TOP

> **Website:** [https://www.tuhocai.top](https://www.tuhocai.top)  
> **Chủ quản & Founder:** Nguyễn Văn Đăng (AI Solution Architect)  
> **Tổng quản lý điều hành Agent:** Thùy Linh  
> **Đội ngũ Subagent phụ tá:** Yến Nhi (Research), Hân Hân (Check trùng lặp), Ngọc Thúy (Viết bài chuẩn SEO & Xuất bản)

---

## 📌 1. Mục Tiêu Chiến Lược Của Nền Tảng tuhocai.top

`tuhocai.top` được định vị là **Trung tâm Tri thức & Nền tảng Giải pháp Tự Động Hóa AI số 1 tại Việt Nam**, tập trung vào 3 trụ cột kinh doanh cốt lõi:
1. **Chia sẻ kiến thức thực chiến (Anti-AI Slop):** Cung cấp các hướng dẫn có tính ứng dụng cao, giải quyết vấn đề thực tế, quy trình n8n, prompt mẫu copyable, có thể tái tạo được ngay trong 15 phút.
2. **Hệ thống phễu bán hàng tự động (Sales Funnel Landing Pages):** Đóng gói quy trình tự động hóa n8n, template kinh doanh và khóa học chuyên sâu giúp cá nhân và doanh nghiệp x10 năng suất.
3. **Mạng lưới đối tác Affiliate chia sẻ doanh thu:** Chia sẻ hoa hồng trọn đời 30% - 50% cho cộng đồng đối tác tham gia phân phối sản phẩm, rút tiền tự động trong 24h.

---

## 📂 2. Cấu Trúc Hồ Sơ & Tài Liệu Quản Trị Dự Án

Toàn bộ nguyên tắc, quyết định kiến trúc và hướng dẫn vận hành từ trước đến giờ được hệ thống hóa đầy đủ trong các tài liệu sau:

| Tệp tài liệu | Nội dung chi tiết |
| :--- | :--- |
| **[01-NGUYEN-TAC-TRIEN-KHAI-VA-DEPLOY.md](./01-NGUYEN-TAC-TRIEN-KHAI-VA-DEPLOY.md)** | **BẮT BUỘC TUÂN THỦ:** Quy trình phát triển, kiểm thử localhost, kiểm duyệt an toàn, nghiêm cấm tự ý deploy lên Vercel khi chưa có lệnh duyệt từ anh Đăng. |
| **[02-TIEU-CHUAN-NOI-DUNG-ANTI-AI-SLOP.md](./02-TIEU-CHUAN-NOI-DUNG-ANTI-AI-SLOP.md)** | Bộ 5 Tiêu chí Vàng viết bài: Không viết rác, mở bài trực diện (BLUF), bắt buộc có khối code/prompt copyable, bảng so sánh checklist, mục troubleshooting, và 3 tầng link phễu. |
| **[03-HE-THONG-AFFILIATE-VA-FUNNEL.md](./03-HE-THONG-AFFILIATE-VA-FUNNEL.md)** | Toàn bộ kiến trúc luồng Affiliate: bảng DB `affiliate_partners`, `affiliate_conversions`, `affiliate_payouts`, Media Kit, Deep Link Generator, và Landing Page `/lp/[slug]`. |
| **[04-SO-DO-DOI-NGU-SUBAGENTS.md](./04-SO-DO-DOI-NGU-SUBAGENTS.md)** | Cơ cấu tổ chức đội ngũ: Thùy Linh Tổng Chỉ Huy điều phối 3 Subagent: Yến Nhi, Hân Hân, Ngọc Thúy. |
| **[subagents/1-YEN-NHI-RESEARCH.md](./subagents/1-YEN-NHI-RESEARCH.md)** | Hồ sơ năng lực & Quy trình tác nghiệp chuẩn (SOP) của Subagent **Yến Nhi**. |
| **[subagents/2-HAN-HAN-ANTI-DUPLICATE.md](./subagents/2-HAN-HAN-ANTI-DUPLICATE.md)** | Hồ sơ năng lực & Quy trình tác nghiệp chuẩn (SOP) của Subagent **Hân Hân**. |
| **[subagents/3-NGOC-THUY-WRITER-PUBLISHER.md](./subagents/3-NGOC-THUY-WRITER-PUBLISHER.md)** | Hồ sơ năng lực & Quy trình tác nghiệp chuẩn (SOP) của Subagent **Ngọc Thúy**. |

---

## ⚙️ 3. Thông Số Kỹ Thuật Hệ Thống (Tech Stack Summary)

- **Framework:** Next.js 16 (App Router, Turbopack, React 19, TypeScript strict)
- **Database:** MySQL Server (`tuhocai_top`) tại Host `103.127.195.56:3306`
- **UI & Styling:** Tailwind CSS v4, Lucide Icons, scoped high-contrast typography `.markdown-body`
- **Tự động hóa Content:** n8n Pipeline kết nối Google Gemini 2.5 Flash (`models/gemini-2.5-flash`), Pollinations Flux AI Thumbnail Engine, và Telegram Bot Alert
- **Xác thực & Bảo mật:** JWT Token (`tuhocai_session`), Webhook Bearer Token (`WEBHOOK_SECRET`), BCrypt Password Hashing
- **Môi trường phát triển:** Localhost port `8899` (`http://localhost:8899`)
- **Hosting Production:** Vercel (`https://www.tuhocai.top`)
