import urllib.request, json, base64

TOKEN = '8884382661:AAH-CBsXMtrwBvQzR2Ko-hCnNjTVMqNBK_E'
CHAT_ID = '6580812076'

# Let's inspect the Telegram Bot updates to see what was received or sent!
url = f'https://api.telegram.org/bot{TOKEN}/getMe'
res = urllib.request.urlopen(url)
print('Bot status:', res.read().decode('utf-8'))
