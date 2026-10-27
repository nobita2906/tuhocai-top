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

def check_all_tables():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            print("DANH SÁCH BẢNG TRONG DATABASE tuhocai_top:")
            for t in tables:
                table_name = list(t.values())[0]
                cursor.execute(f"SELECT COUNT(*) as cnt FROM `{table_name}`")
                cnt = cursor.fetchone()['cnt']
                print(f" - {table_name}: {cnt} bản ghi")
    finally:
        conn.close()

if __name__ == '__main__':
    check_all_tables()
