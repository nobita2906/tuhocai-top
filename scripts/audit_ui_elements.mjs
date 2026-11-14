import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9576;
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

    // 1. Mobile viewport (iPhone 14 / modern phone: 390x844)
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await client.send('Page.navigate', { url: 'http://localhost:8899' });
    await new Promise(r => setTimeout(r, 2000));
    let shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'audit_mobile_home.png'), Buffer.from(shot.data, 'base64'));

    // Cuộn nhẹ xem slider trên mobile
    await client.send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 480, behavior: 'instant' })`
    });
    await new Promise(r => setTimeout(r, 600));
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'audit_mobile_slider.png'), Buffer.from(shot.data, 'base64'));

    // 2. Desktop Light Mode Test
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    // Toggle Light mode
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      })()`
    });
    await new Promise(r => setTimeout(r, 600));
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'audit_desktop_lightmode.png'), Buffer.from(shot.data, 'base64'));

    // 3. Checkout Page Test
    await client.send('Page.navigate', { url: 'http://localhost:8899/thanh-toan?pid=WF-THAI-099' });
    await new Promise(r => setTimeout(r, 2000));
    shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'audit_checkout_page.png'), Buffer.from(shot.data, 'base64'));

    client.close();
    console.log('✅ Hoàn tất audit visual các trang!');
  } finally {
    edge.kill();
  }
}
run();

