import pymysql
import uuid
import json
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

def seed_landing_page():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            slug = "video-drama-gia-dinh-nho"
            cursor.execute("SELECT id FROM landing_pages WHERE slug = %s", [slug])
            row = cursor.fetchone()
            if not row:
                lp_id = str(uuid.uuid4())
                features = [
                    {"title": "Toàn bộ quy trình làm video AI Câu Chuyện Gia Đình Nhỏ", "desc": "Từ kịch bản cảm động, prompt Flux/Midjourney đến tạo video trên Luma/Kling."},
                    {"title": "Hướng dẫn thực chiến từng bước", "desc": "Dễ dàng làm theo ngay cả với người chưa từng tiếp xúc công nghệ dựng phim AI."},
                    {"title": "Cách triển khai dạng Mini Drama triệu view", "desc": "Công thức giữ chân người xem và xây kênh 11 ngày 44 video đạt 427K follow."},
                    {"title": "Nhận nội dung trực tiếp qua Zalo & Drive", "desc": "Mở khóa toàn bộ file mẫu ngay sau khi chuyển khoản 1 ly trà sữa 69K."}
                ]
                modules = [
                    {"title": "Module 1: Ý Tưởng & Kịch Bản Cảm Xúc", "desc": "Prompt tạo kịch bản drama gia đình chạm đến trái tim người xem."},
                    {"title": "Module 2: Tạo Nhân Vật Nhất Quán Bằng AI", "desc": "Kỹ thuật cố định gương mặt và phong cách nhân vật gia đình qua các phân cảnh."},
                    {"title": "Module 3: Biến Ảnh Thành Video Chuyển Động Điện Ảnh", "desc": "Sử dụng Kling AI / Luma Dream Machine với câu lệnh camera mượt mà."},
                    {"title": "Module 4: Lồng Tiếng, Âm Thanh & Xuất Bản Triệu View", "desc": "Ghép giọng đọc AI truyền cảm, âm nhạc xúc động và tối ưu thuật toán TikTok/Reels."}
                ]
                cursor.execute("""
                    INSERT INTO landing_pages (
                        id, slug, title, headline, subheadline, product_id, price, original_price,
                        hero_badge, features, modules, cta_text, is_published, views, conversions
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 1, 128, 42
                    )
                """, [
                    lp_id,
                    slug,
                    'Quy trình Video AI Câu Chuyện Gia Đình Nhỏ — PHƯỚC AI & TỰ HỌC AI',
                    'Toàn bộ quy trình làm video AI “Câu chuyện gia đình nhỏ”',
                    'Từ ý tưởng đến thành phẩm Mini Drama — quy trình thực chiến để bạn tự làm được dạng video này.',
                    'WF-DRAMA-069',
                    69000,
                    499000,
                    'VIDEO AI THỰC CHIẾN #ATM & TỰ HỌC AI',
                    json.dumps(features, ensure_ascii=False),
                    json.dumps(modules, ensure_ascii=False),
                    '⚡ NHẬN TOÀN BỘ QUY TRÌNH (69K)',
                ])
                conn.commit()
                print("[THÀNH CÔNG] Đã thêm landing_pages record cho video-drama-gia-dinh-nho!")
            else:
                print("[INFO] Landing page đã tồn tại trong database.")
    finally:
        conn.close()

if __name__ == '__main__':
    seed_landing_page()
