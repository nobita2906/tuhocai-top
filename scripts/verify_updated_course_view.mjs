import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { SignJWT } from 'jose';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

async function signJWT(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9593;
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

async function captureScreenshot(cdp, fileName) {
  const result = await cdp.send('Page.captureScreenshot', { format: 'png', quality: 90 });
  const outPath = path.join(artifactDir, fileName);
  fs.writeFileSync(outPath, Buffer.from(result.data, 'base64'));
  console.log(`Saved screenshot: ${outPath} (${fs.statSync(outPath).size} bytes)`);
}

async function main() {
  const db = await mysql.createConnection(process.env.DATABASE_URL || 'mysql://root:123456@localhost:3306/tuhocai_db');
  const [admins] = await db.query("SELECT id, name, email, role FROM users WHERE role = 'ADMIN' OR role = 'admin' LIMIT 1");
  const adminUser = admins[0] || { id: 'admin-1', name: 'Nguyễn Văn Đăng', email: 'admin@tuhocai.top', role: 'ADMIN' };
  console.log('Using admin:', adminUser);
  await db.end();

  const token = await signJWT({
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    role: 'ADMIN',
  });

  const tempDir = path.join(process.cwd(), '.temp_edge_verify_course2');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--headless',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,1050',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const pages = await listRes.json();
    const target = pages.find(p => p.type === 'page') || pages[0];

    const cdp = new CDPClient(target.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Network.enable');

    await cdp.send('Network.setCookie', {
      name: 'tuhocai_session',
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true
    });

    // 1. Visit Classroom Student View for video-ai-tu-1-anh
    console.log('Navigating to student classroom: /dashboard/hoc/video-ai-tu-1-anh');
    await cdp.send('Page.navigate', { url: `${BASE_URL}/dashboard/hoc/video-ai-tu-1-anh` });
    await new Promise(r => setTimeout(r, 3500));
    await captureScreenshot(cdp, 'classroom_video_ai_student_view.png');

    // Scroll down to view resources and markdown
    await cdp.send('Runtime.evaluate', {
      expression: `window.scrollBy(0, 520);`
    });
    await new Promise(r => setTimeout(r, 1000));
    await captureScreenshot(cdp, 'classroom_video_ai_resources_and_notes.png');

    // 2. Visit Admin Classroom Management: /admin/khoa-hoc
    console.log('Navigating to admin classroom: /admin/khoa-hoc');
    await cdp.send('Page.navigate', { url: `${BASE_URL}/admin/khoa-hoc` });
    await new Promise(r => setTimeout(r, 3000));
    await captureScreenshot(cdp, 'admin_classroom_course_list.png');

    // Click into course "Khóa Học & Quy Trình Làm Video AI Bán Hàng Triệu View Từ 1 Ảnh"
    console.log('Opening course editor in admin...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const cards = Array.from(document.querySelectorAll('div, button'));
          const btn = cards.find(el => el.textContent && el.textContent.includes('Quản lý bài giảng') && el.closest('.border'));
          if (btn) btn.click();
        })()
      `
    });
    await new Promise(r => setTimeout(r, 2500));
    await captureScreenshot(cdp, 'admin_classroom_video_ai_editor.png');

    cdp.close();
  } finally {
    edgeProc.kill();
  }
}

main().catch(console.error);
