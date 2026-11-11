import { NextResponse } from 'next/server';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { query, execute } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const courses = await query<any>(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM course_modules WHERE course_id = c.id) as modules_count,
        (SELECT COUNT(*) FROM course_lessons WHERE course_id = c.id) as lessons_count,
        (
          SELECT COUNT(DISTINCT ul.user_id) 
          FROM user_library ul 
          JOIN products p ON ul.product_id = p.id 
          WHERE (p.pid = c.pid OR p.slug = c.slug)
        ) as enrolled_students
      FROM courses c
      ORDER BY c.sort_order ASC, c.created_at DESC
    `);

    // Lấy danh sách sản phẩm để người dùng dễ chọn liên kết PID
    const products = await query<any>(`
      SELECT id, pid, name, slug, price 
      FROM products 
      ORDER BY created_at DESC
    `);

    // Lấy danh sách bài viết đã xuất bản để dễ dàng chọn liên kết bán khóa học
    const posts = await query<any>(`
      SELECT id, title, slug, category, created_at
      FROM posts
      WHERE is_published = TRUE
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      success: true,
      courses,
      products,
      posts,
    });
  } catch (error: any) {
    console.error('Admin classroom GET error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi tải danh sách khóa học' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const body = await req.json();
    const {
      title,
      slug,
      pid,
      headline,
      category,
      price,
      level,
      thumbnail,
      instructor,
      custom_url,
      isPublished,
      sortOrder,
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Tiêu đề và Slug là bắt buộc' }, { status: 400 });
    }

    // Check duplicate slug
    const existing = await query<any>('SELECT id FROM courses WHERE slug = ?', [slug.trim().toLowerCase()]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Slug này đã tồn tại, vui lòng chọn đường dẫn khác' }, { status: 400 });
    }

    const courseId = randomUUID();
    await execute(`
      INSERT INTO courses (
        id, slug, pid, title, headline, category, price, level,
        thumbnail, instructor, custom_url, is_published, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      courseId,
      slug.trim().toLowerCase(),
      pid || null,
      title.trim(),
      headline || '',
      category || 'course',
      Number(price) || 0,
      level || 'Thực chiến A-Z',
      thumbnail || '',
      instructor || 'Tự Học AI',
      custom_url ? custom_url.trim() : null,
      isPublished !== false,
      Number(sortOrder) || 1,
    ]);

    // Tạo sẵn 1 Module mẫu ban đầu để dễ dàng thêm bài
    const defaultModuleId = randomUUID();
    await execute(`
      INSERT INTO course_modules (id, course_id, title, sort_order)
      VALUES (?, ?, ?, 1)
    `, [defaultModuleId, courseId, 'Phần 1: Giới thiệu & Khởi động']);

    return NextResponse.json({
      success: true,
      courseId,
      message: 'Tạo khóa học thành công',
    });
  } catch (error: any) {
    console.error('Admin classroom POST error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi tạo khóa học' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const body = await req.json();
    const {
      id,
      title,
      slug,
      pid,
      headline,
      category,
      price,
      level,
      thumbnail,
      instructor,
      custom_url,
      isPublished,
      sortOrder,
    } = body;

    if (!id || !title || !slug) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // Check slug duplicate for other courses
    const existing = await query<any>('SELECT id FROM courses WHERE slug = ? AND id != ?', [slug.trim().toLowerCase(), id]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Slug này đã bị trùng với khóa học khác' }, { status: 400 });
    }

    await execute(`
      UPDATE courses SET
        slug = ?,
        pid = ?,
        title = ?,
        headline = ?,
        category = ?,
        price = ?,
        level = ?,
        thumbnail = ?,
        instructor = ?,
        custom_url = ?,
        is_published = ?,
        sort_order = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [
      slug.trim().toLowerCase(),
      pid || null,
      title.trim(),
      headline || '',
      category || 'course',
      Number(price) || 0,
      level || 'Thực chiến A-Z',
      thumbnail || '',
      instructor || 'Tự Học AI',
      custom_url ? custom_url.trim() : null,
      isPublished !== false,
      Number(sortOrder) || 0,
      id,
    ]);

    return NextResponse.json({
      success: true,
      message: 'Cập nhật khóa học thành công',
    });
  } catch (error: any) {
    console.error('Admin classroom PUT error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi cập nhật khóa học' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID khóa học cần xóa' }, { status: 400 });
    }

    // Xóa lessons, modules, rồi xóa course
    await execute('DELETE FROM course_lessons WHERE course_id = ?', [id]);
    await execute('DELETE FROM course_modules WHERE course_id = ?', [id]);
    await execute('DELETE FROM courses WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Đã xóa khóa học thành công',
    });
  } catch (error: any) {
    console.error('Admin classroom DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi khi xóa khóa học' }, { status: 500 });
  }
}

