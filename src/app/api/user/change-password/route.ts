import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { verifyPassword, hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, currentPassword, newPassword } = await req.json();

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 });
    }

    if (String(newPassword).length < 6) {
      return NextResponse.json({ error: 'Mật khẩu mới phải có tối thiểu 6 ký tự' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanCurrentPass = String(currentPassword).trim();
    const cleanNewPass = String(newPassword).trim();

    // 1. Tìm user theo email
    const users = await query<any>('SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1', [cleanEmail]);
    if (users.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy tài khoản người dùng' }, { status: 404 });
    }

    const user = users[0];
    let isCurrentPassValid = false;

    if (user.password_hash) {
      isCurrentPassValid = await verifyPassword(cleanCurrentPass, user.password_hash);
    }

    // Nếu không khớp hash, kiểm tra fallback với số điện thoại trong orders
    if (!isCurrentPassValid) {
      const orders = await query<any>(
        'SELECT customer_phone FROM orders WHERE LOWER(customer_email) = ? AND customer_phone IS NOT NULL LIMIT 1',
        [cleanEmail]
      );
      if (orders.length > 0) {
        const phone = String(orders[0].customer_phone).replace(/\s+/g, '').trim();
        if (cleanCurrentPass === phone) {
          isCurrentPassValid = true;
        }
      }
    }

    if (!isCurrentPassValid) {
      return NextResponse.json(
        { error: 'Mật khẩu hiện tại không chính xác (mặc định là Số điện thoại của bạn)' },
        { status: 401 }
      );
    }

    // 2. Hash và cập nhật mật khẩu mới
    const newHash = await hashPassword(cleanNewPass);
    await execute('UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?', [newHash, user.id]);

    return NextResponse.json({
      success: true,
      message: 'Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới để đăng nhập Kho Của Tôi.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi xử lý đổi mật khẩu' }, { status: 500 });
  }
}
