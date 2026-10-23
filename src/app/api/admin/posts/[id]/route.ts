import { NextResponse } from 'next/server';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { query, execute } from '@/lib/db';
import { slugifyVietnamese } from '@/lib/slugify';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { id } = await params;
    const posts = await query('SELECT * FROM posts WHERE id = ? LIMIT 1', [id]);
    if (posts.length === 0) {
      return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 });
    }
    return NextResponse.json({ success: true, post: posts[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, summary, content, category, tags, thumbnail, is_featured, is_published, slug: newSlug } = body;

    const existing = await query<any>('SELECT id, slug FROM posts WHERE id = ? LIMIT 1', [id]);
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 });
    }

    let finalSlug = existing[0].slug;
    if (newSlug && newSlug !== existing[0].slug) {
      finalSlug = slugifyVietnamese(newSlug);
      // Check conflict
      const conflict = await query('SELECT id FROM posts WHERE slug = ? AND id != ? LIMIT 1', [finalSlug, id]);
      if (conflict.length > 0) {
        finalSlug = `${finalSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }

    await execute(
      `UPDATE posts SET
        title = COALESCE(?, title),
        slug = COALESCE(?, slug),
        summary = COALESCE(?, summary),
        content = COALESCE(?, content),
        category = COALESCE(?, category),
        tags = COALESCE(?, tags),
        thumbnail = COALESCE(?, thumbnail),
        is_featured = COALESCE(?, is_featured),
        is_published = COALESCE(?, is_published)
       WHERE id = ?`,
      [
        title ? title.trim() : null,
        finalSlug,
        summary !== undefined ? summary : null,
        content || null,
        category || null,
        tags !== undefined ? tags : null,
        thumbnail !== undefined ? thumbnail : null,
        is_featured !== undefined ? (is_featured ? 1 : 0) : null,
        is_published !== undefined ? (is_published ? 1 : 0) : null,
        id,
      ]
    );

    return NextResponse.json({ success: true, message: 'Cập nhật bài viết thành công!' });
  } catch (error: any) {
    console.error('Update post error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi cập nhật bài viết' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { id } = await params;
    await execute('DELETE FROM posts WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Đã xóa bài viết thành công' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi xóa bài viết' }, { status: 500 });
  }
}
