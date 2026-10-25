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
    const pinnedOnly = searchParams.get('pinned') === 'true';

    let sql = 'SELECT * FROM internal_docs WHERE 1=1';
    const params: any[] = [];

    if (search) {
      sql += ' AND (title LIKE ? OR tags LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category && category !== 'ALL') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (pinnedOnly) {
      sql += ' AND is_pinned = TRUE';
    }

    sql += ' ORDER BY is_pinned DESC, updated_at DESC, created_at DESC';

    const docs = await query(sql, params);
    return NextResponse.json({ success: true, docs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi tải tài liệu nội bộ' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const body = await req.json();
    const {
      title,
      icon = '📄',
      category = 'QUY_TRINH',
      tags = '',
      drive_url = '',
      content = '',
      is_pinned = false,
      badge_color = 'indigo',
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Tiêu đề tài liệu không được để trống' }, { status: 400 });
    }

    let slug = body.slug ? slugifyVietnamese(body.slug) : slugifyVietnamese(title);
    if (!slug) slug = 'doc-' + Date.now();

    // Ensure unique slug
    const existing = await query('SELECT id FROM internal_docs WHERE slug = ? LIMIT 1', [slug]);
    if (existing.length > 0) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const id = randomUUID();

    await execute(
      `INSERT INTO internal_docs (id, title, slug, icon, category, tags, drive_url, content, is_pinned, badge_color, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        slug,
        icon || '📄',
        category,
        tags,
        drive_url,
        content,
        is_pinned ? 1 : 0,
        badge_color || 'indigo',
        admin.name || 'Admin',
      ]
    );

    return NextResponse.json({ success: true, id, slug });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi lưu tài liệu nội bộ' }, { status: 500 });
  }
}
