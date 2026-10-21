import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, signJWT, getSessionCookieOptions } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập email và mật khẩu' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const users = await query<any>('SELECT * FROM users WHERE email = ? LIMIT 1', [cleanEmail]);
    if (users.length === 0) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác' }, { status: 401 });
    }

    const user = users[0];
    const isMatch = await verifyPassword(password, user.password_hash || '');
    if (!isMatch) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác' }, { status: 401 });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = await signJWT(payload);
    const cookieStore = await cookies();
    const cookieOpts = getSessionCookieOptions();
    cookieStore.set(cookieOpts.name, token, cookieOpts);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Đăng nhập thất bại: ' + (err.message || 'Lỗi máy chủ') }, { status: 500 });
  }
}
