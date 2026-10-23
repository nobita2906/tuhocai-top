import { NextResponse } from 'next/server';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { getSiteSettings } from '@/lib/settings';
import { slugifyVietnamese } from '@/lib/slugify';

export async function POST(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { topic, category = 'NEWS', tone = 'Chuyên gia, thực chiến, truyền cảm hứng' } = await req.json();

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: 'Vui lòng cung cấp chủ đề hoặc tiêu đề bài viết' }, { status: 400 });
    }

    const settings = await getSiteSettings();
    const geminiKey = settings.gemini_api_key || process.env.GEMINI_API_KEY;
    const openaiKey = settings.openai_api_key || process.env.OPENAI_API_KEY;

    const systemPrompt = `Bạn là chuyên gia hàng đầu về Trí tuệ nhân tạo (AI), Tự động hóa (Automation n8n, Make), và Lập trình hỗ trợ bởi AI (Cursor, Claude Code, GitHub Copilot) tại nền tảng Tự Học AI (tuhocai.top).
Nhiệm vụ: Viết một bài viết hướng dẫn chuyên sâu, cuốn hút, chuẩn SEO Google bằng tiếng Việt dựa trên chủ đề được cung cấp.

Yêu cầu định dạng đầu ra: BẮT BUỘC trả về duy nhất một chuỗi JSON hợp lệ (không chứa markdown backticks ngoài JSON):
{
  "title": "Tiêu đề bài viết hấp dẫn, chuẩn SEO (khoảng 50-70 ký tự)",
  "summary": "Đoạn tóm tắt ngắn cuốn hút để hiển thị ngoài danh mục (120-160 ký tự)",
  "category": "${category}",
  "tags": "Từ khóa phân cách bằng dấu phẩy, ví dụ: AI, Cursor, Prompt, n8n",
  "content": "Nội dung bài viết đầy đủ bằng Markdown tiêu chuẩn. Bao gồm: Đặt vấn đề, 3-5 tiêu đề H2 (##), các tiêu đề H3 (###), các đoạn trích dẫn (>), các khối code/prompt minh họa (\`\`\`markdown hoặc \`\`\`json hoặc \`\`\`typescript), bảng so sánh hoặc checklist nếu phù hợp, và lời kết kêu gọi hành động tham gia nhóm Zalo VIP Tự Học AI."
}`;

    const userPrompt = `Chủ đề bài viết: "${topic.trim()}"\nChuyên mục: ${category}\nPhong cách hành văn: ${tone}`;

    // 1. Try Google Gemini API if key exists
    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
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
                source: 'Google Gemini 1.5 Flash'
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
                source: 'OpenAI GPT-4o-mini'
              }
            });
          }
        }
      } catch (openaiErr) {
        console.error('OpenAI generate error, falling back:', openaiErr);
      }
    }

    // 3. Fallback: Intelligent domain-specific structured generator
    const cleanTopic = topic.trim();
    const generatedTitle = cleanTopic.startsWith('Hướng dẫn') || cleanTopic.startsWith('Làm chủ')
      ? cleanTopic
      : `Hướng Dẫn Toàn Diện: ${cleanTopic} Từ Số 0 Cho Người Tự Học AI`;

    const generatedSlug = slugifyVietnamese(generatedTitle);
    const generatedSummary = `Khám phá lộ trình và kỹ thuật thực chiến về ${cleanTopic}. Hướng dẫn chi tiết từng bước giúp bạn tiết kiệm 80% thời gian với công nghệ AI hàng đầu.`;

    const generatedContent = `## 1. Giới thiệu tổng quan về ${cleanTopic}

Trong kỷ nguyên số và trí tuệ nhân tạo bùng nổ, **${cleanTopic}** đang trở thành một trong những kỹ năng đắc lực nhất giúp cá nhân và doanh nghiệp tối ưu hóa hiệu suất làm việc gấp 5 đến 10 lần.

> "AI sẽ không thay thế bạn, nhưng người biết làm chủ AI chắc chắn sẽ thay thế người không biết."

Bài viết này được đội ngũ **Tự Học AI (tuhocai.top)** đúc kết từ hàng trăm giờ trải nghiệm thực tế, giúp bạn nhanh chóng nắm bắt bản chất cốt lõi và ứng dụng ngay hôm nay.

---

## 2. Các bước triển khai thực chiến từng bước

Để ứng dụng thành công, bạn chỉ cần tuân theo quy trình chuẩn hóa gồm 3 bước dưới đây:

### Bước 1: Chuẩn bị môi trường & Thiết lập nền tảng
- Xác định mục tiêu rõ ràng và kết quả đầu ra bạn mong muốn đạt được.
- Cấu hình các công cụ AI hỗ trợ, tối ưu hóa thiết lập để đạt tốc độ xử lý cao nhất.

### Bước 2: Kỹ thuật Prompt & Quy trình tự động hóa
Áp dụng mẫu Prompt mẫu có cấu trúc rõ ràng:

\`\`\`markdown
Bạn là chuyên gia về ${cleanTopic}.
Mục tiêu: Hãy tạo cho tôi một kế hoạch hành động chi tiết 3 ngày để làm chủ kỹ năng này.
Yêu cầu:
- Trình bày ngắn gọn, dễ hiểu.
- Kèm theo ví dụ thực hành cụ thể.
\`\`\`

### Bước 3: Đánh giá, tối ưu và mở rộng quy mô
- Kiểm tra kết quả đầu ra xem đã đáp ứng tiêu chuẩn hay chưa.
- Tự động hóa các công việc lặp đi lặp lại để dành thời gian cho các quyết định mang tính chiến lược.

---

## 3. Các lưu ý quan trọng để tránh mắc sai lầm

1. **Không phụ thuộc 100% vào AI không kiểm soát**: Luôn đối chiếu và tinh chỉnh kết quả theo ngữ cảnh thực tế của dự án.
2. **Cập nhật kiến thức liên tục**: Công nghệ AI thay đổi theo từng tuần, việc tham gia các cộng đồng chuyên sâu là vô cùng cần thiết.
3. **Bảo mật thông tin**: Tránh đưa dữ liệu nhạy cảm hoặc mật khẩu vào các mô hình công khai.

---

## 4. Lời kết & Tài nguyên học tập tiếp theo

Hy vọng bài hướng dẫn về **${cleanTopic}** đã mang lại cho bạn góc nhìn rõ ràng và các bước hành động cụ thể.

👉 **Mẹo cho bạn:** Đừng quên tham gia [Nhóm Zalo VIP Tự Học AI](https://zalo.me/g/tuhocai) để giao lưu, nhận thêm nhiều Workflow n8n và bộ Prompt đỉnh cao hoàn toàn miễn phí nhé!`;

    return NextResponse.json({
      success: true,
      data: {
        title: generatedTitle,
        slug: generatedSlug,
        summary: generatedSummary,
        category,
        tags: `${cleanTopic}, AI Automation, Prompt, Tự Học AI`,
        content: generatedContent,
        source: 'AI Template Engine (Thêm Gemini hoặc OpenAI API key trong Cài đặt để kích hoạt sinh văn bản trực tiếp)'
      }
    });
  } catch (error: any) {
    console.error('AI post generation error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi tạo bài viết bằng AI' }, { status: 500 });
  }
}
