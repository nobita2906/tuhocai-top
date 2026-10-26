import urllib.request
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

url = 'https://www.tuhocai.top/bai-viet/phim-ai-odyssey-cua-grok-7-phut-danh-gia-ky-thuat-quy-trinh-tao-video-ai'
html = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8')

# Find content inside article body
content_m = re.search(r'<div class="prose[^"]*"[^>]*>(.*?)</div>\s*<div class="pt-6 border-t', html, re.DOTALL)
if content_m:
    raw_html = content_m.group(1)
    print("Content HTML length:", len(raw_html))
    print("\n--- PHÂN ĐOẠN ĐẦU TIÊN CỦA BÀI VIẾT ---")
    clean = re.sub(r'<[^>]+>', ' ', raw_html)
    clean = re.sub(r'\s+', ' ', clean).strip()
    print(clean[:1500])
else:
    print("Could not isolate article content container!")
