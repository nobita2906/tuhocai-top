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
            title: '1.1 Tổng quan quy trình sản xuất video AI 1 ảnh',
            duration: '08:45',
            videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', // Placeholder embed, replaceable with unlisted YT
            summary: 'Nắm vững quy trình 4 bước: Tạo ảnh -> Image-to-Video -> Lồng tiếng AI -> Dựng CapCut chuyển đổi cao.',
            contentMarkdown: `### Mục tiêu bài học:
- Hiểu rõ tư duy chọn chủ đề và ngách nội dung dễ viral.
- Chuẩn bị tài nguyên hình ảnh chất lượng cao 16:9 hoặc 9:16.
- Quy tắc 3 giây đầu giữ chân khán giả lướt Feed.`,
            actionChecklist: [
              'Chọn 1 ngách sản phẩm hoặc chủ đề muốn làm video',
              'Đăng ký tài khoản Kling AI / Runway / Midjourney',
              'Tải sẵn ứng dụng CapCut PC bản mới nhất'
            ],
            resources: [
              {
                name: 'Kịch bản mẫu 3 giây đầu giật gân (PDF)',
                type: 'pdf',
                url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
                size: '1.2 MB'
              }
            ],
            sortOrder: 1,
          },
          {
            id: 'lesson-1-2',
            title: '1.2 Viết kịch bản bán hàng cảm xúc với ChatGPT / Claude',
            duration: '12:10',
            videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            summary: 'Prompt chuyên sâu biến ý tưởng thành kịch bản phân cảnh chi tiết từng giây cho AI.',
            contentMarkdown: `### Cấu trúc kịch bản chuẩn:
1. **Hook (0-3s)**: Nỗi đau hoặc nghịch lý bất ngờ.
2. **Story (4-25s)**: Trải nghiệm hoặc câu chuyện dẫn dắt.
3. **Climax (26-45s)**: Giải pháp đột phá từ sản phẩm.
4. **Call To Action (46-60s)**: Lời kêu gọi mua hàng hoặc nhận quà.`,
            actionChecklist: [
              'Copy bộ Mega-Prompt viết kịch bản từ mục Tài nguyên',
              'Điền thông tin sản phẩm của bạn vào template',
              'Tạo ra 3 phiên bản kịch bản khác nhau để test A/B'
            ],
            resources: [
              {
                name: 'Bộ Prompt Tạo Kịch Bản Phân Cảnh (TXT)',
                type: 'doc',
                url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
                size: '45 KB'
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
            duration: '15:30',
            videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            summary: 'Cách dùng Seed number và tham chiếu khuôn mặt để nhân vật không bị biến dạng qua các cảnh quay.',
            contentMarkdown: `### Mẹo thực chiến:
- Luôn giữ cố định bộ tham số: \`--cref\`, \`--cw 70\`, ánh sáng studio cinematic.
- Cách chỉnh sửa bàn tay và góc nghiêng của nhân vật.`,
            actionChecklist: [
              'Tạo nhân vật đại diện chính cho kênh',
              'Lưu lại mã Seed và hình ảnh gốc chuẩn 4K',
              'Xuất 5 góc chụp khác nhau của nhân vật'
            ],
            resources: [
              {
                name: '50 Prompt Chân Dung Thương Mại Đẹp Nhất (PDF)',
                type: 'pdf',
                url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing',
                size: '4.8 MB'
              }
            ],
            sortOrder: 3,
          },
          {
            id: 'lesson-2-2',
            title: '2.2 Hướng dẫn Kling AI tạo chuyển động mượt mà không biến dạng',
            duration: '14:20',
            videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            summary: 'Làm chủ tính năng Motion Brush và Camera Control trong Kling AI để tạo cử động mắt, nụ cười và cử chỉ.',
            contentMarkdown: `### Các thông số quan trọng:
- Motion Strength: Nên đặt từ 3 - 5 để tránh nhòe hình.
- End Frame: Giúp khớp cảnh chuyển tiếp mượt mà.`,
            actionChecklist: [
              'Upload ảnh nhân vật lên Kling AI',
              'Khoanh vùng chuyển động miệng và mắt',
              'Render video 5s độ phân giải 1080p'
            ],
            resources: [
              {
                name: 'Bảng tham chiếu lệnh Motion Control Kling AI',
                type: 'doc',
                url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing'
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
            duration: '16:05',
            videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            summary: 'Lồng tiếng với ElevenLabs / Vbee, cân bằng âm lượng nhạc nền và tạo chữ chạy highlight màu vàng neon.',
            contentMarkdown: `### Checklist dựng phim:
- Cắt gọt khoảng lặng (Silence removal) giúp video nhịp điệu dồn dập.
- Thêm Sound Effects (Whoosh, Pop, Cash register) vào điểm nhấn.`,
            actionChecklist: [
              'Import voiceover và các clip video AI vào CapCut',
              'Áp dụng Auto Captions và font chữ đậm',
              'Thêm hiệu ứng rung nhẹ (Camera shake) vào cảnh cao trào'
            ],
            resources: [
              {
                name: 'Gói 100+ Hiệu Ứng Âm Thanh SFX Viral (ZIP)',
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
            duration: '11:15',
            videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            summary: 'Chiến lược phân phối 1 video ra 4 nền tảng (TikTok, FB Reels, IG Reels, YouTube Shorts) kèm link bio affiliate.',
            contentMarkdown: `### Checklist xuất bản:
- Tiêu đề chứa từ khóa tìm kiếm phổ biến.
- 3 Hashtag ngách + 2 Hashtag xu hướng.
- Ghim comment điều hướng mua hàng ngay sau khi đăng.`,
            actionChecklist: [
              'Xuất file MP4 1080x1920 60fps',
              'Đăng thử nghiệm video đầu tiên',
              'Báo cáo kết quả và chia sẻ link vào nhóm Zalo Hỗ Trợ'
            ],
            resources: [
              {
                name: 'Lịch Đăng Bài Mẫu 30 Ngày Tự Động (Google Sheets)',
                type: 'link',
                url: 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing'
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

