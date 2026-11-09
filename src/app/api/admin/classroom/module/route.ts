import { NextResponse } from 'next/server';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { execute } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const body = await req.json();
    const { id, courseId, title, sortOrder } = body;

    if (!courseId || !title) {
      return NextResponse.json({ error: 'Thiếu Course ID hoặc Tiêu đề chương' }, { status: 400 });
    }

    if (id) {
      // Cập nhật module
      await execute(`
        UPDATE course_modules SET
          title = ?,
          sort_order = ?,
          updated_at = NOW()
        WHERE id = ? AND course_id = ?
      `, [title.trim(), Number(sortOrder) || 0, id, courseId]);

      return NextResponse.json({ success: true, message: 'Đã cập nhật chương học' });
    } else {
      // Tạo mới module
      const moduleId = randomUUID();
      await execute(`
        INSERT INTO course_modules (id, course_id, title, sort_order)
        VALUES (?, ?, ?, ?)
      `, [moduleId, courseId, title.trim(), Number(sortOrder) || 1]);

      return NextResponse.json({ success: true, moduleId, message: 'Đã thêm chương học mới' });
    }
  } catch (error: any) {
    console.error('Classroom module save error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi lưu chương học' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID chương cần xóa' }, { status: 400 });
    }

    // Xóa lessons thuộc module rồi xóa module
    await execute('DELETE FROM course_lessons WHERE module_id = ?', [id]);
    await execute('DELETE FROM course_modules WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Đã xóa chương học' });
  } catch (error: any) {
    console.error('Classroom module delete error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi xóa chương học' }, { status: 500 });
  }
}

