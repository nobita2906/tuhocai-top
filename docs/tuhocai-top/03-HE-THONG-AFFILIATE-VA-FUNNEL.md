# HỆ THỐNG QUẢN LÝ AFFILIATE & SALES FUNNEL LANDING PAGE

> **Mục tiêu:** Xây dựng cỗ máy bán hàng và mạng lưới cộng tác viên (Affiliate Network) tự động hóa, hỗ trợ anh em kiếm hoa hồng 30% - 50% trọn đời và giải phóng thời gian vận hành cho anh Đăng.

---

## 🏗️ 1. KIẾN TRÚC CƠ SỞ DỮ LIỆU AFFILIATE (DATABASE SCHEMA)

Hệ thống được vận hành bởi 3 bảng MySQL liên kết chặt chẽ:

```sql
-- 1. Bảng quản lý Đối tác Affiliate
CREATE TABLE IF NOT EXISTS affiliate_partners (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  affiliate_code VARCHAR(32) NOT NULL UNIQUE,
  commission_rate DECIMAL(5,2) DEFAULT 30.00,
  balance DECIMAL(15,2) DEFAULT 0.00,
  total_earned DECIMAL(15,2) DEFAULT 0.00,
  bank_name VARCHAR(128) NULL,
  bank_account VARCHAR(64) NULL,
  bank_owner VARCHAR(128) NULL,
  status ENUM('ACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_affiliate_code (affiliate_code)
);

-- 2. Bảng ghi nhận Chuyển đổi Đơn hàng (Conversions)
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id VARCHAR(64) PRIMARY KEY,
  partner_id VARCHAR(64) NOT NULL,
  order_id VARCHAR(64) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  commission DECIMAL(15,2) NOT NULL,
  status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_partner_id (partner_id),
  INDEX idx_order_id (order_id)
);

-- 3. Bảng Quản lý Yêu cầu Rút tiền (Payouts)
CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id VARCHAR(64) PRIMARY KEY,
  partner_id VARCHAR(64) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status ENUM('PENDING', 'PAID', 'REJECTED') DEFAULT 'PENDING',
  bank_name VARCHAR(128) NOT NULL,
  bank_account VARCHAR(64) NOT NULL,
  bank_owner VARCHAR(128) NOT NULL,
  proof_image VARCHAR(512) NULL,
  note TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_payout_partner (partner_id),
  INDEX idx_payout_status (status)
);
```

---

## 🔗 2. LUỒNG BÁM ĐUỔI COOKIE & GHI NHẬN HOA HỒNG (REFERRAL TRACKING)

1. **Gắn Cookie khi nhấp link:**
   - Bất kỳ khách hàng nào truy cập website qua link có chứa query parameter `?ref=<MA_AFF>` (ví dụ: `https://www.tuhocai.top/lp/n8n-tu-dong-hoa-kiem-tien?ref=DANG2026`).
   - Middleware/API tự động lưu cookie `tuhocai_ref` vào trình duyệt khách hàng với thời hạn **30 ngày** (First-click / Last-click tracking).
2. **Khách hàng thanh toán qua VietQR:**
   - Khi đơn hàng hoàn tất tại `/api/checkout`, hệ thống đọc cookie `tuhocai_ref`.
   - Nếu tồn tại đối tác hợp lệ, hệ thống tự động:
     - Tính hoa hồng: `Hoa hồng = Giá trị đơn hàng * (commission_rate / 100)`.
     - Ghi 1 bản ghi vào `affiliate_conversions`.
     - Cộng số dư ngay lập tức vào cột `balance` và `total_earned` của đối tác.
     - Bắn thông báo chốt đơn tức thì qua bot Telegram.

---

## 🖥️ 3. GIAO DIỆN CỔNG ĐỐI TÁC AFFILIATE (`/affiliate`)

Được thiết kế gồm 3 Tab chuyên nghiệp:
- **Tab 1: Tổng quan số liệu (Dashboard Overview):** Hiển thị số lượt click, số đơn hàng chốt thành công, số dư khả dụng và tổng doanh thu đã kiếm được.
- **Tab 2: Lịch sử hoa hồng & Rút tiền:** Đối tác tạo lệnh rút tiền về tài khoản ngân hàng bất kỳ, hệ thống hỗ trợ duyệt lệnh trong 24h.
- **Tab 3: Media Kit & Trình tạo Deep Link (Độc quyền):** 
  - Tự động gắn mã affiliate vào bất kỳ đường dẫn nào trên web:
    `https://www.tuhocai.top/bai-viet/...` ➔ `https://www.tuhocai.top/bai-viet/...?ref=<MA_DOI_TAC>`.
  - Giúp đối tác thoải mái chia sẻ bài viết hữu ích lên Facebook, Zalo, TikTok mà vẫn tự động nhận hoa hồng khi người đọc mua sản phẩm.

---

## 🎯 4. HỆ THỐNG SALES FUNNEL LANDING PAGE (`/lp/[slug]`)

- **Cấu trúc động:** Route `/lp/[slug]` phục vụ các chiến dịch bán hàng trực tiếp với tỷ lệ chuyển đổi cao.
- **Trang mẫu tiêu biểu:** `/lp/n8n-tu-dong-hoa-kiem-tien`
  - Đầy đủ Hero chuyển đổi, Video demo thực chiến, 6 Module khóa học, Bảng so sánh trước/sau khi tự động hóa, Đánh giá thực tế từ học viên (Testimonials), và Box thanh toán VietQR quét mã là kích hoạt khóa học tự động.
