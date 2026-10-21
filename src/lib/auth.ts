import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'tuhocai_session';

export interface SessionPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  [key: string]: any;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Support both bcrypt and plain sha256 from seed script if any
  if (hash.length === 64 && !hash.startsWith('$2')) {
    // legacy or dev sha256 hash check
    const crypto = await import('crypto');
    const sha = crypto.createHash('sha256').update(password).digest('hex');
    return sha === hash;
  }
  return bcrypt.compare(password, hash);
}

export async function signJWT(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifyJWT(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as SessionPayload;
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyJWT(token);
  } catch (error) {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  };
}
