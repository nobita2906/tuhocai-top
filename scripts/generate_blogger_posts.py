import urllib.request
import json
import re
import sys
import xml.sax.saxutils as saxutils
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

print("Fetching categories...")
req_cats = urllib.request.Request('https://workflowfree.com/wp-json/wp/v2/categories?per_page=100', headers={'User-Agent': 'Mozilla/5.0'})
cats = json.loads(urllib.request.urlopen(req_cats).read().decode('utf-8'))
cat_map = {c['id']: c['name'] for c in cats}
print(f"Loaded {len(cat_map)} categories: {cat_map}")

# 1. Fetch core workflow & guide posts
posts = []
categories_to_fetch = [11, 13, 14, 35, 12]
cat_str = ",".join(str(c) for c in categories_to_fetch)
url_core = f'https://workflowfree.com/wp-json/wp/v2/posts?categories={cat_str}&per_page=100&_embed=1'
print(f"Fetching core posts from {url_core}...")
req = urllib.request.Request(url_core, headers={'User-Agent': 'Mozilla/5.0'})
core_posts = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
posts.extend(core_posts)
print(f"Fetched {len(core_posts)} core posts.")

# 2. Fetch recent 30 image prompts
try:
    url_prompts = 'https://workflowfree.com/wp-json/wp/v2/posts?categories=39&per_page=30&_embed=1'
    print(f"Fetching 30 image prompt posts...")
    req_p = urllib.request.Request(url_prompts, headers={'User-Agent': 'Mozilla/5.0'})
    prompt_posts = json.loads(urllib.request.urlopen(req_p).read().decode('utf-8'))
    posts.extend(prompt_posts)
    print(f"Fetched {len(prompt_posts)} image prompt posts.")
except Exception as e:
    print(f"Error fetching prompts: {e}")

print(f"Total posts to export: {len(posts)}")

# Build Blogger Atom XML
entries_xml = []
now_iso = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.000Z')

for p in posts:
    post_id = p['id']
    title = p['title']['rendered']
    # decode HTML entities in title
    title = title.replace('&amp;', '&').replace('&quot;', '"').replace('&#038;', '&').replace('&#8211;', '–').replace('&#8217;', "'")
    title_escaped = saxutils.escape(title, entities={"'": "&apos;", '"': "&quot;"})
    
    slug = p['slug']
    date_published = p.get('date', now_iso)
    if not date_published.endswith('Z') and '+' not in date_published:
        date_published += "+07:00"
    date_modified = p.get('modified', date_published)
    if not date_modified.endswith('Z') and '+' not in date_modified:
        date_modified += "+07:00"

    author_name = "Xuân Linh"
    if '_embedded' in p and 'author' in p['_embedded'] and p['_embedded']['author']:
        author_name = p['_embedded']['author'][0].get('name', 'Xuân Linh')

    # Categories
    p_cats = p.get('categories', [])
    category_terms = [cat_map.get(cid) for cid in p_cats if cid in cat_map]
    if not category_terms:
        category_terms = ['Workflow n8n']

    category_tags = "\n".join([
        f"    <category scheme='http://www.blogger.com/atom/ns#' term='{saxutils.escape(t)}'/>"
        for t in category_terms if t
    ])

    # Featured image
    featured_img_url = ""
    if '_embedded' in p and 'wp:featuredmedia' in p['_embedded'] and p['_embedded']['wp:featuredmedia']:
        featured_img_url = p['_embedded']['wp:featuredmedia'][0].get('source_url', '')

    raw_content = p['content']['rendered']
    
    # Prepend featured image if not already in content
    if featured_img_url and featured_img_url not in raw_content:
        img_html = f'<div class="separator" style="clear: both; text-align: center;"><img border="0" src="{featured_img_url}" alt="{saxutils.escape(title)}" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;" /></div><br/>'
        content = img_html + raw_content
    else:
        content = raw_content

    # Fix CDATA closing if present
    content = content.replace(']]>', ']]]]><![CDATA[>')

    entry = f"""  <entry>
    <id>tag:blogger.com,1999:blog-workflowfree.post-{post_id}</id>
    <published>{date_published}</published>
    <updated>{date_modified}</updated>
    <category scheme='http://schemas.google.com/g/2005#kind' term='http://schemas.google.com/blogger/2008/kind#post'/>
{category_tags}
    <title type='text'>{title_escaped}</title>
    <content type='html'><![CDATA[{content}]]></content>
    <link rel='alternate' type='text/html' href='http://workflowfree.blogspot.com/{slug}.html' title='{title_escaped}'/>
    <author>
      <name>{saxutils.escape(author_name)}</name>
    </author>
  </entry>"""
    entries_xml.append(entry)

blogger_feed = f"""<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns='http://www.w3.org/2005/Atom' xmlns:openSearch='http://a9.com/-/spec/opensearchrss/1.0/' xmlns:georss='http://www.georss.org/georss' xmlns:gd='http://schemas.google.com/g/2005' xmlns:thr='http://purl.org/syndication/thread/1.0'>
  <id>tag:blogger.com,1999:blog-workflowfree</id>
  <updated>{now_iso}</updated>
  <title type='text'>Share Workflow Template Free - n8n Automation and Ai Agents</title>
  <subtitle type='html'>Share Workflow Automation Template n8n io Free</subtitle>
  <link rel='http://schemas.google.com/g/2005#feed' type='application/atom+xml' href='http://workflowfree.blogspot.com/feeds/posts/default'/>
  <link rel='self' type='application/atom+xml' href='http://workflowfree.blogspot.com/feeds/posts/default'/>
  <link rel='alternate' type='text/html' href='http://workflowfree.blogspot.com/'/>
  <author>
    <name>Xuân Linh</name>
  </author>
  <generator version='7.00' uri='http://www.blogger.com'>Blogger</generator>
{"\n".join(entries_xml)}
</feed>"""

out_path = 'docs/blogger/workflowfree-blogger-posts.xml'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(blogger_feed)

print(f"Successfully generated {out_path} with {len(posts)} posts!")
