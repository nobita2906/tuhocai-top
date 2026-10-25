import { NextResponse } from 'next/server';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { query, execute } from '@/lib/db';
import { slugifyVietnamese } from '@/lib/slugify';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { id } = await params;
    const docs = await query('SELECT * FROM internal_docs WHERE id = ? OR slug = ? LIMIT 1', [id, id]);
    if (docs.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy tài liệu' }, { status: 404 });
    }
    return NextResponse.json({ success: true, doc: docs[0] });
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

    // Check if toggle pin only
    if (body.togglePin !== undefined) {
      await execute('UPDATE internal_docs SET is_pinned = NOT is_pinned WHERE id = ?', [id]);
      return NextResponse.json({ success: true, message: 'Đã cập nhật ghim tài liệu' });
    }

    const {
      title,
      icon,
      category,
      tags,
      drive_url,
      content,
      is_pinned,
      badge_color,
    } = body;

    let slugUpdate = '';
    const updateParams: any[] = [];

    let updateFields = [
      'title = ?',
      'icon = ?',
      'category = ?',
      'tags = ?',
      'drive_url = ?',
      'content = ?',
      'is_pinned = ?',
      'badge_color = ?',
      'updated_at = NOW()',
    ];

    updateParams.push(
      title,
      icon || '📄',
      category || 'QUY_TRINH',
      tags || '',
      drive_url || '',
      content || '',
      is_pinned ? 1 : 0,
      badge_color || 'indigo'
    );

    if (body.slug) {
      const slug = slugifyVietnamese(body.slug);
      updateFields.push('slug = ?');
      updateParams.push(slug);
    }

    updateParams.push(id);

    await execute(
      `UPDATE internal_docs SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );

    return NextResponse.json({ success: true, message: 'Cập nhật tài liệu thành công' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi cập nhật tài liệu' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { id } = await params;
    await execute('DELETE FROM internal_docs WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Đã xóa tài liệu' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi xóa tài liệu' }, { status: 500 });
  }
}
