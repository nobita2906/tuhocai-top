import pymysql

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
        cursor.execute("SELECT content FROM posts WHERE slug = 'claude-37-sonnet-ra-mat-mo-hinh-ai-hybrid-dau-tien-tich-hop-kha-nang-suy-luan-sau'")
        c = cursor.fetchone()['content']
        # Escape <think> to `<think>`
        c = c.replace("thẻ <think>", "thẻ `<think>`")
        cursor.execute("UPDATE posts SET content = %s WHERE slug = 'claude-37-sonnet-ra-mat-mo-hinh-ai-hybrid-dau-tien-tich-hop-kha-nang-suy-luan-sau'", [c])
    conn.commit()
    print("Fixed <think> tag!")
finally:
    conn.close()
