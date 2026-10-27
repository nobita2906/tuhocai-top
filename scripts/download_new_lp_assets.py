import urllib.request
import os

VIP_DIR = r"d:\ai-website-cloner-template\public\sites\tuhocai-top\landing\video-vip"
COPY_DIR = r"d:\ai-website-cloner-template\public\sites\tuhocai-top\landing\copy-lp"

os.makedirs(VIP_DIR, exist_ok=True)
os.makedirs(COPY_DIR, exist_ok=True)

# 1. Tải ảnh videoaivip
vip_assets = [
    ("ket-qua-video.jpg", "https://videoaivip.vercel.app/assets/ket-qua-video.jpg"),
]

for filename, url in vip_assets:
    dest = os.path.join(VIP_DIR, filename)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, timeout=15).read()
        with open(dest, "wb") as f:
            f.write(data)
        print(f"[OK] Downloaded {filename} ({len(data)} bytes)")
    except Exception as e:
        print(f"[ERROR] Failed {filename}: {e}")

print("Assets downloaded successfully!")
