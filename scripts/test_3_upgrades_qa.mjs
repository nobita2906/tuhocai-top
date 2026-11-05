import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9555;
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

async function capture(client, filename) {
  const shot = await client.send('Page.captureScreenshot', { format: 'png' });
  const buffer = Buffer.from(shot.data, 'base64');
  const filePath = path.join(artifactDir, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`📸 Lưu screenshot: ${filename} (${buffer.length} bytes)`);
}

async function runTest() {
  console.log('🚀 Khởi động Edge CDP server tại port ' + port);
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
    console.error('Không tìm thấy target page');
    edge.kill();
    return;
  }

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  console.log('✓ Kết nối CDP WebSocket thành công!');

  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('Runtime.enable');

  // TEST 1: DESKTOP HOMEPAGE & DEMO MODAL
  console.log('\n--- 1. Kiểm tra Homepage Desktop (1440x900) ---');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send('Page.navigate', { url: 'http://localhost:8899/' });
  await new Promise((r) => setTimeout(r, 3000));

  await capture(client, 'test_desktop_hero_cta.png');

  // Click Hero Demo Button
  console.log('Click nút [▶ Xem Demo Vận Hành (45s)] trên Hero...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const demoBtn = btns.find(b => b.textContent && b.textContent.includes('Xem Demo Vận Hành'));
      if (demoBtn) demoBtn.click();
    })()`
  });
  await new Promise((r) => setTimeout(r, 1000));
  await capture(client, 'test_desktop_demo_modal_tab1.png');

  // Click Tab 2
  console.log('Click Tab "4 Bước Tự Động Hóa Chi Tiết"...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const tabBtns = Array.from(document.querySelectorAll('button'));
      const tab2 = tabBtns.find(b => b.textContent && b.textContent.includes('4 Bước Tự Động Hóa'));
      if (tab2) tab2.click();
    })()`
  });
  await new Promise((r) => setTimeout(r, 800));
  await capture(client, 'test_desktop_demo_modal_tab2.png');

  // Close modal by clicking backdrop or close button
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const closeBtn = document.querySelector('button[aria-label="Đóng demo"]') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('✕') || b.querySelector('svg.lucide-x'));
      if (closeBtn) closeBtn.click();
    })()`
  });
  await new Promise((r) => setTimeout(r, 500));

  // Scroll down to Flagship Mockup Card
  console.log('Scroll to Flagship Mockup Card...');
  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 1200, behavior: 'instant' });`
  });
  await new Promise((r) => setTimeout(r, 1000));
  await capture(client, 'test_desktop_flagship_overlay.png');

  // TEST 2: MOBILE VIEWPORT & SOCIAL PROOF TOAST
  console.log('\n--- 2. Kiểm tra Mobile Viewport (390x844) & Social Proof Toast ---');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await client.send('Page.navigate', { url: 'http://localhost:8899/' });
  // Wait for toast trigger
  await new Promise((r) => setTimeout(r, 4500));
  await capture(client, 'test_mobile_toast_spacing_v2.png');

  // TEST 3: ARTICLE 1 (N8N BOT AUTOMATION)
  console.log('\n--- 3. Kiểm tra Bài viết 1: n8n + Telegram + VietQR ---');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send('Page.navigate', { url: 'http://localhost:8899/bai-viet/huong-dan-tu-xay-ai-automation-bot-n8n-telegram-vietqr' });
  await new Promise((r) => setTimeout(r, 2000));
  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 3100, behavior: 'instant' });`
  });
  await new Promise((r) => setTimeout(r, 1000));
  await capture(client, 'test_article_n8n_code_v2.png');

  // TEST 4: ARTICLE 2 (TIKTOK VIDEO AI)
  console.log('\n--- 4. Kiểm tra Bài viết 2: Quy trình Video AI TikTok ---');
  await client.send('Page.navigate', { url: 'http://localhost:8899/bai-viet/quy-trinh-tao-video-ai-trieu-view-tu-1-anh-tinh-tiktok-reels' });
  await new Promise((r) => setTimeout(r, 2000));
  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 2600, behavior: 'instant' });`
  });
  await new Promise((r) => setTimeout(r, 1000));
  await capture(client, 'test_article_video_prompts_v2.png');

  console.log('✅ Hoàn tất toàn bộ kịch bản QA!');
  client.close();
  edge.kill();
}

runTest().catch((err) => {
  console.error('Lỗi khi chạy QA:', err);
  process.exit(1);
});
