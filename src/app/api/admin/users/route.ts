import { NextResponse } from 'next/server';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { query, execute } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const role = searchParams.get('role') || '';

    let sql = `
      SELECT 
        u.id, u.name, u.email, u.role, u.created_at, u.updated_at,
        (SELECT COUNT(*) FROM user_library ul WHERE ul.user_id = u.id) as library_count,
        (SELECT COUNT(*) FROM orders o WHERE o.customer_email = u.email AND o.payment_status = 'APPROVED') as orders_count
      FROM users u
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      sql += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (role && (role === 'USER' || role === 'ADMIN')) {
      sql += ' AND u.role = ?';
      params.push(role);
    }

    sql += ' ORDER BY u.created_at DESC';

    const users = await query(sql, params);
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi tải danh sách người dùng' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const body = await req.json();
    const { id, role, name, newPassword } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID người dùng' }, { status: 400 });
    }

    const targetUser = await query<any>('SELECT id, email, role FROM users WHERE id = ? LIMIT 1', [id]);
    if (targetUser.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    }

    // Safeguard: Prevent admin from revoking their own admin role
    if (admin.id === id && role && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Không thể tự hạ quyền Admin của chính mình' }, { status: 400 });
    }

    if (role && (role === 'USER' || role === 'ADMIN')) {
      await execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    }

    if (name) {
      await execute('UPDATE users SET name = ? WHERE id = ?', [name.trim(), id]);
    }

    if (newPassword && newPassword.trim().length >= 6) {
      const passwordHash = await hashPassword(newPassword.trim());
      await execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin thành viên thành công!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi cập nhật người dùng' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID người dùng' }, { status: 400 });
    }

    // Safeguard: Cannot delete self
    if (admin.id === id) {
      return NextResponse.json({ error: 'Không thể tự xóa tài khoản của chính mình' }, { status: 400 });
    }

    await execute('DELETE FROM user_library WHERE user_id = ?', [id]);
    await execute('DELETE FROM users WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Đã xóa người dùng thành công' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi xóa người dùng' }, { status: 500 });
  }
}
