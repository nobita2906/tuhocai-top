import pymysql
import uuid
import json

DB_CONFIG = {
    'host': '103.127.195.56',
    'user': 'postgress_user',
    'password': 'Nvdang@1',
    'port': 3306,
    'database': 'tuhocai_top',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

CREATE_LP_TABLE = """
CREATE TABLE IF NOT EXISTS landing_pages (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  headline VARCHAR(255) NOT NULL,
  subheadline TEXT,
  product_id VARCHAR(36),
  price INT DEFAULT 199000,
  original_price INT DEFAULT 990000,
  video_url VARCHAR(500),
  hero_badge VARCHAR(100) DEFAULT '✦ QUY TRÌNH THỰC CHIẾN ĐỘC QUYỀN TỰ HỌC AI',
  features JSON,
  modules JSON,
  testimonials JSON,
  bonus_items JSON,
  cta_text VARCHAR(100) DEFAULT '⚡ NHẬN TRỌN BỘ WORKFLOW NGAY (199K)',
  is_published BOOLEAN DEFAULT TRUE,
  views INT DEFAULT 0,
  conversions INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_lp_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
"""

def migrate():
    print("Connecting to MySQL...")
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cur:
            cur.execute(CREATE_LP_TABLE)
            print("Landing pages table verified/created.")

            # Seed an initial showcase landing page if not exists
            cur.execute("SELECT id FROM landing_pages WHERE slug = 'n8n-tu-dong-hoa-kiem-tien' LIMIT 1")
            existing = cur.fetchone()
            if not existing:
                lp_id = str(uuid.uuid4())
                features = [
                    {"title": "Cào tin tức tự động 24/7", "desc": "Tự động thu thập bài viết từ hơn 20 trang báo & blog công nghệ hàng đầu mỗi ngày."},
                    {"title": "ChatGPT viết lại bài chuẩn SEO", "desc": "Ứng dụng prompt độc quyền viết lại 100% không trùng lặp, tối ưu thẻ H2, H3 và mật độ từ khóa."},
                    {"title": "Tự động xuất bản lên Blogger & Web", "desc": "Tích hợp Google API & Blogger đẩy bài liên tục theo lịch hẹn giờ mà không cần mở máy tính."},
                    {"title": "Báo cáo tức thì về Telegram", "desc": "Mỗi bài viết được đăng thành công đều gửi thông báo kèm đường link kiểm tra về điện thoại của bạn."}
                ]
                modules = [
                    {"step": "01", "name": "Cài đặt & Kích hoạt n8n", "desc": "Hướng dẫn tự cài n8n miễn phí trên máy tính cá nhân hoặc VPS chi phí 0đ."},
                    {"step": "02", "name": "Bộ Workflow Cào Tin Tức & RSS", "desc": "File JSON template dựng sẵn chỉ việc import và bấm kích hoạt."},
                    {"step": "03", "name": "Prompt Engineering Chuyên Sâu", "desc": "Cách tinh chỉnh prompt để bài viết tự nhiên, không bị gắn mác văn phong AI."},
                    {"step": "04", "name": "Tự Động Hóa Bán Hàng & Kiếm Tiền", "desc": "Chiến lược gắn link Affiliate và thu hút traffic tự nhiên từ Google."}
                ]
                testimonials = [
                    {"name": "Trần Minh Quân", "role": "Content Creator & Blogger", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Quan", "comment": "Quy trình n8n của Tự Học AI setup siêu nhanh. Trước đây mình mất 4 tiếng viết bài mỗi ngày, giờ hệ thống tự chạy đăng 15 bài/ngày."},
                    {"name": "Lê Thị Bích Ngọc", "role": "Kinh doanh Online", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ngoc", "comment": "Không biết code tí nào mà làm theo video hướng dẫn 20 phút là chạy mượt. Đáng đồng tiền bát gạo!"}
                ]
                bonus_items = [
                    "Bộ 500+ Prompt AI Chuẩn Thương Mại (Trị giá 499.000đ)",
                    "Template Tự Động Bắn Tin Nhắn Đơn Hàng Về Telegram Bot (Trị giá 299.000đ)",
                    "Quyền tham gia Nhóm Zalo Hỗ Trợ Kỹ Thuật VIP Trọn Đời (Vô giá)"
                ]

                cur.execute("""
                    INSERT INTO landing_pages (
                        id, slug, title, headline, subheadline, product_id, price, original_price,
                        hero_badge, features, modules, testimonials, bonus_items, cta_text, is_published
                    ) VALUES (
                        %s, 'n8n-tu-dong-hoa-kiem-tien', 
                        'Hệ Thống Tự Động Hóa n8n & AI - Xây Kênh & Kiếm Tiền Thụ Động 2026',
                        'Sở hữu Cỗ Máy Sáng Tạo Nội Dung & Tự Động Xuất Bản 24/7 Không Cần Viết Thủ Công',
                        'Được Tự Học AI đúc kết từ thực chiến xây dựng hệ sinh thái tự động hóa. Import template là chạy ngay trong 15 phút, không cần biết lập trình.',
                        '03fefa9b-5de0-491a-8b40-db5f9604a97c', 199000, 990000,
                        '✦ QUY TRÌNH THỰC CHIẾN ĐỘC QUYỀN TỰ HỌC AI',
                        %s, %s, %s, %s, '⚡ NHẬN TRỌN BỘ WORKFLOW NGAY (199K)', TRUE
                    )
                """, (
                    lp_id,
                    json.dumps(features, ensure_ascii=False),
                    json.dumps(modules, ensure_ascii=False),
                    json.dumps(testimonials, ensure_ascii=False),
                    json.dumps(bonus_items, ensure_ascii=False)
                ))
                print("Seeded showcase landing page 'n8n-tu-dong-hoa-kiem-tien'.")
            else:
                print("Showcase landing page already exists.")

            conn.commit()
    finally:
        conn.close()

if __name__ == '__main__':
    migrate()
