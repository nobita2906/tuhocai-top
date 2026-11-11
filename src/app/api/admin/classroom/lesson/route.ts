import { NextResponse } from 'next/server';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { execute } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const body = await req.json();
    const {
      id,
      courseId,
      moduleId,
      title,
      duration,
      videoUrl,
      summary,
      contentMarkdown,
      actionChecklist,
      resources,
      sortOrder,
      isFreePreview,
      customUrl,
    } = body;

    if (!courseId || !moduleId || !title) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc (Course, Module hoặc Tiêu đề bài học)' }, { status: 400 });
    }

    const checklistJson = JSON.stringify(Array.isArray(actionChecklist) ? actionChecklist : []);
    const resourcesJson = JSON.stringify(Array.isArray(resources) ? resources : []);

    if (id) {
      // Cập nhật bài học
      await execute(`
        UPDATE course_lessons SET
          module_id = ?,
          title = ?,
          duration = ?,
          video_url = ?,
          custom_url = ?,
          summary = ?,
          content_markdown = ?,
          action_checklist = ?,
          resources = ?,
          sort_order = ?,
          is_free_preview = ?,
          updated_at = NOW()
        WHERE id = ? AND course_id = ?
      `, [
        moduleId,
        title.trim(),
        duration || '10:00',
        videoUrl || '',
        customUrl ? customUrl.trim() : null,
        summary || '',
        contentMarkdown || '',
        checklistJson,
        resourcesJson,
        Number(sortOrder) || 0,
        isFreePreview ? 1 : 0,
        id,
        courseId,
      ]);

      return NextResponse.json({ success: true, message: 'Đã cập nhật bài học' });
    } else {
      // Tạo bài học mới
      const lessonId = randomUUID();
      await execute(`
        INSERT INTO course_lessons (
          id, course_id, module_id, title, duration, video_url, custom_url,
          summary, content_markdown, action_checklist, resources,
          sort_order, is_free_preview
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        lessonId,
        courseId,
        moduleId,
        title.trim(),
        duration || '10:00',
        videoUrl || '',
        customUrl ? customUrl.trim() : null,
        summary || '',
        contentMarkdown || '',
        checklistJson,
        resourcesJson,
        Number(sortOrder) || 1,
        isFreePreview ? 1 : 0,
      ]);

      return NextResponse.json({ success: true, lessonId, message: 'Đã thêm bài học mới' });
    }
  } catch (error: any) {
    console.error('Classroom lesson save error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi lưu bài học' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID bài học cần xóa' }, { status: 400 });
    }

    await execute('DELETE FROM course_lessons WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Đã xóa bài học' });
  } catch (error: any) {
    console.error('Classroom lesson delete error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi xóa bài học' }, { status: 500 });
  }
}

