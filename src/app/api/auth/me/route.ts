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

  // Get customer_phone from previous orders
  const phoneRes = await query<any>(
    'SELECT customer_phone FROM orders WHERE user_id = ? AND customer_phone IS NOT NULL AND customer_phone != "" ORDER BY created_at DESC LIMIT 1',
    [session.id]
  );
  const phone = phoneRes[0]?.customer_phone || '';

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.id,
      name: session.name,
      email: session.email,
      phone,
      role: session.role,
      libraryCount,
    }
  });
}
