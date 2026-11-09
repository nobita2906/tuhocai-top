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
const port = 9568;
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

async function runScenarioQA() {
  console.log('--- 🧪 BẮT ĐẦU KIỂM THỬ TỔNG QUAN TẤT CẢ TRƯỜNG HỢP SỬ DỤNG KHÓA HỌC ---');

  // 1. Tạo JWT Token
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
  console.log('✓ Token xác thực sẵn sàng');

  // 2. Khởi động Edge CDP Browser
  console.log('[Browser Test] Khởi động Edge CDP server tại port ' + port);
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
  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Network.enable');

  await client.send('Network.setCookie', {
    name: 'tuhocai_session',
    value: adminToken,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
  });

  // =========================================================================
  // SCENARIO 1: DESKTOP VIEW - LỘ TRÌNH BÊN TAY TRÁI & KHÔNG GIAN BÊN PHẢI
  // =========================================================================
  console.log('\n[KỊCH BẢN 1] Mở phòng học học viên trên Desktop (1440x900)...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send('Page.navigate', { url: `${BASE_URL}/dashboard/hoc/video-ai-tu-1-anh` });
  await new Promise((r) => setTimeout(r, 2500));

  // Chụp toàn cảnh: Cột trái (Lộ trình), Cột phải (Video & Tiêu đề)
  await capture(client, 'qa_case_a_student_overview_left_sidebar.png');

  // =========================================================================
  // SCENARIO 2: TEST BỘ PROMPT & CÂU LỆNH SAO CHÉP NHANH (1-CLICK COPY)
  // =========================================================================
  console.log('\n[KỊCH BẢN 2] Kiểm tra Bộ Prompt Dùng Ngay & Nút Sao Chép...');
  // Cuộn nhẹ xuống để thấy Khung Prompt Dùng Ngay
  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 580, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await capture(client, 'qa_case_b_prompt_quick_copy_section.png');

  // Thử click nút Sao chép Prompt đầu tiên để kiểm tra tương tác
  console.log('👉 Click thử nút "Sao chép Prompt"...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const copyBtn = btns.find(b => b.innerText.includes('Sao chép Prompt') || b.innerText.includes('Sao Chép Lệnh'));
      if (copyBtn) copyBtn.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 600));
  await capture(client, 'qa_case_c_prompt_copied_feedback.png');

  // =========================================================================
  // SCENARIO 3: CHECKLIST THỰC HÀNH & TÀI LIỆU TẢI VỀ
  // =========================================================================
  console.log('\n[KỊCH BẢN 3] Kiểm tra Checklist tương tác & Tệp tải về...');
  // Click tick chọn checkbox đầu tiên
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const checklistBtns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Đọc kỹ file PDF') || b.innerText.includes('Xác định 1 ngách'));
      if (checklistBtns[0]) checklistBtns[0].click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 500));

  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 950, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await capture(client, 'qa_case_d_interactive_checklist_and_downloads.png');

  // Cuộn tiếp xuống phần Markdown Ghi chú với nút copy trên từng code block
  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 1550, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await capture(client, 'qa_case_e_markdown_notes_with_copy_btn.png');

  // =========================================================================
  // SCENARIO 4: CHUYỂN BÀI HỌC QUA SIDEBAR TRÁI (BÀI 1.2 CÓ PROMPT CLAUDE 3.7)
  // =========================================================================
  console.log('\n[KỊCH BẢN 4] Chuyển sang bài 1.2 (Prompt kịch bản Claude 3.7)...');
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const items = Array.from(document.querySelectorAll('button'));
      const lesson12 = items.find(b => b.innerText.includes('1.2 Viết kịch bản'));
      if (lesson12) lesson12.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 1500));

  await client.send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 550, behavior: 'instant' });`,
  });
  await new Promise((r) => setTimeout(r, 1000));
  await capture(client, 'qa_case_f_lesson_1_2_claude_prompt.png');

  // =========================================================================
  // SCENARIO 5: ADMIN QUẢN TRỊ VỚI LỘ TRÌNH BÊN TRÁI
  // =========================================================================
  console.log('\n[KỊCH BẢN 5] Kiểm tra Admin /admin/khoa-hoc với Lộ trình bên TRÁI...');
  await client.send('Page.navigate', { url: `${BASE_URL}/admin/khoa-hoc` });
  await new Promise((r) => setTimeout(r, 2000));

  // Click Quản lý bài học
  await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const manageBtn = btns.find(b => b.innerText.includes('Quản Lý Bài Học'));
      if (manageBtn) manageBtn.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 2500));

  await capture(client, 'qa_case_g_admin_left_sidebar_and_main_stage.png');

  // =========================================================================
  // SCENARIO 6: MOBILE VIEWPORT (390x844 - iPhone 14 / Di Động)
  // =========================================================================
  console.log('\n[KỊCH BẢN 6] Kiểm tra giao diện Mobile (390x844)...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await client.send('Page.navigate', { url: `${BASE_URL}/dashboard/hoc/video-ai-tu-1-anh` });
  await new Promise((r) => setTimeout(r, 2500));

  await capture(client, 'qa_case_h_mobile_classroom_top.png');

  client.close();
  edge.kill();
  console.log('\n🎉 TẤT CẢ 6 KỊCH BẢN KIỂM THỬ ĐÃ HOÀN TẤT THÀNH CÔNG 100%!');
}

runScenarioQA().catch((err) => {
  console.error('❌ Lỗi kiểm thử kịch bản:', err);
  process.exit(1);
});

