export interface LessonResource {
  name: string;
  type: 'json' | 'pdf' | 'doc' | 'link' | 'zip';
  url: string;
  size?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  summary: string;
  contentMarkdown: string;
  actionChecklist: string[];
  resources: LessonResource[];
  sortOrder: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  slug: string;
  pid: string;
  title: string;
  headline: string;
  category: 'workflow' | 'skill' | 'prompt' | 'course';
  price: number;
  level: string;
  thumbnail: string;
  instructor: string;
  modules: Module[];
}

export const COURSES: Course[] = [
  {
    slug: 'video-ai-tu-1-anh',
    pid: 'WF-VIP-297',
    title: 'Khóa Học & Quy Trình Làm Video AI Bán Hàng Triệu View Từ 1 Ảnh',
    headline: 'Xây dựng chuỗi video ngắn chuyển đổi cao không cần lộ mặt, áp dụng Kling AI & Midjourney thực chiến.',
    category: 'workflow',
    price: 297000,
    level: 'Thực chiến A-Z',
    thumbnail: '/sites/tuhocai-top/landing/video-vip/ket-qua-video.jpg',
    instructor: 'Đội ngũ Kỹ thuật Tự Học AI',
    modules: [
      {
        id: 'mod-1',
        title: 'Phần 1: Thiết Lập Công Cụ & Kịch Bản Giữ Chân 3 Giây Đầu',
        lessons: [
          {
            id: 'lesson-1-1',
            title: '1.1 Tổng quan quy trình 5 bước sản xuất video AI 1 ảnh',
            duration: '10:45',
            videoUrl: 'https://www.youtube.com/watch?v=KOAKDMxpPxI',
            summary: 'Quy trình chuẩn từ Nguyễn Đăng AI: Biến 1 bức ảnh chân dung tĩnh thành video ngắn triệu view chuyển đổi cao, không cần lộ mặt.',
            contentMarkdown: `### 🎯 Mục tiêu & Tổng quan bài học:
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

> 💡 **Tài liệu học tập đi kèm:** Tải ngay cẩm nang PDF và đọc bài phân tích chi tiết ở mục Tài nguyên bên dưới.`,
            actionChecklist: [
              'Đọc kỹ file PDF Cẩm nang Quy trình Video AI đính kèm ở mục Tài nguyên',
              'Xác định 1 ngách chủ đề hoặc sản phẩm bạn muốn làm video bán hàng',
              'Cài đặt ứng dụng CapCut PC và chuẩn bị tài khoản AI'
            ],
            resources: [
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
            ],
            sortOrder: 1,
          },
          {
            id: 'lesson-1-2',
            title: '1.2 Viết kịch bản bán hàng cảm xúc & Hook 3 giây với Claude 3.7',
            duration: '14:20',
            videoUrl: 'https://www.youtube.com/watch?v=KOAKDMxpPxI',
            summary: 'Prompt chuyên sâu biến ý tưởng thành kịch bản phân cảnh chi tiết từng giây cho AI, cấu trúc Hook - Pain - Solution - CTA.',
            contentMarkdown: `### 🧠 Cấu trúc kịch bản chuyển đổi cao (Thời lượng 45 - 60s):

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
            actionChecklist: [
              'Tải file JSON Bộ Mega-Prompt trong mục Tài nguyên',
              'Điền thông tin sản phẩm của bạn vào khung kịch bản',
              'Tạo ra 3 phiên bản kịch bản khác nhau để test A/B'
            ],
            resources: [
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
            ],
            sortOrder: 2,
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Phần 2: Kỹ Thuật Tạo Ảnh Nhân Vật Nhất Quán & Biến Ảnh Thành Video',
        lessons: [
          {
            id: 'lesson-2-1',
            title: '2.1 Kỹ thuật Prompt giữ nét mặt nhân vật bằng FLUX & Midjourney',
            duration: '16:15',
            videoUrl: 'https://www.youtube.com/watch?v=KOAKDMxpPxI',
            summary: 'Cách dùng Seed number và tham chiếu khuôn mặt để nhân vật không bị biến dạng qua các cảnh quay, tỷ lệ chuẩn 9:16.',
            contentMarkdown: `### 📸 Công thức tạo nhân vật chân dung thương mại:

\`\`\`text
ultra-realistic medium close-up portrait of an attractive confident 28yo Vietnamese female entrepreneur in modern minimalist studio, subtle confident smile, sharp eye contact looking directly into the camera, soft cinematic warm rim lighting, 8k resolution, authentic skin texture with natural pores, shot on 85mm lens f/1.8 --ar 9:16 --v 6.0 --style raw
\`\`\`

---

### 🔑 Các lưu ý sống còn:
- **Tỷ lệ khung hình**: Bắt buộc thêm \`--ar 9:16\` để ảnh vừa khít màn hình dọc của TikTok, Facebook Reels và YouTube Shorts.
- **Khuôn mặt**: Phải chiếm từ 45% đến 55% diện tích ảnh, ánh mắt nhìn thẳng vào camera (direct eye contact) để người xem có cảm giác đang trò chuyện trực tiếp.
- **Giữ nhân vật nhất quán**: Lưu lại mã \`--seed\` và sử dụng câu lệnh tham chiếu \`--cref [URL_ANH_GOC] --cw 70\`.`,
            actionChecklist: [
              'Tạo ảnh nhân vật chính đại diện cho kênh của bạn',
              'Lưu lại hình ảnh gốc chuẩn 4K và mã Seed',
              'Kiểm tra ánh mắt nhân vật nhìn thẳng vào ống kính'
            ],
            resources: [
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
            ],
            sortOrder: 3,
          },
          {
            id: 'lesson-2-2',
            title: '2.2 Hướng dẫn Kling AI tạo chuyển động mượt mà không biến dạng',
            duration: '15:10',
            videoUrl: 'https://www.youtube.com/watch?v=KOAKDMxpPxI',
            summary: 'Làm chủ tính năng Motion Brush và Camera Control trong Kling AI để tạo cử động mắt, nụ cười và cử chỉ tự nhiên.',
            contentMarkdown: `### 🎬 Thông số cấu hình chuyển động Kling AI:
- **Motion Strength**: Đặt từ 3 đến 5 (nếu đặt quá cao trên 6 nhân vật sẽ bị méo hình hoặc nhòe nét).
- **Camera Movement**: Chọn \`Slow Zoom In\` (tốc độ 2) để tăng độ cuốn hút.
- **Motion Brush**: Dùng cọ quét nhẹ vùng lông mày, khóe môi và lọn tóc trước gió để tạo độ rung chuyển động sống động.

---

### ⚡ Prompt điều khiển chuyển động Kling AI (Image-to-Video):
\`\`\`text
gentle breathing, subtle confident smile, natural head nodding, eyes blinking smoothly, soft wind blowing hair, cinematic depth of field, sharp 4k details, smooth realistic motion
\`\`\``,
            actionChecklist: [
              'Upload ảnh nhân vật lên Kling AI',
              'Khoanh vùng chuyển động miệng và mắt',
              'Render video 5s độ phân giải 1080p và kiểm tra độ nét'
            ],
            resources: [
              {
                name: 'Bộ Mega-Prompt & Tham Chiếu Motion Kling AI (JSON)',
                type: 'json',
                url: '/uploads/classroom/Bo-Mega-Prompt-Video-AI-1-Anh-2026.json',
                size: '2.5 KB'
              }
            ],
            sortOrder: 4,
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Phần 3: Dựng CapCut, Phụ Đề Tự Động & Đăng Kênh Đa Nền Tảng',
        lessons: [
          {
            id: 'lesson-3-1',
            title: '3.1 Ghép voice AI truyền cảm & Tạo phụ đề tự động giật gân',
            duration: '17:30',
            videoUrl: 'https://www.youtube.com/watch?v=KOAKDMxpPxI',
            summary: 'Lồng tiếng với ElevenLabs Multilingual v2, cân bằng âm lượng nhạc nền và tạo chữ chạy highlight màu vàng neon.',
            contentMarkdown: `### 🎙️ Cấu hình thông số ElevenLabs tiếng Việt truyền cảm:
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
- Đổi màu từ khóa nhấn mạnh sang **Vàng Neon (#FFE600)** để giữ mắt người xem liên tục trên màn hình.`,
            actionChecklist: [
              'Import voiceover và các clip video AI vào CapCut PC',
              'Áp dụng Auto Captions và tô màu highlight từ khóa',
              'Thêm âm thanh SFX (Whoosh, Pop, Cash register) vào điểm nhấn'
            ],
            resources: [
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
            ],
            sortOrder: 5,
          },
          {
            id: 'lesson-3-2',
            title: '3.2 Khung giờ vàng đăng bài & Tối ưu SEO TikTok / Reels / Shorts',
            duration: '12:45',
            videoUrl: 'https://www.youtube.com/watch?v=KOAKDMxpPxI',
            summary: 'Chiến lược phân phối 1 video ra 4 nền tảng kèm kỹ thuật ghim comment kéo khách vào bio affiliate tự động.',
            contentMarkdown: `### ⏰ Khung giờ vàng đăng video TikTok & Reels:
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
Sau đó bấm **Ghim bình luận** để mọi người xem lướt qua đều bấm vào bio của bạn.`,
            actionChecklist: [
              'Xuất file MP4 1080x1920 chuẩn 60fps',
              'Đăng video vào khung giờ vàng đã chọn',
              'Ghim bình luận kêu gọi hành động vào đầu video'
            ],
            resources: [
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
            ],
            sortOrder: 6,
          }
        ]
      }
    ]
  },
  {
    slug: 'workflow-n8n-tu-dong-dang-bai-da-kenh',
    pid: 'WF-THAI-099',
    title: 'Workflow n8n Tự Động Đăng Bài Đa Kênh (Facebook, Telegram, WordPress)',
    headline: 'Tự động hóa hoàn toàn luồng viết nội dung bằng AI và xuất bản lên mạng xã hội theo lịch hẹn 24/7.',
    category: 'workflow',
    price: 99000,
    level: 'Thực chiến 1-Click',
    thumbnail: '/images/products/n8n-workflow-demo.jpg',
    instructor: 'Đội ngũ Kỹ thuật Tự Học AI',
    modules: [
      {
        id: 'n8n-mod-1',
        title: 'Phần 1: Cài Đặt Môi Trường n8n & Cấu Hình Kết Nối API',
        lessons: [
          {
            id: 'n8n-1-1',
            title: '1.1 Cài đặt n8n miễn phí trên Docker hoặc n8n Cloud',
            duration: '10:15',
            videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            summary: 'Hướng dẫn cài đặt n8n tự host trên VPS hoặc dùng gói n8n Cloud nhanh gọn trong 5 phút.',
            contentMarkdown: `### Nội dung:
- Lệnh chạy Docker Compose 1-click.
- Cấu hình domain SSL HTTPS cho webhook.`,
            actionChecklist: [
              'Đăng nhập bảng điều khiển n8n',
              'Tạo dự án mới mang tên "Auto Social Post"'
            ],
            resources: [
              {
                name: 'File Docker Compose n8n chuẩn (YAML)',
                type: 'doc',
                url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing'
              }
            ],
            sortOrder: 1,
          },
          {
            id: 'n8n-1-2',
            title: '1.2 Tạo API Token Facebook Page & Telegram Bot',
            duration: '13:40',
            videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            summary: 'Lấy Access Token vĩnh viễn cho Fanpage và tạo Telegram Bot nhận thông báo xuất bản.',
            contentMarkdown: `### Các bước thực hiện:
1. Vào developers.facebook.com tạo App.
2. Lấy Page Access Token (Never Expire).
3. Chat với @BotFather tạo Telegram Bot.`,
            actionChecklist: [
              'Lưu Page ID và Access Token',
              'Lưu Bot Token và Chat ID Telegram'
            ],
            resources: [
              {
                name: 'Hướng dẫn chi tiết cấp quyền Facebook Graph API (PDF)',
                type: 'pdf',
                url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing'
              }
            ],
            sortOrder: 2,
          }
        ]
      },
      {
        id: 'n8n-mod-2',
        title: 'Phần 2: Import Mã Nguồn JSON & Vận Hành Luồng Đăng Bài',
        lessons: [
          {
            id: 'n8n-2-1',
            title: '2.1 Import file JSON flow vào n8n & Thiết lập kết nối',
            duration: '14:50',
            videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            summary: 'Nhập file JSON đính kèm, gắn API key và test chạy thử luồng đầu tiên.',
            contentMarkdown: `### Lưu ý quan trọng:
- Thay biến môi trường \`OPENAI_API_KEY\` hoặc \`GEMINI_API_KEY\`.
- Cấu hình Cron Trigger: Chạy mỗi ngày lúc 8:00 sáng và 19:30 tối.`,
            actionChecklist: [
              'Tải file JSON flow từ mục Tài nguyên bên dưới',
              'Vào n8n -> Import from File',
              'Bấm nút "Test Step" từng node để đảm bảo xanh lá'
            ],
            resources: [
              {
                name: 'Mã nguồn n8n_Auto_Post_MultiChannel_v2.json',
                type: 'json',
                url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
                size: '68 KB'
              }
            ],
            sortOrder: 3,
          },
          {
            id: 'n8n-2-2',
            title: '2.2 Tùy biến prompt tạo nội dung và xử lý lỗi tự động',
            duration: '11:30',
            videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            summary: 'Cách điều chỉnh giọng văn (Tone of voice) bài viết và cấu hình thông báo lỗi về Telegram khi API quá tải.',
            contentMarkdown: `### Cải tiến nâng cao:
- Cấu hình node Error Trigger tự động gửi thông báo khi đăng bài thất bại.`,
            actionChecklist: [
              'Bật công tắc Active cho workflow',
              'Kiểm tra bài đăng mẫu xuất hiện trên Facebook Page'
            ],
            resources: [
              {
                name: 'Bộ 20 Prompt Tự Động Viết Bài Chuyên Nghiệp',
                type: 'doc',
                url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing'
              }
            ],
            sortOrder: 4,
          }
        ]
      }
    ]
  },
  {
    slug: 'app-flow-google-auto-bao-cao-sheets',
    pid: 'WF-FLOW-001',
    title: 'App Flow Google - Auto Báo Cáo Sheets (Miễn Phí 0Đ)',
    headline: 'Tự động tổng hợp dữ liệu Google Sheets và gửi báo cáo tóm tắt hàng ngày về Telegram hoàn toàn miễn phí.',
    category: 'workflow',
    price: 0,
    level: 'Cơ bản',
    thumbnail: '/images/products/n8n-workflow-demo.jpg',
    instructor: 'Đội ngũ Kỹ thuật Tự Học AI',
    modules: [
      {
        id: 'flow-mod-1',
        title: 'Phần 1: Cấu Hình Tự Động Hóa Google Sheets & Telegram',
        lessons: [
          {
            id: 'flow-1-1',
            title: '1.1 Sao chép template Google Sheets & Cài Apps Script',
            duration: '09:20',
            videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            summary: 'Nhận bản sao Google Sheets chuẩn bị sẵn công thức và mã nguồn Apps Script tự động.',
            contentMarkdown: `### Các bước nhanh trong 3 phút:
1. Tạo bản sao bảng tính Google Sheets mẫu.
2. Vào **Tiện ích mở rộng -> Apps Script**.
3. Dán mã nguồn có sẵn và điền Telegram Bot Token.`,
            actionChecklist: [
              'Bấm mở bản sao Google Sheets mẫu',
              'Thêm Bot Telegram vào nhóm nội bộ cần nhận báo cáo'
            ],
            resources: [
              {
                name: 'Template Google Sheets Báo Cáo Doanh Thu Mẫu',
                type: 'link',
                url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing'
              },
              {
                name: 'Mã nguồn Apps Script Google Sheets to Telegram (JS)',
                type: 'doc',
                url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing'
              }
            ],
            sortOrder: 1,
          },
          {
            id: 'flow-1-2',
            title: '1.2 Thiết lập đồng hồ hẹn giờ (Time Trigger) gửi báo cáo tự động',
            duration: '07:15',
            videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            summary: 'Cài đặt tự động chạy báo cáo định kỳ 8:00 mỗi sáng hoặc 18:00 mỗi chiều hoàn toàn miễn phí.',
            contentMarkdown: `### Vận hành:
- Google Apps Script chạy trên hạ tầng đám mây của Google, không cần bật máy tính.`,
            actionChecklist: [
              'Tạo Trigger theo thời gian trong Apps Script',
              'Chạy hàm testSendReport để nhận tin nhắn đầu tiên'
            ],
            resources: [
              {
                name: 'File hướng dẫn xử lý lỗi bảo mật Google (PDF)',
                type: 'pdf',
                url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing'
              }
            ],
            sortOrder: 2,
          }
        ]
      }
    ]
  },
  {
    slug: 'video-drama-gia-dinh-nho',
    pid: 'WF-DRAMA-069',
    title: 'Quy trình Video AI Câu Chuyện Gia Đình Nhỏ (Mini Drama 69K)',
    headline: 'Công thức tạo chuỗi video hoạt hình AI xúc động triệu view về tình cảm gia đình, tình cha mẹ con cái.',
    category: 'workflow',
    price: 69000,
    level: 'Thực chiến',
    thumbnail: '/sites/tuhocai-top/landing/drama/mini-drama-results-atm.png',
    instructor: 'Đội ngũ Kỹ thuật Tự Học AI',
    modules: [
      {
        id: 'drama-mod-1',
        title: 'Phần 1: Kịch Bản 3 Hồi & Tạo Nhân Vật Drama Việt Nam',
        lessons: [
          {
            id: 'drama-1-1',
            title: '1.1 Cấu trúc kịch bản 60s lấy nước mắt người xem',
            duration: '11:45',
            videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            summary: 'Cách tạo tình huống mâu thuẫn gia đình và nút thắt hóa giải xúc động giữ chân người xem 100%.',
            contentMarkdown: `### 3 Yếu tố cốt lõi:
1. Nhân vật gần gũi: Bố mẹ già ở quê, con cái đi làm xa.
2. Tình tiết xúc động: Món quà bất ngờ, hy sinh thầm lặng.
3. Câu đúc kết nhân văn chạm đến trái tim.`,
            actionChecklist: [
              'Chọn 1 trong 5 kịch bản mẫu đính kèm',
              'Tùy biến câu thoại phù hợp với vùng miền'
            ],
            resources: [
              {
                name: 'Tuyển tập 10 kịch bản Mini Drama triệu view (PDF)',
                type: 'pdf',
                url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing'
              }
            ],
            sortOrder: 1,
          },
          {
            id: 'drama-1-2',
            title: '1.2 Tạo ảnh hoạt hình 3D phong cách Disney / Pixar ấm áp',
            duration: '13:50',
            videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            summary: 'Prompt chuyên biệt tạo bối cảnh làng quê Việt Nam, căn nhà xưa và nhân vật biểu cảm chân thực.',
            contentMarkdown: `### Mẫu prompt:
\`Warm cinematic lighting, nostalgic Vietnamese countryside house, Pixar animation style, emotional storytelling, 8k resolution.\``,
            actionChecklist: [
              'Tạo bộ ảnh 6 phân cảnh cho câu chuyện',
              'Chuyển động bằng Kling AI hoặc Luma Dream Machine'
            ],
            resources: [
              {
                name: 'Bộ Prompt Nhân Vật Hoạt Hình Gia Đình (TXT)',
                type: 'doc',
                url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing'
              }
            ],
            sortOrder: 2,
          }
        ]
      }
    ]
  }
];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug || c.pid.toLowerCase() === slug.toLowerCase());
}

export function getAllCourses(): Course[] {
  return COURSES;
}

