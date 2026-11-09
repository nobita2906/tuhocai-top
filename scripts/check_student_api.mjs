import { SignJWT } from 'jose';
import { query } from '../src/lib/db.ts';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key');

async function main() {
  const adminRows = await query("SELECT id, name, email, role FROM users WHERE role = 'ADMIN' LIMIT 1");
  const adminUser = adminRows[0];
  const token = await new SignJWT({ id: adminUser.id, name: adminUser.name, email: adminUser.email, role: 'ADMIN' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);

  const res = await fetch('http://localhost:8899/api/dashboard/classroom/video-ai-tu-1-anh', {
    headers: { Cookie: `tuhocai_session=${token}` }
  });
  console.log('API Status:', res.status);
  const data = await res.json();
  console.log('API Data Success:', data.success);
  if (data.course) {
    console.log('Course title:', data.course.title);
    console.log('Course price:', data.course.price);
    console.log('isUnlocked:', data.course.isUnlocked);
    console.log('Course modules count:', data.course.modules?.length);
    if (data.course.modules?.length > 0) {
      console.log('First module lessons count:', data.course.modules[0].lessons?.length);
      console.log('First lesson title:', data.course.modules[0].lessons[0]?.title);
    }
  }
}
main();

