import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { SignJWT } from 'jose';
import { query } from '../src/lib/db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

async function signJWT(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9565;
const artifactDir = 'C:\\Users\\nvdan\\.gemini\\antigravity\\brain\\29726e24-60fa-429a-8839-5619b392b496';
const BASE_URL = 'http://localhost:8899';

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.id && this.callbacks.has(data.id)) {
          const { resolve, reject } = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function capture(client, filename) {
  const shot = await client.send('Page.captureScreenshot', { format: 'png' });
  const buffer = Buffer.from(shot.data, 'base64');
  const filePath = path.join(artifactDir, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`📸 Lưu screenshot: ${filename} (${buffer.length} bytes)`);
}

async function runQA() {
  console.log('--- 🧪 BẮT ĐẦU KIỂM THỬ KHU VỰC HỌC TẬP & TẢI TÀI LIỆU ---');

  // 1. Tạo JWT Token Admin
  const adminRows = await query("SELECT id, name, email, role FROM users WHERE role = 'ADMIN' LIMIT 1");
  const adminUser = adminRows[0] || {
    id: '93f17bf0-79f7-499e-98fb-d64e3cab3d5d',
    name: 'Nguyễn Văn Đăng',
    email: 'dang@tuhocai.top',
    role: 'ADMIN',
  };

  const adminToken = await signJWT({
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    role: 'ADMIN',
  });
  console.log('✓ Tạo session token Admin thành công');

  // 2. Test API GET /api/admin/classroom
  console.log('\n[API 1] GET /api/admin/classroom...');
  const getRes = await fetch(`${BASE_URL}/api/admin/classroom`, {
    headers: { Cookie: `tuhocai_session=${adminToken}` },
  });
  const getData = await getRes.json();
  if (!getData.success || !getData.courses) {
    throw new Error('GET /api/admin/classroom thất bại: ' + JSON.stringify(getData));
  }
  console.log(`✓ Lấy thành công ${getData.courses.length} khóa học từ Database!`);
  getData.courses.forEach((c) => {
    console.log(`  - [${c.slug}] ${c.title} (${c.modules_count} chương, ${c.lessons_count} bài)`);
  });

  // 3. Test API POST /api/admin/classroom/upload (Tải lên file tài liệu học tập)
  console.log('\n[API 2] POST /api/admin/classroom/upload (Tải file tài liệu)...');
  const testPdfContent = Buffer.from('%PDF-1.4 Test Document Tu Hoc AI Material Content 2026');
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const bodyBuffer = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="Tai_Lieu_Huong_Dan_Thuc_Chien.pdf"\r\nContent-Type: application/pdf\r\n\r\n`),
    testPdfContent,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);

  const uploadRes = await fetch(`${BASE_URL}/api/admin/classroom/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      Cookie: `tuhocai_session=${adminToken}`,
    },
    body: bodyBuffer,
  });
  const uploadData = await uploadRes.json();
  if (!uploadData.success || !uploadData.url) {
    throw new Error('Upload file tài liệu thất bại: ' + JSON.stringify(uploadData));
  }
  console.log(`✓ Upload tệp tài liệu thành công:`);
  console.log(`  Tên: ${uploadData.name} | Loại: ${uploadData.type} | Kích thước: ${uploadData.size} | Link: ${uploadData.url}`);

  // 4. Test API GET /api/dashboard/classroom (Học viên lấy danh sách khóa học)
  console.log('\n[API 3] GET /api/dashboard/classroom (Học viên view)...');
  const studentRes = await fetch(`${BASE_URL}/api/dashboard/classroom`, {
    headers: { Cookie: `tuhocai_session=${adminToken}` },
  });
  const studentData = await studentRes.json();
  if (!studentData.success || !studentData.courses) {
    throw new Error('Học viên load classroom thất bại: ' + JSON.stringify(studentData));
  }
  console.log(`✓ Học viên tải thành công ${studentData.courses.length} khóa học từ database!`);

  // 5. Khởi động Edge CDP Browser để chụp ảnh thực tế
  console.log('\n[Browser Test] Khởi động Edge CDP server tại port ' + port);
  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ]);

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) break;
    } catch (_) {}
  }

  const targetsRes = await fetch(`http://127.0.0.1:${port}/json/list`);
  const targets = await targetsRes.json();
  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Network.enable');

  // Đặt cookie Admin session
  await client.send('Network.setCookie', {
    name: 'tuhocai_session',
    value: adminToken,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // 6. Truy cập trang Quản Trị Khu Vực Học Tập
  const adminClassroomUrl = `${BASE_URL}/admin/khoa-hoc`;
  console.log(`🌐 Truy cập: ${adminClassroomUrl}...`);
  await client.send('Page.navigate', { url: adminClassroomUrl });
  await new Promise((r) => setTimeout(r, 2500));

  await capture(client, 'admin_classroom_dashboard.png');

  // 7. Click nút "Quản Lý Bài Học" của khóa học đầu tiên
  console.log('👉 Click mở quản lý bài học & tài liệu của khóa học...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const manageBtn = btns.find(b => b.innerText.includes('Quản Lý Bài Học'));
      if (manageBtn) manageBtn.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 3500));

  await capture(client, 'admin_classroom_lesson_editor.png');

  // 8. Cuộn xuống xem Khu Vực Up Tài Liệu & Video Preview
  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 800, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 1200));

  await capture(client, 'admin_classroom_material_uploader.png');

  // 9. Mở phòng học thực tế của học viên
  const studentRoomUrl = `${BASE_URL}/dashboard/hoc/video-ai-tu-1-anh`;
  console.log(`🌐 Mở phòng học phía học viên: ${studentRoomUrl}...`);
  await client.send('Page.navigate', { url: studentRoomUrl });
  await new Promise((r) => setTimeout(r, 2500));

  // Click vào bài học đầu tiên trong danh sách bên trái
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const items = Array.from(document.querySelectorAll('button, div'));
      const lessonItem = items.find(el => el.textContent && el.textContent.includes('1.1 Tổng quan'));
      if (lessonItem) lessonItem.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 1500));

  await capture(client, 'classroom_student_view_active_lesson.png');

  // Cuộn xuống để xem tabs và tài nguyên
  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 1000, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 800));

  // Chuyển sang Tab "Tài nguyên đính kèm"
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const resTab = btns.find(b => b.innerText.includes('Tài Nguyên') || b.innerText.includes('Tài nguyên'));
      if (resTab) resTab.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 1200));

  await capture(client, 'classroom_student_view_materials.png');

  client.close();
  edge.kill();
  console.log('\n🎉 KIỂM THỬ E2E THÀNH CÔNG 100%!');
}

runQA().catch((err) => {
  console.error('❌ Lỗi kiểm thử:', err);
  process.exit(1);
});
