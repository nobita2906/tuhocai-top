import pymysql
import uuid
import csv
import re
import hashlib

DB_CONFIG = {
    'host': '103.127.195.56',
    'user': 'postgress_user',
    'password': 'Nvdang@1',
    'port': 3306,
    'database': 'tuhocai_top',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def to_slug(s):
    s = s.lower()
    s = re.sub(r'[àáạảãâầấậẩẫăằắặẳẵ]', 'a', s)
    s = re.sub(r'[èéẹẻẽêềếệểễ]', 'e', s)
    s = re.sub(r'[ìíịỉĩ]', 'i', s)
    s = re.sub(r'[òóọỏõôồốộổỗơờớợởỡ]', 'o', s)
    s = re.sub(r'[ùúụủũưừứựửữ]', 'u', s)
    s = re.sub(r'[ỳýỵỷỹ]', 'y', s)
    s = re.sub(r'[đ]', 'd', s)
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'[\s-]+', '-', s).strip('-')
    return s

def seed():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cur:
            # 1. Admin user
            admin_id = str(uuid.uuid4())
            admin_email = 'dang@tuhocai.top'
            # Simple sha256 or bcrypt hash
            admin_pass_hash = hashlib.sha256('Admin@123456'.encode('utf-8')).hexdigest()
            cur.execute("""
                INSERT INTO users (id, name, email, password_hash, role)
                VALUES (%s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE name=VALUES(name), role='ADMIN';
            """, (admin_id, 'Nguyễn Văn Đăng (Admin)', admin_email, admin_pass_hash, 'ADMIN'))

            # 2. Seed main flagship product WF-THAI-099
            cur.execute("""
                INSERT INTO products (id, pid, name, slug, description, price, original_price, category, is_active, sales_count)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE price=VALUES(price), name=VALUES(name);
            """, (
                str(uuid.uuid4()),
                'WF-THAI-099',
                'Workflow n8n Tự Động Đăng Bài Đa Kênh (Facebook, Telegram, WordPress)',
                'workflow-n8n-tu-dong-dang-bai-da-kenh',
                'Hệ thống tự động hóa n8n giúp lên lịch, tạo nội dung bằng AI và tự động đăng bài đa kênh không giới hạn.',
                99000,
                299000,
                'workflow',
                True,
                15
            ))

            # 3. Read and seed products-database.csv
            with open('docs/blogger/automation/products-database.csv', 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    pid = row['pid'].strip()
                    name = row['name'].strip()
                    price = int(row['price'].strip() or 0)
                    cat_raw = row['category'].strip().lower()
                    cat = 'workflow' if 'workflow' in cat_raw else ('prompt' if 'prompt' in cat_raw else 'skill')
                    desc = row['description'].strip()
                    slug = to_slug(name)

                    cur.execute("""
                        INSERT INTO products (id, pid, name, slug, description, price, original_price, category, is_active)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), category=VALUES(category);
                    """, (
                        str(uuid.uuid4()),
                        pid,
                        name,
                        slug,
                        desc,
                        price,
                        price * 2 if price > 0 else 99000,
                        cat,
                        True
                    ))

            # 4. Seed initial AI articles (Tin tức & Hướng dẫn)
            sample_posts = [
                {
                    'title': 'Claude 3.7 Sonnet Ra Mắt: Mô Hình AI Hybrid Đầu Tiên Tích Hợp Khả Năng Suy Luận Sâu',
                    'category': 'NEWS',
                    'summary': 'Anthropic vừa chính thức công bố Claude 3.7 Sonnet với khả năng lập trình vượt trội và tư duy suy luận thích ứng theo từng câu hỏi.',
                    'tags': 'Claude, Anthropic, Tin tức AI',
                    'content': '<h2>Claude 3.7 Sonnet: Bước nhảy vọt về khả năng lập trình</h2><p>Claude 3.7 Sonnet là mô hình đầu tiên kết hợp cả hai chế độ: phản hồi tức thì và suy luận mở rộng (hybrid reasoning model). Điều này cho phép lập trình viên tự động hóa các tác vụ phức tạp với độ chính xác chưa từng có.</p>'
                },
                {
                    'title': 'Hướng Dẫn Tự Động Hóa Đăng Bài Đa Kênh Bằng n8n Không Cần Thuê Server Đắt Tiền',
                    'category': 'WORKFLOW',
                    'summary': 'Cách kết hợp n8n và OpenAI API để xây dựng hệ thống tự động quét tin tức, viết bài chuẩn SEO và đăng lên mạng xã hội hoàn toàn tự động.',
                    'tags': 'n8n, Tự động hóa, Workflow',
                    'content': '<h2>Quy trình thiết lập n8n tự động đăng bài</h2><p>Với n8n tự host, bạn có thể tiết kiệm hàng triệu đồng mỗi tháng so với các nền tảng Zapier hay Make. Bài viết này hướng dẫn chi tiết cách cấu hình node Webhook, node OpenAI và node Telegram Bot.</p>'
                },
                {
                    'title': 'Bộ 50+ Prompt Tối Ưu Cho Cursor AI & GitHub Copilot Giúp Code Nhanh Gấp 5 Lần',
                    'category': 'PROMPT',
                    'summary': 'Tổng hợp các cấu trúc câu lệnh prompt thực chiến dành cho lập trình viên khi sử dụng IDE AI để debug, refactor và sinh code sạch.',
                    'tags': 'Prompt, Cursor, Copilot, Lập trình',
                    'content': '<h2>Cấu trúc Prompt chuẩn cho AI Coding</h2><p>Để AI hiểu chính xác ngữ cảnh dự án, bạn cần cung cấp định dạng rõ ràng bao gồm Context, Task, Constraints và Desired Output.</p>'
                },
                {
                    'title': 'Top 10 Kỹ Năng (Skills) Cần Có Để Làm Chủ AI Trong Năm 2026',
                    'category': 'SKILL',
                    'summary': 'Khám phá các kỹ năng mới từ Prompt Engineering nâng cao đến Agentic Workflows giúp bạn không bị thay thế trong kỷ nguyên AI.',
                    'tags': 'Skill, Kỹ năng AI, Phát triển bản thân',
                    'content': '<h2>Thời đại của Agentic AI</h2><p>Không chỉ dừng lại ở chatbot hỏi-đáp, xu hướng hiện nay là xây dựng các AI Agent có khả năng tự suy luận, tự gọi công cụ và hoàn thành mục tiêu độc lập.</p>'
                }
            ]

            for p in sample_posts:
                slug = to_slug(p['title'])
                cur.execute("""
                    INSERT INTO posts (id, slug, title, summary, content, category, tags, is_featured, is_published, views)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE title=VALUES(title), summary=VALUES(summary);
                """, (
                    str(uuid.uuid4()),
                    slug,
                    p['title'],
                    p['summary'],
                    p['content'],
                    p['category'],
                    p['tags'],
                    True,
                    True,
                    120
                ))

            conn.commit()
            print("Successfully seeded MySQL database with products, articles, and admin account!")

    finally:
        conn.close()

if __name__ == '__main__':
    seed()
