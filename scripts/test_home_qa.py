import urllib.request
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def test_home():
    url = "http://localhost:8899/"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            code = resp.getcode()
            html = resp.read().decode('utf-8', errors='ignore')
            has_error = 'Invalid src prop' in html or 'Runtime Error' in html
            print(f"Status Code: {code}")
            print(f"Has Next.js Runtime Error: {has_error}")
            print(f"Contains 'Tự Học AI': {'Tự Học AI' in html or 'T&#x1EF1; H&#x1ECD;c AI' in html or 'TuHocAI' in html}")
            if not has_error and code == 200:
                print(">>> TRANG CHỦ LOCALHOST:8899 ĐÃ HOẠT ĐỘNG HOÀN HẢO! <<<")
            else:
                print(">>> VẪN CÒN LỖI TRANG CHỦ! <<<")
    except Exception as e:
        print(f"Request Error: {e}")

if __name__ == '__main__':
    test_home()
