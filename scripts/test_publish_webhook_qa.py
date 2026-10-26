import sys
import io
import json
import urllib.request
import urllib.error
import pymysql
import os
from dotenv import load_dotenv

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
load_dotenv('.env')

DB_CONFIG = {
    'host': os.getenv('DB_HOST', '103.127.195.56'),
    'user': os.getenv('DB_USER', 'postgress_user'),
    'password': os.getenv('DB_PASSWORD', 'Nvdang@1'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'database': os.getenv('DB_NAME', 'tuhocai_top'),
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}
WEBHOOK_SECRET = os.getenv('WEBHOOK_SECRET', 'tuhocai-auto-publish-secret-key-2026')

BASE_URL = 'http://localhost:8899'

def get_db_connection():
    return pymysql.connect(**DB_CONFIG)

def test_publish_webhook():
    print("==================================================")
    print("🚀 [TESTER REPORT] BẮT ĐẦU TEST WEBHOOK PUBLISH POST")
    print("==================================================")
    
    created_post_ids = []
    conn = get_db_connection()

    # Pre-clean any leftover QA posts
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM posts WHERE title LIKE '%(QA Test)%' OR title LIKE '%(QA Test Query Param)%'")
        conn.commit()
    
    try:
        # TC-01: Unauthorized access (no token)
        print("\n--- TC-01: Kiểm tra chặn truy cập khi thiếu hoặc sai Token ---")
        req = urllib.request.Request(f"{BASE_URL}/api/webhook/publish-post", data=json.dumps({"title": "Test"}).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='POST')
        try:
            urllib.request.urlopen(req)
            print("❌ TC-01 FAILED: Mong đợi 401 nhưng API trả về 200!")
            assert False
        except urllib.error.HTTPError as e:
            assert e.code == 401, f"Expected 401, got {e.code}"
            print(f"✅ TC-01 PASS: Chặn chuẩn 401 Unauthorized khi không có Token.")

        # TC-01b: Unauthorized access with wrong token
        req_wrong = urllib.request.Request(
            f"{BASE_URL}/api/webhook/publish-post",
            data=json.dumps({"title": "Test"}).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'Authorization': 'Bearer wrong-secret-key'},
            method='POST'
        )
        try:
            urllib.request.urlopen(req_wrong)
            print("❌ TC-01b FAILED: Mong đợi 401 nhưng API trả về 200!")
            assert False
        except urllib.error.HTTPError as e:
            assert e.code == 401, f"Expected 401, got {e.code}"
            print(f"✅ TC-01b PASS: Chặn chuẩn 401 Unauthorized khi truyền sai Token.")

        # TC-02: Missing fields (title or content)
        print("\n--- TC-02: Kiểm tra validation thiếu title hoặc content ---")
        req_missing = urllib.request.Request(
            f"{BASE_URL}/api/webhook/publish-post",
            data=json.dumps({"content": "Nội dung mà không có tiêu đề"}).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {WEBHOOK_SECRET}'},
            method='POST'
        )
        try:
            urllib.request.urlopen(req_missing)
            print("❌ TC-02 FAILED: Mong đợi 400 nhưng trả về 200!")
            assert False
        except urllib.error.HTTPError as e:
            assert e.code == 400, f"Expected 400, got {e.code}"
            print(f"✅ TC-02 PASS: Validate chuẩn 400 Bad Request khi thiếu title.")

        # TC-03: Publish valid post via Bearer Token
        print("\n--- TC-03: Đăng bài tự động thành công (Bearer Token) ---")
        post_data_1 = {
            "title": "Hướng dẫn ứng dụng n8n tự động hóa doanh nghiệp từ A-Z 2026 (QA Test)",
            "summary": "Tài liệu thực chiến giúp bạn xây dựng hệ thống tự động hóa kinh doanh không cần biết code.",
            "content": """# Hướng dẫn ứng dụng n8n tự động hóa doanh nghiệp

## 1. Tại sao n8n là vũ khí tối thượng năm 2026?
Tự động hóa giúp doanh nghiệp tiết kiệm 80% thời gian xử lý thủ công.

## 2. Quy trình 4 bước thực hiện
- Bước 1: Thu thập lead từ Webhook
- Bước 2: Tự động phân loại bằng AI Gemini
- Bước 3: Đồng bộ vào Google Sheet và CRM
- Bước 4: Bắn thông báo chốt sale tức thì qua Telegram

> Lưu ý: Hãy bảo mật Webhook Secret để tránh bị spam dữ liệu.

Tải workflow mẫu tại: https://tuhocai.top/san-pham
""",
            "category": "WORKFLOW",
            "tags": "n8n, Tu Dong Hoa, AI, SEO",
            "isFeatured": True
        }
        req_valid = urllib.request.Request(
            f"{BASE_URL}/api/webhook/publish-post",
            data=json.dumps(post_data_1).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {WEBHOOK_SECRET}'},
            method='POST'
        )
        with urllib.request.urlopen(req_valid) as res:
            assert res.status == 200
            res_body = json.loads(res.read().decode('utf-8'))
            print("Response:", res_body)
            assert res_body.get('success') is True
            post_info = res_body.get('post') or res_body.get('data')
            post_id_1 = post_info['id']
            slug_1 = post_info['slug']
            created_post_ids.append(post_id_1)
            print(f"✅ TC-03 PASS: Đăng bài thành công! ID: {post_id_1}, Slug: {slug_1}")

            # Verify in Database
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM posts WHERE id = %s", (post_id_1,))
                db_post = cursor.fetchone()
                assert db_post is not None, "Bài viết không tìm thấy trong DB!"
                assert db_post['category'] == 'WORKFLOW'
                assert db_post['is_published'] == 1
                assert db_post['is_featured'] == 1
                print("✅ Verify DB: Dữ liệu lưu chính xác 100% vào bảng posts.")

        # TC-04: Test Collision Resolver (Trùng tiêu đề -> slug tự thêm -1)
        print("\n--- TC-04: Kiểm tra chống trùng slug (Auto Collision Resolver) ---")
        req_dup = urllib.request.Request(
            f"{BASE_URL}/api/webhook/publish-post",
            data=json.dumps(post_data_1).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {WEBHOOK_SECRET}'},
            method='POST'
        )
        with urllib.request.urlopen(req_dup) as res:
            assert res.status == 200
            res_dup_body = json.loads(res.read().decode('utf-8'))
            dup_info = res_dup_body.get('post') or res_dup_body.get('data')
            post_id_2 = dup_info['id']
            slug_2 = dup_info['slug']
            created_post_ids.append(post_id_2)
            assert slug_2 == f"{slug_1}-1", f"Slug trùng lặp không được đánh số chuẩn: {slug_2} vs {slug_1}-1"
            print(f"✅ TC-04 PASS: Tự động phát hiện trùng slug và sinh mã an toàn: {slug_2}")

        # TC-05: Test Query Param Token (?token=...)
        print("\n--- TC-05: Kiểm tra xác thực qua Query Parameter (?token=...) ---")
        post_data_3 = {
            "title": "Prompt ChatGPT viết content chuẩn SEO E-E-A-T (QA Test Query Param)",
            "content": "Tổng hợp prompt thực chiến cho anh em làm Affiliate và Content Creator."
        }
        req_query_token = urllib.request.Request(
            f"{BASE_URL}/api/webhook/publish-post?token={WEBHOOK_SECRET}",
            data=json.dumps(post_data_3).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req_query_token) as res:
            assert res.status == 200
            res_query_body = json.loads(res.read().decode('utf-8'))
            q_info = res_query_body.get('post') or res_query_body.get('data')
            post_id_3 = q_info['id']
            created_post_ids.append(post_id_3)
            print(f"✅ TC-05 PASS: Query Param Token hợp lệ, đăng bài thành công ID: {post_id_3}")

    finally:
        # TC-06: Clean up QA test posts
        print("\n--- Dọn dẹp dữ liệu bài viết QA test ---")
        if created_post_ids:
            with conn.cursor() as cursor:
                format_strings = ','.join(['%s'] * len(created_post_ids))
                cursor.execute(f"DELETE FROM posts WHERE id IN ({format_strings})", tuple(created_post_ids))
                conn.commit()
            print(f"🧹 Đã xóa {len(created_post_ids)} bài viết mẫu tạo trong quá trình test.")
        conn.close()

    print("\n==================================================")
    print("🎉 TẤT CẢ 5/5 TEST CASES ĐÃ PASS 100%!")
    print("==================================================")

if __name__ == '__main__':
    test_publish_webhook()
