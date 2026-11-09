import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9559;
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

async function run() {
  console.log('🚀 Khởi động Edge CDP server tại port ' + port);
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
  await client.send('DOM.enable');

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const url = `${BASE_URL}/lp/video-drama-gia-dinh-nho`;
  console.log(`🌐 Truy cập ${url}...`);
  await client.send('Page.navigate', { url });
  await new Promise((r) => setTimeout(r, 2500));

  // 1. Chụp Hero section với giá 99K và CTA (99K)
  await capture(client, 'drama_lp_hero_99k.png');

  // 2. Cuộn xuống Section "MỜI NGUYỄN ĐĂNG AI 1 LY TRÀ SỮA 99.000Đ"
  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 1400, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await capture(client, 'drama_lp_tra_sua_99k.png');

  // 3. Cuộn xuống Section VietQR & bảng thông tin chuyển khoản 99.000đ
  await client.send('Runtime.evaluate', {
    expression: `document.querySelector('#nhan-quy-trinh').scrollIntoView({ behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await capture(client, 'drama_lp_vietqr_checkout_99k.png');

  client.close();
  edge.kill();
  console.log('✅ Chụp hoàn tất 3 khu vực kiểm chứng!');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
