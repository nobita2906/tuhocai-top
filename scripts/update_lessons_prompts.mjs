import { query } from '../src/lib/db.ts';

async function updateDbLessons() {
  console.log('Updating MySQL course_lessons for course db11d5a0-49b8-44c0-82e8-63c284724c31...');

  // Lesson 1.1
  await query(
    `UPDATE course_lessons SET content_markdown = ? WHERE id = 'lesson-1-1'`,
    [`### 🎯 Mục tiêu & Tổng quan bài học:
Quy trình này giải quyết triệt để 3 rào cản lớn nhất của người sáng tạo nội dung: **sợ ống kính**, **không biết viết kịch bản** và **không có phòng quay đắt tiền**.

---

### ⚡ Lộ trình 5 bước cốt lõi:
1. **Bước 1 - Lên ý tưởng & Kịch bản Hook 3s**: Sử dụng Claude 3.7 Sonnet để tạo kịch bản đánh trúng tâm lý, giữ chân người xem ngay lập tức.
2. **Bước 2 - Tạo ảnh chân dung tỷ lệ 9:16**: Dùng Midjourney v6 hoặc FLUX với góc chụp cận trung (Medium Close-Up), ánh mắt nhìn thẳng máy quay.
3. **Bước 3 - Thu âm giọng đọc cảm xúc**: Tinh chỉnh ElevenLabs Multilingual v2 với độ ổn định 0.45 để giọng tự nhiên như người thật.
4. **Bước 4 - Tạo chuyển động & Khẩu hình (Lip-Sync)**: Kết hợp Kling AI 1.5 Motion Brush hoặc Hedra để khớp miệng 99% theo từng âm tiết.
5. **Bước 5 - Dựng CapCut PC thần tốc**: Cắt khoảng lặng, thêm chữ nhảy màu vàng neon và hiệu ứng âm thanh viral SFX.

---

### 📋 Mega-Prompt Lập Kế Hoạch Sản Xuất Video AI (Copy & Paste):
\`\`\`text
Bạn là Giám đốc Sáng tạo nội dung video ngắn AI triệu view.
Hãy phân tích sản phẩm/dịch vụ sau: [ĐIỀN TÊN SẢN PHẨM / CHỦ ĐỀ CỦA BẠN]
Và lập kế hoạch sản xuất video AI 1 ảnh tỷ lệ 9:16 gồm:
1. Ý tưởng Hook 3 giây đầu tiên gây tò mò, giữ chân người xem.
2. Mô tả ngoại hình, thần thái nhân vật ảo đại diện kênh (tuổi, trang phục, biểu cảm).
3. Kịch bản phân cảnh chi tiết khớp từng câu thoại (45 - 60 giây).
4. Gợi ý âm thanh hiệu ứng SFX (Whoosh, Pop, Cash) tại các điểm nhấn.
\`\`\`

> 💡 **Tài liệu học tập đi kèm:** Tải ngay cẩm nang PDF và đọc bài phân tích chi tiết ở mục Tài nguyên bên dưới.`]
  );

  // Lesson 1.2
  await query(
    `UPDATE course_lessons SET content_markdown = ? WHERE id = 'lesson-1-2'`,
    [`### 🧠 Cấu trúc kịch bản chuyển đổi cao (Thời lượng 45 - 60s):

1. **HOOK (0 - 3 giây)**: Nghịch lý hoặc câu hỏi đánh trúng sự ức chế/nỗi đau lớn nhất của khách hàng. Tuyệt đối không chào hỏi dài dòng.
2. **VẤN ĐỀ & SAI LẦM (4 - 15 giây)**: Chỉ ra lý do 95% mọi người làm mãi không ra đơn vì dùng phương pháp cũ kỹ, tốn thời gian.
3. **GIẢI PHÁP ĐỘT PHÁ (16 - 38 giây)**: Tiết lộ bí kíp 3 bước cực kỳ đơn giản với công nghệ AI giúp giải quyết vấn đề ngay lập tức.
4. **KẾT QUẢ THỰC TẾ (39 - 48 giây)**: Dẫn chứng con số (view, đơn hàng, thời gian tiết kiệm) tạo sự tin tưởng tuyệt đối.
5. **CALL TO ACTION (49 - 60 giây)**: Kêu gọi bình luận từ khóa hoặc truy cập link bio để nhận tài liệu/ưu đãi giới hạn.

---

### 📋 Mẫu Mega-Prompt Viết Kịch Bản Bán Hàng Với Claude 3.7:
\`\`\`text
Bạn là chuyên gia biên kịch video ngắn triệu view và bậc thầy tâm lý học bán hàng trên TikTok & Reels.
Hãy viết cho tôi 1 kịch bản video ngắn (thời lượng 45 - 60 giây) về chủ đề: [ĐIỀN TÊN SẢN PHẨM / CHỦ ĐỀ].
Cấu trúc kịch bản chuẩn:
- [0-3s] Hook gây tò mò cực độ:
- [4-15s] Nỗi đau & Sai lầm thường gặp:
- [16-35s] Bí kíp giải pháp thần tốc với AI:
- [36-45s] Kết quả thực tế & Bằng chứng:
- [46-60s] Call To Action kêu gọi comment:
Văn phong: Dứt khoát, gần gũi, sử dụng các động từ hành động mạnh, ngắt câu ngắn dưới 12 từ để AI đọc truyền cảm.
\`\`\``]
  );

  // Lesson 2.1
  await query(
    `UPDATE course_lessons SET content_markdown = ? WHERE id = 'lesson-2-1'`,
    [`### 📸 Công thức tạo nhân vật chân dung thương mại Midjourney & FLUX:

\`\`\`text
ultra-realistic medium close-up portrait of an attractive confident 28yo Vietnamese female entrepreneur in modern minimalist studio, subtle confident smile, sharp eye contact looking directly into the camera, soft cinematic warm rim lighting, 8k resolution, authentic skin texture with natural pores, shot on 85mm lens f/1.8 --ar 9:16 --v 6.0 --style raw
\`\`\`

---

### 🔁 Câu lệnh giữ nguyên khuôn mặt nhân vật qua nhiều cảnh quay (--cref):
\`\`\`text
[URL_ANH_GOC] attractive Vietnamese female entrepreneur talking to camera, expressive hand gestures, modern office background, soft cinematic lighting --cref [URL_ANH_GOC] --cw 75 --seed 4892110 --ar 9:16 --v 6.0
\`\`\`

---

### 🔑 Các lưu ý sống còn:
- **Tỷ lệ khung hình**: Bắt buộc thêm \`--ar 9:16\` để ảnh vừa khít màn hình dọc của TikTok, Facebook Reels và YouTube Shorts.
- **Khuôn mặt**: Phải chiếm từ 45% đến 55% diện tích ảnh, ánh mắt nhìn thẳng vào camera (direct eye contact) để người xem có cảm giác đang trò chuyện trực tiếp.
- **Giữ nhân vật nhất quán**: Lưu lại mã \`--seed\` và sử dụng câu lệnh tham chiếu \`--cref [URL_ANH_GOC] --cw 70\`.`]
  );

  // Lesson 2.2
  await query(
    `UPDATE course_lessons SET content_markdown = ? WHERE id = 'lesson-2-2'`,
    [`### 🎬 Thông số cấu hình chuyển động Kling AI:
- **Motion Strength**: Đặt từ 3 đến 5 (nếu đặt quá cao trên 6 nhân vật sẽ bị méo hình hoặc nhòe nét).
- **Camera Movement**: Chọn \`Slow Zoom In\` (tốc độ 2) để tăng độ cuốn hút.
- **Motion Brush**: Dùng cọ quét nhẹ vùng lông mày, khóe môi và lọn tóc trước gió để tạo độ rung chuyển động sống động.

---

### ⚡ Prompt điều khiển chuyển động Kling AI (Image-to-Video):
\`\`\`text
gentle breathing, subtle confident smile, natural head nodding, eyes blinking smoothly, soft wind blowing hair, cinematic depth of field, sharp 4k details, smooth realistic motion
\`\`\``]
  );

  // Lesson 3.1
  await query(
    `UPDATE course_lessons SET content_markdown = ? WHERE id = 'lesson-3-1'`,
    [`### 🎙️ Cấu hình thông số ElevenLabs tiếng Việt truyền cảm:
\`\`\`text
Model: Eleven Multilingual v2
Voice: Adam / Rachel (Hoặc giọng clone tiếng Việt chuẩn)
Stability: 0.45 (Giúp giọng có ngữ điệu tự nhiên, không bị cứng như robot)
Clarity + Similarity: 0.85 (Tăng độ trong trẻo và chuẩn xác âm tiết)
Style Exaggeration: 0.10 (Nhấn nhá câu chữ sống động)
Speaker Boost: ON
\`\`\`

---

### ✂️ Kỹ thuật dựng CapCut PC thần tốc:
- Cắt bỏ toàn bộ khoảng lặng (Silence) trên 0.3 giây bằng phím tắt \`Ctrl + B\`.
- Tạo **Auto Captions (Phụ đề tự động)**, chọn font chữ in hoa đậm nét.
- Đổi màu từ khóa nhấn mạnh sang **Vàng Neon (#FFE600)** để giữ mắt người xem liên tục trên màn hình.`]
  );

  // Lesson 3.2
  await query(
    `UPDATE course_lessons SET content_markdown = ? WHERE id = 'lesson-3-2'`,
    [`### ⏰ Khung giờ vàng đăng video TikTok & Reels:
- **Trưa: 11:30 - 12:45** (Dân văn phòng nghỉ trưa lướt feed).
- **Chiều tối: 18:00 - 19:30** (Tan tầm về nhà).
- **Tối đỉnh điểm: 20:30 - 22:30** (Thời gian vàng truy cập nhiều nhất trong ngày).

---

### 🏷️ Mẫu Caption & Bộ Hashtag TikTok / Reels Chuẩn SEO (Copy & Paste):
\`\`\`text
Cách mình làm video bán hàng triệu view từ đúng 1 bức ảnh chân dung AI (ai cũng làm được chỉ với 5 phút) 👇

Quy trình 5 bước:
1️⃣ Lên kịch bản Hook 3s với Claude 3.7
2️⃣ Tạo ảnh chân dung 9:16 bằng Midjourney
3️⃣ Lồng tiếng AI truyền cảm
4️⃣ Làm chuyển động mượt bằng Kling AI
5️⃣ Auto phụ đề màu vàng neon trên CapCut PC

👉 Nhận trọn bộ Prompt & File hướng dẫn miễn phí tại link bio nhé!
#tuhocai #videoai #videotrieuview #kinhdoanhtiktok #congngheai #huongdanai #capcut #affiliate
\`\`\`

---

### 📌 Chiến lược ghim Comment Affiliate:
Ngay sau khi đăng, dùng chính kênh của mình viết bình luận:  
*"Bộ prompt kịch bản và tài liệu video AI chi tiết mình đã để sẵn trong link bio cá nhân, bấm nhận miễn phí nhé!"*  
Sau đó bấm **Ghim bình luận** để mọi người xem lướt qua đều bấm vào bio của bạn.`]
  );

  console.log('✓ Cập nhật thành công 6 bài học với Prompt mẫu chuẩn chỉnh!');
}

updateDbLessons().catch(console.error);

