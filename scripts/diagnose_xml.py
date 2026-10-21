import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('docs/blogger/workflowfree-ALL-POSTS-AND-PRODUCTS.xml', 'r', encoding='utf-8') as f:
    content = f.read()

entries = re.findall(r'<entry>.*?</entry>', content, re.DOTALL)
print(f"Total entries in master XML: {len(entries)}")

# Check dates, IDs, and tags
ids = []
dates = []
for idx, e in enumerate(entries):
    eid = re.findall(r'<id>(.*?)</id>', e)
    published = re.findall(r'<published>(.*?)</published>', e)
    title = re.findall(r'<title type=[\'\"]text[\'\"]>(.*?)</title>', e)
    t = title[0] if title else "NO TITLE"
    p = published[0] if published else "NO DATE"
    i = eid[0] if eid else "NO ID"
    ids.append(i)
    dates.append(p)
    if 'Trọn bộ quy trình n8n Lookbook' in t:
        print(f"Found product Lookbook at entry #{idx}: ID={i}, published={p}")
    if 'Quy trình ghép mặt, thay mặt' in t:
        print(f"Found product Ghép mặt at entry #{idx}: ID={i}, published={p}")

print(f"Unique IDs: {len(set(ids))} / {len(ids)}")
print(f"Sample dates: {dates[:5]}")
print(f"Sample last dates: {dates[-5:]}")
