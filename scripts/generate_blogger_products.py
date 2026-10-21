import urllib.request
import json
import re
import sys
import xml.sax.saxutils as saxutils
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

print("Fetching products from store...")
req = urllib.request.Request('https://workflowfree.com/wp-json/wp/v2/product?per_page=30&_embed=1', headers={'User-Agent': 'Mozilla/5.0'})
products = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
print(f"Fetched {len(products)} products from REST API.")

entries_xml = []
now_iso = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.000Z')

for p in products:
    p_id = p['id']
    title = p['title']['rendered']
    title = title.replace('&amp;', '&').replace('&quot;', '"').replace('&#038;', '&').replace('&#8211;', '–').replace('&#8217;', "'").replace('&#8220;', '“').replace('&#8221;', '”')
    title_escaped = saxutils.escape(title, entities={"'": "&apos;", '"': "&quot;"})
    slug = p['slug']
    date_pub = p.get('date', now_iso)
    if not date_pub.endswith('Z') and '+' not in date_pub:
        date_pub += "+07:00"

    # Featured image
    featured_img = ""
    if '_embedded' in p and 'wp:featuredmedia' in p['_embedded'] and p['_embedded']['wp:featuredmedia']:
        featured_img = p['_embedded']['wp:featuredmedia'][0].get('source_url', '')

    price_regular = "300.000 đ"
    price_sale = "199.000 đ"
    amount_clean = "199000"

    # Build Product Card & VietQR Checkout HTML
    box_template = """
<div class="shop-product-box" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin: 20px 0 32px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); font-family: 'Be Vietnam Pro', sans-serif;">
  <div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: center;">
    <div style="flex: 1 1 280px; text-align: center;">
      <img src="__IMG__" alt="__TITLE__" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
    </div>
    <div style="flex: 1 1 340px;">
      <span style="background: #fef2f2; color: #ef4444; font-weight: 700; font-size: 12px; padding: 4px 12px; border-radius: 20px; border: 1px solid #fecaca; text-transform: uppercase;">
        🔥 Sản phẩm cao cấp
      </span>
      <h2 style="font-size: 21px; font-weight: 800; color: #0f172a; margin: 12px 0 14px; line-height: 1.4;">
        __TITLE__
      </h2>
      <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 18px;">
        <span style="font-size: 26px; font-weight: 800; color: #4f46e5;">__PRICE_SALE__</span>
        <del style="font-size: 15px; color: #94a3b8; font-weight: 500;">__PRICE_REG__</del>
        <span style="background: #e0e7ff; color: #4338ca; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 6px;">Ưu đãi</span>
      </div>
      <div style="background: #f8fafc; border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; border: 1px dashed #cbd5e1; font-size: 13.5px; line-height: 1.75;">
        <div style="color: #1e293b; font-weight: 600;">🎁 Quyền lợi khi mua Workflow:</div>
        <div>✅ Tải trọn bộ file JSON workflow n8n gốc</div>
        <div>✅ Kèm video hướng dẫn cài đặt & chạy thực tế</div>
        <div>✅ Hỗ trợ kích hoạt và hướng dẫn 1-1 qua Zalo</div>
        <div>✅ Cập nhật trọn đời khi có phiên bản mới</div>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        <button onclick="openVietQRModal('__TITLE_JS__', '__AMOUNT__', 'WF__ID__')" style="flex: 1 1 180px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; border: none; padding: 13px 18px; border-radius: 10px; font-weight: 700; font-size: 14.5px; cursor: pointer; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
          ⚡ MUA NGAY (VIETQR)
        </button>
        <a href="https://zalo.me/0987654321" target="_blank" rel="noopener" style="flex: 1 1 140px; text-align: center; background: #0068ff; color: #ffffff; padding: 13px 16px; border-radius: 10px; font-weight: 700; font-size: 14px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px;">
          💬 Chat Zalo
        </a>
      </div>
    </div>
  </div>
</div>

<!-- POPUP THANH TOÁN VIETQR -->
<div id="vietqrModal" style="display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px); z-index: 99999; justify-content: center; align-items: center; padding: 16px;">
  <div style="background: #ffffff; border-radius: 16px; max-width: 440px; width: 100%; padding: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); position: relative; max-height: 90vh; overflow-y: auto;">
    <button onclick="closeVietQRModal()" style="position: absolute; right: 16px; top: 14px; background: none; border: none; font-size: 24px; color: #64748b; cursor: pointer;">&times;</button>
    <div style="text-align: center; margin-bottom: 16px;">
      <h3 style="font-size: 19px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">Thanh Toán Đơn Hàng</h3>
      <p id="qrProdName" style="font-size: 13.5px; color: #475569; font-weight: 600;"></p>
    </div>
    <div style="text-align: center; background: #f8fafc; border-radius: 12px; padding: 14px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
      <div style="font-size: 12.5px; color: #64748b; margin-bottom: 8px;">Quét mã QR bằng App Ngân hàng bất kỳ / MoMo</div>
      <img id="qrImg" src="" alt="Mã VietQR" style="max-width: 220px; margin: 0 auto 10px; border-radius: 8px; border: 1px solid #cbd5e1;" />
      <div style="font-size: 13.5px; color: #0f172a; line-height: 1.6;">
        <div>Số tiền: <strong id="qrAmountTxt" style="color: #ef4444; font-size: 16px;"></strong></div>
        <div>Nội dung CK: <strong id="qrMemoTxt" style="color: #4f46e5; background: #e0e7ff; padding: 2px 6px; border-radius: 4px;"></strong></div>
      </div>
    </div>
    <div style="margin-bottom: 16px;">
      <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px;">Email nhận link tải Workflow:</label>
      <input type="email" id="buyerEmailInput" placeholder="vidu@gmail.com" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13.5px; box-sizing: border-box; outline: none;" />
    </div>
    <button onclick="handleConfirmDone()" style="width: 100%; background: #10b981; color: #ffffff; border: none; padding: 13px; border-radius: 8px; font-weight: 700; font-size: 14.5px; cursor: pointer;">
      ✅ TÔI ĐÃ CHUYỂN KHOẢN XONG
    </button>
  </div>
</div>

<script>
function openVietQRModal(name, amount, code) {
  var modal = document.getElementById('vietqrModal');
  if (!modal) return;
  document.getElementById('qrProdName').innerText = name;
  document.getElementById('qrAmountTxt').innerText = parseInt(amount).toLocaleString('vi-VN') + ' đ';
  var memo = code + ' ' + Math.floor(1000 + Math.random() * 9000);
  document.getElementById('qrMemoTxt').innerText = memo;
  
  var bankId = 'MB'; // MBBank, VCB, ACB, TPB...
  var accountNo = '0987654321'; // Thay số tài khoản của bạn
  var accountName = 'NGUYEN DANG'; // Thay tên của bạn
  var qrUrl = 'https://img.vietqr.io/image/' + bankId + '-' + accountNo + '-compact2.png?amount=' + amount + '&addInfo=' + encodeURIComponent(memo) + '&accountName=' + encodeURIComponent(accountName);
  document.getElementById('qrImg').src = qrUrl;
  modal.style.display = 'flex';
}

function closeVietQRModal() {
  var modal = document.getElementById('vietqrModal');
  if (modal) modal.style.display = 'none';
}

function handleConfirmDone() {
  var email = document.getElementById('buyerEmailInput').value;
  if (!email || email.indexOf('@') === -1) {
    alert('Vui lòng nhập đúng địa chỉ email để nhận link!');
    return;
  }
  alert('Đã ghi nhận thanh toán! Link tải workflow sẽ được gửi đến email: ' + email + ' sau khi hệ thống khớp lệnh.');
  closeVietQRModal();
}
</script>
"""
    clean_box = (box_template
                 .replace('__IMG__', featured_img)
                 .replace('__TITLE__', title_escaped)
                 .replace('__TITLE_JS__', title.replace("'", "\\'"))
                 .replace('__PRICE_SALE__', price_sale)
                 .replace('__PRICE_REG__', price_regular)
                 .replace('__AMOUNT__', amount_clean)
                 .replace('__ID__', str(p_id)))

    raw_content = p['content']['rendered']
    raw_content = raw_content.replace(']]>', ']]]]><![CDATA[>')

    content = clean_box + "\n\n<h3>Mô tả chi tiết sản phẩm:</h3>\n" + raw_content

    category_terms = ['Cửa hàng', 'Sản phẩm n8n']
    category_tags = "\n".join([
        f"    <category scheme='http://www.blogger.com/atom/ns#' term='{saxutils.escape(t)}'/>"
        for t in category_terms
    ])

    entry = f"""  <entry>
    <id>tag:blogger.com,1999:blog-workflowfree-shop.post-{p_id}</id>
    <published>{date_pub}</published>
    <updated>{date_pub}</updated>
    <category scheme='http://schemas.google.com/g/2005#kind' term='http://schemas.google.com/blogger/2008/kind#post'/>
{category_tags}
    <title type='text'>[Cửa Hàng] {title_escaped}</title>
    <content type='html'><![CDATA[{content}]]></content>
    <link rel='alternate' type='text/html' href='http://workflowfree.blogspot.com/{slug}.html' title='{title_escaped}'/>
    <author>
      <name>Xuân Linh</name>
    </author>
  </entry>"""
    entries_xml.append(entry)

