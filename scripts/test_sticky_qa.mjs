import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { SignJWT } from 'jose';
import { query } from '../src/lib/db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9588;
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

async function runStickyQA() {
  console.log('--- 🧪 KIỂM THỬ TÍNH NĂNG CỐ ĐỊNH (STICKY) & ẨN SCROLLBAR ---');

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

    // Chụp hình 1: Đỉnh trang bài 1.1 với thanh điều hướng mới không có thanh cuộn xám
    await capture(client, 'sticky_qa_1_top_view_no_scrollbar.png');

    // 2. Cuộn chuột xuống 650px (đang ở giữa bài học)
    console.log('[Test 2] Cuộn chuột xuống 650px để kiểm tra Sticky Sidebar và Sticky Sub-Nav...');
    await client.send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: 650, behavior: "instant" });',
    });
    await sleep(1000);

    // Chụp hình 2: Sticky view - cả cột trái và thanh chuyển đến ghim cố định ở đỉnh
    await capture(client, 'sticky_qa_2_scrolled_sticky_both.png');

    // 3. Cuộn sâu xuống 1400px (tận phần Checklist & Ghi chú kịch bản)
    console.log('[Test 3] Cuộn sâu xuống 1400px...');
    await client.send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: 1400, behavior: "instant" });',
    });
    await sleep(1000);

    // Chụp hình 3: Deep scroll - thanh điều hướng vẫn ghim vững chắc
    await capture(client, 'sticky_qa_3_deep_scroll_checklist_sticky.png');

    // 4. Test bấm nút "[2. Lấy Prompt]" từ vị trí sâu 1400px
    console.log('[Test 4] Bấm nút [2. Lấy Prompt] từ vị trí sâu 1400px...');
    const jumpResult = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const promptBtn = btns.find(b => b.textContent && b.textContent.includes('2. Lấy Prompt'));
          if (promptBtn) {
            promptBtn.click();
            return 'Đã bấm 2. Lấy Prompt';
          }
          return 'Không tìm thấy nút Lấy Prompt';
        })()
      `,
    });
    console.log('Result:', jumpResult.result.value);
    await sleep(1200);

    // Chụp hình 4: Nhảy ngược mượt mà đến đúng hộp Prompt, không bị che bởi sticky navbar
    await capture(client, 'sticky_qa_4_jump_to_prompt_with_offset.png');

    // 5. Test bấm nút "[Đầu bài]"
    console.log('[Test 5] Bấm nút [Đầu bài]...');
    const topResult = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const topBtn = btns.find(b => b.textContent && b.textContent.includes('Đầu bài'));
          if (topBtn) {
            topBtn.click();
            return 'Đã bấm Đầu bài';
          }
          return 'Không tìm thấy nút Đầu bài';
        })()
      `,
    });
    console.log('Result:', topResult.result.value);
    await sleep(1200);
    await capture(client, 'sticky_qa_5_back_to_top_header.png');

    console.log('✅ HOÀN TẤT TOÀN BỘ 5 BƯỚC KIỂM THỬ STICKY & SCROLLBAR!');
  } finally {
    client.close();
    edge.kill();
  }
}

runStickyQA().catch(err => {
  console.error('Lỗi khi chạy QA:', err);
  process.exit(1);
});

