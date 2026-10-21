# Quy tắc & Quy trình Clone Website sang Blogger (Blogspot)

Quy tắc này áp dụng khi người dùng yêu cầu clone, chuyển đổi hoặc sao chép bất kỳ website nào sang nền tảng **Google Blogger (Blogspot)**.

---

## 1. Kiến trúc & Bản chất của Blogger
- Blogger quản lý giao diện và dữ liệu hoàn toàn tách biệt:
  1. **Dữ liệu bài viết (Posts & Media)**: Quản lý bằng định dạng **Blogger Atom XML Feed** (`.xml`), nhập qua `Cài đặt > Nhập nội dung (Import content)`.
  2. **Giao diện (Theme/Template)**: Quản lý bằng **Blogger Theme Layout v3 XML** (`.xml`), cài đặt qua `Chủ đề > Khôi phục (Restore)` hoặc `Chỉnh sửa HTML (Edit HTML)`.
- Khi clone sang Blogger, **luôn chủ động tạo cả 2 file độc lập này** để người dùng có thể áp dụng 1-click.

---

## 2. Quy trình trích xuất bài viết (Posts Export to Blogger XML)

### 2.1. Nguồn dữ liệu
- **Nếu website gốc là WordPress**: Luôn ưu tiên dùng **WordPress REST API** (`/wp-json/wp/v2/posts?per_page=100&_embed=1`, `/categories`, `/tags`) vì cho dữ liệu chuẩn 100%, có sẵn HTML render sạch, ảnh đại diện (`wp:featuredmedia`), ngày đăng và tác giả.
- **Nếu là CMS khác hoặc web tĩnh**: Cào qua Sitemap XML hoặc BeautifulSoup/Playwright trích xuất tiêu đề, bài viết, ảnh và ngày tháng.

### 2.2. Định dạng chuẩn Blogger Atom XML
- File XML phải tuân thủ chuẩn Atom Feed của Google:
```xml
<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns='http://www.w3.org/2005/Atom' xmlns:openSearch='http://a9.com/-/spec/opensearchrss/1.0/' xmlns:georss='http://www.georss.org/georss' xmlns:gd='http://schemas.google.com/g/2005' xmlns:thr='http://purl.org/syndication/thread/1.0'>
  <id>tag:blogger.com,1999:blog-{site_slug}</id>
  <updated>{ISO_TIMESTAMP_UTC}</updated>
  <title type='text'>{Site Title}</title>
  <subtitle type='html'>{Site Subtitle}</subtitle>
  <!-- Các bài viết dạng <entry> -->
  <entry>
    <id>tag:blogger.com,1999:blog-{site_slug}.post-{post_id}</id>
    <published>{ISO_DATETIME_WITH_OFFSET}</published>
    <updated>{ISO_DATETIME_WITH_OFFSET}</updated>
    <!-- Phân loại bắt buộc để Blogger nhận diện là bài viết -->
    <category scheme='http://schemas.google.com/g/2005#kind' term='http://schemas.google.com/blogger/2008/kind#post'/>
    <!-- Nhãn bài viết (Labels) -->
    <category scheme='http://www.blogger.com/atom/ns#' term='{Category/Label Name}'/>
    <title type='text'>{Escaped Post Title}</title>
    <!-- Nội dung HTML bọc trong CDATA -->
    <content type='html'><![CDATA[{Post HTML Content}]]></content>
    <link rel='alternate' type='text/html' href='http://{site_slug}.blogspot.com/{slug}.html' title='{Escaped Post Title}'/>
    <author>
      <name>{Author Name}</name>
    </author>
  </entry>
</feed>
```
- **Xử lý ảnh đại diện (Featured Image)**: Nếu trong nội dung HTML chưa có ảnh đại diện, bắt buộc phải chèn thẻ ảnh lên đầu nội dung:
  `<div class="separator" style="clear: both; text-align: center;"><img src="{featured_img_url}" alt="{title}" /></div>`
  Điều này giúp Blogger tự động nhận diện ảnh đại diện làm thumbnail hiển thị trên lưới bài viết trang chủ và khi chia sẻ mạng xã hội.
- **Escape CDATA**: Thay thế `]]>` thành `]]]]><![CDATA[>` để tránh làm hỏng cấu trúc XML.

---

## 3. Quy tắc cấu trúc Theme XML của Blogger (Blogger Theme Rules & Gotchas)

### 3.1. Thẻ gốc `<html>` và Document Type
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:css='false' b:defaultwidgetversion='2' b:layoutsversion='3' b:responsive='true' lang='vi' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
<head>
  <meta charset='utf-8'/>
  <meta content='width=device-width, initial-scale=1, shrink-to-fit=no' name='viewport'/>
  <title><data:view.title.escaped/></title>
  <b:include data='blog' name='all-head-content'/>
  ...
