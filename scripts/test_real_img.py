import urllib.request, json

TOKEN = '8884382661:AAH-CBsXMtrwBvQzR2Ko-hCnNjTVMqNBK_E'
CHAT_ID = '6580812076'

# Download real image bytes
img_req = urllib.request.urlopen('https://workflowfree.com/wp-content/uploads/2026/08/anh-bia-1024x574.png')
img_bytes = img_req.read()

boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
body = []

body.append(f'--{boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n{CHAT_ID}\r\n')
body.append(f'--{boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\nTest Real Photo Binary Upload\r\n')

body_bytes = ''.join(body).encode('utf-8')
file_header = f'--{boundary}\r\nContent-Disposition: form-data; name="photo"; filename="bienlai.png"\r\nContent-Type: image/png\r\n\r\n'.encode('utf-8')
file_footer = f'\r\n--{boundary}--\r\n'.encode('utf-8')

full_payload = body_bytes + file_header + img_bytes + file_footer

req = urllib.request.Request(
    f'https://api.telegram.org/bot{TOKEN}/sendPhoto',
    data=full_payload,
    headers={'Content-Type': f'multipart/form-data; boundary={boundary}'}
)

try:
    res = urllib.request.urlopen(req, timeout=15)
    print('Telegram sendPhoto result:', res.read().decode('utf-8'))
except Exception as e:
    print('Telegram sendPhoto error:', e)
    if hasattr(e, 'read'):
        print('Error body:', e.read().decode('utf-8'))
