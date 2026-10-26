import urllib.request
import json
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

url = 'https://www.tuhocai.top/bai-viet/phim-ai-odyssey-cua-grok-7-phut-danh-gia-ky-thuat-quy-trinh-tao-video-ai'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req, timeout=10) as res:
        html = res.read().decode('utf-8')
        print(f"HTTP Status: {res.status}")
        print(f"Total HTML Size: {len(html)} bytes ({round(len(html)/1024, 2)} KB)")
        
        # 1. Title & Meta
        title_m = re.search(r'<title>(.*?)</title>', html)
        print(f"Page Title: {title_m.group(1) if title_m else 'None'}")
        
        meta_desc = re.search(r'<meta name="description" content="(.*?)"', html)
        print(f"Meta Description: {meta_desc.group(1) if meta_desc else 'None'}")

        # 2. Schema.org JSON-LD
        schema_m = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
        if schema_m:
            schema_data = json.loads(schema_m.group(1))
            print(f"Schema.org Type: {schema_data.get('@type')}")
            print(f"Schema.org Headline: {schema_data.get('headline')}")
            print(f"Schema.org Author: {schema_data.get('author', {}).get('name')}")
            print(f"Schema.org Publisher: {schema_data.get('publisher', {}).get('name')}")
        else:
            print("Schema.org: NOT FOUND")

        # 3. Features
        has_toc = 'Mục lục nội dung bài viết' in html
        has_readtime = 'phút đọc' in html
        has_lead_magnet = 'Quà tặng miễn phí' in html
        has_funnel_lp = '/lp/n8n-tu-dong-hoa-kiem-tien' in html
        has_affiliate = '/affiliate' in html
        has_zalo = 'https://zalo.me/g/tuhocai' in html

        print(f"Table of Contents (Mục lục): {'YES' if has_toc else 'NO'}")
        print(f"Reading Time Calculation: {'YES' if has_readtime else 'NO'}")
        print(f"Lead Magnet 0đ Box: {'YES' if has_lead_magnet else 'NO'}")
        print(f"Landing Page Funnel Link: {'YES' if has_funnel_lp else 'NO'}")
        print(f"Affiliate Partner Link: {'YES' if has_affiliate else 'NO'}")
        print(f"Zalo Community Link: {'YES' if has_zalo else 'NO'}")

        # 4. Headings
        h2s = re.findall(r'<h2[^>]*>(.*?)</h2>', html)
        print(f"Total H2 Headings: {len(h2s)}")
        for i, h in enumerate(h2s, 1):
            clean_h = re.sub(r'<[^>]+>', '', h).strip()
            print(f"  {i}. {clean_h}")

        # 5. Table & Code block presence
        has_table = '<table' in html or '|' in html
        has_code = '<pre>' in html or '<code' in html or 'class="language-' in html
        print(f"Markdown Comparison Table: {'YES' if has_table else 'NO'}")
        print(f"Code / Prompt Block: {'YES' if has_code else 'NO'}")

except Exception as e:
    print(f"Audit Error: {e}")
