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
        cursor.execute("DESCRIBE products")
        cols = cursor.fetchall()
        print("COLUMNS IN products:")
        for c in cols:
            print(f" - {c['Field']} ({c['Type']})")
        cursor.execute("SELECT * FROM products LIMIT 5")
        rows = cursor.fetchall()
        print("SAMPLE ROWS:")
        for r in rows:
            print(r)
finally:
    conn.close()
