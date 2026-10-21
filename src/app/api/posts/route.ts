import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Post } from '@/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let sql = 'SELECT id, slug, title, summary, category, tags, thumbnail, is_featured, views, created_at FROM posts WHERE is_published = TRUE';
    const params: any[] = [];

    if (category && category !== 'ALL') {
      sql += ' AND category = ?';
      params.push(category.toUpperCase());
    }

    if (featured) {
      sql += ' AND is_featured = TRUE';
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    const posts = await query<Post>(sql, params);
    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    console.error('Fetch posts error:', err);
    return NextResponse.json({ error: 'Lỗi tải bài viết' }, { status: 500 });
  }
}
