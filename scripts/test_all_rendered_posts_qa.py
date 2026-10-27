import urllib.request
import json
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

SLUGS = [
    'phim-ai-odyssey-cua-grok-7-phut-danh-gia-ky-thuat-quy-trinh-tao-video-ai',
    'claude-37-sonnet-ra-mat-mo-hinh-ai-hybrid-dau-tien-tich-hop-kha-nang-suy-luan-sau',
    'huong-dan-tu-dong-hoa-dang-bai-da-kenh-bang-n8n-khong-can-thue-server-dat-tien',
    'top-10-ky-nang-skills-can-co-de-lam-chu-ai-trong-nam-2026',
    'bo-50-prompt-toi-uu-cho-cursor-ai-github-copilot-giup-code-nhanh-gap-5-lan'
]

def test_localhost():
    print("=== KIỂM THỬ RENDER TẤT CẢ 5 BÀI VIẾT TRÊN LOCALHOST:8899 ===")
    all_ok = True
    for slug in SLUGS:
        url = f"http://localhost:8899/bai-viet/{slug}"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'QA-Tester/1.0'})
            with urllib.request.urlopen(req, timeout=10) as resp:
                code = resp.getcode()
                html = resp.read().decode('utf-8', errors='ignore')
                
                # Kiểm tra các thành phần quan trọng trong HTML
                has_h1 = '<h1' in html
                has_code = '<code' in html or 'pre' in html
                has_table = '<table' in html or 'table' in html
                has_author = 'Nguyễn Văn Đăng' in html or 'Nguy&#x1EC7;n V&#x103;n &#x110;&#x103;ng' in html or 'Nguyen Van Dang' in html
                has_drive = '1TuhocAI_FreeResources_2026' in html
                
                status = "PASS" if code == 200 and has_h1 and has_drive else "FAIL"
                if status == "FAIL": all_ok = False
                
                print(f"[{status}] {slug[:45]}...")
                print(f"       Code: {code} | H1: {has_h1} | Code block: {has_code} | Table: {has_table} | Drive link: {has_drive}")
        except Exception as e:
            print(f"[ERROR] {slug}: {e}")
            all_ok = False
            
    print("-" * 60)
    print(f"KẾT QUẢ TỔNG THỂ: {'100% HOÀN HẢO' if all_ok else 'CÓ LỖI CẦN FIX'}")

if __name__ == '__main__':
    test_localhost()
