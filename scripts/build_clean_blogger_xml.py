import urllib.request
import json
import re
import sys
import xml.sax.saxutils as saxutils
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

BLOG_ID = "2562876275428955705"

print(f"=== BUILDING CLEAN BLOGGER XML (BLOG_ID={BLOG_ID}) ===")

# 1. Fetch Categories Map
req_cats = urllib.request.Request('https://workflowfree.com/wp-json/wp/v2/categories?per_page=100', headers={'User-Agent': 'Mozilla/5.0'})
cats = json.loads(urllib.request.urlopen(req_cats).read().decode('utf-8'))
cat_map = {c['id']: c['name'] for c in cats}

now_iso = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.000Z')

# Clean HTML content function
def clean_html_content(raw_html):
    # Remove wp-embedded iframes
    h = re.sub(r'<iframe class="wp-embedded-content"[^>]*>.*?</iframe>', '', raw_html, flags=re.DOTALL)
    h = re.sub(r'<iframe[^>]*embed[^>]*>.*?</iframe>', '', h, flags=re.DOTALL)
    # Remove blockquote wp-embedded-content
    h = re.sub(r'<blockquote class="wp-embedded-content"[^>]*>.*?</blockquote>', '', h, flags=re.DOTALL)
    # Remove scripts
    h = re.sub(r'<script[^>]*>.*?</script>', '', h, flags=re.DOTALL)
    # Fix http to https
    h = h.replace('http://', 'https://')
    # Fix CDATA closing
    h = h.replace(']]>', ']]]]><![CDATA[>')
    return h.strip()

# 2. Fetch Core Posts
core_cats = [11, 13, 14, 35, 12]
cat_str = ",".join(str(c) for c in core_cats)
url_core = f'https://workflowfree.com/wp-json/wp/v2/posts?categories={cat_str}&per_page=100&page=1&_embed=1'
req_c = urllib.request.Request(url_core, headers={'User-Agent': 'Mozilla/5.0'})
core_posts = json.loads(urllib.request.urlopen(req_c).read().decode('utf-8'))
print(f"Fetched {len(core_posts)} core posts.")

# 3. Fetch Image Prompts (50 posts)
url_p = 'https://workflowfree.com/wp-json/wp/v2/posts?categories=39&per_page=50&page=1&_embed=1'
req_p = urllib.request.Request(url_p, headers={'User-Agent': 'Mozilla/5.0'})
prompt_posts = json.loads(urllib.request.urlopen(req_p).read().decode('utf-8'))
print(f"Fetched {len(prompt_posts)} prompt posts.")

# 4. Fetch Products (17 products)
url_pr = 'https://workflowfree.com/wp-json/wp/v2/product?per_page=50&page=1&_embed=1'
req_pr = urllib.request.Request(url_pr, headers={'User-Agent': 'Mozilla/5.0'})
store_products = json.loads(urllib.request.urlopen(req_pr).read().decode('utf-8'))
print(f"Fetched {len(store_products)} store products.")

def format_entry(p_id, title_raw, slug, date_pub, content_html, category_terms, author="Xuân Linh"):
    title = (title_raw.replace('&amp;', '&').replace('&quot;', '"').replace('&#038;', '&')
             .replace('&#8211;', '–').replace('&#8217;', "'").replace('&#8220;', '“').replace('&#8221;', '”'))
    title_escaped = saxutils.escape(title, entities={"'": "&apos;", '"': "&quot;"})

    if not date_pub.endswith('Z') and '+' not in date_pub:
        date_pub += "+07:00"

    cat_tags = "\n".join([
        f"    <category scheme='http://www.blogger.com/atom/ns#' term='{saxutils.escape(t)}'/>"
        for t in category_terms if t
    ])

    return f"""  <entry>
    <id>tag:blogger.com,1999:blog-{BLOG_ID}.post-{p_id}</id>
    <published>{date_pub}</published>
    <updated>{date_pub}</updated>
    <category scheme='http://schemas.google.com/g/2005#kind' term='http://schemas.google.com/blogger/2008/kind#post'/>
{cat_tags}
    <title type='text'>{title_escaped}</title>
    <content type='html'><![CDATA[{content_html}]]></content>
    <link rel='alternate' type='text/html' href='http://nguyendangai.blogspot.com/{slug}.html' title='{title_escaped}'/>
    <author>
      <name>{saxutils.escape(author)}</name>
    </author>
  </entry>"""

