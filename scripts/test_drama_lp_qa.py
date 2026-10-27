import urllib.request
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

urls = [
    ("Landing Page", "http://localhost:8899/lp/video-drama-gia-dinh-nho"),
    ("Trang Cảm Ơn", "http://localhost:8899/lp/video-drama-gia-dinh-nho/cam-on")
]

for name, url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            code = resp.getcode()
            html = resp.read().decode('utf-8', errors='ignore')
            has_err = 'Runtime Error' in html or 'Invalid src prop' in html
            print(f"[{'PASS' if code == 200 and not has_err else 'FAIL'}] {name} ({url})")
            print(f"       Code: {code} | HasError: {has_err} | Length: {len(html)} bytes")
    except Exception as e:
        print(f"[ERROR] {name}: {e}")
