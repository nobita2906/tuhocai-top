import re
import sys
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

with open('docs/blogger/workflowfree-ALL-POSTS-AND-PRODUCTS.xml', 'r', encoding='utf-8') as f:
    content = f.read()

entries = re.findall(r'<entry>.*?</entry>', content, re.DOTALL)
print(f"Total entries: {len(entries)}")

dates = []
for idx, e in enumerate(entries):
    published = re.findall(r'<published>(.*?)</published>', e)[0]
    title = re.findall(r'<title type=[\'\"]text[\'\"]>(.*?)</title>', e)[0]
    dates.append((published, title))

dates.sort(key=lambda x: x[0], reverse=True)
print("Latest 10 dates:")
for d, t in dates[:10]:
    print(f"{d} : {t[:60]}")

print("\nOldest 5 dates:")
for d, t in dates[-5:]:
    print(f"{d} : {t[:60]}")
