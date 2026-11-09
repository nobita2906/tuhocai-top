import { NextResponse } from 'next/server';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { query } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { courseId } = await params;

    const courses = await query<any>('SELECT * FROM courses WHERE id = ? LIMIT 1', [courseId]);
    if (courses.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy khóa học' }, { status: 404 });
    }

    const course = courses[0];

    // Lấy modules
    const modules = await query<any>(
      'SELECT * FROM course_modules WHERE course_id = ? ORDER BY sort_order ASC, created_at ASC',
      [courseId]
    );

    // Lấy lessons
    const lessons = await query<any>(
      'SELECT * FROM course_lessons WHERE course_id = ? ORDER BY sort_order ASC, created_at ASC',
      [courseId]
    );

    // Parse JSON fields
    const parsedLessons = lessons.map((l: any) => ({
      ...l,
      action_checklist: typeof l.action_checklist === 'string' ? JSON.parse(l.action_checklist || '[]') : (l.action_checklist || []),
      resources: typeof l.resources === 'string' ? JSON.parse(l.resources || '[]') : (l.resources || []),
    }));

    // Gom lessons vào modules
    const modulesWithLessons = modules.map((mod: any) => ({
      ...mod,
      lessons: parsedLessons.filter((l: any) => l.module_id === mod.id),
    }));

    return NextResponse.json({
      success: true,
      course,
      modules: modulesWithLessons,
    });
  } catch (error: any) {
    console.error('Admin course detail GET error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi tải chi tiết khóa học' }, { status: 500 });
  }
}

