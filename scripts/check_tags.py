import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('docs/blogger/workflowfree-ALL-POSTS-AND-PRODUCTS.xml', 'r', encoding='utf-8') as f:
    content = f.read()

iframes = re.findall(r'<iframe[^>]*>', content)
scripts = re.findall(r'<script[^>]*>', content)
videos = re.findall(r'<video[^>]*>', content)

print(f"Total iframes found in posts: {len(iframes)}")
print(f"Total scripts found in posts: {len(scripts)}")
print(f"Total videos found in posts: {len(videos)}")

if iframes:
    print("Sample iframe:", iframes[0])
