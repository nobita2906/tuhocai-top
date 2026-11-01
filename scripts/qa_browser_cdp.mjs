import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9444;
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

async function runQA() {
  console.log('🚀 Khởi động Edge CDP server...');
  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ]);

  // Wait for CDP
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) break;
    } catch (_) {}
  }

  // Get active target
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

  const viewports = [
    { name: 'desktop_1280', width: 1280, height: 900, isMobile: false },
    { name: 'desktop_1024', width: 1024, height: 900, isMobile: false },
    { name: 'tablet_768', width: 768, height: 1024, isMobile: true },
    { name: 'mobile_390', width: 390, height: 844, isMobile: true },
    { name: 'mobile_360', width: 360, height: 800, isMobile: true },
  ];

  const results = [];

  for (const vp of viewports) {
    console.log(`\n========================================`);
    console.log(`🔎 Đang kiểm tra Viewport: ${vp.name} (${vp.width}x${vp.height})...`);

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.isMobile,
    });

    await client.send('Page.navigate', { url: 'http://localhost:8899/san-pham' });

    // Wait navigation
    await new Promise((r) => setTimeout(r, 2000));

    // Evaluate DOM state
    const evalRes = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const bodyScrollWidth = document.documentElement.scrollWidth;
        const windowWidth = window.innerWidth;
        const hasHorizontalOverflow = bodyScrollWidth > windowWidth;

        // Find all product cards
        const cards = Array.from(document.querySelectorAll('.bento-card')).map((card) => {
          const title = card.querySelector('h3')?.innerText?.trim() || '';
          const priceBlock = card.querySelector('.font-mono.tracking-tight');
          const originalPriceBlock = card.querySelector('.line-through');
          const salesBlock = card.querySelector('strong');
          const buttons = Array.from(card.querySelectorAll('button, a[href*="san-pham"], a[href*="thanh-toan"]')).map(b => b.innerText.trim());

          const priceText = priceBlock?.innerText?.trim() || '';
          const originalPriceText = originalPriceBlock?.innerText?.trim() || '';
          const salesText = salesBlock?.innerText?.trim() || '';

          // Check if price text has line break (newline or wrapped)
          const priceRect = priceBlock?.getBoundingClientRect();
          const origPriceRect = originalPriceBlock?.getBoundingClientRect();

          return {
            title,
            priceText,
            originalPriceText,
            salesText,
            buttons,
            priceWidth: priceRect?.width || 0,
            priceHeight: priceRect?.height || 0,
            origPriceTop: origPriceRect?.top,
            priceTop: priceRect?.top,
          };
        }).filter(c => c.title.length > 0);

        return {
          windowWidth,
          bodyScrollWidth,
          hasHorizontalOverflow,
          cardCount: cards.length,
          cards
        };
      })()`,
      returnByValue: true,
    });

    const data = evalRes.result.value;
    console.log(`  - Chiều rộng Viewport: ${data.windowWidth}px, ScrollWidth: ${data.bodyScrollWidth}px`);
    console.log(`  - Tràn màn hình ngang (Overflow)? ${data.hasHorizontalOverflow ? '❌ CÓ TRÀN' : '✅ KHÔNG TRÀN (Chuẩn)'}`);
    console.log(`  - Số lượng Product Cards: ${data.cardCount}`);

    let allPricesClean = true;
    for (const card of data.cards) {
      // Check if price text contains lone currency or weird wrap
      const isCard2 = card.title.includes('Video AI Bán Hàng Triệu View');
      if (isCard2) {
        console.log(`  👉 [Khóa Học 1 Ảnh 297k]:`);
        console.log(`     + Giá: "${card.priceText}" (W: ${card.priceWidth.toFixed(0)}px, H: ${card.priceHeight.toFixed(0)}px)`);
        console.log(`     + Giá gốc: "${card.originalPriceText}"`);
        console.log(`     + Đã bán: "${card.salesText}"`);
        console.log(`     + Nút: ${card.buttons.join(' | ')}`);
      }
      if (card.priceText.includes('\n') || card.priceText === 'đ') {
        allPricesClean = false;
        console.log(`     ❌ Lỗi rớt chữ trong: ${card.title} -> "${card.priceText}"`);
      }
    }

    // Capture screenshot
    const screenshot = await client.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });

    const shotPath = path.join(artifactDir, `cdp_${vp.name}.png`);
    fs.writeFileSync(shotPath, Buffer.from(screenshot.data, 'base64'));
    console.log(`  📸 Đã chụp: cdp_${vp.name}.png (${(screenshot.data.length * 0.75 / 1024).toFixed(0)} KB)`);

    results.push({
      viewport: vp.name,
      noOverflow: !data.hasHorizontalOverflow,
      allPricesClean,
    });
  }

  client.close();
  edge.kill();

  console.log('\n========================================');
  console.log('🎉 TỔNG KẾT KẾT QUẢ QA TOÀN DIỆN:');
  const allPassed = results.every((r) => r.noOverflow && r.allPricesClean);
  console.table(results);
  console.log(allPassed ? '>>> TẤT CẢ TEST ĐẠT 100%! <<<' : '>>> CẦN FIX THÊM! <<<');
}

runQA().catch(console.error);

