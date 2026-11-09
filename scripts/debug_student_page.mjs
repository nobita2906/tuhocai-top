import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { SignJWT } from 'jose';
import { query } from '../src/lib/db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9567;
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

async function main() {
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
  await client.send('Network.enable');

  await client.send('Network.setCookie', {
    name: 'tuhocai_session',
    value: adminToken,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  console.log('Navigating to student classroom...');
  await client.send('Page.navigate', { url: `${BASE_URL}/dashboard/hoc/video-ai-tu-1-anh` });
  await new Promise((r) => setTimeout(r, 4000));

  const pageInfo = await client.send('Runtime.evaluate', {
    expression: `JSON.stringify({
      url: window.location.href,
      title: document.title,
      textLength: document.body.innerText.length,
      sampleText: document.body.innerText.slice(0, 300)
    })`,
  });

  console.log('Page info:', pageInfo.result.value);

  await capture(client, 'debug_student_classroom.png');

  client.close();
  edge.kill();
}

main().catch(console.error);

