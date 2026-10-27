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

def step1_clean_duplicate_and_fix_post2():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            # 1. Xóa bài số 1 trùng lặp
            dup_id = "818b130f-2132-4b92-a04d-af58ae9e5405"
            cursor.execute("DELETE FROM posts WHERE id = %s", [dup_id])
            print(f"[THÀNH CÔNG] Đã xóa bài viết trùng lặp (ID: {dup_id})")

            # 2. Cập nhật bài số 2: chuẩn hóa các khối code bằng ```json và ```markdown + thêm link tải drive
            post2_id = "62863ad6-4410-4c0d-bf3a-781316dfa964"
            cursor.execute("SELECT content FROM posts WHERE id = %s", [post2_id])
            row = cursor.fetchone()
            if row:
                content = row['content']
                # Sửa khối json thiếu backticks
                content = content.replace("json\n{\n  \"nodes\": [", "```json\n{\n  \"nodes\": [")
                content = content.replace("    }\n  ]\n}\n\n\n### Prompt Template", "    }\n  ]\n}\n```\n\n### Prompt Template")
                # Sửa khối markdown prompt template thiếu backticks
                content = content.replace("markdown\n[Camera Angle]: Low-angle", "```markdown\n[Camera Angle]: Low-angle")
                content = content.replace("frame warping, sudden character transformation\n\n\n---", "frame warping, sudden character transformation\n```\n\n---")
                
                # Bổ sung link tải Google Drive tài nguyên video AI miễn phí
                if "1TuhocAI_FreeResources_2026" not in content:
                    drive_block = "\n* **Tải Trọn Bộ Template Prompt & Workflow Video AI (Drive 0đ):** [Truy cập kho tài nguyên Google Drive](https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing)\n"
                    content = content.replace("* **Nhận tài liệu & Workflow AI miễn phí:**", drive_block + "* **Nhận tài liệu & Workflow AI miễn phí:**")
                
                cursor.execute("UPDATE posts SET content = %s WHERE id = %s", [content, post2_id])
                print(f"[THÀNH CÔNG] Đã chuẩn hóa khối code và link tải Drive cho bài 2 (ID: {post2_id})")
        
        conn.commit()
    finally:
        conn.close()

if __name__ == '__main__':
    step1_clean_duplicate_and_fix_post2()
