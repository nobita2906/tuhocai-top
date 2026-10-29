import pymysql
import uuid
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DB_CONFIG = {
    'host': '103.127.195.56',
    'user': 'postgress_user',
    'password': 'Nvdang@1',
    'port': 3306,
    'database': 'tuhocai_top',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def migrate():
    print("Connecting to MySQL Database...")
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cur:
            # 1. Thêm cột vào bảng orders nếu chưa có
            cur.execute("""
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = 'tuhocai_top' AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'landing_slug'
            """)
            if not cur.fetchone():
                print("Adding landing_slug & utm columns to orders table...")
                cur.execute("""
                    ALTER TABLE orders
                    ADD COLUMN landing_slug VARCHAR(100) AFTER product_name,
                    ADD COLUMN utm_source VARCHAR(100) AFTER landing_slug,
                    ADD COLUMN utm_medium VARCHAR(100) AFTER utm_source,
                    ADD COLUMN utm_campaign VARCHAR(100) AFTER utm_medium,
                    ADD INDEX idx_landing_slug (landing_slug),
                    ADD INDEX idx_utm_source (utm_source);
                """)
                print("✓ Added landing_slug and utm columns to orders.")
            else:
                print("✓ Columns in orders table already exist.")

            # 2. Thêm cta_clicks vào landing_pages nếu chưa có
            cur.execute("""
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = 'tuhocai_top' AND TABLE_NAME = 'landing_pages' AND COLUMN_NAME = 'cta_clicks'
            """)
            if not cur.fetchone():
                print("Adding cta_clicks to landing_pages...")
                cur.execute("ALTER TABLE landing_pages ADD COLUMN cta_clicks INT DEFAULT 0 AFTER views;")
                print("✓ Added cta_clicks to landing_pages.")
            else:
                print("✓ cta_clicks already exists in landing_pages.")

            # 3. Tạo bảng landing_page_events
            print("Creating landing_page_events table...")
            cur.execute("""
                CREATE TABLE IF NOT EXISTS landing_page_events (
                    id VARCHAR(36) PRIMARY KEY,
                    landing_slug VARCHAR(100) NOT NULL,
                    event_type ENUM('PAGEVIEW', 'CTA_CLICK') NOT NULL,
                    utm_source VARCHAR(100),
                    utm_medium VARCHAR(100),
                    utm_campaign VARCHAR(100),
                    referrer VARCHAR(500),
                    user_agent VARCHAR(500),
                    ip_address VARCHAR(50),
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_lp_event (landing_slug, event_type, created_at),
                    INDEX idx_created_at (created_at)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """)
            print("✓ Created landing_page_events table.")

            # 4. Đảm bảo cả 3 Landing Page hiện tại có trong bảng landing_pages để thống kê đồng bộ
            lps_to_seed = [
                {
                    'slug': 'video-drama-gia-dinh-nho',
                    'title': 'Toàn Bộ Quy Trình Làm Video AI “Câu Chuyện Gia Đình Nhỏ”',
                    'headline': 'TOÀN BỘ QUY TRÌNH LÀM VIDEO AI “CÂU CHUYỆN GIA ĐÌNH NHỎ”',
                    'subheadline': 'Từ ý tưởng đến video triệu view thực chiến. Đóng gói đầy đủ prompt và kịch bản.',
                    'product_id': 'WF-DRAMA-069',
                    'price': 69000,
                    'original_price': 499000,
                    'cta_text': 'NHẬN TOÀN BỘ QUY TRÌNH (69K)',
                },
                {
                    'slug': 'video-ai-tu-1-anh',
                    'title': 'Làm Video Xây Dựng Thương Hiệu Bán Hàng Triệu View Từ 1 Ảnh',
                    'headline': 'LÀM VIDEO XÂY DỰNG THƯƠNG HIỆU BÁN HÀNG TRIỆU VIEW TỪ 1 ẢNH',
                    'subheadline': 'Biến 1 bức ảnh tĩnh thành cỗ máy video triệu view bán hàng tự động chuẩn studio.',
                    'product_id': 'WF-VIP-297',
                    'price': 297000,
                    'original_price': 1200000,
                    'cta_text': 'NHẬN QUY TRÌNH · 297.000Đ',
                },
                {
                    'slug': 'sao-chep-landing-page',
                    'title': 'Sao Chép Bất Kỳ Landing Page Chuyển Đổi Cao Bạn Muốn Chỉ Với 1 Click',
                    'headline': 'SAO CHÉP BẤT KÌ LANDING PAGE CHUYỂN ĐỔI CAO BẠN MUỐN CHỈ VỚI 1 CLICK',
                    'subheadline': 'Skill AI phân tích và tái tạo giống 99.99% trang gốc và cho phép chỉnh sửa tùy ý.',
                    'product_id': 'SKILL-CLONE-099',
                    'price': 99000,
                    'original_price': 499000,
                    'cta_text': 'NHẬN TOÀN BỘ QUY TRÌNH (99K)',
                }
            ]

            for lp in lps_to_seed:
                cur.execute("SELECT id FROM landing_pages WHERE slug = %s LIMIT 1", (lp['slug'],))
                res = cur.fetchone()
                if not res:
                    new_id = str(uuid.uuid4())
                    cur.execute("""
                        INSERT INTO landing_pages (id, slug, title, headline, subheadline, product_id, price, original_price, cta_text, is_published, views, cta_clicks, conversions)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, TRUE, 0, 0, 0)
                    """, (new_id, lp['slug'], lp['title'], lp['headline'], lp['subheadline'], lp['product_id'], lp['price'], lp['original_price'], lp['cta_text']))
                    print(f"✓ Seeded landing page record: {lp['slug']}")
                else:
                    print(f"✓ Landing page record exists: {lp['slug']}")

            conn.commit()
            print("MIGRATION COMPLETED SUCCESSFULLY 100%!")
    finally:
        conn.close()

if __name__ == '__main__':
    migrate()
