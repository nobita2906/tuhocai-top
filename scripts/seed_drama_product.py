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

def seed_drama_product():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            pid = "WF-DRAMA-069"
            cursor.execute("SELECT id FROM products WHERE pid = %s OR slug = 'video-drama-gia-dinh-nho'", [pid])
            row = cursor.fetchone()
            if not row:
                prod_id = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO products (
                        id, pid, name, slug, description, content, price, original_price,
                        thumbnail, preview_url, download_url, category, is_active, sales_count
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 1, 42
                    )
                """, [
                    prod_id,
                    pid,
                    'Quy trình Video AI Câu Chuyện Gia Đình Nhỏ (Mini Drama 69K)',
                    'video-drama-gia-dinh-nho',
                    'Từ ý tưởng đến thành phẩm Mini Drama — quy trình thực chiến làm video AI triệu view chỉ bằng 1 ly trà sữa 69K.',
                    'Toàn bộ quy trình làm video AI Câu Chuyện Gia Đình Nhỏ từ Phước AI & Tự Học AI. Bao gồm prompt kịch bản, prompt hình ảnh Flux/Midjourney và quy trình tạo chuyển động video.',
                    69000,
                    499000,
                    '/sites/tuhocai-top/landing/drama/mini-drama-results-atm.png',
                    'https://videodramma.vercel.app/',
                    'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
                    'workflow'
                ])
                conn.commit()
                print("[THÀNH CÔNG] Đã thêm sản phẩm WF-DRAMA-069 vào bảng products!")
            else:
                print("[INFO] Sản phẩm WF-DRAMA-069 đã tồn tại trong database.")
    finally:
        conn.close()

if __name__ == '__main__':
    seed_drama_product()
