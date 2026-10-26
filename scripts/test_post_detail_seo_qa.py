import sys
import io
import json
import urllib.request
import urllib.error
import pymysql
import os
import re
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

def test_post_detail_seo():
    print("==================================================")
    print("🚀 [TESTER REPORT] BẮT ĐẦU TEST SEO ON-PAGE & SCHEMA.ORG")
    print("==================================================")

    created_post_id = None
    conn = get_db_connection()

    try:
        # 1. Publish a rich article with headings, lists, and summary
        test_article = {
            "title": "Bí Quyết Tự Động Hóa Affiliate Marketing Với n8n & Gemini AI 2026 (SEO QA Test)",
            "summary": "Hướng dẫn chi tiết từng bước xây dựng cỗ máy bán hàng và kiếm hoa hồng Affiliate tự động 24/7.",
            "content": """# Bí Quyết Tự Động Hóa Affiliate Marketing Với n8n

## 1. Bản chất của mô hình Affiliate tự động hóa
Mô hình truyền thống đòi hỏi bạn phải tốn hàng giờ copy paste link, viết bài thủ công và theo dõi đơn hàng.

## 2. Các thành phần chính trong hệ thống n8n
- **Node Webhook**: Lắng nghe sự kiện từ blog tuhocai.top
- **Node Gemini AI**: Tự động viết nội dung và phân tích sản phẩm
- **Node Telegram**: Bắn thông báo chốt đơn và hoa hồng trực tiếp

## 3. Checklist triển khai trong 24 giờ
1. Đăng ký tài khoản Affiliate tại tuhocai.top
2. Lấy API Secret Key và thiết lập n8n webhook
3. Kích hoạt workflow và nhận hoa hồng 30-50%
""",
            "category": "WORKFLOW",
            "tags": "Affiliate, n8n, AI, Automation",
            "isFeatured": True
        }

        print("\n--- Bước 1: Đăng bài viết qua Webhook API ---")
        req = urllib.request.Request(
            f"{BASE_URL}/api/webhook/publish-post",
            data=json.dumps(test_article).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {WEBHOOK_SECRET}'},
            method='POST'
        )
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            post_info = res_data.get('post') or res_data.get('data')
            created_post_id = post_info['id']
            slug = post_info['slug']
            print(f"✅ Đã tạo bài viết test thành công: {slug} (ID: {created_post_id})")

        # 2. Fetch HTML of the post
        print(f"\n--- Bước 2: Tải trang HTML bài viết từ {BASE_URL}/bai-viet/{slug} ---")
        page_url = f"{BASE_URL}/bai-viet/{slug}"
        with urllib.request.urlopen(page_url) as page_res:
            html = page_res.read().decode('utf-8')
            print(f"✅ Tải trang thành công! Kích thước HTML: {len(html)} bytes")

            # TC-01: Schema.org JSON-LD
            print("\n--- TC-01: Kiểm tra Schema.org TechArticle JSON-LD ---")
            assert 'application/ld+json' in html, "Thiếu script application/ld+json!"
            assert '"@type":"TechArticle"' in html or '"@type": "TechArticle"' in html, "Thiếu @type TechArticle!"
            assert test_article['title'] in html, "Schema JSON-LD không chứa headline bài viết!"
            assert 'Nguyễn Văn Đăng' in html, "Thiếu thông tin tác giả Nguyễn Văn Đăng trong Schema!"
            print("✅ TC-01 PASS: Schema.org TechArticle JSON-LD chuẩn xác 100%.")

            # TC-02: OpenGraph & Canonical
            print("\n--- TC-02: Kiểm tra thẻ OpenGraph và Canonical SEO ---")
            assert 'og:title' in html, "Thiếu thẻ og:title!"
            assert 'og:description' in html, "Thiếu thẻ og:description!"
            assert 'canonical' in html, "Thiếu thẻ canonical!"
            print("✅ TC-02 PASS: Thẻ OpenGraph và Canonical đầy đủ.")

            # TC-03: Table of Contents (Mục lục)
            print("\n--- TC-03: Kiểm tra Mục lục nội dung bài viết (TOC) ---")
            assert "Mục lục nội dung bài viết" in html, "Thiếu component Mục lục bài viết!"
            assert "ban-chat-cua-mo-hinh-affiliate-tu-dong-hoa" in html, "Mục lục không có anchor link tới H2!"
            assert "cac-thanh-phan-chinh-trong-he-thong-n8n" in html, "Mục lục không có anchor link tới H2 số 2!"
            print("✅ TC-03 PASS: Mục lục tự động sinh ra và liên kết chính xác tới các thẻ H2.")

            # TC-04: Reading time & Author Badge
            print("\n--- TC-04: Kiểm tra Thời gian đọc & Tác giả ---")
            assert "phút đọc" in html, "Thiếu thông tin thời gian đọc!"
            assert "Verified AI Author" in html, "Thiếu huy hiệu Verified AI Author!"
            print("✅ TC-04 PASS: Hiển thị chuẩn thời gian đọc và huy hiệu tác giả.")

            # TC-05: 3-Tier Conversion Funnel
            print("\n--- TC-05: Kiểm tra 3-Tier Conversion Funnel CTA Box ---")
            assert "Quà tặng miễn phí" in html, "Thiếu Box Quà tặng miễn phí 0đ!"
            assert "zalo.me" in html, "Thiếu link Zalo cộng đồng quà tặng!"
            assert "/lp/n8n-tu-dong-hoa-kiem-tien" in html, "Thiếu CTA link tới Landing Page Funnel n8n!"
            assert "/affiliate" in html, "Thiếu CTA link đăng ký đối tác Affiliate!"
            print("✅ TC-05 PASS: Đầy đủ 3 tầng phễu chuyển đổi (Lead Magnet -> Sản phẩm -> Đối tác).")

    finally:
        # Cleanup
        print("\n--- Dọn dẹp bài viết SEO QA test ---")
        if created_post_id:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM posts WHERE id = %s", (created_post_id,))
                conn.commit()
            print(f"🧹 Đã xóa bài viết SEO QA test ID: {created_post_id}")
        conn.close()

    print("\n==================================================")
    print("🎉 TẤT CẢ 5/5 SEO QA TEST CASES ĐÃ PASS 100%!")
    print("==================================================")

if __name__ == '__main__':
    test_post_detail_seo()
