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

def inspect_details():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, title, slug, content FROM posts ORDER BY created_at DESC")
            posts = cursor.fetchall()
            for p in posts:
                print(f"=== {p['title']} ({p['slug']}) ===")
                print(p['content'])
                print("\n" + "="*80 + "\n")
    finally:
        conn.close()

if __name__ == '__main__':
    inspect_details()
