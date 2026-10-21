# Hướng Dẫn Clone Danh Mục Cửa Hàng (WooCommerce Shop) Cho Blogger

Tài liệu này hướng dẫn cách áp dụng giao diện danh mục **Cửa hàng** chuẩn WooCommerce từ website gốc:  
`https://workflowfree.com/cua-hang/?orderby=date&v=5e9c52c6d618`  
vào blog Blogger hiện tại (**Nguyen Dang AI** tại `nguyendangai.blogspot.com`).

---

## 1. Những Điểm Cải Tiến Đã Được Clone & Điều Chỉnh Cho Blogger

| Thành phần trên WorkflowFree | Xử lý & Tối ưu trên Blogger |
| :--- | :--- |
| **Bố cục danh mục (`columns-3`)** | Grid 3 cột chuẩn WooCommerce (`.shop-products-grid.products.columns-3`), responsive 2 cột trên tablet và 1 cột trên mobile. |
| **Ảnh đại diện sản phẩm** | Tỷ lệ vuông **1:1** (`aspect-ratio: 1/1`) sắc nét, hiệu ứng zoom nhẹ mượt mà khi hover chuột. |
| **Badge giảm giá (`onsale`)** | Huy hiệu giảm giá nổi bật màu đỏ (`-17%`, `-34%` hoặc `HOT`) ở góc trên bên trái ảnh sản phẩm. |
| **Nút thao tác nhanh** | Nút **"Xem chi tiết"** dạng overlay nổi lên khi rê chuột vào ảnh (`bloghash-btn`). |
| **Thẻ phân loại Category** | Hiển thị các tag chuyên mục con (`FLOW APP`, `VIDEO AUTOMATION`, `SẢN PHẨM N8N`) phía trên tiêu đề. |
| **Tiêu đề sản phẩm** | Tự động loại bỏ tiền tố `[Cửa Hàng]` để tiêu đề hiển thị tự nhiên, chuyên nghiệp đúng chuẩn cửa hàng. |
| **Hiển thị giá (`price`)** | Cặp giá chuẩn: Giá gốc gạch ngang (`<del>300.000 đ</del>`) và Giá khuyến mãi đậm nét màu tím indigo (`<span class="custom-sale-price">199.000 đ</span>`). |
| **Nút mua nhanh VietQR** | Nút gradient **"⚡ Mua ngay VietQR"** ở chân thẻ sản phẩm, dẫn thẳng đến trang chi tiết hoặc popup quét mã thanh toán 24/7. |
| **Thanh công cụ sắp xếp** | Toolbar phía trên danh sách sản phẩm gồm số lượng và bộ lọc: **Mới nhất**, **Giá: Thấp đến cao**, **Giá: Cao xuống thấp**, **Ưu đãi giảm giá nhiều nhất**. |
| **Menu điều hướng chính** | Thêm mục **"Cửa hàng"** trên thanh menu kèm biểu tượng giỏ hàng và huy hiệu **`HOT`** nhấp nháy bắt mắt. |

---

## 2. Cách Áp Dụng Theme Đã Nâng Cấp Vào Blogger (30 Giây)

Toàn bộ mã giao diện danh mục Cửa hàng đã được tích hợp hoàn chỉnh trong file:  
👉 **[workflowfree-blogger-theme.xml](file:///d:/ai-website-cloner-template/docs/blogger/workflowfree-blogger-theme.xml)**

### Các bước thực hiện trên Blogger:
1. Mở trang quản trị Blogger: [Blogger Themes](https://www.blogger.com/blog/themes/2562876275428955705).
2. Tại khung chủ đề đang dùng, bấm vào **nút mũi tên thả xuống (▼)** ngay cạnh chữ **Tùy chỉnh (Customize)**.
3. Chọn **Chỉnh sửa HTML (Edit HTML)**.
4. Nhấn `Ctrl + A` để chọn toàn bộ mã cũ, xóa đi.
5. Mở file **[workflowfree-blogger-theme.xml](file:///d:/ai-website-cloner-template/docs/blogger/workflowfree-blogger-theme.xml)**, copy toàn bộ nội dung và dán (`Ctrl + V`) vào trình soạn thảo.
6. Bấm biểu tượng chiếc đĩa mềm màu cam **Lưu (Save)** ở góc trên bên phải.
7. Truy cập vào đường link danh mục cửa hàng để xem thành quả:  
   👉 **`https://nguyendangai.blogspot.com/search/label/C%E1%BB%ADa%20h%C3%A0ng`**

---

## 3. Cơ Chế Tự Động Phân Tích Giá & Sắp Xếp (Client-side Engine)

Theme đã tích hợp sẵn đoạn mã JavaScript thông minh:
- **Tự động trích xuất giá:** Khi hiển thị bất kỳ bài viết nào có nhãn `Cửa hàng`, hệ thống tự quét giá trong nội dung bài viết và điền vào thẻ giá chuẩn WooCommerce.
- **Tự động tính phần trăm giảm giá:** Nếu bài viết có 2 mức giá (ví dụ: 300.000 đ và 199.000 đ), hệ thống tự động tính ra `-34%` và hiển thị lên huy hiệu `onsale`.
- **Sắp xếp theo thời gian thực (Real-time Sorting):** Người dùng có thể chọn sắp xếp theo giá tăng dần, giảm dần hoặc mức giảm giá ngay trên trình duyệt mà không cần tải lại trang.

---

## 4. Tùy Chỉnh Thông Tin Ngân Hàng VietQR Dùng Chung

Trong file theme XML, tại thẻ `<script>` ở cuối trang, bạn có thể chỉnh sửa 1 lần duy nhất để áp dụng cho toàn bộ cửa hàng:

```javascript
window.VIETQR_CONFIG = {
  bankId: 'MB',                 // Mã ngân hàng: MB, VCB, ACB, TPB, TCB, VPB, BIDV...
  accountNo: '0987654321',      // SỐ TÀI KHOẢN NHẬN TIỀN CỦA BẠN
  accountName: 'NGUYEN DANG',   // TÊN CHỦ TÀI KHOẢN (viết hoa không dấu)
  zaloPhone: '0987654321'       // SỐ ZALO TƯ VẤN BÁN HÀNG
};
```
Mọi mã QR thanh toán và link Zalo trên toàn blog sẽ tự động cập nhật đồng bộ!