```

### 3.2. ⚠️ LỖI CHÍ MẠNG CẦN TRÁNH TUYỆT ĐỐI (Crucial Gotcha)
Trong tiện ích `<b:widget id='Blog1' type='Blog' version='2'>`:
- **KHÔNG ĐƯỢC CHỨA CÁC THAM SỐ QUẢNG CÁO ADSENSE CŨ**:
  ❌ **CẤM** các thẻ:
  ```xml
  <b:widget-setting name='style.unittype'>...</b:widget-setting>
  <b:widget-setting name='postsPerAd'>...</b:widget-setting>
  <b:widget-setting name='showInlineAds'>...</b:widget-setting>
  <b:widget-setting name='style.textcolor'>...</b:widget-setting>
  <b:widget-setting name='style.urlcolor'>...</b:widget-setting>
  <b:widget-setting name='style.linkcolor'>...</b:widget-setting>
  <b:widget-setting name='style.bordercolor'>...</b:widget-setting>
  ```
  👉 **Hậu quả nếu vi phạm**: Blogger sẽ báo lỗi ngay lập tức khi người dùng Khôi phục hoặc Lưu:  
  `"The widget settings in widget with id Blog1 is not valid. Unknown ad unit type"`.
- ✅ **Chỉ dùng các tham số chuẩn an toàn**:
  ```xml
  <b:widget-settings>
    <b:widget-setting name='showDateHeader'>false</b:widget-setting>
    <b:widget-setting name='showShareButtons'>true</b:widget-setting>
    <b:widget-setting name='authorLabel'>Tác giả</b:widget-setting>
    <b:widget-setting name='showCommentLink'>true</b:widget-setting>
    <b:widget-setting name='showAuthor'>true</b:widget-setting>
    <b:widget-setting name='showAuthorProfile'>false</b:widget-setting>
    <b:widget-setting name='showTimestamp'>true</b:widget-setting>
    <b:widget-setting name='postsPerPage'>12</b:widget-setting>
    <b:widget-setting name='showLabels'>true</b:widget-setting>
  </b:widget-settings>
  ```
  *(Hoặc có thể bỏ hẳn thẻ `<b:widget-settings>` mà không ảnh hưởng gì).*

### 3.3. Quy tắc điều kiện hiển thị trong Blogger Layout v3
- Trang chủ: `<b:if cond='data:view.isHomepage'>`
- Trang danh sách bài viết / chuyên mục / tìm kiếm: `<b:if cond='data:view.isMultipleItems'>`
- Trang bài viết đơn lẻ (Single post): `<b:if cond='data:view.isPost'>` (hoặc nhánh `<b:else/>` của `isMultipleItems`).
- Trang tĩnh (Page): `<b:if cond='data:view.isPage'>`
- Lấy từ khóa tìm kiếm: `<data:view.search.query/>`
- Lấy tên nhãn đang xem: `<data:view.search.label/>`

### 3.4. Quy tắc CSS & Responsive
- Toàn bộ CSS phải đặt trong `<b:skin><![CDATA[ ... ]]></b:skin>`.
- Khai báo CSS variables hiện đại ở `:root` (`--primary`, `--bg-body`, `--card-shadow`, v.v.).
- Sử dụng Google Fonts hỗ trợ tiếng Việt đầy đủ (`Be Vietnam Pro`, `Inter Tight`, `JetBrains Mono`).
- **Thiết lập Mobile trên Blogger**: Nhắc người dùng vào `Chủ đề > Cài đặt cho thiết bị di động > chọn "Máy tính để bàn (Desktop)"` để giao diện Responsive CSS tự co giãn tối ưu, không bị ép về theme mobile cổ điển của Blogger.

---

## 4. Chuyển đổi tính năng đặc thù sang Blogger
1. **Tìm kiếm (Search)**:
   Dùng form tìm kiếm chuẩn:
   ```html
   <form expr:action='data:blog.searchUrl' method='get'>
     <input name='q' placeholder='Tìm kiếm bài viết...' type='text'/>
   </form>
   ```
2. **Menu nhãn (Category Links)**:
   Đường dẫn xem bài viết theo nhãn:
   `expr:href='data:blog.homepageUrl + "search/label/" + {LabelName}'`
3. **Thương mại điện tử / Cửa hàng (WooCommerce)**:
   Blogger không có backend giỏ hàng động. Chuyển đổi thành:
   - Nút liên hệ/đặt mua qua Zalo, Telegram, Messenger.
   - Nhúng Google Form hoặc giỏ hàng tĩnh Snipcart.
4. **Code Block / Code JSON**:
   Tạo khối `<pre><code>` màu tối, có nút sao chép nhanh (`navigator.clipboard.writeText`) chuyên dụng cho chia sẻ code, workflow json hoặc prompt.
