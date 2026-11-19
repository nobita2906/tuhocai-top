import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9760;
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

async function audit() {
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

  const auditReport = {
    overflowIssues: [],
    tapTargetIssues: [],
    checkoutIssues: [],
    productPageIssues: [],
    contrastIssues: [],
    screenshots: []
  };

  // Helper chụp ảnh
  async function takeShot(name, w, h, isMobile, scrollY = 0) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: isMobile ? 2 : 1,
      mobile: isMobile,
    });
    if (scrollY > 0) {
      await client.send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY})` });
      await sleep(800);
    }
    const shot = await client.send('Page.captureScreenshot', { format: 'png' });
    const filename = `audit_${name}.png`;
    fs.writeFileSync(path.join(artifactDir, filename), Buffer.from(shot.data, 'base64'));
    auditReport.screenshots.push(filename);
    console.log(`📸 Chụp xong: ${filename}`);
  }

  // Helper kiểm tra tràn ngang (Horizontal Overflow)
  async function checkHorizontalOverflow(pageName) {
    const res = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const docWidth = document.documentElement.offsetWidth;
          const windowWidth = window.innerWidth;
          const overflowingElements = [];
          document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > windowWidth + 1) {
              overflowingElements.push({
                tag: el.tagName,
                className: el.className ? String(el.className).slice(0, 50) : '',
                id: el.id,
                right: Math.round(rect.right),
                windowWidth
              });
            }
          });
          return { docWidth, windowWidth, overflowingCount: overflowingElements.length, overflowingElements: overflowingElements.slice(0, 5) };
        })()
      `,
      returnByValue: true
    });
    if (res.result?.value?.overflowingCount > 0) {
      auditReport.overflowIssues.push({ page: pageName, ...res.result.value });
    }
  }

  // 1. RÀ SOÁT TRANG CHỦ (Home) TRÊN MOBILE 375px (Màn nhỏ nhất thường dùng: iPhone SE)
  console.log('--- 1. Kiểm tra Trang Chủ trên Mobile 375px ---');
  await client.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  await client.send('Page.navigate', { url: 'http://localhost:8899' });
  await sleep(3500);

  await checkHorizontalOverflow('Home (375px Mobile)');
  await takeShot('home_hero_375', 375, 812, true, 0);
  await takeShot('home_catalog_375', 375, 812, true, 1100);
  await takeShot('home_bundles_375', 375, 812, true, 2600);
  await takeShot('home_roadmap_375', 375, 812, true, 3600);
  await takeShot('home_footer_375', 375, 812, true, 4800);

  // 2. RÀ SOÁT TRANG CHI TIẾT SẢN PHẨM (/san-pham/sao-chep-landing-page)
  console.log('--- 2. Kiểm tra Trang Chi Tiết Sản Phẩm ---');
  await client.send('Page.navigate', { url: 'http://localhost:8899/san-pham/sao-chep-landing-page' });
  await sleep(3000);
  await checkHorizontalOverflow('Product Detail (Mobile)');
  await takeShot('product_detail_mobile', 375, 812, true, 0);
  await takeShot('product_detail_desktop', 1440, 900, false, 0);

  // 3. RÀ SOÁT TRANG THANH TOÁN (/thanh-toan?pid=COMBO-VIDEO-299)
  console.log('--- 3. Kiểm tra Trang Thanh Toán VietQR ---');
  await client.send('Page.navigate', { url: 'http://localhost:8899/thanh-toan?pid=COMBO-VIDEO-299' });
  await sleep(3000);
  await checkHorizontalOverflow('Checkout (Mobile)');
  await takeShot('checkout_mobile', 375, 812, true, 0);
  await takeShot('checkout_desktop', 1440, 900, false, 0);

  // 4. RÀ SOÁT TRANG BÀI VIẾT TIN TỨC (/bai-viet)
  console.log('--- 4. Kiểm tra Trang Blog / Bài Viết ---');
  await client.send('Page.navigate', { url: 'http://localhost:8899/bai-viet' });
  await sleep(3000);
  await checkHorizontalOverflow('Blog List (Mobile)');
  await takeShot('blog_mobile', 375, 812, true, 0);

  // 5. RÀ SOÁT TRANG AFFILIATE (/affiliate)
  console.log('--- 5. Kiểm tra Trang Affiliate CTV ---');
  await client.send('Page.navigate', { url: 'http://localhost:8899/affiliate' });
  await sleep(3000);
  await checkHorizontalOverflow('Affiliate (Mobile)');
  await takeShot('affiliate_mobile', 375, 812, true, 0);

  console.log('=== KẾT QUẢ QUÉT TỰ ĐỘNG ===');
  console.log(JSON.stringify(auditReport, null, 2));

  client.close();
  edge.kill();
}

audit().catch(console.error);

