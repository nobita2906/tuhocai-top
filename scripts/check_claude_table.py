import urllib.request
import re

url = "http://localhost:8899/bai-viet/claude-37-sonnet-ra-mat-mo-hinh-ai-hybrid-dau-tien-tich-hop-kha-nang-suy-luan-sau"
html = urllib.request.urlopen(url).read().decode('utf-8')
m = re.findall(r'<table[^>]*>.*?</table>', html, re.DOTALL)
print(f"Table count: {len(m)}")
if not m:
    # Check if table markdown is present in the HTML raw
    pos = html.find("Claude 3.7 Sonnet (Anthropic)")
    print("Around position:", html[pos-100:pos+200] if pos != -1 else "Not found")
