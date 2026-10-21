# Hướng Dẫn Kỹ Thuật Clone Website Sang Blogger (Blogspot)

Tài liệu này là cẩm nang kỹ thuật chi tiết dành cho agent khi thực hiện nhiệm vụ reverse-engineer hoặc clone bất kỳ website nào sang Google Blogger (Blogspot).

---

## 1. Hai Thành Phần Bắt Buộc

Mọi dự án clone sang Blogger luôn phải cung cấp đủ 2 tệp độc lập:
1. `docs/blogger/{site}-blogger-posts.xml`: Dữ liệu bài viết đóng gói theo chuẩn Google Blogger Atom XML.
2. `docs/blogger/{site}-blogger-theme.xml`: Giao diện Blog đóng gói theo chuẩn Blogger Theme Layout v3 XML.

---

## 2. Quy Trình Trích Xuất Dữ Liệu Bài Viết

### 2.1. Website nguồn là WordPress
- Kiểm tra REST API: `https://{domain}/wp-json/wp/v2/posts?per_page=100&_embed=1`
- Lấy danh mục: `https://{domain}/wp-json/wp/v2/categories?per_page=100`
- Xây dựng file Python xuất ra tệp Atom XML:
  * Mỗi bài viết thành một thẻ `<entry>`.
  * Tiêu đề escape chuẩn: `xml.sax.saxutils.escape(title)`.
  * Nội dung bọc trong `<![CDATA[ ... ]]>`.
  * Thay thế chuỗi `]]>` bên trong nội dung bằng `]]]]><![CDATA[>`.
  * Đảm bảo ảnh đại diện được chèn lên đầu nội dung nếu chưa có:
    `<div class="separator" style="clear: both; text-align: center;"><img border="0" src="{img_url}" alt="{title}" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;" /></div><br/>`
  * Nhãn (Categories/Labels): `<category scheme='http://www.blogger.com/atom/ns#' term='{Label}'/>`.

### 2.2. Website nguồn không phải WordPress
- Sử dụng crawler (Playwright hoặc BeautifulSoup) thu thập: Tiêu đề, Nội dung HTML bài viết, Ảnh minh họa, Ngày đăng, Thẻ tag.
- Đóng gói theo cùng cấu trúc `<feed>` của Blogger Atom XML như trên.

---

## 3. Quy Tắc & Cạm Bẫy Cần Tránh Khi Viết Theme XML Cho Blogger

### 3.1. ⚠️ CẠM BẪY LỚN NHẤT: Thẻ cấu hình quảng cáo cũ trong widget Blog1
Google Blogger hiện tại **nghiêm cấm** các tham số AdSense cũ bên trong `<b:widget-settings>` của widget `Blog`:
- ❌ **TUYỆT ĐỐI KHÔNG DÙNG**:
  * `style.unittype`
  * `postsPerAd`
  * `showInlineAds`
  * `style.textcolor`
  * `style.urlcolor`
  * `style.linkcolor`
  * `style.bordercolor`
- **Thông báo lỗi khi vi phạm**:
  `The widget settings in widget with id Blog1 is not valid. Unknown ad unit type`
- ✅ **Chỉ dùng các tham số hợp lệ**:
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

### 3.2. Cấu trúc Layout v3
- Thẻ `<html>`:
  ```xml
  <html b:css='false' b:defaultwidgetversion='2' b:layoutsversion='3' b:responsive='true' lang='vi' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
  ```
- CSS: Đặt hoàn toàn trong `<b:skin><![CDATA[ ... ]]></b:skin>`.
- Điều kiện hiển thị trang:
  * `<b:if cond='data:view.isHomepage'>`: Dành riêng cho hero banner, slider giới thiệu trang chủ.
  * `<b:if cond='data:view.isMultipleItems'>`: Lưới danh sách bài viết (trang chủ, archive, nhãn, search).
  * `<b:else/>` (trong loop posts): Trang chi tiết bài viết (Single Post).

### 3.3. Tối ưu di động
- Nhắc người dùng tắt giao diện di động cũ trong `Chủ đề > Cài đặt cho thiết bị di động > chọn "Máy tính để bàn (Desktop)"` để CSS Flex/Grid Responsive hiện đại của theme tự phục vụ trên điện thoại.
