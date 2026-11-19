import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9888;
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
  console.log(`📸 Đã chụp: ${filename}`);
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

  // --- DESKTOP 1440x900 ---
  console.log('🖥️ Đang chụp Desktop...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send('Page.navigate', { url: 'http://localhost:8899' });
  await sleep(3000);

  // 1. Hero + Branch Selector
  await capture(client, 'phase2_desktop_01_hero.png');

  // 2. Branch + Lead Form
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("phan-nhanh")?.scrollIntoView({ behavior: "instant" })',
  });
  await sleep(1000);
  await capture(client, 'phase2_desktop_02_branches.png');

  // 3. Lead Form + About Me
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("nhan-qua-0d")?.scrollIntoView({ behavior: "instant" })',
  });
  await sleep(1000);
  await capture(client, 'phase2_desktop_03_lead_form.png');

  // 4. About Me + Free Learning
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("ve-toi")?.scrollIntoView({ behavior: "instant" })',
  });
  await sleep(1000);
  await capture(client, 'phase2_desktop_04_about_me.png');

  // 5. 3 Products
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("san-pham")?.scrollIntoView({ behavior: "instant" })',
  });
  await sleep(1000);
  await capture(client, 'phase2_desktop_05_products.png');

  // 6. Trust + FAQ
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("an-tam")?.scrollIntoView({ behavior: "instant" })',
  });
  await sleep(1000);
  await capture(client, 'phase2_desktop_06_trust.png');

  // 7. FAQ + Final CTA + Footer
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("faq")?.scrollIntoView({ behavior: "instant" })',
  });
  await sleep(1000);
  await capture(client, 'phase2_desktop_07_faq_cta.png');

  // --- MOBILE 375x812 ---
  console.log('📱 Đang chụp Mobile...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await client.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await sleep(1500);

  // M1. Mobile Hero
  await capture(client, 'phase2_mobile_01_hero.png');

  // M2. Mobile Branches
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("phan-nhanh")?.scrollIntoView({ behavior: "instant" })',
  });
  await sleep(1000);
  await capture(client, 'phase2_mobile_02_branches.png');

  // M3. Mobile Lead Form
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("nhan-qua-0d")?.scrollIntoView({ behavior: "instant" })',
  });
  await sleep(1000);
  await capture(client, 'phase2_mobile_03_lead_form.png');

  // M4. Mobile Products
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("san-pham")?.scrollIntoView({ behavior: "instant" })',
  });
  await sleep(1000);
  await capture(client, 'phase2_mobile_04_products.png');

  // M5. Mobile Trust
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("an-tam")?.scrollIntoView({ behavior: "instant" })',
  });
  await sleep(1000);
  await capture(client, 'phase2_mobile_05_trust.png');

  console.log('✅ Hoàn tất chụp ảnh QA Phase 2!');
  client.close();
  edge.kill();
}

run().catch(console.error);
