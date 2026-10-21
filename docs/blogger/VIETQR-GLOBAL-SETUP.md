# Hướng Dẫn Cấu Hình Số Tài Khoản VietQR Dùng Chung Toàn Blog

Thay vì phải nhập thủ công số tài khoản, ngân hàng và số Zalo vào từng bài viết, giải pháp **Centralized VietQR Engine** cho phép bạn:
- **Cấu hình 1 lần duy nhất tại 1 vị trí trung tâm.**
- **Tất cả các bài đăng bán hàng (cũ và mới) sẽ tự động cập nhật số tài khoản, mã QR và link Zalo đồng bộ 100%.**
- Khi bạn đổi tài khoản ngân hàng hoặc số điện thoại, bạn chỉ cần sửa **đúng 1 nơi**, toàn bộ website sẽ đổi theo ngay lập tức!

---

## 🌟 Cách 1: Cài Đặt Qua Mục "Bố Cục" (Khuyên Dùng - Cực Dễ, Không Sợ Lỗi Code)

Đây là cách thuận tiện nhất vì bạn có thể sửa trực tiếp trên giao diện quản trị Blogger mà không cần đụng đến code theme:

1. Mở trang quản trị Blogger > chọn mục **Bố cục (Layout)** ở menu bên trái.
2. Tìm đến phần **Thanh bên (Sidebar)** hoặc **Chân trang (Footer)** > Bấm vào **Thêm tiện ích (Add a Gadget)**.
3. Chọn loại tiện ích: **HTML/JavaScript**.
4. Thiết lập tiện ích:
   - **Tiêu đề (Title):** Để trống (để không hiện tiêu đề ra ngoài trang).
   - **Nội dung (Content):** Dán đoạn mã sau vào:

```html
<script>
  window.VIETQR_CONFIG = {
    bankId: 'MB',                 // Mã ngân hàng của bạn: MB, VCB, ACB, TPB, TCB, VPB, BIDV...
    accountNo: '0987654321',      // Số tài khoản ngân hàng nhận tiền của bạn
    accountName: 'NGUYEN DANG',   // Tên chủ tài khoản (viết hoa không dấu)
    zaloPhone: '0987654321'       // Số điện thoại Zalo tư vấn chốt đơn
  };
</script>
```

5. Bấm **Lưu (Save)**.
6. **XONG!** Kể từ thời điểm này, toàn bộ bài viết bán hàng trên blog sẽ tự động hiển thị mã QR và link Zalo theo thông tin bạn vừa điền. Khi cần đổi số tài khoản, bạn chỉ cần vào lại mục Bố cục và sửa lại tiện ích này trong 5 giây!

---

## 🎨 Cách 2: Cài Đặt Trực Tiếp Trong Theme XML

File giao diện [workflowfree-blogger-theme.xml](file:///d:/ai-website-cloner-template/docs/blogger/workflowfree-blogger-theme.xml) đã được tích hợp sẵn bộ máy này:

1. Vào mục **Chủ đề (Theme)** > bấm vào mũi tên cạnh nút **Tùy chỉnh** > chọn **Chỉnh sửa HTML (Edit HTML)**.
2. Nhấn `Ctrl + F` và tìm từ khóa: `VIETQR_CONFIG`.
3. Bạn sẽ thấy đoạn mã ở gần cuối file:

```javascript
window.VIETQR_CONFIG = window.VIETQR_CONFIG || {
  bankId: 'MB',                 // Mã ngân hàng của bạn
  accountNo: '0987654321',      // Số tài khoản của bạn
  accountName: 'NGUYEN DANG',   // Tên chủ tài khoản
  zaloPhone: '0987654321'       // Số điện thoại Zalo
};
```

4. Thay các giá trị trên thành tài khoản thật của bạn và bấm biểu tượng **Lưu** (hình chiếc đĩa mềm) ở góc trên bên phải.

---

## 💡 Khi Viết Bài Đăng Mới: Cách Thức Hoạt Động Cực Kỳ Tiện Lợi

Khi đăng một sản phẩm mới, bạn **hoàn toàn không cần gõ lại số tài khoản hay ngân hàng**. Trong mẫu [1-template-ban-hang.html](file:///d:/ai-website-cloner-template/docs/blogger/templates/1-template-ban-hang.html), thẻ ảnh chỉ cần khai báo:

```html
<img class="vietqr-img" 
     data-amount="199000" 
     data-memo="WF11538" 
     src="https://img.vietqr.io/image/MB-0987654321-compact2.png" />
```

- `data-amount`: Số tiền của sản phẩm này (Ví dụ: `199000`).
- `data-memo`: Mã đơn hàng của sản phẩm này (Ví dụ: `WF11538`).

Bộ máy toàn cục sẽ tự động ghép với Số tài khoản + Ngân hàng dùng chung để tạo ra mã QR có sẵn số tiền chính xác từng đồng cho khách hàng quét!
