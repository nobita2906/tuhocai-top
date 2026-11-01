import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { getCourseBySlug } from '@/lib/classroomData';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseSlug: string }> }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { courseSlug } = await params;
    const course = getCourseBySlug(courseSlug);

    if (!course) {
      return NextResponse.json({ error: 'Không tìm thấy khóa học' }, { status: 404 });
    }

    // Check if unlocked
    let isUnlocked = course.price === 0;

    if (!isUnlocked) {
      const unlocked = await query<any>(
        `SELECT ul.id 
         FROM user_library ul
         JOIN products p ON ul.product_id = p.id
         WHERE ul.user_id = ? AND (p.pid = ? OR p.slug = ?)
         LIMIT 1`,
        [session.id, course.pid, course.slug]
      );
      if (unlocked.length > 0) {
        isUnlocked = true;
      }
    }

    // Get completed lessons
    const progressRows = await query<any>(
      `SELECT lesson_id 
       FROM user_lesson_progress 
       WHERE user_id = ? AND course_slug = ? AND completed = TRUE`,
      [session.id, course.slug]
    );

    const completedLessonIds = new Set(progressRows.map((r) => r.lesson_id));

    // Enrich modules & lessons
    const modules = course.modules.map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((lesson) => ({
        ...lesson,
        isCompleted: completedLessonIds.has(lesson.id),
      })),
    }));

    const allLessons = modules.flatMap((m) => m.lessons);
    const totalLessons = allLessons.length;
    const completedLessons = allLessons.filter((l) => l.isCompleted).length;
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return NextResponse.json({
      success: true,
      course: {
        slug: course.slug,
        pid: course.pid,
        title: course.title,
        headline: course.headline,
        category: course.category,
        price: course.price,
        level: course.level,
        thumbnail: course.thumbnail,
        instructor: course.instructor,
        isUnlocked,
        totalLessons,
        completedLessons,
        progressPercent,
        modules,
      },
    });
  } catch (err: any) {
    console.error('Course detail error:', err);
    return NextResponse.json({ error: 'Lỗi tải bài học' }, { status: 500 });
  }
}

