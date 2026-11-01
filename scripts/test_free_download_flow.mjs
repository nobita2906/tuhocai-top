import { SignJWT } from 'jose';

const BASE_URL = 'http://localhost:8899';
const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

async function createToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 BẮT ĐẦU KIỂM TRA QUY TRÌNH & TÀI LIỆU MIỄN PHÍ QA');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  // 1. Test pages render
  console.log('--- 1. Kiểm tra Render các trang liên quan ---');
  const urls = [
    '/',
    '/san-pham',
    '/san-pham/app-flow-google-auto-bao-cao-sheets',
    '/thanh-toan?pid=WF-FLOW-001',
  ];

  for (const url of urls) {
    try {
      const res = await fetch(`${BASE_URL}${url}`);
      assert(res.status === 200, `Trang ${url} trả về HTTP 200 OK`);
    } catch (e) {
      assert(false, `Trang ${url} gặp lỗi kết nối: ${e.message}`);
    }
  }

  // 2. Test Auth Token & /api/auth/me
  console.log('\n--- 2. Kiểm tra Đăng nhập & Xác thực ---');
  const testUser = {
    id: '0cf63839-aa90-4c36-9757-1676dee23f57', // Existing user in DB
    name: 'NGUYỄN HOÀNG PHƯỚC',
    email: 'phuocttt7@gmail.com',
    role: 'USER',
  };

  const token = await createToken(testUser);
  const authHeaders = {
    'Content-Type': 'application/json',
    Cookie: `tuhocai_session=${token}`,
  };

  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, { headers: authHeaders });
    const data = await res.json();
    assert(data.authenticated === true, 'Đã xác thực thành công qua /api/auth/me');
    assert(data.user?.email === testUser.email, `Email người dùng khớp: ${data.user?.email}`);
  } catch (e) {
    assert(false, `Lỗi /api/auth/me: ${e.message}`);
  }

  // 3. Test /api/leads when user is logged in (Tự động kích hoạt không cần nhập thông tin)
  console.log('\n--- 3. Kiểm tra Tải Miễn Phí khi ĐÃ ĐĂNG NHẬP (Auto-claim) ---');
  try {
    // Client can send minimal or empty name/email because user is logged in
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        resource_id: 'WF-FLOW-001',
        resource_name: 'App Flow Google - Auto Báo Cáo Sheets',
      }),
    });

    const data = await res.json();
    assert(res.status === 200, `Gọi /api/leads trả về HTTP 200`);
    assert(data.success === true, `Kích hoạt thành công: ${data.message}`);
    assert(!!data.download_url, `Có trả về link tải trực tiếp: ${data.download_url}`);
    assert(!!data.zalo_group, `Có trả về link nhóm Zalo: ${data.zalo_group}`);
  } catch (e) {
    assert(false, `Lỗi khi gọi /api/leads khi logged in: ${e.message}`);
  }

  // 4. Test /api/library (Kiểm tra xem tài liệu đã có trong Kho Của Tôi chưa)
  console.log('\n--- 4. Kiểm tra Kho Của Tôi (/api/library) của User ---');
  try {
    const res = await fetch(`${BASE_URL}/api/library`, { headers: authHeaders });
    const data = await res.json();
    assert(res.status === 200, `Gọi /api/library trả về HTTP 200`);
    assert(Array.isArray(data.library), 'Kho tài liệu trả về mảng danh sách');
    const hasItem = data.library.some(
      (item) => item.product_name?.toLowerCase().includes('flow google') || item.product_slug?.includes('flow')
    );
    assert(hasItem, 'Tài liệu "App Flow Google" đã được mở khóa tự động trong Kho Của Tôi!');
  } catch (e) {
    assert(false, `Lỗi kiểm tra library: ${e.message}`);
  }

  // 5. Test /api/leads when user is NOT logged in (Khách vãng lai điền thông tin)
  console.log('\n--- 5. Kiểm tra Tải Miễn Phí khi CHƯA ĐĂNG NHẬP (Guest) ---');
  try {
    const res = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Khách Thử Nghiệm 01',
        email: 'khach.test.leads@gmail.com',
        phone: '0987654321',
        resource_id: 'WF-FLOW-001',
        resource_name: 'App Flow Google - Auto Báo Cáo Sheets',
      }),
    });

    const data = await res.json();
    assert(res.status === 200, `Gọi /api/leads cho guest trả về HTTP 200`);
    assert(data.success === true, `Guest đăng ký thành công: ${data.message}`);
    assert(!!data.download_url, `Guest nhận được link tải: ${data.download_url}`);
  } catch (e) {
    assert(false, `Lỗi khi test guest: ${e.message}`);
  }

  // 6. Test /api/checkout for 0đ free product
  console.log('\n--- 6. Kiểm tra Checkout sản phẩm 0đ ---');
  try {
    const res = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        productId: 'WF-FLOW-001',
        customerName: testUser.name,
        customerEmail: testUser.email,
      }),
    });

    const data = await res.json();
    assert(res.status === 200, `Checkout 0đ trả về HTTP 200`);
    assert(data.success === true, 'Kích hoạt 0đ thành công');
    assert(data.isFree === true, 'Xác nhận cờ isFree là true');
    assert(!!data.downloadUrl, `Trả về URL tải về: ${data.downloadUrl}`);
  } catch (e) {
    assert(false, `Lỗi checkout 0đ: ${e.message}`);
  }

  console.log('\n====================================================');
  console.log(`📊 TỔNG KẾT: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================');

  if (passed === total) {
    console.log('🎉 TẤT CẢ CÁC KIỂM TRA ĐỀU THÀNH CÔNG 100%!');
    process.exit(0);
  } else {
    console.error('❌ MỘT SỐ KIỂM TRA THẤT BẠI!');
    process.exit(1);
  }
}

runTests();

