import pymysql
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

def inspect_docs_and_products():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            print("=== NỘI DUNG BẢNG internal_docs ===")
            cursor.execute("SELECT * FROM internal_docs")
            docs = cursor.fetchall()
            for d in docs:
                print(d)
                
            print("\n=== NỘI DUNG BẢNG products (TÀI LIỆU/KHÓA HỌC) ===")
            cursor.execute("SELECT id, title, slug, price, download_url, preview_url, type FROM products")
            prods = cursor.fetchall()
            for p in prods:
                print(p)
    finally:
        conn.close()

if __name__ == '__main__':
    inspect_docs_and_products()
