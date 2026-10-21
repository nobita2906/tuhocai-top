import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { execute, query } from '@/lib/db';
import { hashPassword, signJWT, getSessionCookieOptions } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ họ tên, email và mật khẩu' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists
    const existing = await query<any>('SELECT id FROM users WHERE email = ? LIMIT 1', [cleanEmail]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email này đã được đăng ký tài khoản. Vui lòng đăng nhập.' }, { status: 409 });
    }

    const userId = randomUUID();
    const passwordHash = await hashPassword(password);

    await execute(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [userId, name.trim(), cleanEmail, passwordHash, 'USER']
    );

    // Auto-claim any existing orders previously made with this email
    const pendingLibrary = await query<any>(
      `SELECT product_id, id as order_id FROM orders WHERE customer_email = ? AND payment_status = 'APPROVED'`,
      [cleanEmail]
    );
    for (const item of pendingLibrary) {
      await execute(
        'INSERT IGNORE INTO user_library (id, user_id, product_id, order_id) VALUES (?, ?, ?, ?)',
        [randomUUID(), userId, item.product_id, item.order_id]
      );
    }

    // Sign JWT session
    const payload = { id: userId, email: cleanEmail, name: name.trim(), role: 'USER' as const };
    const token = await signJWT(payload);

    const cookieStore = await cookies();
    const cookieOpts = getSessionCookieOptions();
    cookieStore.set(cookieOpts.name, token, cookieOpts);

    return NextResponse.json({
      success: true,
      user: { id: userId, name: name.trim(), email: cleanEmail, role: 'USER' }
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Đăng ký thất bại: ' + (err.message || 'Lỗi máy chủ') }, { status: 500 });
  }
}
