import urllib.request
import time
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def check_live():
    url = "https://www.tuhocai.top/"
    print(f"Đang kiểm tra website trực tiếp tại {url}...")
    for attempt in range(1, 7):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=15) as resp:
                code = resp.getcode()
                html = resp.read().decode('utf-8', errors='ignore')
                has_err = 'Invalid src prop' in html or 'Runtime Error' in html
                print(f"[Attempt {attempt}] Code: {code} | HasError: {has_err}")
                if code == 200 and not has_err:
                    print(">>> LIVE PRODUCTION DEPLOYED VÀ HOẠT ĐỘNG HOÀN TOÀN TỐT! <<<")
                    return True
        except Exception as e:
            print(f"[Attempt {attempt}] Error: {e}")
        time.sleep(5)
    return False

if __name__ == '__main__':
    check_live()
