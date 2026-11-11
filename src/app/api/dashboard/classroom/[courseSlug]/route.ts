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

    // 1. Thử tìm khóa học trong Database trước
    const dbCourses = await query<any>(
      'SELECT * FROM courses WHERE slug = ? AND is_published = TRUE LIMIT 1',
      [courseSlug]
    );

    let course: any = null;
    let modules: any[] = [];

    if (dbCourses.length > 0) {
      const dbCourse = dbCourses[0];

      // Lấy modules từ DB
      const dbModules = await query<any>(
        'SELECT * FROM course_modules WHERE course_id = ? ORDER BY sort_order ASC, created_at ASC',
        [dbCourse.id]
      );

      // Lấy lessons từ DB
      const dbLessons = await query<any>(
        'SELECT * FROM course_lessons WHERE course_id = ? ORDER BY sort_order ASC, created_at ASC',
        [dbCourse.id]
      );

      // Parse JSON
      const parsedLessons = dbLessons.map((l: any) => ({
        id: l.id,
        course_id: l.course_id,
        module_id: l.module_id,
        title: l.title,
        duration: l.duration || '10:00',
        videoUrl: l.video_url || '',
        summary: l.summary || '',
        contentMarkdown: l.content_markdown || '',
        actionChecklist: typeof l.action_checklist === 'string' ? JSON.parse(l.action_checklist || '[]') : (l.action_checklist || []),
        resources: typeof l.resources === 'string' ? JSON.parse(l.resources || '[]') : (l.resources || []),
        sortOrder: l.sort_order || 1,
        isFreePreview: Boolean(l.is_free_preview),
        customUrl: l.custom_url || null,
      }));

      modules = dbModules.map((m: any) => ({
        id: m.id,
        title: m.title,
        lessons: parsedLessons.filter((l: any) => l.module_id === m.id),
      }));

      course = {
        slug: dbCourse.slug,
        pid: dbCourse.pid,
        title: dbCourse.title,
        headline: dbCourse.headline,
        category: dbCourse.category,
        price: dbCourse.price,
        level: dbCourse.level,
        thumbnail: dbCourse.thumbnail,
        instructor: dbCourse.instructor,
        customUrl: dbCourse.custom_url || null,
      };
    } else {
      // Fallback tĩnh
      const staticCourse = getCourseBySlug(courseSlug);
      if (!staticCourse) {
        return NextResponse.json({ error: 'Không tìm thấy khóa học' }, { status: 404 });
      }
      course = {
        ...staticCourse,
        customUrl: staticCourse.custom_url || null,
      };
      modules = staticCourse.modules;
    }

    // 2. Kiểm tra quyền mở khóa (Unlocked status)
    let isUnlocked = course.price === 0 || session.role === 'ADMIN';

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

    // 3. Lấy tiến độ các bài đã học của user
    const progressRows = await query<any>(
      `SELECT lesson_id 
       FROM user_lesson_progress 
       WHERE user_id = ? AND course_slug = ? AND completed = TRUE`,
      [session.id, course.slug]
    );

    const completedLessonIds = new Set(progressRows.map((r) => r.lesson_id));

    // Enrich modules & lessons với trạng thái isCompleted
    const enrichedModules = modules.map((mod: any) => ({
      ...mod,
      lessons: mod.lessons.map((lesson: any) => ({
        ...lesson,
        isCompleted: completedLessonIds.has(lesson.id),
      })),
    }));

    const allLessons = enrichedModules.flatMap((m: any) => m.lessons);
    const totalLessons = allLessons.length;
    const completedLessons = allLessons.filter((l: any) => l.isCompleted).length;
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return NextResponse.json({
      success: true,
      course: {
        ...course,
        isUnlocked,
        totalLessons,
        completedLessons,
        progressPercent,
        modules: enrichedModules,
      },
    });
  } catch (err: any) {
    console.error('Course detail error:', err);
    return NextResponse.json({ error: 'Lỗi tải bài học' }, { status: 500 });
  }
}
