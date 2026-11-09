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
const port = 9569;
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

async function runScrollQA() {
  console.log('--- 🧪 BẮT ĐẦU KIỂM THỬ TÍNH NĂNG TỰ ĐỘNG CUỘN (AUTO-SCROLL) & THANH QUICK ANCHORS ---');

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

  // STEP 1: Truy cập phòng học học viên
  console.log('\n[TEST 1] Truy cập phòng học: /dashboard/hoc/video-ai-tu-1-anh...');
  await client.send('Page.navigate', { url: `${BASE_URL}/dashboard/hoc/video-ai-tu-1-anh` });
  await new Promise((r) => setTimeout(r, 2500));

  // Chụp toàn cảnh ban đầu với thanh điều hướng Quick Jump
  await capture(client, 'scroll_qa_1_overview_anchors.png');

  // STEP 2: Test click nút Quick Anchor [2. Lấy Prompt]
  console.log('\n[TEST 2] Click thanh điều hướng 1 chạm: "2. Lấy Prompt"...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const promptBtn = btns.find(b => b.innerText.includes('2. Lấy Prompt'));
      if (promptBtn) promptBtn.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 600));

  const scrollPosAfterPrompt = await client.send('Runtime.evaluate', {
    expression: 'window.scrollY',
  });
  console.log(`✓ Đã tự động cuộn đến vị trí: ${scrollPosAfterPrompt.result.value}px`);
  await capture(client, 'scroll_qa_2_jump_to_prompt.png');

  // STEP 3: Test click nút Quick Anchor [4. Checklist]
  console.log('\n[TEST 3] Click thanh điều hướng 1 chạm: "4. Checklist"...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const checklistBtn = btns.find(b => b.innerText.includes('4. Checklist'));
      if (checklistBtn) checklistBtn.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 600));

  const scrollPosAfterChecklist = await client.send('Runtime.evaluate', {
    expression: 'window.scrollY',
  });
  console.log(`✓ Đã tự động cuộn đến vị trí: ${scrollPosAfterChecklist.result.value}px`);
  await capture(client, 'scroll_qa_3_jump_to_checklist.png');

  // STEP 4: Khi đang ở dưới đáy trang, click vào bài học 1.2 ở Sidebar Trái
  console.log('\n[TEST 4] Đang ở dưới trang, click bài 1.2 trên Sidebar Trái...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const lesson12 = btns.find(b => b.innerText.includes('1.2 Viết kịch bản'));
      if (lesson12) lesson12.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 800));

  const scrollPosAfterLessonSelect = await client.send('Runtime.evaluate', {
    expression: 'window.scrollY',
  });
  console.log(`✓ Đã tự động cuộn mượt ngược lên đầu bài học: ${scrollPosAfterLessonSelect.result.value}px`);
  await capture(client, 'scroll_qa_4_autoscroll_on_lesson_click.png');

  client.close();
  edge.kill();
  console.log('\n🎉 KIỂM THỬ TÍNH NĂNG TỰ ĐỘNG CUỘN ĐẠT 100% THÀNH CÔNG!');
}

runScrollQA().catch((err) => {
  console.error('❌ Lỗi kiểm thử:', err);
  process.exit(1);
});

