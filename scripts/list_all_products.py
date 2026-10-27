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

conn = pymysql.connect(**DB_CONFIG)
try:
    with conn.cursor() as cursor:
        cursor.execute("SELECT pid, name, slug, price, download_url, category FROM products")
        for p in cursor.fetchall():
            print(f"[{p['pid']}] {p['name']} | Giá: {p['price']} | Link: {p['download_url']}")
finally:
    conn.close()
