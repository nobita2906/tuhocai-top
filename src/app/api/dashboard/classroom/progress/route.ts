import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { execute, query } from '@/lib/db';
import { randomUUID } from 'crypto';
import { getCourseBySlug } from '@/lib/classroomData';

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { courseSlug, lessonId, completed } = await req.json();

    if (!courseSlug || !lessonId) {
      return NextResponse.json({ error: 'Thiếu thông tin bài học' }, { status: 400 });
    }

    const course = getCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: 'Khóa học không hợp lệ' }, { status: 404 });
    }

    const isCompleted = completed !== false; // default true

    // Upsert into user_lesson_progress
    const existing = await query<any>(
      'SELECT id FROM user_lesson_progress WHERE user_id = ? AND course_slug = ? AND lesson_id = ? LIMIT 1',
      [session.id, courseSlug, lessonId]
    );

    if (existing.length > 0) {
      await execute(
        'UPDATE user_lesson_progress SET completed = ?, completed_at = NOW() WHERE id = ?',
        [isCompleted, existing[0].id]
      );
    } else {
      await execute(
        `INSERT INTO user_lesson_progress (id, user_id, course_slug, lesson_id, completed, completed_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [randomUUID(), session.id, courseSlug, lessonId, isCompleted]
      );
    }

    // Calculate updated progress
    const progressRows = await query<any>(
      `SELECT lesson_id FROM user_lesson_progress 
       WHERE user_id = ? AND course_slug = ? AND completed = TRUE`,
      [session.id, courseSlug]
    );

    const completedLessonIds = new Set(progressRows.map((r) => r.lesson_id));
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const totalLessons = allLessons.length;
    const completedCount = allLessons.filter((l) => completedLessonIds.has(l.id)).length;
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return NextResponse.json({
      success: true,
      lessonId,
      isCompleted,
      completedLessons: completedCount,
      totalLessons,
      progressPercent,
      message: isCompleted ? 'Đã hoàn thành bài học! (+10 điểm)' : 'Đã bỏ đánh dấu hoàn thành.',
    });
  } catch (err: any) {
    console.error('Progress update error:', err);
    return NextResponse.json({ error: 'Lỗi cập nhật tiến độ' }, { status: 500 });
  }
}

