import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9574;
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
  close() { this.ws.close(); }
}

async function captureUrl(client, url, filename, waitMs = 2500) {
  console.log(`Navigating to ${url}...`);
  await client.send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, waitMs));
  const shot = await client.send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.join(artifactDir, filename);
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log(`📸 Saved: ${filename}`);
}

async function run() {
  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    'about:blank',
  ]);

  try {
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        if (res.ok) break;
      } catch (_) {}
    }
    const targetsRes = await fetch(`http://127.0.0.1:${port}/json/list`);
    const targets = await targetsRes.json();
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];

    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 960,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // 1. Chụp Trang Chi Tiết Sản Phẩm (Mới tối giản)
    await captureUrl(
      client,
      'http://localhost:8899/san-pham/bo-prompt-midjourney-thuong-mai',
      'streamlined_detail_product.png',
      2500
    );

    // 2. Chụp Trang Chi Tiết Bài Viết (Mới tối giản)
    await captureUrl(
      client,
      'http://localhost:8899/bai-viet/huong-dan-tu-xay-ai-automation-bot-n8n-telegram-vietqr',
      'streamlined_detail_post.png',
      2500
    );

    // 3. Chụp Trang Chủ (Phần Hero & Slider nối tiếp nhau liền mạch)
    await captureUrl(
      client,
      'http://localhost:8899',
      'streamlined_home_hero_slider.png',
      2500
    );

    client.close();
    console.log('✅ Hoàn tất chụp visual QA!');
  } finally {
    edge.kill();
  }
}

run();

