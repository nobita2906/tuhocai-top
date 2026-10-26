import { NextResponse } from 'next/server';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { getSiteSettings } from '@/lib/settings';
import { slugifyVietnamese } from '@/lib/slugify';

export async function POST(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { topic, category = 'NEWS', tone = 'Chuyên gia, thực chiến, cô đọng (Anti-AI Slop)' } = await req.json();

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: 'Vui lòng cung cấp chủ đề hoặc tiêu đề bài viết' }, { status: 400 });
    }

    const settings = await getSiteSettings();
    const geminiKey = settings.gemini_api_key || process.env.GEMINI_API_KEY;
    const openaiKey = settings.openai_api_key || process.env.OPENAI_API_KEY;

    const systemPrompt = `Bạn là Nguyễn Văn Đăng - AI Solution Architect và Founder tại Tự Học AI (tuhocai.top).
Bạn có phong cách viết thực chiến, cô đọng, chuyên sâu, tuyệt đối nói KHÔNG với nội dung rác (Anti-AI Slop).

QUY TẮC BẮT BUỘC (ANTI-AI SLOP):
1. Tuyệt đối KHÔNG viết các câu sáo rỗng vô thưởng vô phạt: "Trong kỷ nguyên số bùng nổ...", "Hãy cùng chúng tôi khám phá...", "Như chúng ta đã biết...". Hãy đi thẳng vào vấn đề (Bottom-Line Up Front).
2. Nội dung PHẢI có tính ứng dụng cao, người đọc làm theo được ngay trong 10-15 phút.
3. BẮT BUỘC có 1 khối Code / Prompt / JSON mẫu chuẩn xác trong khối markdown (\`\`\`markdown hoặc \`\`\`json) để người đọc có thể copy-paste dùng ngay.
4. BẮT BUỘC có 1 bảng Markdown so sánh hoặc Checklist thực thi rõ ràng.
5. BẮT BUỘC có mục "Lỗi thường gặp & Cách khắc phục" (Troubleshooting) để tăng tính xác thực kinh nghiệm thực tế.
6. Gắn Backlink và Anchor chuyển đổi tự nhiên:
   - Quà tặng Prompt / Tài liệu 0đ: [Nhóm Zalo VIP Tự Học AI](https://zalo.me/g/tuhocai)
   - Khóa học / Quy trình tự động hoá: [Hệ thống n8n Tự Động Hóa](https://www.tuhocai.top/lp/n8n-tu-dong-hoa-kiem-tien)
   - Kiếm tiền Affiliate hoa hồng 30-50%: [Chương trình Affiliate Tự Học AI](https://www.tuhocai.top/affiliate)

YÊU CẦU ĐỊNH DẠNG ĐẦU RA:
BẮT BUỘC trả về DUY NHẤT một chuỗi JSON hợp lệ (không kèm backticks bên ngoài):
{
  "title": "Tiêu đề bài viết hấp dẫn, chuẩn SEO E-E-A-T (khoảng 50-70 ký tự)",
  "summary": "Đoạn mô tả tóm tắt cô đọng giải quyết trực tiếp nỗi đau người đọc (120-160 ký tự)",
  "category": "${category}",
  "tags": "Từ khóa phân cách bằng dấu phẩy",
  "content": "Nội dung bài viết đầy đủ bằng Markdown tiêu chuẩn gồm H2, H3, khối prompt/code, checklist, bảng so sánh và các anchor link phễu chuyển đổi."
}`;

    const userPrompt = `Chủ đề bài viết: "${topic.trim()}"\nChuyên mục: ${category}\nPhong cách hành văn: ${tone}`;

    // 1. Try Google Gemini API if key exists
    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: systemPrompt + '\n\n' + userPrompt }
                  ]
                }
              ],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.7,
              }
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return NextResponse.json({
              success: true,
              data: {
                title: parsed.title || topic,
                slug: slugifyVietnamese(parsed.title || topic),
                summary: parsed.summary || '',
                category: parsed.category || category,
                tags: parsed.tags || 'AI, Tự Học AI, Công nghệ',
                content: parsed.content || '',
                source: 'Google Gemini 2.5 Flash (Anti-Slop Engine)'
              }
            });
          }
        }
      } catch (geminiErr) {
        console.error('Gemini generate error, falling back:', geminiErr);
      }
    }

    // 2. Try OpenAI API if key exists
    if (openaiKey) {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
          })
        });

        if (openaiRes.ok) {
          const openaiData = await openaiRes.json();
          const rawText = openaiData.choices?.[0]?.message?.content;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return NextResponse.json({
              success: true,
              data: {
                title: parsed.title || topic,
                slug: slugifyVietnamese(parsed.title || topic),
                summary: parsed.summary || '',
                category: parsed.category || category,
                tags: parsed.tags || 'AI, Tự Học AI, Công nghệ',
                content: parsed.content || '',
                source: 'OpenAI GPT-4o-mini (Anti-Slop Engine)'
              }
            });
          }
        }
      } catch (openaiErr) {
        console.error('OpenAI generate error, falling back:', openaiErr);
      }
    }

    // 3. Fallback: Anti-Slop Structured Template Engine
    const cleanTopic = topic.trim();
    const generatedTitle = cleanTopic.startsWith('Hướng dẫn') || cleanTopic.startsWith('Làm chủ') || cleanTopic.startsWith('Bí quyết')
      ? cleanTopic
      : `Hướng Dẫn Thực Chiến: ${cleanTopic} Tối Ưu Năng Suất 10X`;

    const generatedSlug = slugifyVietnamese(generatedTitle);
    const generatedSummary = `Khám phá quy trình thực chiến về ${cleanTopic}. Hướng dẫn từng bước với checklist, code mẫu và kinh nghiệm thực chiến giúp bạn ứng dụng ngay hôm nay.`;

    const generatedContent = `## 1. Vấn đề thực tế & Tại sao bạn cần làm chủ ${cleanTopic}?

Hầu hết mọi người khi tiếp cận **${cleanTopic}** đều mắc phải một sai lầm phổ biến: làm việc theo cảm tính mà thiếu đi một khung quy trình có thể tái tạo (reproducible workflow).

Để tối ưu hóa năng suất gấp 5 đến 10 lần, bạn cần chuẩn hóa từng bước từ đầu vào (input), xử lý tự động (automation logic) cho đến kiểm duyệt kết quả đầu ra (output quality).

---

## 2. Quy trình 3 bước triển khai chuẩn hóa

### Bước 1: Xác định cấu trúc dữ liệu và mục tiêu đầu ra
Trước khi bắt tay vào cấu hình, hãy xác định rõ:
- Mục tiêu cần hoàn thành trong bao lâu?
- Dữ liệu đầu vào lấy từ đâu (RSS, Sheet, Webhook)?
- Kết quả mong muốn được chuyển đến kênh nào (Email, Website, CRM)?

### Bước 2: Thiết lập Prompt chuẩn xác & Khung tự động hóa
Dưới đây là mẫu Prompt có cấu trúc chuẩn bạn có thể sao chép và tinh chỉnh cho hệ thống của mình:

\`\`\`markdown
# ROLE: Chuyên gia giải pháp về ${cleanTopic}
# CONTEXT: Áp dụng vào hệ sinh thái Tự Học AI (tuhocai.top)
# INSTRUCTION:
1. Phân tích các lỗi sai phổ biến mà 90% người mới gặp phải.
2. Thiết kế giải pháp 3 bước giải quyết triệt để với thời gian triển khai dưới 30 phút.
3. Cung cấp checklist kiểm tra tính khả thi trước khi bàn giao.
# OUTPUT FORMAT: Markdown sạch, phân cấp rõ ràng, không sáo rỗng.
\`\`\`

### Bước 3: Đánh giá, nghiệm thu và mở rộng quy mô
Đưa hệ thống vào chạy thử nghiệm với nhóm mẫu nhỏ trước khi triển khai trên diện rộng.

---

## 3. Bảng so sánh phương pháp: Thủ công vs Tự động hóa

| Tiêu chí | Làm thủ công truyền thống | Tự động hóa với ${cleanTopic} |
| :--- | :--- | :--- |
| **Thời gian xử lý** | 2 - 4 giờ mỗi tác vụ | 30 giây chạy nền tự động |
| **Tỷ lệ sai sót** | Dễ sai lệch do mệt mỏi | Nhất quán 100% theo quy tắc |
| **Khả năng mở rộng** | Bị giới hạn bởi sức người | Mở rộng không giới hạn quy mô |
| **Chi phí vận hành** | Tốn kém nhân sự | Tối ưu chi phí tối đa |

---

## 4. Lỗi thường gặp & Cách khắc phục (Troubleshooting)

1. **Lỗi phụ thuộc vào một mô hình duy nhất**: Luôn có phương án dự phòng (fallback) để đảm bảo hệ thống không bị gián đoạn khi một API gặp sự cố.
2. **Thiếu khâu kiểm duyệt chất lượng**: Tự động hóa không có nghĩa là buông lỏng. Hãy áp dụng quy tắc 80/20 (AI xử lý 80%, con người duyệt 20%).
3. **Bỏ quên bảo mật**: Tuyệt đối không để lộ Webhook Secret hoặc API Key trên môi trường công khai.

---

## 5. Tài nguyên thực hành & Bước tiếp theo

- 🎁 **Tải bộ Prompt & File cấu hình 0đ:** Tham gia ngay [Nhóm Zalo VIP Tự Học AI](https://zalo.me/g/tuhocai) để nhận toàn bộ tài liệu thực hành được cập nhật liên tục.
- 🚀 **Tìm hiểu giải pháp tự động hóa toàn diện:** Xem ngay [Hệ sinh thái n8n Tự Động Hóa 2026](https://www.tuhocai.top/lp/n8n-tu-dong-hoa-kiem-tien) để giải phóng thời gian của bạn.
- 💰 **Hợp tác phân phối & Nhận hoa hồng 30-50%:** Đăng ký tham gia [Mạng lưới Affiliate Tự Học AI](https://www.tuhocai.top/affiliate).`;

    return NextResponse.json({
      success: true,
      data: {
        title: generatedTitle,
        slug: generatedSlug,
        summary: generatedSummary,
        category,
        tags: `${cleanTopic}, AI Automation, Prompt, Tự Học AI, Anti-Slop`,
        content: generatedContent,
        source: 'Anti-Slop Structured Template Engine'
      }
    });
  } catch (error: any) {
    console.error('AI post generation error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi tạo bài viết bằng AI' }, { status: 500 });
  }
}
