import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { execute, query } from '@/lib/db';
import { slugifyVietnamese } from '@/lib/slugify';
import { getSiteSettings } from '@/lib/settings';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'tuhocai-auto-publish-secret-key-2026';

const DEFAULT_THUMBNAILS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
];

export async function POST(req: Request) {
  try {
    // 1. Kiểm tra xác thực Token (Bearer Token hoặc Query Param ?token=...)
    const authHeader = req.headers.get('authorization') || '';
    const url = new URL(req.url);
    const queryToken = url.searchParams.get('token');

    let providedToken = '';
    if (authHeader.startsWith('Bearer ')) {
      providedToken = authHeader.substring(7).trim();
    } else if (queryToken) {
      providedToken = queryToken.trim();
    }

    if (!providedToken || providedToken !== WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập (Unauthorized Webhook Token)', success: false },
        { status: 401 }
      );
    }

    // 2. Parse dữ liệu đầu vào
    const body = await req.json();
    const {
      title,
      slug: customSlug,
      summary,
      content,
      category = 'NEWS',
      tags = 'AI, Tự Học AI, Công nghệ',
      thumbnail,
      isFeatured = false,
      isPublished = true,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Tiêu đề bài viết (title) là bắt buộc', success: false }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Nội dung bài viết (content) là bắt buộc', success: false }, { status: 400 });
    }

    // 3. Chuẩn hóa Slug & Xử lý chống trùng lặp (Auto-Collision Resolver)
    let baseSlug = customSlug ? slugifyVietnamese(customSlug) : slugifyVietnamese(title);
    if (!baseSlug) baseSlug = `bai-viet-${Date.now()}`;

    let finalSlug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await query<any>('SELECT id FROM posts WHERE slug = ? LIMIT 1', [finalSlug]);
      if (existing.length === 0) break;
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 4. Chuẩn hóa Category (NEWS, WORKFLOW, PROMPT, SKILL)
    const validCategories = ['NEWS', 'WORKFLOW', 'PROMPT', 'SKILL'];
    const cleanCategory = validCategories.includes(String(category).toUpperCase())
      ? String(category).toUpperCase()
      : 'NEWS';

    // 5. Chuẩn hóa Summary (Meta description)
    let cleanSummary = summary ? summary.trim() : '';
    if (!cleanSummary) {
      // Bóc tách 160 ký tự đầu tiên từ content không chứa thẻ markdown
      cleanSummary = content
        .replace(/^[#>\s-*_`]+/gm, '')
        .replace(/\n+/g, ' ')
        .trim()
        .slice(0, 160);
    }

    // 6. Chuẩn hóa Thumbnail
    const randomThumb = DEFAULT_THUMBNAILS[Math.floor(Math.random() * DEFAULT_THUMBNAILS.length)];
    const finalThumbnail = thumbnail && thumbnail.startsWith('http') ? thumbnail.trim() : randomThumb;

    // 7. Tạo ID và lưu vào bảng posts
    const postId = randomUUID();
    await execute(
      `INSERT INTO posts (
        id, slug, title, summary, content, category, tags, thumbnail, is_featured, is_published, views
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        postId,
        finalSlug,
        title.trim(),
        cleanSummary,
        content.trim(),
        cleanCategory,
        tags.trim(),
        finalThumbnail,
        isFeatured ? 1 : 0,
        isPublished ? 1 : 0,
      ]
    );

    const postUrl = `https://www.tuhocai.top/bai-viet/${finalSlug}`;

    // 8. Tự động bắn thông báo Telegram cho Admin
    const settings = await getSiteSettings();
    const telegramToken = settings.telegram_bot_token;
    const telegramChatId = settings.telegram_chat_id;

    if (telegramToken && telegramChatId) {
      const message = `🤖 *BÀI VIẾT MỚI ĐÃ XUẤT BẢN TỰ ĐỘNG!*

📌 *Tiêu đề:* ${title.trim()}
🏷 *Chuyên mục:* \`${cleanCategory}\`
🌐 *Đường dẫn:* [Bấm vào để đọc bài](${postUrl})

✨ *Tự Học AI Content Engine* đã đồng bộ bài viết lên hệ sinh thái website!`;

      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      }).catch((e) => console.error('Error sending Telegram notification on post publish:', e));
    }

    return NextResponse.json({
      success: true,
      message: 'Xuất bản bài viết tự động thành công!',
      post: {
        id: postId,
        slug: finalSlug,
        title: title.trim(),
        category: cleanCategory,
        url: postUrl,
      },
    });
  } catch (error: any) {
    console.error('Webhook publish-post error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi xử lý webhook', success: false }, { status: 500 });
  }
}
