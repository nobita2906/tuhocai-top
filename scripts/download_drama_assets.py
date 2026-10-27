import urllib.request
import os

DEST_DIR = r"d:\ai-website-cloner-template\public\sites\tuhocai-top\landing\drama"
os.makedirs(DEST_DIR, exist_ok=True)

ASSETS = [
    ("phuoc-avatar.png", "https://videodramma.vercel.app/assets/phuoc-avatar.png"),
    ("atm-community-logo.png", "https://videodramma.vercel.app/assets/atm-community-logo.png"),
    ("mini-drama-results-atm.png", "https://videodramma.vercel.app/assets/mini-drama-results-atm.png"),
    ("tra-sua.png", "https://videodramma.vercel.app/assets/tra-sua.png"),
    ("qr-techcombank-phuoc.jpg", "https://videodramma.vercel.app/assets/qr-techcombank-phuoc.jpg"),
    ("qr-zalo-phuoc.jpg", "https://videodramma.vercel.app/assets/qr-zalo-phuoc.jpg"),
]

for filename, url in ASSETS:
    dest_path = os.path.join(DEST_DIR, filename)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, timeout=15).read()
        with open(dest_path, "wb") as f:
            f.write(data)
        print(f"[OK] Downloaded {filename} ({len(data)} bytes)")
    except Exception as e:
        print(f"[ERROR] Failed {filename}: {e}")
