import sys
import io
import json
import jwt
import requests
import os
from dotenv import load_dotenv

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
load_dotenv('.env')

BASE_URL = 'http://localhost:8899'
JWT_SECRET = os.getenv('JWT_SECRET', 'tuhocai-super-secret-jwt-token-2026-secure-key')

def test_admin_ai_writer():
    print("==================================================")
    print("🚀 [TESTER REPORT] BẮT ĐẦU TEST ANTI-SLOP AI AUTO WRITER V2")
    print("==================================================")

    # 1. Test unauthorized access
    print("\n--- TC-01: Kiểm tra bảo vệ quyền Admin (Chặn khi chưa đăng nhập) ---")
    res_unauth = requests.post(f"{BASE_URL}/api/admin/ai-generate-post", json={"topic": "Test"})
    assert res_unauth.status_code in [401, 403], f"Expected 401/403, got {res_unauth.status_code}"
    print(f"✅ TC-01 PASS: Chặn chuẩn {res_unauth.status_code} khi không có session Admin.")

    # 2. Tạo Admin Token
    admin_token = jwt.encode(
        {"id": "93f17bf0-79f7-499e-98fb-d64e3cab3d5d", "name": "Nguyễn Văn Đăng", "email": "dang@tuhocai.top", "role": "ADMIN"},
        JWT_SECRET,
        algorithm="HS256"
    )
    headers = {
        'Cookie': f'tuhocai_session={admin_token}',
        'Content-Type': 'application/json'
    }

    # 3. Test validation missing topic
    print("\n--- TC-02: Kiểm tra validation khi thiếu chủ đề (topic) ---")
    res_missing = requests.post(f"{BASE_URL}/api/admin/ai-generate-post", json={"topic": ""}, headers=headers)
    assert res_missing.status_code == 400, f"Expected 400, got {res_missing.status_code}"
    print("✅ TC-02 PASS: Validate chuẩn 400 khi thiếu topic.")

    # 4. Test generate post with Anti-Slop Content
    print("\n--- TC-03: Kiểm tra sinh bài viết chuẩn Anti-Slop Content ---")
    payload = {
        "topic": "Xây dựng hệ thống n8n tự động hóa marketing và bán hàng 2026",
        "category": "WORKFLOW",
        "tone": "Chuyên gia, thực chiến, cô đọng (Anti-AI Slop)"
    }
    res_gen = requests.post(f"{BASE_URL}/api/admin/ai-generate-post", json=payload, headers=headers)
    assert res_gen.status_code == 200, f"Expected 200, got {res_gen.status_code}"
    body = res_gen.json()
    assert body.get('success') is True, "Response success is false!"
    post_data = body.get('data')

    title = post_data.get('title')
    summary = post_data.get('summary')
    content = post_data.get('content')
    source = post_data.get('source')

    print(f"Tiêu đề bài viết: {title}")
    print(f"Engine xử lý: {source}")
    print(f"Độ dài bài viết: {len(content)} ký tự")

    # Anti-Slop Assertions
    assert "```markdown" in content or "```json" in content, "Nội dung thiếu khối Prompt/Code mẫu có thể copy-paste!"
    print("✅ Anti-Slop Check 1: Chứa khối Prompt/Code mẫu copyable.")

    assert "| Tiêu chí |" in content or "| Bước |" in content or "| --- |" in content, "Nội dung thiếu Bảng so sánh thực chiến!"
    print("✅ Anti-Slop Check 2: Chứa Bảng so sánh chuẩn Markdown.")

    assert "Lỗi thường gặp & Cách khắc phục" in content or "Troubleshooting" in content, "Nội dung thiếu mục Troubleshooting!"
    print("✅ Anti-Slop Check 3: Chứa mục Lỗi thường gặp & Cách khắc phục.")

    assert "https://zalo.me/g/tuhocai" in content, "Nội dung thiếu backlink Nhóm Zalo VIP Tự Học AI!"
    assert "/lp/n8n-tu-dong-hoa-kiem-tien" in content, "Nội dung thiếu anchor phễu Landing Page n8n!"
    assert "/affiliate" in content, "Nội dung thiếu anchor đối tác Affiliate!"
    print("✅ Anti-Slop Check 4: Gắn trọn vẹn 3 tầng Backlink phễu chuyển đổi nội bộ.")

    print("\n==================================================")
    print("🎉 TẤT CẢ 3/3 AI WRITER V2 TEST CASES ĐÃ PASS 100%!")
    print("==================================================")

if __name__ == '__main__':
    test_admin_ai_writer()
