# QUY TẮC TRIỂN KHAI & DEPLOY LÊN VERCEL (BẮT BUỘC TUÂN THỦ 100%)

> **Người ban hành:** Nguyễn Văn Đăng (Chủ quản dự án)  
> **Người thực thi & giám sát:** Thùy Linh (Tổng quản lý Agent)  
> **Áp dụng:** Cho toàn bộ Agent, Subagent và công cụ tham gia phát triển dự án `tuhocai.top`.

---

## ⛔ NGUYÊN TẮC BẤT KHẢ XÂM PHẠM

> [!CAUTION]
> **TUYỆT ĐỐI KHÔNG TỰ Ý DEPLOY LÊN VERCEL HOẶC PUSH LÊN REMOTE KÍCH HOẠT AUTO-DEPLOY KHI CHƯA CÓ LỆNH PHÊ DUYỆT RÕ RÀNG TỪ ANH ĐĂNG.**  
> Mọi hành động commit/push trực tiếp vào nhánh `main` của các remote `origin` hoặc `nvdang` nhằm mục đích deploy lên Vercel mà không thông qua bước nghiệm thu của anh Đăng đều bị coi là **VI PHẠM KỶ LUẬT NGHIÊM TRỌNG**.

---

## 🔄 QUY TRÌNH 4 BƯỚC TRIỂN KHAI CHUẨN MỰC

```
┌────────────────────────────────────────────────────────┐
│ BƯỚC 1: Phát triển & Kiểm thử trên Localhost:8899      │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ BƯỚC 2: Viết script QA tự động & Chạy đạt 100% PASS    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ BƯỚC 3: Báo cáo đường link & kịch bản để anh Đăng test │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ BƯỚC 4: CHỈ KHI anh Đăng phê duyệt ➔ Mới bấm Deploy    │
└────────────────────────────────────────────────────────┘
```

### Bước 1: Phát triển tính năng & Kiểm thử nội bộ
- Toàn bộ tính năng mới, chỉnh sửa giao diện, API route hoặc database schema chỉ được phép chạy thử nghiệm trên môi trường cục bộ:
  **`http://localhost:8899`**
- Không được can thiệp vào production khi chưa hoàn thiện local.

### Bước 2: Tự động hóa kiểm thử QA (Automated QA Scripts)
- Mỗi tính năng khi hoàn thành **BẮT BUỘC phải có script kiểm thử bằng Python** đặt trong thư mục `scripts/`:
  - `scripts/test_publish_webhook_qa.py`: Kiểm thử API Webhook đăng bài.
  - `scripts/test_post_detail_seo_qa.py`: Kiểm thử On-page SEO, Schema.org, TOC.
  - `scripts/test_admin_ai_writer_qa.py`: Kiểm thử bộ sinh bài viết Anti-Slop trong Admin.
  - `scripts/test_admin_affiliate_qa.py`: Kiểm thử cổng quản trị Affiliate.
  - `scripts/test_lp_funnel_qa.py`: Kiểm thử Landing Page bán hàng.
- Chạy kiểm tra tĩnh bắt buộc:
  - `npm run typecheck` (Phải đạt 0 lỗi TypeScript).
  - `npm run build` (Phải build production bundle thành công 54/54 trang).

### Bước 3: Bàn giao báo cáo nghiệm thu cho anh Đăng
- Thùy Linh tổng hợp báo cáo chi tiết gửi anh Đăng gồm:
  1. Bảng tóm tắt kết quả test cases (% Pass).
  2. Các đường link trực tiếp trên `http://localhost:8899/...` để anh Đăng bấm vào trải nghiệm ngay.
  3. Kịch bản test giả lập để anh Đăng kiểm tra tính năng.

### Bước 4: Chờ lệnh phê duyệt từ anh Đăng
- **CHỈ KHI anh Đăng đã kiểm tra xong và gửi thông điệp đồng ý** (ví dụ: *"anh duyệt rồi, deploy đi em"*, *"ok deploy lên vercel nhé"*, *"deploy các chỉnh sửa lên web đi Thùy Linh"*), lúc đó Thùy Linh mới được phép:
  1. `git add -A`
  2. `git commit -m "feat/fix: ..."`
  3. `git push origin main` và `git push nvdang main` để Vercel tự động build và deploy.

---

## 🔐 QUẢN LÝ THÔNG TIN BẢO MẬT (SECRETS)

- **Webhook Secret:** Mặc định `tuhocai-auto-publish-secret-key-2026` hoặc biến môi trường `WEBHOOK_SECRET`.
- **JWT Secret:** `tuhocai-super-secret-jwt-token-2026-secure-key` dùng để ký phiên đăng nhập `tuhocai_session`.
- **Database Credentials:** Kết nối MySQL nội bộ an toàn, không commit mật khẩu plain-text ra ngoài kho lưu trữ công khai.
- **Gemini API:** Luôn gọi qua biến môi trường `GEMINI_API_KEY`, không hardcode khóa API vào file giao diện client.
