import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { SignJWT } from 'jose';
import { query } from '../src/lib/db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9599;
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

async function takeScreenshot(client, filepath) {
  const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(filepath, Buffer.from(data, 'base64'));
}

async function main() {
  const userDataDir = path.join(process.cwd(), '.edge-temp-gated-profile');
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  console.log('🚀 Khởi động Microsoft Edge CDP để chụp Visual QA...');
  const edgeProcess = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--headless=new',
    '--window-size=1440,960',
    'about:blank',
  ]);

  await sleep(2000);

  try {
    const listRes = await fetch(`http://localhost:${port}/json/list`);
    const pages = await listRes.json();
    const targetPage = pages.find((p) => p.type === 'page') || pages[0];

    const client = new CDPClient(targetPage.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Network.enable');

    const GATED_URL = `${BASE_URL}/bai-viet/quy-trinh-tao-video-ai-trieu-view-tu-1-anh-tinh-tiktok-reels`;

    // 1. Chụp màn hình Khách Vãng Lai (Chưa mua - Paywall VIP Gate)
    console.log('1. Chụp ảnh Paywall Gate (Khách chưa mua)...');
    await client.send('Page.navigate', { url: GATED_URL });
    await sleep(3000);
    await client.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 450)' });
    await sleep(1000);
    await takeScreenshot(client, path.join(artifactDir, 'gated_article_1_paywall_guest.png'));
    console.log('  📸 Lưu gated_article_1_paywall_guest.png');

    // 2. Chụp màn hình Admin / Học viên đã mở khóa
    console.log('2. Đăng nhập Admin & Chụp ảnh bài viết đã mở khóa...');
    const adminToken = await new SignJWT({
      id: 'admin-1',
      email: 'nobita2906@gmail.com',
      name: 'Nguyễn Văn Đăng',
      role: 'ADMIN',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secretKey);

    await client.send('Network.setCookie', {
      name: 'tuhocai_session',
      value: adminToken,
      domain: 'localhost',
      path: '/',
    });

    await client.send('Page.navigate', { url: GATED_URL });
    await sleep(3000);
    await client.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 100)' });
    await sleep(1000);
    await takeScreenshot(client, path.join(artifactDir, 'gated_article_2_unlocked_vip_member.png'));
    console.log('  📸 Lưu gated_article_2_unlocked_vip_member.png');

    // 3. Chụp màn hình Admin chỉnh sửa quyền riêng tư bài viết
    console.log('3. Chụp ảnh Admin chỉnh sửa bài viết & Quyền riêng tư...');
    const postRes = await query("SELECT id FROM posts WHERE slug = 'quy-trinh-tao-video-ai-trieu-view-tu-1-anh-tinh-tiktok-reels' LIMIT 1");
    if (postRes.length > 0) {
      await client.send('Page.navigate', { url: `${BASE_URL}/admin/bai-viet/${postRes[0].id}` });
      await sleep(3000);
      await client.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 500)' });
      await sleep(1000);
      await takeScreenshot(client, path.join(artifactDir, 'gated_article_3_admin_privacy_settings.png'));
      console.log('  📸 Lưu gated_article_3_admin_privacy_settings.png');
    }

    client.close();
    console.log('🎉 Đã chụp thành công 100% Visual Artifacts!');
  } finally {
    edgeProcess.kill();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

main().catch((err) => {
  console.error('Lỗi khi chụp Edge QA:', err);
  process.exit(1);
});

