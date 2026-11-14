import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9566;
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

async function run() {
  const adminToken = await new SignJWT({
    id: '93f17bf0-79f7-499e-98fb-d64e3cab3d5d',
    role: 'ADMIN',
    email: 'admin@tuhocai.top',
    name: 'Admin Tự Học AI',
  })
    .setProtectedHeader({ alg: 'HS256' })
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

    await client.send('Network.setCookie', {
      name: 'tuhocai_session',
      value: adminToken,
      domain: 'localhost',
      path: '/',
    });

    await client.send('Page.navigate', { url: `${BASE_URL}/admin/san-pham` });
    await sleep(2500);

    // Bấm nút "Sửa giá & link" của sản phẩm đầu tiên
    await client.send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Sửa giá & link'));
        if (btns.length > 0) btns[0].click();
      })()`,
    });
    await sleep(1000);

    const shot = await client.send('Page.captureScreenshot', { format: 'png' });
    const p = path.join(artifactDir, 'lp_redirect_4_admin_edit_modal.png');
    fs.writeFileSync(p, Buffer.from(shot.data, 'base64'));
    console.log('Saved modal shot:', p);

    client.close();
  } finally {
    edge.kill();
  }
}

run().catch(console.error);

