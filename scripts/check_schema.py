import urllib.request
import re
import json
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

url = 'https://www.tuhocai.top/bai-viet/phim-ai-odyssey-cua-grok-7-phut-danh-gia-ky-thuat-quy-trinh-tao-video-ai'
html = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8')
m = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
for i, s in enumerate(m):
    try:
        data = json.loads(s)
        print(f"Script #{i+1} @type: {data.get('@type')}")
        if data.get('@type') == 'TechArticle':
            print("  Headline:", data.get('headline'))
            print("  Author:", data.get('author'))
            print("  Publisher:", data.get('publisher'))
            print("  Keywords:", data.get('keywords'))
    except Exception as e:
        print(f"Error parsing script #{i+1}: {e}")
