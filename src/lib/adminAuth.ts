import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN';
}

/**
 * Verifies if current request is from an authenticated administrator.
 * Checks both JWT token payload and database role.
 */
export async function verifyAdminSession(): Promise<AdminUser | null> {
  const session = await getCurrentUser();
  if (!session || session.role !== 'ADMIN') {
    return null;
  }

  // Cross-check with DB to ensure role hasn't been revoked
  const users = await query<any>(
    'SELECT id, name, email, role FROM users WHERE id = ? AND role = "ADMIN" LIMIT 1',
    [session.id]
  );

  if (users.length === 0) {
    return null;
  }

  return {
    id: users[0].id,
    name: users[0].name || session.name,
    email: users[0].email,
    role: 'ADMIN',
  };
}

/**
 * Helper to respond with 401 Unauthorized or 403 Forbidden
 */
export function unauthorizedAdminResponse(message = 'Bạn không có quyền quản trị viên') {
  return NextResponse.json({ error: message, success: false }, { status: 403 });
}
