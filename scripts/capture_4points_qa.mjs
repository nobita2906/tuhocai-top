import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9580;
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

async function captureUrl(client, url, filename, waitMs = 2500, evaluateFn = null) {
  console.log(`Navigating to ${url}...`);
  await client.send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, waitMs));
  if (evaluateFn) {
    await client.send('Runtime.evaluate', { expression: evaluateFn });
    await new Promise(r => setTimeout(r, 600));
  }
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

    // 1. Desktop Trang Chủ: Xem khoảng cách Hero & Slider co sát + Ô search nhanh Catalog
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 960,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await captureUrl(
      client,
      'http://localhost:8899',
      'qa_4points_home_hero_slider.png',
      2500
    );

    // 2. Mobile View: Chi tiết sản phẩm hiển thị Mobile Sticky Bottom Bar
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await captureUrl(
      client,
      'http://localhost:8899/san-pham/bo-prompt-midjourney-thuong-mai',
      'qa_4points_mobile_sticky_cta.png',
      2500,
      `window.scrollTo({ top: 350, behavior: 'instant' })`
    );

    // 3. Desktop Trang Kho Sản Phẩm: Xem ô Search nâng cấp
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 960,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await captureUrl(
      client,
      'http://localhost:8899/san-pham',
      'qa_4points_catalog_search.png',
      2500,
      `(() => {
        const input = document.querySelector('input[placeholder*=\"Tìm kiếm\"]');
        if (input) {
          input.value = 'n8n';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      })()`
    );

    // 4. Desktop Trang Thanh Toán: Xem nút Copy 1-chạm & Khung Memo nổi bật
    await captureUrl(
      client,
      'http://localhost:8899/thanh-toan?pid=WF-THAI-099',
      'qa_4points_checkout_copy_tap.png',
      2500,
      `(() => {
        // Cuộn xuống khu vực thông tin chuyển khoản ngân hàng
        const el = document.querySelector('.space-y-3\\\\.5') || document.querySelector('.space-y-3');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`
    );

    client.close();
    console.log('✅ Hoàn tất toàn bộ Visual QA cho 4 điểm cải tiến!');
  } finally {
    edge.kill();
  }
}

run();

