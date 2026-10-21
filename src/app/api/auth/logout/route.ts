import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionCookieOptions } from '@/lib/auth';

export async function POST() {
  const cookieStore = await cookies();
  const opts = getSessionCookieOptions();
  cookieStore.set(opts.name, '', { ...opts, maxAge: 0 });
  return NextResponse.json({ success: true, message: 'Đã đăng xuất' });
}
