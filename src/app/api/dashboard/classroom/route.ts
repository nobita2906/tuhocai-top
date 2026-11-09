import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { COURSES } from '@/lib/classroomData';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    // 1. Get user unlocked products from user_library
    const unlockedRows = await query<any>(
      `SELECT p.pid, p.slug, p.id 
       FROM user_library ul
       JOIN products p ON ul.product_id = p.id
       WHERE ul.user_id = ?`,
      [session.id]
    );

    const unlockedPids = new Set(unlockedRows.map((r) => r.pid));
    const unlockedSlugs = new Set(unlockedRows.map((r) => r.slug));

    // 2. Get user lesson progress
    const progressRows = await query<any>(
      `SELECT course_slug, lesson_id, completed 
       FROM user_lesson_progress 
       WHERE user_id = ? AND completed = TRUE`,
      [session.id]
    );

    const completedLessonSet = new Set(
      progressRows.map((r) => `${r.course_slug}:${r.lesson_id}`)
    );

    // 3. Query courses from Database first
    const dbCourses = await query<any>(`
      SELECT c.*,
        (SELECT COUNT(*) FROM course_lessons WHERE course_id = c.id) as total_lessons_count
      FROM courses c
      WHERE c.is_published = TRUE
      ORDER BY c.sort_order ASC, c.created_at DESC
    `);

    let mappedCourses: any[] = [];
    let completedLessonsCount = 0;

    if (dbCourses.length > 0) {
      // Load all lessons from DB for progress mapping
      const allDbLessons = await query<any>(`
        SELECT id, course_id, module_id 
        FROM course_lessons
      `);

      for (const course of dbCourses) {
        const isUnlocked = course.price === 0 || session.role === 'ADMIN' || unlockedPids.has(course.pid) || unlockedSlugs.has(course.slug);
        const courseLessons = allDbLessons.filter((l) => l.course_id === course.id);
        const courseTotalLessons = courseLessons.length;

        const courseCompletedLessons = courseLessons.filter((l) =>
          completedLessonSet.has(`${course.slug}:${l.id}`)
        ).length;

        if (isUnlocked) {
          completedLessonsCount += courseCompletedLessons;
        }

        const progressPercent = courseTotalLessons > 0
          ? Math.round((courseCompletedLessons / courseTotalLessons) * 100)
          : 0;

        mappedCourses.push({
          slug: course.slug,
          pid: course.pid,
          title: course.title,
          headline: course.headline,
          category: course.category,
          price: course.price,
          level: course.level,
          thumbnail: course.thumbnail,
          instructor: course.instructor,
          totalLessons: courseTotalLessons,
          completedLessons: courseCompletedLessons,
          progressPercent,
          isUnlocked,
        });
      }
    } else {
      // Fallback to static COURSES
      mappedCourses = COURSES.map((course) => {
        const isUnlocked = course.price === 0 || unlockedPids.has(course.pid) || unlockedSlugs.has(course.slug);
        const allLessons = course.modules.flatMap((m) => m.lessons);
        const courseTotalLessons = allLessons.length;

        const courseCompletedLessons = allLessons.filter((l) =>
          completedLessonSet.has(`${course.slug}:${l.id}`)
        ).length;

        if (isUnlocked) {
          completedLessonsCount += courseCompletedLessons;
        }

        const progressPercent = courseTotalLessons > 0
          ? Math.round((courseCompletedLessons / courseTotalLessons) * 100)
          : 0;

        return {
          slug: course.slug,
          pid: course.pid,
          title: course.title,
          headline: course.headline,
          category: course.category,
          price: course.price,
          level: course.level,
          thumbnail: course.thumbnail,
          instructor: course.instructor,
          totalLessons: courseTotalLessons,
          completedLessons: courseCompletedLessons,
          progressPercent,
          isUnlocked,
        };
      });
    }

    // 4. Calculate Level & Points (Skool Gamification)
    const points = completedLessonsCount * 10;
    let levelName = 'Level 1: Tân Binh Khởi Động';
    let levelBadge = 'Lv.1';
    let nextLevelPoints = 50;

    if (points >= 100) {
      levelName = 'Level 4: Bậc Thầy Tự Động Hóa AI';
      levelBadge = 'Lv.4 VIP';
      nextLevelPoints = 200;
    } else if (points >= 50) {
      levelName = 'Level 3: Chuyên Gia Workflow';
      levelBadge = 'Lv.3 Pro';
      nextLevelPoints = 100;
    } else if (points >= 20) {
      levelName = 'Level 2: Thực Chiến AI';
      levelBadge = 'Lv.2';
      nextLevelPoints = 50;
    }

    return NextResponse.json({
      success: true,
      courses: mappedCourses,
      userStats: {
        points,
        levelName,
        levelBadge,
        nextLevelPoints,
        completedLessonsCount,
      },
    });
  } catch (error: any) {
    console.error('Classroom API error:', error);
    return NextResponse.json({ error: 'Lỗi tải phòng học' }, { status: 500 });
  }
}
