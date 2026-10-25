# HƯỚNG DẪN DEPLOY VÀ QUY TRÌNH PHÁT HÀNH (TUHOCAI.TOP)

Tài liệu ghi nhớ quy trình deploy lên Vercel cho tên miền chính thức **https://tuhocai.top**.

---

## 1. CƠ CHẾ HOẠT ĐỘNG (CI/CD PIPELINE)
- **Hạ tầng lưu trữ:** Vercel Production Environment
- **Tên miền tùy chỉnh (Custom Domain):** `tuhocai.top` và `www.tuhocai.top`
- **Mã nguồn GitHub liên kết:** `https://github.com/nobita2906/tuhocai-top.git` (và backup `https://github.com/nvdang2906/tuhocai-top.git`)
- **Nhánh chính (Production Branch):** `main`
- **Cơ chế tự động:** Mỗi khi có commit mới được `git push` lên nhánh `main`, Vercel sẽ tự động:
  1. Kéo mã nguồn mới nhất về
  2. Cài đặt dependencies (`npm install`)
  3. Chạy `next build` với Turbopack
  4. Trỏ tên miền `tuhocai.top` vào bản phát hành mới nhất (Zero Downtime)

---

## 2. CÁC BƯỚC THỰC HIỆN DEPLOY

### Cách 1: Chạy lệnh 1-Click (Khuyên dùng)
Trong terminal tại thư mục dự án, chỉ cần gõ:
```bash
npm run deploy
```
Hoặc:
```powershell
powershell -ExecutionPolicy Bypass -File ./scripts/deploy.ps1 "Nội dung ghi chú thay đổi"
```

### Cách 2: Các bước thủ công (Manual Steps)
Khi cần chạy từng bước độc lập:

1. **Kiểm tra kiểu dữ liệu:**
   ```bash
   npm run typecheck
   ```
2. **Kiểm tra build Next.js cục bộ:**
   ```bash
   npm run build
   ```
3. **Commit toàn bộ thay đổi:**
   ```bash
   git add .
   git commit -m "feat: cập nhật tính năng mới cho tuhocai.top"
   ```
4. **Đẩy mã nguồn lên GitHub để Vercel deploy:**
   ```bash
   git push origin main
   git push nvdang main
   ```

---

## 3. CÁC BIẾN MÔI TRƯỜNG CẦN THIẾT TRÊN VERCEL (ENVIRONMENT VARIABLES)
Đảm bảo trên dashboard Vercel (`Project Settings -> Environment Variables`) có đầy đủ các khóa sau:
- `DATABASE_URL`: Chuỗi kết nối MySQL / TiDB / PlanetScale
- `JWT_SECRET`: Khóa bí mật ký token đăng nhập
- `TELEGRAM_BOT_TOKEN`: Token bot Telegram nhận thông báo đơn hàng
- `TELEGRAM_CHAT_ID`: Chat ID nhận tin nhắn báo đơn
- `RESEND_API_KEY`: API Key Resend để tự động gửi email bàn giao link tải
- `NEXT_PUBLIC_ZALO_SUPPORT`: Số hotline/Zalo hỗ trợ (`0934.434.101`)
- `NEXT_PUBLIC_ZALO_GROUP`: Đường dẫn nhóm Zalo học viên VIP
