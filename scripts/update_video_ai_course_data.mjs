import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function update() {
  const connectionUrl = process.env.DATABASE_URL || 'mysql://root:123456@localhost:3306/tuhocai_db';
  const db = await mysql.createConnection(connectionUrl);

  const courseSlug = 'video-ai-tu-1-anh';
  const [courses] = await db.query('SELECT * FROM courses WHERE slug = ?', [courseSlug]);
  if (!courses.length) {
    console.error('Course not found:', courseSlug);
    process.exit(1);
  }
  const course = courses[0];
  console.log('Found course:', course.id, course.title);

  // Lesson updates map
  const updates = [
    {
      id: 'lesson-1-1',
      title: '1.1 Tổng quan quy trình 5 bước sản xuất video AI 1 ảnh',
      duration: '10:45',
      video_url: 'https://www.youtube.com/watch?v=KOAKDMxpPxI',
      summary: 'Quy trình chuẩn từ Nguyễn Đăng AI: Biến 1 bức ảnh chân dung tĩnh thành video ngắn triệu view chuyển đổi cao, không cần lộ mặt.',
      content_markdown: `### 🎯 Mục tiêu & Tổng quan bài học:
Quy trình này giải quyết triệt để 3 rào cản lớn nhất của người sáng tạo nội dung: **sợ ống kính**, **không biết viết kịch bản** và **không có phòng quay đắt tiền**.

---

### ⚡ Lộ trình 5 bước cốt lõi:
1. **Bước 1 - Lên ý tưởng & Kịch bản Hook 3s**: Sử dụng Claude 3.7 Sonnet để tạo kịch bản đánh trúng tâm lý, giữ chân người xem ngay lập tức.
2. **Bước 2 - Tạo ảnh chân dung tỷ lệ 9:16**: Dùng Midjourney v6 hoặc FLUX với góc chụp cận trung (Medium Close-Up), ánh mắt nhìn thẳng máy quay.
3. **Bước 3 - Thu âm giọng đọc cảm xúc**: Tinh chỉnh ElevenLabs Multilingual v2 với độ ổn định 0.45 để giọng tự nhiên như người thật.
4. **Bước 4 - Tạo chuyển động & Khẩu hình (Lip-Sync)**: Kết hợp Kling AI 1.5 Motion Brush hoặc Hedra để khớp miệng 99% theo từng âm tiết.
5. **Bước 5 - Dựng CapCut PC thần tốc**: Cắt khoảng lặng, thêm chữ nhảy màu vàng neon và hiệu ứng âm thanh viral SFX.

> 💡 **Tài liệu học tập đi kèm:** Tải ngay cẩm nang PDF và đọc bài phân tích chi tiết ở mục Tài nguyên bên dưới.`,
      action_checklist: JSON.stringify([
        'Đọc kỹ file PDF Cẩm nang Quy trình Video AI đính kèm ở mục Tài nguyên',
        'Xác định 1 ngách chủ đề hoặc sản phẩm bạn muốn làm video bán hàng',
        'Cài đặt ứng dụng CapCut PC và chuẩn bị tài khoản AI'
      ]),
      resources: JSON.stringify([
        {
          name: 'Cẩm Nang Độc Quyền: Quy Trình Làm Video AI Triệu View Từ 1 Ảnh (PDF Chuẩn In)',
          type: 'pdf',
          url: '/uploads/classroom/Quy-Trinh-Video-AI-Trieu-View-Tu-1-Anh-Nguyen-Dang-AI-2026.pdf',
          size: '576 KB'
        },
        {
          name: 'Bài viết chuyên sâu: Quy trình tạo video AI triệu view từ ảnh tĩnh 2026',
          type: 'link',
          url: '/bai-viet/quy-trinh-tao-video-ai-trieu-view-tu-1-anh-tinh-tiktok-reels'
        }
      ])
    },
    {
      id: 'lesson-1-2',
      title: '1.2 Viết kịch bản bán hàng cảm xúc & Hook 3 giây với Claude 3.7',
      duration: '14:20',
      video_url: 'https://www.youtube.com/watch?v=KOAKDMxpPxI',
      summary: 'Prompt chuyên sâu biến ý tưởng thành kịch bản phân cảnh chi tiết từng giây cho AI, cấu trúc Hook - Pain - Solution - CTA.',
      content_markdown: `### 🧠 Cấu trúc kịch bản chuyển đổi cao (Thời lượng 45 - 60s):

1. **HOOK (0 - 3 giây)**: Nghịch lý hoặc câu hỏi đánh trúng sự ức chế/nỗi đau lớn nhất của khách hàng. Tuyệt đối không chào hỏi dài dòng.
2. **VẤN ĐỀ & SAI LẦM (4 - 15 giây)**: Chỉ ra lý do 95% mọi người làm mãi không ra đơn vì dùng phương pháp cũ kỹ, tốn thời gian.
3. **GIẢI PHÁP ĐỘT PHÁ (16 - 38 giây)**: Tiết lộ bí kíp 3 bước cực kỳ đơn giản với công nghệ AI giúp giải quyết vấn đề ngay lập tức.
4. **KẾT QUẢ THỰC TẾ (39 - 48 giây)**: Dẫn chứng con số (view, đơn hàng, thời gian tiết kiệm) tạo sự tin tưởng tuyệt đối.
5. **CALL TO ACTION (49 - 60 giây)**: Kêu gọi bình luận từ khóa hoặc truy cập link bio để nhận tài liệu/ưu đãi giới hạn.

---

### 📋 Mẫu Mega-Prompt Copy & Paste:
\`\`\`text
Bạn là chuyên gia biên kịch video ngắn triệu view và bậc thầy tâm lý học bán hàng trên TikTok & Reels.
Hãy viết cho tôi 1 kịch bản video ngắn (thời lượng 45 - 60 giây) về chủ đề: [ĐIỀN TÊN SẢN PHẨM / CHỦ ĐỀ].
Văn phong: Dứt khoát, gần gũi, sử dụng các động từ hành động mạnh, ngắt câu ngắn để AI đọc truyền cảm.
\`\`\``,
      action_checklist: JSON.stringify([
        'Tải file JSON Bộ Mega-Prompt trong mục Tài nguyên',
        'Điền thông tin sản phẩm của bạn vào khung kịch bản',
        'Tạo ra 3 phiên bản kịch bản khác nhau để test A/B'
      ]),
      resources: JSON.stringify([
        {
          name: 'Bộ Mega-Prompt Tạo Kịch Bản Phân Cảnh & Hook 3s (JSON)',
          type: 'json',
          url: '/uploads/classroom/Bo-Mega-Prompt-Video-AI-1-Anh-2026.json',
          size: '2.5 KB'
        },
        {
          name: 'Kho Google Drive Tài Nguyên Khóa Học Gốc',
          type: 'link',
          url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing'
        }
      ])
    },
    {
      id: 'lesson-2-1',
      title: '2.1 Kỹ thuật Prompt giữ nét mặt nhân vật bằng FLUX & Midjourney',
      duration: '16:15',
      video_url: 'https://www.youtube.com/watch?v=KOAKDMxpPxI',
      summary: 'Cách dùng Seed number và tham chiếu khuôn mặt để nhân vật không bị biến dạng qua các cảnh quay, tỷ lệ chuẩn 9:16.',
      content_markdown: `### 📸 Công thức tạo nhân vật chân dung thương mại:

\`\`\`text
ultra-realistic medium close-up portrait of an attractive confident 28yo Vietnamese female entrepreneur in modern minimalist studio, subtle confident smile, sharp eye contact looking directly into the camera, soft cinematic warm rim lighting, 8k resolution, authentic skin texture with natural pores, shot on 85mm lens f/1.8 --ar 9:16 --v 6.0 --style raw
\`\`\`

---

### 🔑 Các lưu ý sống còn:
- **Tỷ lệ khung hình**: Bắt buộc thêm \`--ar 9:16\` để ảnh vừa khít màn hình dọc của TikTok, Facebook Reels và YouTube Shorts.
- **Khuôn mặt**: Phải chiếm từ 45% đến 55% diện tích ảnh, ánh mắt nhìn thẳng vào camera (direct eye contact) để người xem có cảm giác đang trò chuyện trực tiếp.
- **Giữ nhân vật nhất quán**: Lưu lại mã \`--seed\` và sử dụng câu lệnh tham chiếu \`--cref [URL_ANH_GOC] --cw 70\`.`,
      action_checklist: JSON.stringify([
        'Tạo ảnh nhân vật chính đại diện cho kênh của bạn',
        'Lưu lại hình ảnh gốc chuẩn 4K và mã Seed',
        'Kiểm tra ánh mắt nhân vật nhìn thẳng vào ống kính'
      ]),
      resources: JSON.stringify([
        {
          name: 'Cẩm Nang Độc Quyền: Quy Trình Làm Video AI Triệu View (PDF)',
          type: 'pdf',
          url: '/uploads/classroom/Quy-Trinh-Video-AI-Trieu-View-Tu-1-Anh-Nguyen-Dang-AI-2026.pdf',
          size: '576 KB'
        },
        {
          name: 'Bộ Prompt Nhân Vật & Câu Lệnh Studio 9:16 (JSON)',
          type: 'json',
          url: '/uploads/classroom/Bo-Mega-Prompt-Video-AI-1-Anh-2026.json',
          size: '2.5 KB'
        }
      ])
    },
    {
      id: 'lesson-2-2',
      title: '2.2 Hướng dẫn Kling AI tạo chuyển động mượt mà không biến dạng',
      duration: '15:10',
      video_url: 'https://www.youtube.com/watch?v=KOAKDMxpPxI',
      summary: 'Làm chủ tính năng Motion Brush và Camera Control trong Kling AI để tạo cử động mắt, nụ cười và cử chỉ tự nhiên.',
      content_markdown: `### 🎬 Thông số cấu hình chuyển động Kling AI:
- **Motion Strength**: Đặt từ 3 đến 5 (nếu đặt quá cao trên 6 nhân vật sẽ bị méo hình hoặc nhòe nét).
- **Camera Movement**: Chọn \`Slow Zoom In\` (tốc độ 2) để tăng độ cuốn hút.
- **Motion Brush**: Dùng cọ quét nhẹ vùng lông mày, khóe môi và lọn tóc trước gió để tạo độ rung chuyển động sống động.`,
      action_checklist: JSON.stringify([
        'Upload ảnh nhân vật lên Kling AI',
        'Khoanh vùng chuyển động miệng và mắt',
        'Render video 5s độ phân giải 1080p và kiểm tra độ nét'
      ]),
      resources: JSON.stringify([
        {
          name: 'Bộ Mega-Prompt & Tham Chiếu Motion Kling AI (JSON)',
          type: 'json',
          url: '/uploads/classroom/Bo-Mega-Prompt-Video-AI-1-Anh-2026.json',
          size: '2.5 KB'
        }
      ])
    },
    {
      id: 'lesson-3-1',
      title: '3.1 Ghép voice AI truyền cảm & Tạo phụ đề tự động giật gân',
      duration: '17:30',
      video_url: 'https://www.youtube.com/watch?v=KOAKDMxpPxI',
      summary: 'Lồng tiếng với ElevenLabs Multilingual v2, cân bằng âm lượng nhạc nền và tạo chữ chạy highlight màu vàng neon.',
      content_markdown: `### 🎙️ Cấu hình thông số ElevenLabs tiếng Việt:
- **Model**: \`Eleven Multilingual v2\`
- **Stability**: \`0.45\` (giúp giọng có ngữ điệu tự nhiên, không bị cứng như robot).
- **Clarity + Similarity**: \`0.85\` (tăng độ trong trẻo và chuẩn xác âm tiết).
- **Style Exaggeration**: \`0.10\` (nhấn nhá câu chữ sống động).

---

### ✂️ Kỹ thuật dựng CapCut:
- Cắt bỏ toàn bộ khoảng lặng (Silence) trên 0.3 giây bằng phím tắt \`Ctrl + B\`.
- Tạo **Auto Captions (Phụ đề tự động)**, chọn font chữ in hoa đậm nét.
- Đổi màu từ khóa nhấn mạnh sang **Vàng Neon (#FFE600)** để giữ mắt người xem liên tục trên màn hình.`,
      action_checklist: JSON.stringify([
        'Import voiceover và các clip video AI vào CapCut PC',
        'Áp dụng Auto Captions và tô màu highlight từ khóa',
        'Thêm âm thanh SFX (Whoosh, Pop, Cash register) vào điểm nhấn'
      ]),
      resources: JSON.stringify([
        {
          name: 'Bảng Checklist Thực Hành SOP Sản Xuất Video AI (DOC)',
          type: 'doc',
          url: '/uploads/classroom/Checklist-Thuc-Hanh-SOP-San-Xuat-Video-AI.doc',
          size: '1.8 KB'
        },
        {
          name: 'Gói 100+ Hiệu Ứng Âm Thanh SFX Viral (Google Drive)',
          type: 'zip',
          url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
          size: '25 MB'
        }
      ])
    },
    {
      id: 'lesson-3-2',
      title: '3.2 Khung giờ vàng đăng bài & Tối ưu SEO TikTok / Reels / Shorts',
      duration: '12:45',
      video_url: 'https://www.youtube.com/watch?v=KOAKDMxpPxI',
      summary: 'Chiến lược phân phối 1 video ra 4 nền tảng kèm kỹ thuật ghim comment kéo khách vào bio affiliate tự động.',
      content_markdown: `### ⏰ Khung giờ vàng đăng video TikTok & Reels:
- **Trưa: 11:30 - 12:45** (Dân văn phòng nghỉ trưa lướt feed).
- **Chiều tối: 18:00 - 19:30** (Tan tầm về nhà).
- **Tối đỉnh điểm: 20:30 - 22:30** (Thời gian vàng truy cập nhiều nhất trong ngày).

---

### 📌 Chiến lược ghim Comment Affiliate:
Ngay sau khi đăng, dùng chính kênh của mình viết bình luận:  
*"Bộ prompt kịch bản và tài liệu video AI chi tiết mình đã để sẵn trong link bio cá nhân, bấm nhận miễn phí nhé!"*  
Sau đó bấm **Ghim bình luận** để mọi người xem lướt qua đều bấm vào bio của bạn.`,
      action_checklist: JSON.stringify([
        'Xuất file MP4 1080x1920 chuẩn 60fps',
        'Đăng video vào khung giờ vàng đã chọn',
        'Ghim bình luận kêu gọi hành động vào đầu video'
      ]),
      resources: JSON.stringify([
        {
          name: 'Cẩm Nang Độc Quyền: Quy Trình Làm Video AI Triệu View (PDF)',
          type: 'pdf',
          url: '/uploads/classroom/Quy-Trinh-Video-AI-Trieu-View-Tu-1-Anh-Nguyen-Dang-AI-2026.pdf',
          size: '576 KB'
        },
        {
          name: 'Bảng Checklist Thực Hành SOP Sản Xuất Video AI (DOC)',
          type: 'doc',
          url: '/uploads/classroom/Checklist-Thuc-Hanh-SOP-San-Xuat-Video-AI.doc',
          size: '1.8 KB'
        }
      ])
    }
  ];

  for (const item of updates) {
    console.log(`Updating lesson: ${item.id} - ${item.title}`);
    await db.query(
      `UPDATE course_lessons 
       SET title = ?, duration = ?, video_url = ?, summary = ?, content_markdown = ?, action_checklist = ?, resources = ?
       WHERE id = ?`,
      [
        item.title,
        item.duration,
        item.video_url,
        item.summary,
        item.content_markdown,
        item.action_checklist,
        item.resources,
        item.id
      ]
    );
  }

  console.log('✅ All lessons in course_lessons successfully updated!');
  await db.end();
}

update().catch(console.error);

