import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { query, execute } from '@/lib/db';
import { slugifyVietnamese } from '@/lib/slugify';

export async function GET(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';

    let sql = 'SELECT id, slug, title, summary, category, tags, thumbnail, is_featured, is_published, views, created_at, updated_at FROM posts WHERE 1=1';
    const params: any[] = [];

    if (search) {
      sql += ' AND (title LIKE ? OR summary LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category && category !== 'ALL') {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY created_at DESC';

    const posts = await query(sql, params);
    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi tải danh sách bài viết' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const body = await req.json();
    const { title, summary, content, category, tags, thumbnail, is_featured, is_published } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Tiêu đề và nội dung bài viết không được để trống' }, { status: 400 });
    }

    let slug = body.slug ? slugifyVietnamese(body.slug) : slugifyVietnamese(title);
    if (!slug) {
      slug = 'bai-viet-' + Date.now();
    }

    // Ensure unique slug
    const existing = await query('SELECT id FROM posts WHERE slug = ? LIMIT 1', [slug]);
    if (existing.length > 0) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const postId = randomUUID();
    await execute(
      `INSERT INTO posts (id, slug, title, summary, content, category, tags, thumbnail, is_featured, is_published, views)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        postId,
        slug,
        title.trim(),
        summary?.trim() || '',
        content,
        category || 'NEWS',
        tags?.trim() || '',
        thumbnail?.trim() || null,
        is_featured ? 1 : 0,
        is_published === false ? 0 : 1,
      ]
    );

    return NextResponse.json({
      success: true,
      post: { id: postId, slug, title },
      message: 'Đăng bài viết thành công!',
    });
  } catch (error: any) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi tạo bài viết' }, { status: 500 });
  }
}
