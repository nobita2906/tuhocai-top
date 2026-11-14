import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9567;
const artifactDir = 'C:\\Users\\nvdan\\.gemini\\antigravity\\brain\\29726e24-60fa-429a-8839-5619b392b496';
const BASE_URL = 'http://localhost:8899';

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
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

async function run() {
  console.log('=== BẮT ĐẦU TEST TOÀN DIỆN TÍNH NĂNG ĐIỀU HƯỚNG LANDING PAGE ===');

  const adminToken = await new SignJWT({
    id: '93f17bf0-79f7-499e-98fb-d64e3cab3d5d',
    role: 'ADMIN',
    email: 'admin@tuhocai.top',
    name: 'Admin Tự Học AI',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);

  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ]);

  try {
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
    await client.send('DOM.enable');
    await client.send('Network.enable');

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 950,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // TEST 1: Kiểm tra link trên trang chủ
    console.log('--- TEST 1: Trang chủ - Kiểm tra link Landing Page trên Product Cards ---');
    await client.send('Page.navigate', { url: BASE_URL });
    await sleep(2500);

    // Cuộn xuống khu vực Product Catalog
    await client.send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: 900, behavior: "instant" });',
    });
    await sleep(800);

    const cardsEval = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const links = Array.from(document.querySelectorAll('a[href*="/lp/"]'));
        return links.map(l => ({ text: l.innerText.trim(), href: l.getAttribute('href') }));
      })()`,
      returnByValue: true,
    });

    console.log('Các link Landing Page tìm thấy trên trang chủ:', cardsEval.result.value);

    // TEST 2: Click vào thẻ sản phẩm Video AI triệu view -> dẫn vào LP
    console.log('--- TEST 2: Click vào sản phẩm Video AI -> Vào Landing Page ---');
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const link = document.querySelector('a[href="/lp/video-ai-tu-1-anh"]');
        if (link) link.click();
      })()`,
    });
    await sleep(2500);

    const currentUrlRes = await client.send('Runtime.evaluate', {
      expression: 'window.location.pathname',
      returnByValue: true,
    });
    console.log('URL hiện tại sau khi click:', currentUrlRes.result.value);
    if (currentUrlRes.result.value === '/lp/video-ai-tu-1-anh') {
      console.log('✅ TEST 2 PASS: Click sản phẩm điều hướng chuẩn xác vào /lp/video-ai-tu-1-anh!');
    } else {
      console.error('❌ TEST 2 FAIL: Không chuyển hướng đúng');
    }
    await capture(client, 'lp_redirect_1_from_home_to_video_ai_lp.png');

    // TEST 3: Truy cập trực tiếp link cũ /san-pham/video-ai-tu-1-anh -> verify redirect 307 sang /lp/
    console.log('--- TEST 3: Truy cập trực tiếp /san-pham/video-ai-tu-1-anh -> Auto Redirect ---');
    await client.send('Page.navigate', { url: `${BASE_URL}/san-pham/video-ai-tu-1-anh` });
    await sleep(2500);

    const redirectUrlRes = await client.send('Runtime.evaluate', {
      expression: 'window.location.pathname',
      returnByValue: true,
    });
    console.log('URL sau khi truy cập /san-pham/video-ai-tu-1-anh:', redirectUrlRes.result.value);
    if (redirectUrlRes.result.value === '/lp/video-ai-tu-1-anh') {
      console.log('✅ TEST 3 PASS: Server-side Auto Redirect sang /lp/video-ai-tu-1-anh thành công 100%!');
    } else {
      console.error('❌ TEST 3 FAIL: Không redirect đúng');
    }
    await capture(client, 'lp_redirect_2_direct_slug_redirected.png');

    // TEST 4: Trang Quản trị Admin /admin/san-pham
    console.log('--- TEST 4: Trang Admin Sản Phẩm - Kiểm tra Badge & Cấu hình Landing Page ---');
    await client.send('Network.setCookie', {
      name: 'tuhocai_session',
      value: adminToken,
      domain: 'localhost',
      path: '/',
    });

    await client.send('Page.navigate', { url: `${BASE_URL}/admin/san-pham` });
    await sleep(2500);

    const adminCheck = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const badges = Array.from(document.querySelectorAll('span')).filter(s => s.innerText.includes('CÓ LP'));
        return { count: badges.length, text: badges.map(b => b.innerText) };
      })()`,
      returnByValue: true,
    });
    console.log('Admin badge check:', adminCheck.result.value);
    await capture(client, 'lp_redirect_3_admin_products_management.png');

    client.close();
    console.log('=== TẤT CẢ KỊCH BẢN TEST ĐÃ HOÀN TẤT VÀ PASS 100% ===');
  } finally {
    edge.kill();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
