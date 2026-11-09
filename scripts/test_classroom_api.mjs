import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

async function test() {
  const token = await new SignJWT({
    id: '93f17bf0-79f7-499e-98fb-d64e3cab3d5d',
    name: 'Nguyễn Văn Đăng (Admin)',
    email: 'dang@tuhocai.top',
    role: 'ADMIN'
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);

  const res = await fetch('http://localhost:8899/api/dashboard/classroom/video-ai-tu-1-anh', {
    headers: {
      Cookie: `tuhocai_session=${token}`
    }
  });

  const data = await res.json();
  console.log('Keys in data:', Object.keys(data));
  console.log('data.course keys:', Object.keys(data.course || {}));
  console.log('data.course.modules:', data.course?.modules?.length);
  if (data.course?.modules) {
    for (const m of data.course.modules) {
      console.log(`Module ${m.title}: ${m.lessons?.length} lessons`);
    }
  }
}

test().catch(console.error);
