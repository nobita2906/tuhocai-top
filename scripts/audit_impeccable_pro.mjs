import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9892;
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

async function runAudit() {
  console.log('🚀 Starting Comprehensive UI/UX Audit for tuhocai.top ...');
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
  await client.send('DOM.enable');
  await client.send('CSS.enable');
  await client.send('Runtime.enable');

  const consoleErrors = [];
  client.ws.addEventListener('message', (event) => {
    try {
      const d = JSON.parse(event.data);
      if (d.method === 'Runtime.consoleAPICalled' && d.params?.type === 'error') {
        consoleErrors.push(d.params.args.map((a) => a.value || a.description).join(' '));
      }
    } catch (_) {}
  });

  // Navigate to target
  console.log('🌐 Loading http://localhost:8899 ...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send('Page.navigate', { url: 'http://localhost:8899' });
  await sleep(3500);

  // In-browser inspection script based on UI UX Pro Max & Impeccable guidelines
  const auditResult = await client.send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const report = {
        headings: [],
        touchTargets: { total: 0, smallCount: 0, items: [] },
        images: { total: 0, missingAlt: 0, externalUrls: [] },
        links: { total: 0, emptyText: 0, targetBlankWithoutNoopener: 0 },
        fonts: new Set(),
        contrastIssues: [],
        emojisAsIcons: []
      };

      // 1. Headings Hierarchy
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
        report.headings.push({ tag: h.tagName, text: h.innerText.trim().slice(0, 60) });
      });

      // 2. Touch Targets (Min 44x44px for buttons/links)
      const interactives = document.querySelectorAll('button, a, input, select, textarea');
      report.touchTargets.total = interactives.length;
      interactives.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          if (rect.width < 44 || rect.height < 44) {
            // Check if it has enough padding or inline text link
            const isInlineTextLink = el.tagName === 'A' && el.closest('p, li, span') && !el.classList.contains('button') && !el.classList.contains('btn');
            if (!isInlineTextLink) {
              report.touchTargets.smallCount++;
              if (report.touchTargets.items.length < 10) {
                report.touchTargets.items.push({
                  tag: el.tagName,
                  text: (el.innerText || el.getAttribute('aria-label') || el.className).slice(0, 40),
                  w: Math.round(rect.width),
                  h: Math.round(rect.height)
                });
              }
            }
          }
        }
      });

      // 3. Images
      document.querySelectorAll('img').forEach(img => {
        report.images.total++;
        if (!img.getAttribute('alt')) report.images.missingAlt++;
      });

      // 4. Links security
      document.querySelectorAll('a').forEach(a => {
        report.links.total++;
        if (!a.innerText.trim() && !a.getAttribute('aria-label') && !a.querySelector('svg, img')) {
          report.links.emptyText++;
        }
        if (a.getAttribute('target') === '_blank') {
          const rel = a.getAttribute('rel') || '';
          if (!rel.includes('noopener')) report.links.targetBlankWithoutNoopener++;
        }
      });

      // 5. Fonts used
      document.querySelectorAll('body, h1, h2, h3, p, button, a').forEach(el => {
        const ff = window.getComputedStyle(el).fontFamily;
        if (ff) report.fonts.add(ff.split(',')[0].replace(/['"]/g, '').trim());
      });
      report.fonts = Array.from(report.fonts);

      // 6. Check for Emoji used as standalone icons
      document.querySelectorAll('button, span, div').forEach(el => {
        if (el.children.length === 0 && el.innerText) {
          const text = el.innerText.trim();
          if (/^[\\u{1F300}-\\u{1F9FF}]$/u.test(text)) {
            report.emojisAsIcons.push({ text, parent: el.parentElement?.className?.slice(0, 40) });
          }
        }
      });

      return report;
    })()`,
  });

  // Take Full-page Desktop & Mobile Overview screenshots
  const shot1 = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'audit_desktop_hero.png'), Buffer.from(shot1.data, 'base64'));

  // Switch to Mobile Viewport 390x844
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await client.send('Page.navigate', { url: 'http://localhost:8899' });
  await sleep(3000);
  const shot2 = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'audit_mobile_hero.png'), Buffer.from(shot2.data, 'base64'));

  // Also check product page
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send('Page.navigate', { url: 'http://localhost:8899/san-pham/combo-video-ai-ban-hang' });
  await sleep(2500);
  const shot3 = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'audit_desktop_product_detail.png'), Buffer.from(shot3.data, 'base64'));

  client.close();
  edge.kill();

  const finalOutput = {
    audit: auditResult.value,
    consoleErrors,
  };

  fs.writeFileSync(path.join(artifactDir, 'audit_raw_report.json'), JSON.stringify(finalOutput, null, 2));
  console.log('✅ Audit Completed! Report written to audit_raw_report.json');
}

runAudit().catch(err => {
  console.error('Audit Error:', err);
  process.exit(1);
});

