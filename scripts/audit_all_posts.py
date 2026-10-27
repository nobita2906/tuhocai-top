import pymysql
import json
import re
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

def audit():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, title, slug, summary, content, category, tags, thumbnail, is_published, created_at FROM posts ORDER BY created_at DESC")
            posts = cursor.fetchall()
            
            print(f"=== TỔNG SỐ BÀI VIẾT TRONG DATABASE: {len(posts)} ===")
            print("-" * 80)
            
            for i, p in enumerate(posts, 1):
                content = p.get('content', '') or ''
                title = p.get('title', '')
                slug = p.get('slug', '')
                cat = p.get('category', '')
                tags = p.get('tags', '')
                
                # Phân tích cấu trúc
                has_code = '```' in content
                has_table = '|' in content and '---' in content
                has_author = 'Nguyễn Đăng' in content or 'Nguyễn Văn Đăng' in content
                has_zalo = 'zalo.me' in content
                has_courses = '/khoa-hoc' in content or 'khoa-hoc' in content
                
                # Tìm các link tải tài liệu / drive / download / github / notion / mega
                download_links = re.findall(r'(https?://(?:drive\.google\.com|docs\.google\.com|github\.com|notion\.so|mega\.nz|t\.me|zalo\.me|mediafire\.com|dropbox\.com)[^\s\)\"\'>]+)', content)
                all_links = re.findall(r'\[([^\]]+)\]\((https?://[^\)]+)\)', content)
                
                print(f"[{i}] ID: {p['id']}")
                print(f"    TIÊU ĐỀ: {title}")
                print(f"    SLUG: {slug}")
                print(f"    DANH MỤC: {cat} | TAGS: {tags}")
                print(f"    ĐỘ DÀI NỘI DUNG: {len(content)} ký tự")
                print(f"    CHECK CẤU TRÚC:")
                print(f"      - Khối Code (```): {'CÓ' if has_code else 'KHÔNG'}")
                print(f"      - Bảng Markdown: {'CÓ' if has_table else 'KHÔNG'}")
                print(f"      - Tác giả định danh: {'CÓ' if has_author else 'KHÔNG'}")
                print(f"      - Phễu Zalo: {'CÓ' if has_zalo else 'KHÔNG'}")
                print(f"      - Phễu Khóa học: {'CÓ' if has_courses else 'KHÔNG'}")
                print(f"    LINK TÀI LIỆU/EXTERNAL ({len(download_links)}): {download_links[:5]}")
                print(f"    TẤT CẢ LINK MARKDOWN ({len(all_links)}):")
                for text, link in all_links[:6]:
                    print(f"        + [{text}] -> {link}")
                print("-" * 80)
    finally:
        conn.close()

if __name__ == '__main__':
    audit()
