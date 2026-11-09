import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9560;
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
  await client.send('Page.navigate', { url });
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Cuộn đến Metric Pillars và CTA Button (khớp với ảnh 5 của anh Đăng)
  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 800, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await capture(client, 'drama_lp_metric_pillars_and_cta_99k.png');

  // 2. Cuộn đến Section Trà Sữa (khớp với ảnh 4 của anh Đăng)
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const el = Array.from(document.querySelectorAll('h2')).find(h => h.innerText.includes('trà sữa') || h.innerText.includes('TRÀ SỮA') || h.innerText.includes('Mời NGUYỄN ĐĂNG AI'));
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      else window.scrollTo({ top: 2200, behavior: 'instant' });
    })()`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await capture(client, 'drama_lp_milk_tea_section_99k.png');

  client.close();
  edge.kill();
  console.log('✅ Hoàn tất chụp 2 góc cận cảnh!');
}

run().catch(console.error);

