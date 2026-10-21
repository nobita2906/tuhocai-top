import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  // Get count of unlocked products
  const countRes = await query<any>(
    'SELECT COUNT(*) as count FROM user_library WHERE user_id = ?',
    [session.id]
  );
  const libraryCount = countRes[0]?.count || 0;

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
      libraryCount,
    }
  });
}
