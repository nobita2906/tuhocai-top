import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9572;
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
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await client.send('Page.navigate', { url: 'http://localhost:8899' });
    await new Promise(r => setTimeout(r, 2500));

    const metrics = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const hero = document.querySelector('section.cyber-grid');
        const heroBtns = hero ? hero.querySelector('.flex.flex-wrap.items-center.justify-center') : null;
        const allSections = Array.from(document.querySelectorAll('section'));
        const slider = allSections.find(s => s.textContent.includes('Tiêu Điểm & Bài Đăng Nổi Bật'));
        
        const heroRect = heroBtns ? heroBtns.getBoundingClientRect() : (hero ? hero.getBoundingClientRect() : null);
        const sliderRect = slider ? slider.getBoundingClientRect() : null;
        
        return {
          heroRect: heroRect ? { top: heroRect.top, bottom: heroRect.bottom, height: heroRect.height } : null,
          sliderRect: sliderRect ? { top: sliderRect.top, bottom: sliderRect.bottom, height: sliderRect.height } : null,
          gap: sliderRect && heroRect ? (sliderRect.top - heroRect.bottom) : null,
          containerClasses: hero ? hero.parentElement.className : ''
        };
      })()`,
      returnByValue: true
    });
    console.log('Metrics:', JSON.stringify(metrics.result.value, null, 2));

    const shot = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'measure_hero_gap.png'), Buffer.from(shot.data, 'base64'));
    console.log('Screenshot saved to measure_hero_gap.png');
    client.close();
  } finally {
    edge.kill();
  }
}
run();

