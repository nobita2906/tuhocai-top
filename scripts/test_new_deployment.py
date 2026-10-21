import urllib.request
import json
import base64

NEW_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxEFiTb3JO611CQLAhA8hvtkV0UygU40AKMXR3KmHDt2R-cHcGpwZALc-_3nk2OhZ0lkQ/exec'

# Read sample image and convert to base64
with open('docs/assets/star-history.png', 'rb') as f:
    img_b64 = base64.b64encode(f.read()).decode('utf-8')

payload = {
    'action': 'paid_order_upload',
    'email': 'khachhang.demo@tuhocai.top',
    'name': 'Nguyễn Văn Đăng (Test Live)',
    'pid': 'WF-THAI-099',
    'productName': 'Workflow n8n Tự Động Đăng Bài Đa Kênh',
    'price': 99000,
    'imageBase64': 'data:image/png;base64,' + img_b64,
    'mimeType': 'image/png'
}

print("Sending request to:", NEW_WEBAPP_URL)
req = urllib.request.Request(
    NEW_WEBAPP_URL,
    data=json.dumps(payload).encode('utf-8'),
    headers={'Content-Type': 'text/plain;charset=utf-8'}
)

try:
    resp = urllib.request.urlopen(req)
    raw = resp.read().decode('utf-8')
    print("Response raw:", raw.encode('ascii', 'backslashreplace').decode('ascii'))
except Exception as e:
    print("Error:", e)
