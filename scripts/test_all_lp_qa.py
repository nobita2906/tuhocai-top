import urllib.request
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

pages = [
    ("Drama Landing Page", "http://localhost:8899/lp/video-drama-gia-dinh-nho"),
    ("Drama Cảm Ơn", "http://localhost:8899/lp/video-drama-gia-dinh-nho/cam-on"),
    ("Video 1 Ảnh Landing Page", "http://localhost:8899/lp/video-ai-tu-1-anh"),
    ("Video 1 Ảnh Cảm Ơn", "http://localhost:8899/lp/video-ai-tu-1-anh/cam-on"),
    ("Copy LP Landing Page", "http://localhost:8899/lp/sao-chep-landing-page"),
    ("Copy LP Cảm Ơn", "http://localhost:8899/lp/sao-chep-landing-page/cam-on"),
]

all_pass = True
for name, url in pages:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            code = resp.getcode()
            html = resp.read().decode('utf-8', errors='ignore')
            has_err = 'Runtime Error' in html or 'Invalid src prop' in html
            has_vib = '0934434101' in html or 'VIB' in html
            status = "PASS" if code == 200 and not has_err else "FAIL"
            if status == "FAIL": all_pass = False
            print(f"[{status}] {name} ({url})")
            print(f"       Code: {code} | HasError: {has_err} | HasVIB: {has_vib} | Length: {len(html)} bytes")
    except Exception as e:
        print(f"[ERROR] {name}: {e}")
        all_pass = False

print("-" * 60)
print(f"KẾT QUẢ TỔNG QUAN: {'100% HOÀN HẢO' if all_pass else 'CẦN KIỂM TRA LẠI'}")
