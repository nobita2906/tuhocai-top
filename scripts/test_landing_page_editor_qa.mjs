import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { SignJWT } from 'jose';
import { query } from '../src/lib/db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

async function signJWT(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9558;
const artifactDir = 'C:\\Users\\nvdan\\.gemini\\antigravity\\brain\\29726e24-60fa-429a-8839-5619b392b496';
const BASE_URL = 'http://localhost:8899';

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

async function runQA() {
  console.log('--- 🧪 KIỂM THỬ QUẢN TRỊ TOÀN DIỆN LANDING PAGE ---');

  // 1. Tạo JWT Admin session
  const adminRows = await query("SELECT id, name, email, role FROM users WHERE role = 'ADMIN' LIMIT 1");
  const adminUser = adminRows[0] || {
    id: '93f17bf0-79f7-499e-98fb-d64e3cab3d5d',
    name: 'Nguyễn Văn Đăng',
    email: 'dang@tuhocai.top',
    role: 'ADMIN',
  };

  const adminToken = await signJWT({
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    role: 'ADMIN',
  });
  console.log('✓ Tạo session token Admin thành công');

  // 2. Test API GET /api/admin/landing-pages
  console.log('\n[API Test 1] GET /api/admin/landing-pages...');
  const getRes = await fetch(`${BASE_URL}/api/admin/landing-pages`, {
    headers: { Cookie: `tuhocai_session=${adminToken}` },
  });
  const getData = await getRes.json();
  if (!getData.success || !getData.landingPages) {
    throw new Error('GET /api/admin/landing-pages failed: ' + JSON.stringify(getData));
  }
  console.log(`✓ GET thành công ${getData.landingPages.length} landing pages.`);

  const targetLp = getData.landingPages.find((lp) => lp.slug === 'n8n-tu-dong-hoa-kiem-tien') || getData.landingPages[0];
  console.log('Target LP:', targetLp.title, `(${targetLp.slug})`);

  // 3. Test API PUT /api/admin/landing-pages with full content
  console.log('\n[API Test 2] PUT /api/admin/landing-pages cập nhật toàn bộ nội dung...');
  const updatePayload = {
    id: targetLp.id,
    title: targetLp.title,
    slug: targetLp.slug,
    subdomain: 'n8n',
    facebookPixelId: '104592019402918',
    isPublished: true,
    price: 199000,
    originalPrice: 990000,
    heroBadge: '✦ QUY TRÌNH THỰC CHIẾN TỰ HỌC AI 2026',
    headline: 'HỆ THỐNG TỰ ĐỘNG HÓA N8N & AI: XÂY KÊNH & BÁN HÀNG TỰ ĐỘNG',
    subheadline: 'Sở hữu trọn bộ file Workflow JSON và hướng dẫn kết nối VietQR SePay, Telegram Bot duyệt đơn tự động 24/7.',
    ctaText: '⚡ NHẬN TRỌN BỘ QUY TRÌNH NGAY',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    showcase: {
      badge: 'KIẾN TRÚC TỰ ĐỘNG HÓA HOÀN CHỈNH',
      title: 'Cắm Vào Là Chạy — Đóng Gói Toàn Diện Từng Dòng Lệnh!',
      desc: 'Toàn bộ file JSON và mã kết nối SePay/Telegram được chuẩn hóa chỉ việc bấm Import.',
      highlights: [
        { title: '✓ Tiết kiệm 4-5 tiếng mỗi ngày', desc: 'Không còn gõ từng bài viết hay canh trực thanh toán thủ công.' },
        { title: '✓ Chi phí duy trì 0đ', desc: 'Host n8n hoàn toàn miễn phí trên máy tính cá nhân hoặc VPS.' },
        { title: '✓ Báo cáo về Telegram tức thì', desc: 'Nhận thông báo đơn hàng và doanh thu ngay trên điện thoại.' },
        { title: '✓ Nhóm Zalo hỗ trợ VIP 1-1', desc: 'Admin trực tiếp giải đáp mọi thắc mắc kỹ thuật trọn đời.' },
      ],
    },
    features: [
      { title: 'Cào tin tức tự động 24/7', desc: 'Thu thập bài viết từ hơn 20 trang công nghệ hàng đầu mỗi ngày.' },
      { title: 'ChatGPT & Claude viết lại chuẩn SEO', desc: 'Prompt độc quyền không trùng lặp, tự sinh hình ảnh và tiêu đề.' },
      { title: 'Tự động xuất bản đa kênh', desc: 'Đẩy bài liên tục lên Facebook Fanpage, Telegram và Website theo lịch.' },
      { title: 'Khớp đơn VietQR SePay 3 giây', desc: 'Tiền về tài khoản là hệ thống tự mở khóa tài nguyên cho học viên.' },
    ],
    modules: [
      { step: '01', name: 'Cài Đặt & Kích Hoạt n8n Miễn Phí', desc: 'Tự host n8n chi phí 0đ trên máy tính hoặc VPS cá nhân.' },
      { step: '02', name: 'Import File JSON Mẫu Vào n8n', desc: 'Bộ workflow mẫu dựng sẵn chỉ việc import và bật Switch Active.' },
      { step: '03', name: 'Điền API Key OpenAI & Telegram Bot', desc: 'Kết nối các cổng dịch vụ với tài khoản của bạn theo video từng bước.' },
      { step: '04', name: 'Lên Lịch Tự Động & Thụ Hưởng Doanh Thu', desc: 'Thiết lập giờ đăng tự động và theo dõi thông báo báo về điện thoại.' },
    ],
    bonusItems: [
      'Bộ 500+ Prompt AI Chuẩn Thương Mại Chuyên Sâu (Trị giá 499.000đ)',
      'Template Tự Động Bắn Tin Nhắn Đơn Hàng Về Telegram Bot (Trị giá 299.000đ)',
      'Quyền Tham Gia Nhóm Zalo Hỗ Trợ Kỹ Thuật VIP Trọn Đời (Vô giá)',
    ],
    testimonials: [
      {
        name: 'Trần Minh Quân',
        role: 'Content Creator & Blogger',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Quan',
        comment: 'Quy trình n8n của Tự Học AI setup siêu nhanh. Trước đây mất 4 tiếng viết bài mỗi ngày, giờ hệ thống tự chạy đăng 15 bài/ngày.',
      },
      {
        name: 'Lê Thị Bích Ngọc',
        role: 'Kinh doanh Online',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ngoc',
        comment: 'Không biết code tí nào mà làm theo video hướng dẫn 20 phút là chạy mượt. Đáng đồng tiền bát gạo!',
      },
    ],
    faq: [
      { q: 'Tôi không biết lập trình hay code thì có dùng được không?', a: 'Hoàn toàn dùng được! Toàn bộ file JSON đã được dựng sẵn, chỉ việc import và nhập API Key theo video hướng dẫn từng cú click.' },
      { q: 'Hệ thống có mất phí duy trì hàng tháng không?', a: 'Không! n8n bản tự host hoàn toàn miễn phí, bạn sở hữu vĩnh viễn và không mất phí định kỳ cho Tự Học AI.' },
      { q: 'Sau khi chuyển khoản tôi nhận quy trình như thế nào?', a: 'Cổng VietQR khớp đơn trong 3 giây. Màn hình tự động mở khóa link tải toàn bộ file kèm link Zalo hỗ trợ kỹ thuật.' },
    ],
  };

  const putRes = await fetch(`${BASE_URL}/api/admin/landing-pages`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `tuhocai_session=${adminToken}`,
    },
    body: JSON.stringify(updatePayload),
  });
  const putData = await putRes.json();
  if (!putData.success) {
    throw new Error('PUT /api/admin/landing-pages failed: ' + JSON.stringify(putData));
  }
  console.log('✓ Cập nhật toàn bộ nội dung Landing Page thành công!');

  // 4. Khởi động Edge CDP Browser
  console.log('\n[Browser Test] Khởi động Edge CDP server tại port ' + port);
  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ]);

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 200));
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
  console.log('✓ Kết nối CDP WebSocket thành công!');

  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('Network.enable');

  // Set Cookie for localhost:8899
  await client.send('Network.setCookie', {
    name: 'tuhocai_session',
    value: adminToken,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Test 4.1: Vào trang Admin Landing Pages
  console.log('Mở trang /admin/landing-pages...');
  await client.send('Page.navigate', { url: `${BASE_URL}/admin/landing-pages` });
  await new Promise((r) => setTimeout(r, 3000));
  await capture(client, 'admin_lp_dashboard.png');

  // Test 4.2: Bấm nút Chỉnh Sửa trên card/dòng landing page
  console.log('Mở Modal Chỉnh Sửa LP...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const editBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent && b.textContent.trim().includes('Sửa'));
      if (editBtns.length > 0) editBtns[0].click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 1500));
  await capture(client, 'admin_lp_edit_tab_general.png');

  // Test 4.3: Chuyển sang Tab Hero & Video
  console.log('Click Tab "🎯 Hero & Video"...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.textContent && b.textContent.includes('Hero & Video'));
      if (tab) tab.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await capture(client, 'admin_lp_edit_tab_hero.png');

  // Test 4.4: Chuyển sang Tab Tính Năng
  console.log('Click Tab "⚡ Tính Năng"...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.textContent && b.textContent.includes('Tính Năng'));
      if (tab) tab.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await capture(client, 'admin_lp_edit_tab_features.png');

  // Test 4.5: Chuyển sang Tab Lộ Trình
  console.log('Click Tab "📚 Lộ Trình"...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.textContent && b.textContent.includes('Lộ Trình'));
      if (tab) tab.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await capture(client, 'admin_lp_edit_tab_modules.png');

  // Test 4.6: Chuyển sang Tab FAQ
  console.log('Click Tab "❓ FAQ"...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const tab = btns.find(b => b.textContent && b.textContent.includes('FAQ'));
      if (tab) tab.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await capture(client, 'admin_lp_edit_tab_faq.png');

  // Test 4.7: Mở trang Live Landing Page để kiểm tra render
  console.log('\nMở trang Landing Page /lp/n8n-tu-dong-hoa-kiem-tien...');
  await client.send('Page.navigate', { url: `${BASE_URL}/lp/n8n-tu-dong-hoa-kiem-tien` });
  await new Promise((r) => setTimeout(r, 3000));
  await capture(client, 'live_lp_hero_and_video.png');

  // Scroll to Showcase and Features
  await client.send('Runtime.evaluate', { expression: `window.scrollTo({ top: 900, behavior: 'instant' });` });
  await new Promise((r) => setTimeout(r, 800));
  await capture(client, 'live_lp_showcase_and_features.png');

  // Scroll to Modules and FAQ
  await client.send('Runtime.evaluate', { expression: `window.scrollTo({ top: 2200, behavior: 'instant' });` });
  await new Promise((r) => setTimeout(r, 800));
  await capture(client, 'live_lp_modules_and_faq.png');

  // Scroll to Testimonials and FAQ
  await client.send('Runtime.evaluate', { expression: `window.scrollTo({ top: 3100, behavior: 'instant' });` });
  await new Promise((r) => setTimeout(r, 800));
  await capture(client, 'live_lp_testimonials_and_faq.png');

  console.log('✅ HOÀN TẤT TOÀN BỘ KIỂM THỬ QA!');
  client.close();
  edge.kill();
}

runQA().catch((err) => {
  console.error('Lỗi khi chạy QA:', err);
  process.exit(1);
});
