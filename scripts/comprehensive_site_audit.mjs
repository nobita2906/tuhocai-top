import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9895;
const artifactDir = 'C:\\Users\\nvdan\\.gemini\\antigravity\\brain\\29726e24-60fa-429a-8839-5619b392b496';
const auditImgDir = path.join(artifactDir, 'site_audit');

if (!fs.existsSync(auditImgDir)) {
  fs.mkdirSync(auditImgDir, { recursive: true });
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

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ROUTES_TO_AUDIT = [
  { name: 'home', url: '/' },
  { name: 'catalog', url: '/san-pham' },
  { name: 'product_combo_video', url: '/san-pham/combo-video-ai-ban-hang' },
  { name: 'product_office_pack', url: '/san-pham/bo-prompt-ai-van-phong' },
  { name: 'product_automation', url: '/san-pham/combo-super-automation-n8n' },
  { name: 'checkout', url: '/thanh-toan?product=COMBO-VIDEO-299' },
  { name: 'blog_list', url: '/bai-viet' },
  { name: 'blog_detail', url: '/bai-viet/quy-trinh-tao-video-ai-ban-hang-tu-1-anh-tinh-tiktok-reels' },
  { name: 'lp_video_ai', url: '/lp/video-ai-tu-1-anh' },
  { name: 'lp_drama', url: '/lp/video-drama-gia-dinh-nho' },
  { name: 'lp_sao_chep', url: '/lp/sao-chep-landing-page' },
  { name: 'affiliate', url: '/affiliate' },
  { name: 'hoan_tien', url: '/hoan-tien' },
  { name: 'dieu_khoan', url: '/dieu-khoan' },
  { name: 'bao_mat', url: '/bao-mat' },
  { name: 'login', url: '/login' },
  { name: 'register', url: '/register' },
];

async function runSiteAudit() {
  console.log(`🚀 Starting Full Site UI/UX Audit across ${ROUTES_TO_AUDIT.length} pages...`);
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

  const fullAuditReport = [];

  for (const item of ROUTES_TO_AUDIT) {
    console.log(`\n🔍 Auditing route: ${item.name} (${item.url})`);
    const pageData = {
      name: item.name,
      url: item.url,
      desktop: {},
      mobile: {},
      issues: [],
    };

    const targetUrl = `http://localhost:8899${item.url}`;

    // --- 1. DESKTOP TEST (1440x900) ---
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await client.send('Page.navigate', { url: targetUrl });
    await sleep(2500);

    // Evaluate Desktop metrics
    const desktopEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const hasOverflow = docW > winW + 2;

        const brokenImgs = [];
        document.querySelectorAll('img').forEach(img => {
          if (img.complete && img.naturalWidth === 0) {
            brokenImgs.push(img.src);
          }
        });

        // Find standalone emojis used as icons
        const emojiElements = [];
        document.querySelectorAll('button, a, span, div, p').forEach(el => {
          if (el.children.length === 0 && el.innerText) {
            const txt = el.innerText.trim();
            if (/^[\\u{1F300}-\\u{1F9FF}]$/u.test(txt)) {
              emojiElements.push({ tag: el.tagName, emoji: txt, class: el.className });
            }
          }
        });

        return {
          scrollWidth: docW,
          innerWidth: winW,
          hasOverflow,
          brokenImgs,
          emojiElements: emojiElements.slice(0, 5),
        };
      })()`,
    });

    pageData.desktop = desktopEval.result.value;
    if (pageData.desktop.hasOverflow) {
      pageData.issues.push(`Desktop horizontal overflow: scrollWidth (${pageData.desktop.scrollWidth}) > innerWidth (${pageData.desktop.innerWidth})`);
    }
    if (pageData.desktop.brokenImgs.length > 0) {
      pageData.issues.push(`Broken images: ${pageData.desktop.brokenImgs.join(', ')}`);
    }
    if (pageData.desktop.emojiElements.length > 0) {
      pageData.issues.push(`Emoji icons detected: ${pageData.desktop.emojiElements.map(e => e.emoji).join(', ')}`);
    }

    // Capture desktop screenshot
    const shotD = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(auditImgDir, `${item.name}_desktop.png`), Buffer.from(shotD.data, 'base64'));

    // --- 2. MOBILE TEST (390x844 iPhone 14) ---
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await client.send('Page.navigate', { url: targetUrl });
    await sleep(2500);

    const mobileEval = await client.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const hasOverflow = docW > winW + 2;

        return {
          scrollWidth: docW,
          innerWidth: winW,
          hasOverflow,
        };
      })()`,
    });

    pageData.mobile = mobileEval.result.value;
    if (pageData.mobile.hasOverflow) {
      pageData.issues.push(`Mobile horizontal overflow: scrollWidth (${pageData.mobile.scrollWidth}) > innerWidth (${pageData.mobile.innerWidth})`);
    }

    // Capture mobile screenshot
    const shotM = await client.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(auditImgDir, `${item.name}_mobile.png`), Buffer.from(shotM.data, 'base64'));

    fullAuditReport.push(pageData);
  }

  client.close();
  edge.kill();

  const finalOutput = {
    totalAudited: fullAuditReport.length,
    pages: fullAuditReport,
    consoleErrors,
  };

  fs.writeFileSync(path.join(artifactDir, 'full_site_audit_report.json'), JSON.stringify(finalOutput, null, 2));
  console.log('\n🎉 FULL SITE AUDIT COMPLETE! Report saved to full_site_audit_report.json');
}

runSiteAudit().catch(err => {
  console.error('Audit Error:', err);
  process.exit(1);
});

