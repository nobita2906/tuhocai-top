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
const port = 9566;
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

async function runSkoolQA() {
  console.log('--- 🧪 BẮT ĐẦU KIỂM THỬ SKOOL.COM CLASSROOM STRUCTURE ---');

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
  console.log('✓ Token Admin sẵn sàng');

  // 2. Khởi động Edge CDP Browser
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

  // TEST 1: ADMIN SKOOL VIEW
  console.log('\n[Step 1] Kiểm tra trang quản trị /admin/khoa-hoc...');
  await client.send('Page.navigate', { url: `${BASE_URL}/admin/khoa-hoc` });
  await new Promise((r) => setTimeout(r, 2500));

  // Click vào khóa học đầu tiên "Quản Lý Bài Học"
  console.log('👉 Click "Quản Lý Bài Học"...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const manageBtn = btns.find(b => b.innerText.includes('Quản Lý Bài Học'));
      if (manageBtn) manageBtn.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 3000));

  // Chọn bài học 1.1 nếu chưa chọn
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const lessonBtn = btns.find(b => b.innerText.includes('1.1') || b.innerText.includes('Tổng quan'));
      if (lessonBtn) lessonBtn.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 1000));

  await capture(client, 'skool_admin_view_top.png');

  // Cuộn xuống xem tài liệu và checklist
  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 600, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await capture(client, 'skool_admin_view_content_and_resources.png');

  // Click sang chế độ Edit: "Chỉnh Sửa Bài Này"
  console.log('👉 Click "Chỉnh Sửa Bài Này" (Admin Editor Mode)...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const editBtn = btns.find(b => b.innerText.includes('Chỉnh Sửa Bài Này'));
      if (editBtn) editBtn.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 1500));
  await capture(client, 'skool_admin_editor_tab1.png');

  // Click sang Tab 2: "2. Tài Liệu Đính Kèm"
  console.log('👉 Click Tab 2: Tài Liệu Đính Kèm...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const tab2 = btns.find(b => b.innerText.includes('2. Tài Liệu'));
      if (tab2) tab2.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await capture(client, 'skool_admin_editor_tab2_resources.png');

  // TEST 2: STUDENT SKOOL LEARNING ROOM
  console.log('\n[Step 2] Kiểm tra giao diện học viên Skool: /dashboard/hoc/video-ai-tu-1-anh...');
  await client.send('Page.navigate', { url: `${BASE_URL}/dashboard/hoc/video-ai-tu-1-anh` });
  await new Promise((r) => setTimeout(r, 3000));

  // Chụp phần đầu của Student View
  await capture(client, 'skool_student_classroom_top.png');

  // Cuộn xuống để xem Attachments Hub, Checklist, và Markdown
  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 650, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await capture(client, 'skool_student_classroom_attachments_and_checklist.png');

  // Cuộn xuống tiếp để xem Markdown Content và Navigation
  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 1200, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await capture(client, 'skool_student_classroom_markdown_notes.png');

  client.close();
  edge.kill();
  console.log('\n🎉 TOÀN BỘ SCREENSHOT SKOOL.COM ĐÃ ĐƯỢC CHỤP THÀNH CÔNG!');
}

runSkoolQA().catch((err) => {
  console.error('❌ Lỗi kiểm thử Skool QA:', err);
  process.exit(1);
});

