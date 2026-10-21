import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('docs/blogger/workflowfree-ALL-POSTS-AND-PRODUCTS.xml', 'r', encoding='utf-8') as f:
    content = f.read()

entries = re.findall(r'<entry>.*?</entry>', content, re.DOTALL)

print("--- ENTRY 0 (NOT IMPORTED) ---")
print(entries[0][:500])
print("...")
print(entries[0][-300:])

print("\n--- ENTRY 198 (IMPORTED) ---")
print(entries[198][:500])
print("...")
print(entries[198][-300:])
