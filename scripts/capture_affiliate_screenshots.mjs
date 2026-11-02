import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9556;
const artifactDir = 'C:\\Users\\nvdan\\.gemini\\antigravity\\brain\\29726e24-60fa-429a-8839-5619b392b496';

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

async function capture(client, url, width, height, filename) {
  console.log(`📸 Viewport ${width}x${height} -> ${url}`);
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });

  await client.send('Page.navigate', { url });
  await new Promise((r) => setTimeout(r, 2000));

  const screenshot = await client.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });

  const filePath = path.join(artifactDir, filename);
  fs.writeFileSync(filePath, Buffer.from(screenshot.data, 'base64'));
  console.log(`✅ Saved: ${filename} (${(screenshot.data.length * 0.75 / 1024).toFixed(0)} KB)`);
}

async function main() {
  console.log('🚀 Khởi chạy Edge headless...');
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
  const pageTarget = targets.find((t) => t.type === 'page');

  if (!pageTarget) {
    console.error('Không tìm thấy page target');
    edge.kill();
    return;
  }

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  console.log('✓ Kết nối CDP WebSocket thành công!');

  await client.send('Page.enable');
  await client.send('DOM.enable');

  // 1. Affiliate Guide desktop 1280
  await capture(client, 'http://localhost:8899/affiliate', 1280, 900, 'affiliate_guide_desktop_1280.png');

  // 1b. Scroll down to Rules & Policies section
  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 1650, behavior: 'instant' });`
  });
  await new Promise((r) => setTimeout(r, 1000));
  const rulesShot = await client.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });
  fs.writeFileSync(path.join(artifactDir, 'affiliate_rules_section_1280.png'), Buffer.from(rulesShot.data, 'base64'));
  console.log(`✅ Saved: affiliate_rules_section_1280.png`);

  // 2. Affiliate Guide mobile 390
  await capture(client, 'http://localhost:8899/affiliate', 390, 844, 'affiliate_guide_mobile_390.png');

  // 3. Affiliate Register tab 1280
  await capture(client, 'http://localhost:8899/affiliate?tab=register', 1280, 900, 'affiliate_register_desktop_1280.png');

  // 4. Product page with promo card 1280
  await capture(client, 'http://localhost:8899/san-pham/video-ai-tu-1-anh', 1280, 900, 'product_promo_benefit_1280.png');

  client.close();
  edge.kill();
  console.log('🎉 Chụp ảnh màn hình hoàn tất 100%!');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
