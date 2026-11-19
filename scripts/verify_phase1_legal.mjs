import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9775;
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

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    await sleep(200);
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) break;
    } catch (_) {}
  }

  const targetsRes = await fetch(`http://127.0.0.1:${port}/json/list`);
  const targets = await targetsRes.json();
  const pageTarget = targets.find((t) => t.type === 'page');

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });

  // 1. Chụp Điều khoản
  await client.send('Page.navigate', { url: 'http://localhost:8899/dieu-khoan' });
  await sleep(2500);
  const shot1 = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'qa_legal_dieu_khoan.png'), Buffer.from(shot1.data, 'base64'));
  console.log('📸 Đã chụp: qa_legal_dieu_khoan.png');

  // 2. Chụp Hoàn tiền
  await client.send('Page.navigate', { url: 'http://localhost:8899/hoan-tien' });
  await sleep(2000);
  const shot2 = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'qa_legal_hoan_tien.png'), Buffer.from(shot2.data, 'base64'));
  console.log('📸 Đã chụp: qa_legal_hoan_tien.png');

  // 3. Chụp Footer mới trang chủ
  await client.send('Page.navigate', { url: 'http://localhost:8899' });
  await sleep(2500);
  await client.send('Runtime.evaluate', { expression: `window.scrollTo(0, document.body.scrollHeight)` });
  await sleep(1000);
  const shot3 = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'qa_legal_footer.png'), Buffer.from(shot3.data, 'base64'));
  console.log('📸 Đã chụp: qa_legal_footer.png');

  client.close();
  edge.kill();
}

run().catch(console.error);

