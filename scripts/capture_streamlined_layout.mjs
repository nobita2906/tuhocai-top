import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9564;
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
  console.log(`📸 Saved screenshot: ${filename} (${buffer.length} bytes)`);
}

async function run() {
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

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 950,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // 1. Chụp Mục Sản Phẩm Mới Trên Trang Chủ
    console.log('Navigating to Home...');
    await client.send('Page.navigate', { url: BASE_URL });
    await sleep(2500);
    await client.send('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: 780, behavior: "instant" });',
    });
    await sleep(800);
    await capture(client, 'streamlined_1_home_products.png');

    // 2. Chụp Mục Bài Viết Mới Trên Trang Chủ
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const el = Array.from(document.querySelectorAll('h2')).find(h => h.innerText.includes('Tin Tức & Hướng Dẫn AI'));
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        else window.scrollTo({ top: 1600, behavior: 'instant' });
      })()`,
    });
    await sleep(800);
    await capture(client, 'streamlined_2_home_posts.png');

    // 3. Chụp Trang Kho Sản Phẩm /san-pham
    console.log('Navigating to /san-pham...');
    await client.send('Page.navigate', { url: `${BASE_URL}/san-pham` });
    await sleep(2500);
    await capture(client, 'streamlined_3_catalog_products.png');

    // 4. Chụp Trang Bài Viết /bai-viet
    console.log('Navigating to /bai-viet...');
    await client.send('Page.navigate', { url: `${BASE_URL}/bai-viet` });
    await sleep(2500);
    await capture(client, 'streamlined_4_blog_posts.png');

    client.close();
    console.log('Chụp hoàn tất!');
  } finally {
    edge.kill();
  }
}

run().catch(console.error);