def build_feed(entries_list, feed_title="Share Workflow Template Free"):
    return f"""<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns='http://www.w3.org/2005/Atom' xmlns:openSearch='http://a9.com/-/spec/opensearchrss/1.0/' xmlns:georss='http://www.georss.org/georss' xmlns:gd='http://schemas.google.com/g/2005' xmlns:thr='http://purl.org/syndication/thread/1.0'>
  <id>tag:blogger.com,1999:blog-{BLOG_ID}</id>
  <updated>{now_iso}</updated>
  <title type='text'>{saxutils.escape(feed_title)}</title>
  <link rel='http://schemas.google.com/g/2005#feed' type='application/atom+xml' href='http://nguyendangai.blogspot.com/feeds/posts/default'/>
  <link rel='self' type='application/atom+xml' href='http://nguyendangai.blogspot.com/feeds/posts/default'/>
  <link rel='alternate' type='text/html' href='http://nguyendangai.blogspot.com/'/>
  <author>
    <name>Xuân Linh</name>
  </author>
  <generator version='7.00' uri='http://www.blogger.com'>Blogger</generator>
{"\n".join(entries_list)}
</feed>"""

# --- Prepare Product Entries ---
product_entries = []
for p in store_products:
    p_id = p['id']
    title = p['title']['rendered']
    slug = p['slug']
    date_pub = p.get('date', now_iso)
    
    featured_img = ""
    if '_embedded' in p and 'wp:featuredmedia' in p['_embedded'] and p['_embedded']['wp:featuredmedia']:
        featured_img = p['_embedded']['wp:featuredmedia'][0].get('source_url', '')

    price_regular = "300.000 đ"
    price_sale = "199.000 đ"
    amount = "199000"
    memo = f"WF{p_id}"
    qr_url = f"https://img.vietqr.io/image/MB-0987654321-compact2.png?amount={amount}&addInfo={memo}&accountName=NGUYEN%20DANG"

    shop_card = f"""<div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin: 20px 0 30px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); font-family: 'Be Vietnam Pro', sans-serif;">
  <div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: center;">
    <div style="flex: 1 1 260px; text-align: center;">
      <img src="{featured_img}" alt="{saxutils.escape(title)}" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
    </div>
    <div style="flex: 1 1 320px;">
      <span style="background: #fef2f2; color: #ef4444; font-weight: 700; font-size: 12px; padding: 4px 12px; border-radius: 20px; border: 1px solid #fecaca; text-transform: uppercase;">🔥 Sản phẩm cao cấp</span>
      <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 12px 0 14px; line-height: 1.4;">{saxutils.escape(title)}</h2>
      <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px;">
        <span style="font-size: 26px; font-weight: 800; color: #4f46e5;">{price_sale}</span>
        <del style="font-size: 15px; color: #94a3b8; font-weight: 500;">{price_regular}</del>
        <span style="background: #e0e7ff; color: #4338ca; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 6px;">Ưu đãi</span>
      </div>
      <div style="background: #f8fafc; border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; border: 1px dashed #cbd5e1; font-size: 13.5px; line-height: 1.75;">
        <div style="color: #1e293b; font-weight: 600;">🎁 Quyền lợi khi mua Workflow:</div>
        <div>✅ Tải trọn bộ file JSON workflow n8n gốc</div>
        <div>✅ Kèm video hướng dẫn cài đặt & chạy thực tế</div>
        <div>✅ Hỗ trợ kích hoạt 1-1 qua Zalo/Telegram</div>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        <a href="{qr_url}" target="_blank" rel="noopener" style="flex: 1 1 180px; text-align: center; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; padding: 13px 18px; border-radius: 10px; font-weight: 700; font-size: 14.5px; text-decoration: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
          ⚡ QUÉT MÃ VIETQR ({price_sale})
        </a>
        <a href="https://zalo.me/0987654321" target="_blank" rel="noopener" style="flex: 1 1 130px; text-align: center; background: #0068ff; color: #ffffff; padding: 13px 16px; border-radius: 10px; font-weight: 700; font-size: 14px; text-decoration: none;">
          💬 Chat Zalo
        </a>
      </div>
    </div>
  </div>
  <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #f1f5f9; text-align: center;">
    <div style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Mã QR Chuyển khoản tự động (Mở app ngân hàng quét nhận link ngay):</div>
    <img src="{qr_url}" alt="Mã VietQR" style="max-width: 220px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 0 auto;" />
    <div style="font-size: 13.5px; color: #475569; margin-top: 8px;">Nội dung CK: <strong style="color: #4f46e5; background: #e0e7ff; padding: 2px 6px; border-radius: 4px;">{memo}</strong> | Số tiền: <strong style="color: #ef4444;">{price_sale}</strong></div>
  </div>
</div>"""

    raw_c = clean_html_content(p['content']['rendered'])
    content = shop_card + "\n\n<h3>Mô tả chi tiết sản phẩm:</h3>\n" + raw_c
    product_entries.append(format_entry(p_id, f"[Cửa Hàng] {title}", slug, date_pub, content, ['Cửa hàng', 'Sản phẩm n8n']))

