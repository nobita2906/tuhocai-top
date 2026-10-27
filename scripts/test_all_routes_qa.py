import urllib.request

routes = [
    '/',
    '/bai-viet',
    '/san-pham',
    '/affiliate',
    '/bai-viet/phim-ai-odyssey-cua-grok-7-phut-danh-gia-ky-thuat-quy-trinh-tao-video-ai',
    '/bai-viet/claude-37-sonnet-ra-mat-mo-hinh-ai-hybrid-dau-tien-tich-hop-kha-nang-suy-luan-sau',
    '/bai-viet/huong-dan-tu-dong-hoa-dang-bai-da-kenh-bang-n8n-khong-can-thue-server-dat-tien',
    '/bai-viet/top-10-ky-nang-skills-can-co-de-lam-chu-ai-trong-nam-2026',
    '/bai-viet/bo-50-prompt-toi-uu-cho-cursor-ai-github-copilot-giup-code-nhanh-gap-5-lan'
]

for r in routes:
    url = f"http://localhost:8899{r}"
    try:
        resp = urllib.request.urlopen(url, timeout=10)
        html = resp.read().decode('utf-8', errors='ignore')
        has_err = 'Invalid src prop' in html or 'Runtime Error' in html
        print(f"[{'PASS' if not has_err and resp.status == 200 else 'FAIL'}] {r} (Code: {resp.status}, HasError: {has_err})")
    except Exception as e:
        print(f"[ERROR] {r}: {e}")
