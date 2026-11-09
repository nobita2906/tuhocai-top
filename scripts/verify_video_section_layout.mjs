import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { SignJWT } from 'jose';
import { query } from '../src/lib/db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9577;
const artifactDir = 'C:\\Users\\nvdan\\.gemini\\antigravity\\brain\\29726e24-60fa-429a-8839-5619b392b496';
const BASE_URL = 'http://localhost:8899';

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

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

async function runVerify() {
  console.log('--- 🧪 KIỂM THỬ GIAO DIỆN MỚI: VIDEO LÀ MỤC RIÊNG & HEADER BÀI HỌC TRÊN ĐẦU ---');

  const adminRows = await query("SELECT id, name, email, role FROM users WHERE role = 'ADMIN' LIMIT 1");
  const adminUser = adminRows[0];
  const adminToken = await new SignJWT({
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    role: 'ADMIN',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);

  console.log('[Browser Test] Khởi động Edge CDP server tại port ' + port);
  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ]);

  for (let i = 0; i < 40; i++) {
    await sleep(200);
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

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 960,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send('Network.setCookie', {
    name: 'tuhocai_session',
    value: adminToken,
    domain: 'localhost',
    path: '/',
  });

  try {
    // 1. Vào trang học viên
    console.log('[Test 1] Điều hướng đến trang phòng học học viên...');
    await client.send('Page.navigate', { url: `${BASE_URL}/dashboard/hoc/video-ai-tu-1-anh` });
    await sleep(4000);

    // Chụp hình ảnh 1: Header trên đầu + Thanh điều hướng + Box Tóm tắt + Mục 1 Video mở đầy đủ
    await capture(client, 'video_sec_1_header_and_expanded_video.png');

    // 2. Bấm nút "Thu Gọn" Video
    console.log('[Test 2] Bấm nút [Thu Gọn] video...');
    const collapseResult = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const collapseBtn = btns.find(b => b.textContent && b.textContent.includes('Thu Gọn'));
          if (collapseBtn) {
            collapseBtn.click();
            return 'Đã bấm Thu Gọn';
          }
          return 'Không tìm thấy nút Thu Gọn';
        })()
      `,
    });
    console.log('Result:', collapseResult.result.value);
    await sleep(800);

    // Chụp hình ảnh 2: Video thu gọn thành thanh nhỏ, Mục 2 Prompt lập tức lộ ra ngay gần đỉnh
    await capture(client, 'video_sec_2_collapsed_video_view.png');

    // 3. Bấm nút sao chép prompt
    console.log('[Test 3] Bấm nút sao chép prompt...');
    const copyResult = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const copyBtn = btns.find(b => b.textContent && (b.textContent.includes('Sao chép Prompt') || b.textContent.includes('Sao chép')));
          if (copyBtn) {
            copyBtn.click();
            return 'Đã bấm sao chép prompt';
          }
          return 'Không tìm thấy nút sao chép';
        })()
      `,
    });
    console.log('Result:', copyResult.result.value);
    await sleep(600);
    await capture(client, 'video_sec_3_prompt_copied_feedback.png');

    // 4. Vào trang Admin /admin/khoa-hoc kiểm tra đồng bộ
    console.log('[Test 4] Điều hướng đến trang quản trị /admin/khoa-hoc...');
    await client.send('Page.navigate', { url: `${BASE_URL}/admin/khoa-hoc` });
    await sleep(3500);

    // Chọn khóa học
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const courseBtn = btns.find(b => b.textContent && b.textContent.includes('Quản Lý Bài Học'));
          if (courseBtn) {
            courseBtn.click();
            return 'Đã click khóa học';
          }
          return 'Không tìm thấy khóa học';
        })()
      `,
    });
    await sleep(2500);

    // Chọn bài 1.1
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const lessonBtn = btns.find(b => b.textContent && b.textContent.includes('1.1'));
          if (lessonBtn) {
            lessonBtn.click();
            return 'Đã click bài 1.1';
          }
          return 'Không tìm thấy bài 1.1';
        })()
      `,
    });
    await sleep(1500);

    // Chụp hình ảnh 4: Admin page preview với Video là Mục 1 và Header trên đầu
    await capture(client, 'video_sec_4_admin_synced_view.png');

    console.log('✅ HOÀN TẤT TOÀN BỘ 4 BƯỚC KIỂM THỬ TRỰC QUAN!');
  } finally {
    client.close();
    edge.kill();
  }
}

runVerify().catch(err => {
  console.error('Lỗi khi chạy QA:', err);
  process.exit(1);
});
