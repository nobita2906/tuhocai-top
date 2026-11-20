import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9890;
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

async function capture(client, filename) {
  const shot = await client.send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.join(artifactDir, filename);
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log(`📸 Saved: ${filename}`);
}

async function run() {
  console.log('🚀 Spawning Edge on port', port);
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

  // --- 1. DESKTOP 1440x900 ---
  console.log('🖥️ Capturing Desktop...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send('Page.navigate', { url: 'http://localhost:8899' });
  await sleep(3000);

  // 1. Hero
  await capture(client, 'qa_v3_desktop_01_hero.png');

  // 2. Branches
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("phan-nhanh")?.scrollIntoView({ behavior: "instant" })',
  });
  await sleep(800);
  await capture(client, 'qa_v3_desktop_02_branches.png');

  // 3. Free Learning (1 Video Thật & Tab Video)
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("hoc-mien-phi")?.scrollIntoView({ behavior: "instant" })',
  });
  await sleep(800);
  await capture(client, 'qa_v3_desktop_03_free_learning.png');

  // 4. Footer
  await client.send('Runtime.evaluate', {
    expression: 'document.querySelector("footer")?.scrollIntoView({ behavior: "instant" })',
  });
  await sleep(800);
  await capture(client, 'qa_v3_desktop_04_footer.png');

  // --- 2. CHECKOUT WITH ?product=COMBO-VIDEO-299 ---
  console.log('🛒 Capturing Checkout with ?product=...');
  await client.send('Page.navigate', { url: 'http://localhost:8899/thanh-toan?product=COMBO-VIDEO-299' });
  await sleep(2500);
  await capture(client, 'qa_v3_checkout_product_param.png');

  // --- 3. CHECKOUT WITH ?pid=PACK-OFFICE-069 ---
  console.log('🛒 Capturing Checkout with ?pid=...');
  await client.send('Page.navigate', { url: 'http://localhost:8899/thanh-toan?pid=PACK-OFFICE-069' });
  await sleep(2500);
  await capture(client, 'qa_v3_checkout_pid_param.png');

  // --- 4. MOBILE 390x844 ---
  console.log('📱 Capturing Mobile...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await client.send('Page.navigate', { url: 'http://localhost:8899' });
  await sleep(3000);
  await capture(client, 'qa_v3_mobile_01_hero.png');

  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("hoc-mien-phi")?.scrollIntoView({ behavior: "instant" })',
  });
  await sleep(1000);
  await capture(client, 'qa_v3_mobile_02_video.png');

  client.close();
  edge.kill();
  console.log('🎉 ALL QA SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

run().catch((err) => {
  console.error('QA Error:', err);
  process.exit(1);
});
