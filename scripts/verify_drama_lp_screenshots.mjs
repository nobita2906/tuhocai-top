import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9666;
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

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function evaluate(client, expression) {
  const res = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return res.result?.value;
}

async function main() {
  console.log('🚀 Khởi chạy Edge Headless để kiểm tra Landing Page Drama...');
  const edgeProcess = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=C:\\temp\\edge-test-profile-drama',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ]);

  await sleep(1500);

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json/list`);
    const pages = await listRes.json();
    const wsUrl = pages[0].webSocketDebuggerUrl;

    const client = new CDPClient(wsUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('DOM.enable');

    // 1. Set Viewport Desktop
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('🌐 Điều hướng tới: http://localhost:8899/lp/video-drama-gia-dinh-nho');
    await client.send('Page.navigate', { url: 'http://localhost:8899/lp/video-drama-gia-dinh-nho' });
    await sleep(2500);

    // Kiểm tra DOM các thành phần giá
    const pageData = await evaluate(client, `(() => {
      const bodyText = document.body.innerText;
      const ctaBtn = document.querySelector('a[href="#nhan-quy-trinh"]');
      const qrImg = document.querySelector('img[alt*="VietQR"]');
      const milkTeaSection = document.querySelector('h2');
      return {
        bodyContains99k: bodyText.includes('99K'),
        bodyContains99000: bodyText.includes('99.000'),
        bodyContains69k: bodyText.includes('69K'),
        bodyContains69000: bodyText.includes('69.000'),
        ctaText: ctaBtn ? ctaBtn.innerText : null,
        qrSrc: qrImg ? qrImg.src : null,
      };
    })()`);

    console.log('🔍 Kết quả phân tích DOM trực tiếp:');
    console.log(JSON.stringify(pageData, null, 2));

    // 2. Chụp Hero Section
    await capture(client, 'drama_lp_hero_and_price_99k.png');

    // 3. Cuộn xuống Section 1 Ly Trà Sữa và chụp
    await evaluate(client, `window.scrollTo({ top: 1200, behavior: 'instant' })`);
    await sleep(800);
    await capture(client, 'drama_lp_milk_tea_99k.png');

    // 4. Cuộn xuống Section VietQR và thông tin chuyển khoản và chụp
    await evaluate(client, `document.querySelector('#nhan-quy-trinh').scrollIntoView()`);
    await sleep(800);
    await capture(client, 'drama_lp_checkout_vietqr_99k.png');

    client.close();
    console.log('✅ Đã hoàn thành kiểm tra và chụp ảnh!');
  } finally {
    edgeProcess.kill();
  }
}

main().catch(console.error);

