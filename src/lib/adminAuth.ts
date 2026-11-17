import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
  isSuperAdmin: boolean;
}

/**
 * Verifies if current request is from an authenticated staff member (ADMIN or EDITOR).
 * Checks both JWT token payload and database role.
 */
export async function verifyAdminSession(): Promise<AdminUser | null> {
  const session = await getCurrentUser();
  if (!session || (session.role !== 'ADMIN' && (session.role as string) !== 'EDITOR')) {
    return null;
  }

  // Cross-check with DB to ensure role hasn't been revoked
  const users = await query<any>(
    'SELECT id, name, email, role FROM users WHERE id = ? AND (role = "ADMIN" OR role = "EDITOR") LIMIT 1',
    [session.id]
  );

  if (users.length === 0) {
    return null;
  }

  const role = users[0].role as 'ADMIN' | 'EDITOR';

  return {
    id: users[0].id,
    name: users[0].name || session.name,
    email: users[0].email,
    role,
    isSuperAdmin: role === 'ADMIN',
  };
}

/**
 * Verifies if current request is from a SUPER ADMIN (role: ADMIN only).
 * Editors/Managers will be blocked from sensitive system settings and deletions.
 */
export async function verifySuperAdminSession(): Promise<AdminUser | null> {
  const admin = await verifyAdminSession();
  if (!admin || !admin.isSuperAdmin) {
    return null;
  }
  return admin;
}

/**
 * Helper to respond with 401 Unauthorized or 403 Forbidden
 */
export function unauthorizedAdminResponse(message = 'Bạn không có quyền truy cập khu vực này') {
  return NextResponse.json({ error: message, success: false }, { status: 403 });
}
