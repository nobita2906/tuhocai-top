import { execute, query } from '../src/lib/db.ts';
import { randomUUID } from 'crypto';

async function main() {
  console.log('Seeding 2 new technical articles...');

  // Article 1
  const id1 = randomUUID();
  const slug1 = 'huong-dan-tu-xay-ai-automation-bot-n8n-telegram-vietqr';
  const title1 = 'Hướng Dẫn Tự Xây AI Automation Bot Với n8n & Telegram: Tự Động Báo Doanh Thu & Khớp Đơn VietQR 24/7';
  const summary1 = 'Khám phá kiến trúc thực chiến tự động hóa 100% quy trình bán hàng số: Tự động phát hiện biến động tài khoản ngân hàng, khớp mã đơn hàng thông minh và bắn thông báo duyệt đơn 1 chạm qua Bot Telegram bằng n8n.';
  const category1 = 'WORKFLOW';
  const tags1 = 'n8n, Telegram Bot, SePay, VietQR, Automation, Tự Động Hóa, Tự Học AI';
  const thumbnail1 = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&q=80';

  const content1 = `> **Tác giả:** Nguyễn Văn Đăng - AI Solution Architect tại Tự Học AI (tuhocai.top)  
> **Chủ đề:** Tự động hóa hệ thống bán hàng số với n8n, SePay Webhook và Telegram Bot  
> **Mục tiêu:** Giúp bạn sở hữu hệ thống bán hàng tự động 24/7, khách quét mã VietQR là tiền về tài khoản, Bot Telegram báo ngay và hệ thống tự mở khóa tài nguyên trong 3 giây.

---

## 1. Nỗi Đau Lớn Nhất Của Người Bán Sản Phẩm Số & Khóa Học Online

Trong mô hình kinh doanh số (Digital Products, Template, Prompt, Khóa học video), 90% nhà sáng tạo nội dung gặp phải bế tắc này:

1. **Khách hàng chuyển khoản xong phải ngồi chờ:** Họ gửi ảnh chụp màn hình qua Zalo/Facebook, nếu bạn đang ngủ hoặc bận lái xe, 30 phút sau mới duyệt thì khách hàng đã nguội lạnh cảm xúc.
2. **Sai sót đối soát doanh thu:** Kẻ gian dùng thủ thuật sửa ảnh bill Photoshop giả để lừa lấy link Drive tài liệu.
3. **Mệt mỏi vì trực tin nhắn thủ công:** Cả ngày chỉ loanh quanh gửi số tài khoản, kiểm tra app ngân hàng, copy link gửi lại cho từng người.

Giải pháp tối thượng trong năm 2026 chính là **xây dựng một Robot n8n kết nối cổng VietQR tự động qua SePay và quản trị qua Telegram Bot**.

---

## 2. Kiến Trúc Hệ Thống Tự Động Hóa 4 Tầng

Hệ thống hoạt động theo chu trình khép kín không cần người trực:

\`\`\`mermaid
flowchart LR
    A[Khách hàng quét mã VietQR] -->|Chuyển khoản thành công| B[Ngân hàng ACB / MB / VIB]
    B -->|Bắn Webhook tức thì| C[Cổng SePay Auto Pay]
    C -->|Gửi biến động số dư| D[n8n Workflow Hub]
    D -->|Khớp mã đơn & Mở khóa Kho| E[Website tuhocai.top]
    D -->|Bắn tin nhắn kèm nút Duyệt| F[Telegram Bot của Admin]
\`\`\`

- **Tầng 1 (Khách hàng):** Xem sản phẩm, website tự động tạo mã QR động chứa đúng mã đơn hàng và số tiền chính xác.
- **Tầng 2 (SePay Gateway):** Đóng vai trò máy quét biến động số dư tài khoản ngân hàng, bắn tín hiệu Webhook ngay khi tiền vào trong 1-3 giây.
- **Tầng 3 (n8n Workflow Hub):** Tiếp nhận dữ liệu, giải mã chuỗi nội dung chuyển khoản, kiểm tra tính hợp lệ và cập nhật cơ sở dữ liệu.
- **Tầng 4 (Telegram Bot Admin):** Báo cáo số tiền vào điện thoại của bạn, đồng thời cấp sẵn các nút hành động tương tác 1 chạm.

---

## 3. Cấu Hình n8n Node: Webhook Listener & Smart Matching

Dưới đây là đoạn cấu hình Function Node trong n8n để phân tích nội dung chuyển khoản và nhận diện mã đơn hàng tự động:

\`\`\`javascript
// Node JavaScript trong n8n: Trích xuất mã đơn hàng từ nội dung chuyển khoản
const payload = items[0].json;
const content = (payload.content || payload.transactionContent || '').toUpperCase();
const amount = Number(payload.transferAmount || payload.amountIn || 0);

// Thuật toán Regex nhận dạng mã đơn hàng: ví dụ THAI123456 hoặc VIDEOAI69K
const codeMatch = content.match(/THAI\\d{5,8}/i) || content.match(/ORD-[A-Z0-9]+/i);
const extractedOrderCode = codeMatch ? codeMatch[0] : null;

return [{
  json: {
    orderCode: extractedOrderCode,
    amount: amount,
    bank: payload.gateway || 'ACB',
    accountNumber: payload.accountNumber,
    timestamp: new Date().toISOString(),
    isMatchFound: Boolean(extractedOrderCode)
  }
}];
\`\`\`

---

## 4. Prompt Cấu Hình Claude / GPT-4o Tạo Bản Tin Báo Cáo Doanh Thu Qua Telegram

Khi tiền vào, bot n8n sẽ gọi model AI để tóm tắt và định dạng thông báo chuyên nghiệp về Telegram channel của bạn. Hãy sử dụng Prompt sau:

\`\`\`markdown
Bạn là trợ lý tài chính thông minh của hệ thống Tự Học AI. 
Hãy nhận dữ liệu JSON giao dịch ngân hàng dưới đây và định dạng thành một tin nhắn thông báo Telegram Markdown thật trực quan, hào hứng và chuẩn xác:

Dữ liệu đầu vào:
- Mã đơn hàng: {orderCode}
- Tên khách hàng: {customerName}
- Số tiền: {amount}
- Ngân hàng: {bankName}
- Nội dung: {transferContent}

Yêu cầu định dạng:
🛒 [TIỀN VÀO TỰ ĐỘNG - SEPAY AUTO PAY]
━━━━━━━━━━━━━━━━━━━━
📦 Mã đơn: {orderCode}
💰 Số tiền: +{amount} đ
👤 Khách hàng: {customerName}
🏦 Ngân hàng: {bankName}
✨ Trạng thái: Hệ thống đã tự động cấp quyền tải Drive và mở khóa Kho cá nhân!
\`\`\`

---

## 5. Kinh Nghiệm Thực Chiến Tránh Lỗi Khi Triển Khai

1. **Bảo mật Webhook với HMAC-SHA256:** Luôn cài đặt \`sepay_webhook_secret\` trong trang quản trị để xác thực chữ ký số. Tuyệt đối không mở endpoint công khai mà không kiểm tra token.
2. **Khớp dự phòng bằng số điện thoại:** Đôi khi người chuyển khoản quên ghi mã đơn nhưng ghi số điện thoại. Hệ thống nên có fallback tìm kiếm đơn hàng PENDING gần nhất trùng với SĐT của khách.
3. **Tận dụng n8n Cloud hoặc Docker cá nhân:** Bạn có thể tự host n8n hoàn toàn miễn phí trên VPS cá nhân hoặc máy tính cục bộ để tiết kiệm 100% chi phí vận hành.

👉 **Muốn đi nhanh hơn mà không phải mò mẫm tự setup?**  
Bạn có thể sở hữu trọn bộ mã nguồn JSON n8n hoàn chỉnh đã được đóng gói sẵn tại:  
[**Workflow n8n Tự Động Đăng Bài & Báo Cáo Đa Kênh (99K)**](/san-pham/workflow-n8n-tu-dong-dang-bai-da-kenh) - Mua xong chỉ cần 1-click import là vận hành ngay!`;

  // Article 2
  const id2 = randomUUID();
  const slug2 = 'quy-trinh-tao-video-ai-trieu-view-tu-1-anh-tinh-tiktok-reels';
  const title2 = 'Quy Trình Tạo Video AI Triệu View Từ 1 Ảnh Tĩnh: Bí Quyết Tự Động Hóa Kênh TikTok & Reels 2026';
  const summary2 = 'Hướng dẫn chi tiết từng bước quy trình sản xuất video AI bán hàng triệu view từ 1 bức ảnh chân dung tĩnh: Từ khâu viết kịch bản viral bằng Claude, tạo giọng đọc cảm xúc bằng ElevenLabs đến đồng bộ khẩu hình và chuyển động siêu mượt.';
  const category2 = 'SKILL';
  const tags2 = 'Video AI, TikTok AI, Midjourney, Kling AI, Hedra, ElevenLabs, Tự Học AI';
  const thumbnail2 = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1280&q=80';

  const content2 = `> **Tác giả:** Nguyễn Văn Đăng - Founder & AI Creator tại Tự Học AI (tuhocai.top)  
> **Chủ đề:** Quy trình tạo video triệu view từ ảnh chân dung tĩnh ứng dụng bán hàng & affiliate  
> **Công cụ:** Claude 3.7 Sonnet, Midjourney v6, ElevenLabs, Hedra / Kling AI, CapCut Pro  

---

## 1. Cuộc Cách Mạng Video AI Từ 1 Ảnh Tĩnh

Năm 2026, bạn không còn cần:
- Phòng quay đắt tiền hàng chục triệu.
- Máy ảnh cơ, hệ thống đèn chiếu sáng phức tạp.
- Thuê diễn viên hay ngồi quay lại hàng chục lần vì nói vấp.

Chỉ với **1 bức ảnh chân dung duy nhất**, bạn có thể biến nó thành một nhân vật AI nói chuyện sống động, cử chỉ biểu cảm tự nhiên, phát âm chuẩn đài truyền hình và có khả năng kéo hàng triệu lượt xem trên TikTok, Facebook Reels và YouTube Shorts.

Rất nhiều kênh TikTok bán hàng hiện nay đạt doanh thu hàng trăm triệu mỗi tháng hoàn toàn nhờ vào quy trình tự động hóa này.

---

## 2. Quy Trình Thực Chiến 5 Bước Biến Ảnh Tĩnh Thành Cỗ Máy Video Triệu View

\`\`\`mermaid
flowchart TD
    A[Bước 1: Viết kịch bản Viral với Claude 3.7] --> B[Bước 2: Tạo ảnh nhân vật với Midjourney]
    B --> C[Bước 3: Lồng tiếng thần thái bằng ElevenLabs]
    C --> D[Bước 4: Đồng bộ khẩu hình & cử chỉ bằng Hedra/Kling]
    D --> E[Bước 5: Thêm Caption động & Xuất bản TikTok]
\`\`\`

---

## 3. Bước 1: Viết Kịch Bản Giữ Chân 3 Giây Đầu Với Claude 3.7

Quy tắc bất di bất dịch của video ngắn là **Hook 3 giây đầu**. Nếu không giật được sự tò mò trong 3 giây, người xem sẽ quẹt đi ngay.

Dưới đây là Prompt Claude độc quyền giúp bạn sản xuất kịch bản video ngắn chuẩn tâm lý học hành vi:

\`\`\`markdown
Bạn là bậc thầy biên kịch video ngắn triệu view trên TikTok & Reels.
Hãy viết cho tôi 1 kịch bản video ngắn (thời lượng 45-60 giây) về chủ đề: [CHỦ ĐỀ CỦA BẠN - Ví dụ: Cách kiếm 30 triệu/tháng nhờ kỹ năng làm video AI bán hàng].

Cấu trúc bắt buộc:
1. HOOK (0 - 3s): Một câu khẳng định giật mình hoặc đặt câu hỏi đánh trúng nỗi đau người xem. Tuyệt đối không chào hỏi dài dòng.
2. NỖI ĐAU & BẤT KHOẢI (3 - 15s): Mô tả sai lầm 99% mọi người đang mắc phải khiến họ tốn tiền và mất thời gian.
3. GIẢI PHÁP ĐỘT PHÁ (15 - 40s): Tiết lộ bí quyết thực chiến 3 bước cực kỳ đơn giản mà ai cũng làm được.
4. CALL TO ACTION (40 - 55s): Kêu gọi bình luận hoặc nhận tài liệu miễn phí tại bio.

Văn phong: Gần gũi, dứt khoát, nhịp điệu nhanh, sử dụng từ ngữ gợi hình ảnh cao.
\`\`\`

---

## 4. Bước 2: Prompt Midjourney Tạo Ảnh Chân Dung Nhân Vật Nhất Quán

Nhân vật AI cần có chiều sâu ánh sáng, ánh mắt nhìn thẳng vào ống kính và biểu cảm tự nhiên:

\`\`\`text
ultra-realistic medium close-up portrait of a confident Asian male entrepreneur in modern minimalist studio, soft cinematic lighting, 8k resolution, highly detailed skin texture, looking directly into the camera, slight confident smile, shot on 85mm lens f/1.8 --ar 9:16 --v 6.0 --style raw
\`\`\`

*(Lưu ý: Luôn chọn tỷ lệ \`--ar 9:16\` để ảnh khớp hoàn hảo với khung hình dọc của TikTok và Reels).*

---

## 5. Bước 3: Thu Âm & Clone Giọng Đọc Cảm Xúc Với ElevenLabs

Giọng AI đọc đều đều như robot sẽ giết chết tỷ lệ giữ chân (Retention Rate). Khi dùng ElevenLabs:
- Chọn Voice model **Eleven Multilingual v2**.
- Tinh chỉnh thông số:
  - **Stability:** \`0.45\` (giúp giọng có độ biến thiên cảm xúc tự nhiên, không bị cứng).
  - **Clarity + Similarity Enhancement:** \`0.85\` (tăng độ trong trẻo và chuẩn âm).
  - **Style Exaggeration:** \`0.10\` (nhấn nhá câu chữ sống động).

---

## 6. Bước 4 & 5: Đồng Bộ Khẩu Hình (Lip-Sync) & Edit Nhanh Bằng CapCut

- Nạp ảnh chân dung và file âm thanh vừa tải vào **Hedra Character-2** hoặc **Kling AI**.
- Chỉ sau 60 giây render, bạn sẽ nhận được video nhân vật cử động đầu, chớp mắt và nhép môi khớp 99% từng âm tiết.
- Kéo video vào CapCut, bấm **Auto Captions (Phụ đề tự động)**, chọn hiệu ứng chữ nảy màu vàng/xanh neon để giữ mắt người xem liên tục trên màn hình.

---

## 7. Tổng Kết & Lộ Trình Triển Khai Thực Tế

Một ngày bạn hoàn toàn có thể sản xuất từ **5 đến 10 video chất lượng cao** chỉ với 1 tiếng thao tác, xây dựng dàn kênh vệ tinh kéo hàng ngàn lượt click Affiliate và khách hàng tiềm năng mỗi tuần.

👉 **Muốn học trọn bộ kỹ thuật nâng cao từ A-Z kèm file mẫu và hỗ trợ trực tiếp?**  
Khám phá ngay:  
[**Khóa Học & Quy Trình Làm Video AI Bán Hàng Triệu View Từ 1 Ảnh (WF-VIP-297)**](/san-pham/video-ai-tu-1-anh) - Bộ giải pháp độc quyền từ Nguyễn Đăng AI!`;

  // Check existing slugs first to avoid duplicate errors
  const existing1 = await query('SELECT id FROM posts WHERE slug = ?', [slug1]);
  if (existing1.length === 0) {
    await execute(
      `INSERT INTO posts (id, slug, title, summary, content, category, tags, thumbnail, is_featured, is_published, views, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 35, NOW(), NOW())`,
      [id1, slug1, title1, summary1, content1, category1, tags1, thumbnail1]
    );
    console.log('✅ Created article 1:', slug1);
  } else {
    console.log('Article 1 already exists, updating content...');
    await execute('UPDATE posts SET content = ?, title = ?, summary = ? WHERE slug = ?', [content1, title1, summary1, slug1]);
  }

  const existing2 = await query('SELECT id FROM posts WHERE slug = ?', [slug2]);
  if (existing2.length === 0) {
    await execute(
      `INSERT INTO posts (id, slug, title, summary, content, category, tags, thumbnail, is_featured, is_published, views, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 48, NOW(), NOW())`,
      [id2, slug2, title2, summary2, content2, category2, tags2, thumbnail2]
    );
    console.log('✅ Created article 2:', slug2);
  } else {
    console.log('Article 2 already exists, updating content...');
    await execute('UPDATE posts SET content = ?, title = ?, summary = ? WHERE slug = ?', [content2, title2, summary2, slug2]);
  }

  console.log('Done inserting 2 technical articles!');
}

main().catch(console.error);