# --- Prepare Core Posts Entries ---
core_entries = []
for p in core_posts:
    p_id = p['id']
    title = p['title']['rendered']
    slug = p['slug']
    date_pub = p.get('date', now_iso)
    
    p_cats = p.get('categories', [])
    category_terms = [cat_map.get(cid) for cid in p_cats if cid in cat_map]
    if not category_terms:
        category_terms = ['Template n8n']

    featured_img = ""
    if '_embedded' in p and 'wp:featuredmedia' in p['_embedded'] and p['_embedded']['wp:featuredmedia']:
        featured_img = p['_embedded']['wp:featuredmedia'][0].get('source_url', '')

    raw_c = clean_html_content(p['content']['rendered'])
    if featured_img and featured_img not in raw_c:
        img_html = f'<div class="separator" style="clear: both; text-align: center;"><img border="0" src="{featured_img}" alt="{saxutils.escape(title)}" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;" /></div><br/>'
        content = img_html + raw_c
    else:
        content = raw_c

    core_entries.append(format_entry(p_id, title, slug, date_pub, content, category_terms))

# --- Prepare Prompt Entries ---
prompt_entries = []
for p in prompt_posts:
    p_id = p['id']
    title = p['title']['rendered']
    slug = p['slug']
    date_pub = p.get('date', now_iso)

    featured_img = ""
    if '_embedded' in p and 'wp:featuredmedia' in p['_embedded'] and p['_embedded']['wp:featuredmedia']:
        featured_img = p['_embedded']['wp:featuredmedia'][0].get('source_url', '')

    raw_c = clean_html_content(p['content']['rendered'])
    if featured_img and featured_img not in raw_c:
        img_html = f'<div class="separator" style="clear: both; text-align: center;"><img border="0" src="{featured_img}" alt="{saxutils.escape(title)}" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;" /></div><br/>'
        content = img_html + raw_c
    else:
        content = raw_c

    prompt_entries.append(format_entry(p_id, title, slug, date_pub, content, ['Image Prompt']))

print(f"Prepared: {len(product_entries)} products, {len(core_entries)} core posts, {len(prompt_entries)} prompt posts.")

# 1. Export Products File
with open('docs/blogger/1-san-pham-ban-hang.xml', 'w', encoding='utf-8') as f:
    f.write(build_feed(product_entries, "Sản Phẩm Cửa Hàng n8n"))
print("Saved docs/blogger/1-san-pham-ban-hang.xml")

# 2. Export Core Posts Part A (46 posts)
with open('docs/blogger/2-workflow-n8n-phan-1.xml', 'w', encoding='utf-8') as f:
    f.write(build_feed(core_entries[:46], "Workflow n8n Phần 1"))
print("Saved docs/blogger/2-workflow-n8n-phan-1.xml")

# 3. Export Core Posts Part B (46 posts)
with open('docs/blogger/3-workflow-n8n-phan-2.xml', 'w', encoding='utf-8') as f:
    f.write(build_feed(core_entries[46:], "Workflow n8n Phần 2"))
print("Saved docs/blogger/3-workflow-n8n-phan-2.xml")

# 4. Export Prompt Posts (50 posts)
with open('docs/blogger/4-image-prompts.xml', 'w', encoding='utf-8') as f:
    f.write(build_feed(prompt_entries, "Image Prompt AI"))
print("Saved docs/blogger/4-image-prompts.xml")

# 5. Master Clean All-in-One
all_clean = product_entries + core_entries + prompt_entries
with open('docs/blogger/workflowfree-CLEAN-ALL.xml', 'w', encoding='utf-8') as f:
    f.write(build_feed(all_clean, "Share Workflow Template Free - Clean All"))
print(f"Saved docs/blogger/workflowfree-CLEAN-ALL.xml ({len(all_clean)} entries)")
