import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { SignJWT } from 'jose';
import { query } from '../src/lib/db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9589;
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

async function runTypoQA() {
  console.log('--- 🧪 BẮT ĐẦU KIỂM THỬ TRỰC QUAN CHUẨN TYPOGRAPHY TOÀN DIỆN ---');

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

    // Chụp hình 1: Header to rõ + Lộ trình bài học chữ lớn sắc nét
    await capture(client, 'typo_qa_1_header_and_curriculum.png');

    // 2. Cuộn chuột xuống Mục 2: Prompt
    console.log('[Test 2] Cuộn chuột xuống Mục 2: Prompts...');
    await client.send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: 850, behavior: "instant" });',
    });
    await sleep(800);
    await capture(client, 'typo_qa_2_prompts_and_code.png');

    // 3. Cuộn chuột xuống Mục 4: Checklist & Mục 5: Ghi Chú Markdown
    console.log('[Test 3] Cuộn chuột xuống Mục 4 & Mục 5...');
    await client.send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: 1550, behavior: "instant" });',
    });
    await sleep(800);
    await capture(client, 'typo_qa_3_checklist_and_notes.png');

    console.log('✅ HOÀN TẤT TOÀN BỘ CÁC BƯỚC KIỂM THỬ TRỰC QUAN TYPOGRAPHY!');
  } finally {
    client.close();
    edge.kill();
  }
}

runTypoQA().catch(err => {
  console.error('Lỗi khi chạy QA:', err);
  process.exit(1);
});

