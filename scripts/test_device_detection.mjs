import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { SignJWT } from 'jose';
import { query } from '../src/lib/db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9591;
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

async function main() {
  console.log('--- 🧪 KIỂM THỬ NHẬN DIỆN THIẾT BỊ & CỐ ĐỊNH GIAO DIỆN MOBILE ---');

  // 1. Kiểm tra HTTP Middleware Device Detection với Desktop User-Agent
  console.log('[Test 1] Gửi request với Desktop User-Agent...');
  const desktopRes = await fetch(`${BASE_URL}/api/health`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  console.log('Desktop Header x-device-type:', desktopRes.headers.get('x-device-type'));
  console.log('Desktop Set-Cookie:', desktopRes.headers.get('set-cookie'));

  // 2. Kiểm tra HTTP Middleware Device Detection với Mobile User-Agent (iPhone)
  console.log('[Test 2] Gửi request với Mobile User-Agent (iPhone)...');
  const mobileRes = await fetch(`${BASE_URL}/api/health`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    }
  });
  console.log('Mobile Header x-device-type:', mobileRes.headers.get('x-device-type'));
  console.log('Mobile Set-Cookie:', mobileRes.headers.get('set-cookie'));

  // 3. Khởi động Browser mô phỏng thiết bị di động (Mobile Emulation: 390x844 iPhone 14)
  console.log('[Test 3] Khởi động Edge mô phỏng iPhone 14 (390 x 844)...');
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

  // Set Mobile User Agent & Device Metrics (iPhone 14)
  await client.send('Network.setUserAgentOverride', {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });

  await client.send('Network.setCookie', {
    name: 'tuhocai_session',
    value: adminToken,
    domain: 'localhost',
    path: '/',
  });

  try {
    console.log('[Test 4] Điều hướng vào phòng học trên Mobile View...');
    await client.send('Page.navigate', { url: `${BASE_URL}/dashboard/hoc/video-ai-tu-1-anh` });
    await sleep(4000);

    // Chụp hình 1: Giao diện Mobile đỉnh trang (Title + Nút hoàn thành + Thanh chuyển đến + Video)
    await capture(client, 'mobile_locked_1_header_and_video.png');

    // Cuộn xuống xem Mục 2 Prompt trên Mobile
    console.log('[Test 5] Cuộn chuột xem Prompt trên Mobile...');
    await client.send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: 580, behavior: "instant" });',
    });
    await sleep(800);
    await capture(client, 'mobile_locked_2_prompt_and_tools.png');

    // Cuộn xuống đáy xem Lộ trình bài học trên Mobile (xếp dưới gọn gàng)
    console.log('[Test 6] Cuộn xuống xem Lộ Trình bài học trên Mobile...');
    await client.send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: 1600, behavior: "instant" });',
    });
    await sleep(800);
    await capture(client, 'mobile_locked_3_curriculum_below.png');

    console.log('✅ HOÀN TẤT KIỂM THỬ MOBILE VIEW VÀ DEVICE DETECTION!');
  } finally {
    client.close();
    edge.kill();
  }
}

main().catch(console.error);

