const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/nvdan/.gemini/antigravity/brain/29726e24-60fa-429a-8839-5619b392b496';

async function runQA() {
  console.log('🚀 Starting Puppeteer QA test on http://localhost:8899 ...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. DESKTOP HOME PAGE TEST
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:8899', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log('✅ Loaded home page (Desktop)');

  // Screenshot Desktop 1: Hero
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'qa_v3_desktop_01_hero.png'),
    clip: { x: 0, y: 0, width: 1440, height: 750 }
  });
  console.log('📸 Captured: qa_v3_desktop_01_hero.png');

  // Screenshot Desktop 2: Branches
  const branchEl = await page.$('#phan-nhanh');
  if (branchEl) {
    const box = await branchEl.boundingBox();
    if (box) {
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'qa_v3_desktop_02_branches.png'),
        clip: { x: 0, y: Math.max(0, box.y - 40), width: 1440, height: Math.min(box.height + 80, 900) }
      });
      console.log('📸 Captured: qa_v3_desktop_02_branches.png');
    }
  }

  // Click chọn nhánh Văn Phòng và xem Form đổi nội dung
  const officeBtn = await page.$$('button');
  for (const btn of officeBtn) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Nhận Bản Rút Gọn 0đ')) {
      await btn.click();
      console.log('👉 Clicked branch button "Nhận Bản Rút Gọn 0đ"');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // Screenshot Desktop 3: Form sau khi chọn nhánh văn phòng
  const formEl = await page.$('#nhan-qua-0d');
  if (formEl) {
    const box = await formEl.boundingBox();
    if (box) {
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'qa_v3_desktop_03_form_office.png'),
        clip: { x: 0, y: Math.max(0, box.y - 40), width: 1440, height: Math.min(box.height + 80, 800) }
      });
      console.log('📸 Captured: qa_v3_desktop_03_form_office.png');
    }
  }

  // Screenshot Desktop 4: Khối Học Miễn Phí (1 Video Thật & Tab Switcher)
  const learnEl = await page.$('#hoc-mien-phi');
  if (learnEl) {
    const box = await learnEl.boundingBox();
    if (box) {
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'qa_v3_desktop_04_free_learning.png'),
        clip: { x: 0, y: Math.max(0, box.y - 40), width: 1440, height: Math.min(box.height + 80, 850) }
      });
      console.log('📸 Captured: qa_v3_desktop_04_free_learning.png');
    }
  }

  // Screenshot Desktop 5: Footer (Không lộ số điện thoại, có link Zalo 1-1 & email)
  const footerEl = await page.$('footer');
  if (footerEl) {
    const box = await footerEl.boundingBox();
    if (box) {
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'qa_v3_desktop_05_footer.png'),
        clip: { x: 0, y: Math.max(0, box.y - 20), width: 1440, height: Math.min(box.height + 40, 800) }
      });
      console.log('📸 Captured: qa_v3_desktop_05_footer.png');
    }
  }

  // 2. MOBILE TEST (Viewport 390x844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:8899', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log('✅ Loaded home page (Mobile)');

  // Screenshot Mobile 1: Hero
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'qa_v3_mobile_01_hero.png'),
    clip: { x: 0, y: 0, width: 390, height: 750 }
  });
  console.log('📸 Captured: qa_v3_mobile_01_hero.png');

  // Screenshot Mobile 2: Video 16:9
  const mLearn = await page.$('#hoc-mien-phi');
  if (mLearn) {
    const box = await mLearn.boundingBox();
    if (box) {
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, 'qa_v3_mobile_02_video.png'),
        clip: { x: 0, y: Math.max(0, box.y - 20), width: 390, height: Math.min(box.height + 40, 750) }
      });
      console.log('📸 Captured: qa_v3_mobile_02_video.png');
    }
  }

  // 3. CHECKOUT PARAM TEST: /thanh-toan?product=COMBO-VIDEO-299
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:8899/thanh-toan?product=COMBO-VIDEO-299', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log('✅ Loaded checkout with ?product=COMBO-VIDEO-299');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'qa_v3_checkout_product_param.png'),
    clip: { x: 0, y: 0, width: 1440, height: 850 }
  });
  console.log('📸 Captured: qa_v3_checkout_product_param.png');

  // 4. CHECKOUT PARAM TEST: /thanh-toan?pid=PACK-OFFICE-069
  await page.goto('http://localhost:8899/thanh-toan?pid=PACK-OFFICE-069', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log('✅ Loaded checkout with ?pid=PACK-OFFICE-069');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'qa_v3_checkout_pid_param.png'),
    clip: { x: 0, y: 0, width: 1440, height: 850 }
  });
  console.log('📸 Captured: qa_v3_checkout_pid_param.png');

  await browser.close();
  console.log('🎉 QA Automation finished successfully!');
}

runQA().catch(err => {
  console.error('QA Error:', err);
  process.exit(1);
});

