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

def seed_copy_lp_product():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            pid = "SKILL-CLONE-099"
            cursor.execute("SELECT id FROM products WHERE pid = %s OR slug = 'sao-chep-landing-page'", [pid])
            row = cursor.fetchone()
            if not row:
                prod_id = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO products (
                        id, pid, name, slug, description, content, price, original_price,
                        thumbnail, preview_url, download_url, category, is_active, sales_count
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 1, 99
                    )
                """, [
                    prod_id,
                    pid,
                    'Skill AI Sao Chép Bất Kỳ Landing Page Chuyển Đổi Cao Với 1 Click (99K)',
                    'sao-chep-landing-page',
                    'Chỉ cần gửi link sale page bạn muốn sao chép, Skill AI này sẽ tái tạo trang giống 99,99% trang gốc và chỉnh sửa tùy ý thần tốc.',
                    'Trọn bộ Skill AI Clone Landing Page + Video hướng dẫn thực chiến từng bước từ Nguyễn Đăng AI. Kích hoạt trực tiếp vào tài khoản email trên tuhocai.top.',
                    99000,
                    699000,
                    '/sites/tuhocai-top/landing/drama/mini-drama-results-atm.png',
                    'https://copylandingpage.vercel.app/',
                    'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
                    'skill'
                ])
                conn.commit()
                print("[THÀNH CÔNG] Đã thêm sản phẩm SKILL-CLONE-099 vào database!")
            else:
                print("[INFO] Sản phẩm SKILL-CLONE-099 đã tồn tại.")
    finally:
        conn.close()

if __name__ == '__main__':
    seed_copy_lp_product()
