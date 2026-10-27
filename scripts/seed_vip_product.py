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

def seed_vip_video():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            pid = "WF-VIP-297"
            cursor.execute("SELECT id FROM products WHERE pid = %s OR slug = 'video-ai-tu-1-anh'", [pid])
            row = cursor.fetchone()
            if not row:
                prod_id = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO products (
                        id, pid, name, slug, description, content, price, original_price,
                        thumbnail, preview_url, download_url, category, is_active, sales_count
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 1, 88
                    )
                """, [
                    prod_id,
                    pid,
                    'Khóa Học & Quy Trình Làm Video AI Bán Hàng Triệu View Từ 1 Ảnh',
                    'video-ai-tu-1-anh',
                    'Biến 1 Bức Ảnh Tĩnh Thành Cỗ Máy Video Triệu View Bán Hàng Tự Động. Quy trình độc quyền từ Nguyễn Đăng AI.',
                    'Trọn bộ quy trình làm video AI từ một bức ảnh tĩnh: kịch bản, giọng đọc, khẩu hình AI, bối cảnh studio chuyên nghiệp.',
                    297000,
                    1200000,
                    '/sites/tuhocai-top/landing/video-vip/ket-qua-video.jpg',
                    'https://videoaivip.vercel.app/',
                    'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
                    'workflow'
                ])
                conn.commit()
                print("[THÀNH CÔNG] Đã thêm sản phẩm WF-VIP-297 vào database!")
            else:
                print("[INFO] Sản phẩm WF-VIP-297 đã có trong database.")
    finally:
        conn.close()

if __name__ == '__main__':
    seed_vip_video()