shop_feed = f"""<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns='http://www.w3.org/2005/Atom' xmlns:openSearch='http://a9.com/-/spec/opensearchrss/1.0/' xmlns:georss='http://www.georss.org/georss' xmlns:gd='http://schemas.google.com/g/2005' xmlns:thr='http://purl.org/syndication/thread/1.0'>
  <id>tag:blogger.com,1999:blog-workflowfree-shop</id>
  <updated>{now_iso}</updated>
  <title type='text'>Cửa Hàng Workflow n8n &amp; AI Agents</title>
  <subtitle type='html'>Sản phẩm tự động hóa, template FLOW App và kịch bản n8n cao cấp</subtitle>
  <link rel='http://schemas.google.com/g/2005#feed' type='application/atom+xml' href='http://workflowfree.blogspot.com/feeds/posts/default'/>
  <link rel='self' type='application/atom+xml' href='http://workflowfree.blogspot.com/feeds/posts/default'/>
  <link rel='alternate' type='text/html' href='http://workflowfree.blogspot.com/'/>
  <author>
    <name>Xuân Linh</name>
  </author>
  <generator version='7.00' uri='http://www.blogger.com'>Blogger</generator>
{"\n".join(entries_xml)}
</feed>"""

out_shop_path = 'docs/blogger/workflowfree-blogger-products.xml'
with open(out_shop_path, 'w', encoding='utf-8') as f:
    f.write(shop_feed)

print(f"Successfully generated {out_shop_path} with {len(products)} products!")
