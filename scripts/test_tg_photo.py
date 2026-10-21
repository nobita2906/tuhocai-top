import urllib.request
import urllib.error
import json
import base64
import io

TOKEN = '8884382661:AAH-CBsXMtrwBvQzR2Ko-hCnNjTVMqNBK_E'
CHAT_ID = '6580812076'

# Let's test with a real sample image from the workspace!
# Let's see if there is an image in public or scripts or docs
import os
sample_img = None
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith(('.png', '.jpg', '.jpeg', '.webp')) and not 'node_modules' in root and not '.git' in root:
            sample_img = os.path.join(root, f)
            break
    if sample_img:
        break

print("Using sample image:", sample_img)
if sample_img:
    with open(sample_img, 'rb') as f:
        img_bytes = f.read()
else:
    # Minimal 100x100 PNG
    img_bytes = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')

boundary = '----TelegramFormBoundary7MA4YWxkTrZu0gW'
body = io.BytesIO()

def add_field(name, value):
    body.write(f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'.encode('utf-8'))

inline_kb = {
    "inline_keyboard": [
        [
            {"text": "✅ DUYỆT (Gửi Link)", "callback_data": "appr:TEST01"},
            {"text": "❌ TỪ CHỐI (Báo Lỗi)", "callback_data": "rejc:TEST01"}
        ]
    ]
}

add_field('chat_id', CHAT_ID)
add_field('caption', '🧪 <b>Test Ảnh Biên Lai Thực Tế</b>\nMã: #TEST01\nKhách: Nguyễn Văn Đăng')
add_field('parse_mode', 'HTML')
add_field('reply_markup', json.dumps(inline_kb))

body.write(f'--{boundary}\r\nContent-Disposition: form-data; name="photo"; filename="receipt.png"\r\nContent-Type: image/png\r\n\r\n'.encode('utf-8'))
body.write(img_bytes)
body.write(f'\r\n--{boundary}--\r\n'.encode('utf-8'))

req = urllib.request.Request(
    f'https://api.telegram.org/bot{TOKEN}/sendPhoto',
    data=body.getvalue(),
    headers={'Content-Type': f'multipart/form-data; boundary={boundary}'}
)

try:
    resp = urllib.request.urlopen(req)
    res_data = json.loads(resp.read().decode('utf-8'))
    print("SEND PHOTO SUCCESS! Message ID:", res_data['result']['message_id'])
except urllib.error.HTTPError as e:
    err_body = e.read().decode('utf-8')
    print("SEND PHOTO HTTP ERROR:", e.code, err_body)
except Exception as e:
    print("SEND PHOTO EXCEPTION:", str(e))
