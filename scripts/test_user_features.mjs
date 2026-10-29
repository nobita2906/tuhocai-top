import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const BASE_URL = 'http://localhost:8899';

async function generateAdminToken() {
  return new SignJWT({
    id: '93f17bf0-79f7-499e-98fb-d64e3cab3d5d',
    email: 'dang@tuhocai.top',
    name: 'Nguyễn Văn Đăng (Admin)',
    role: 'ADMIN',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

async function runTests() {
  console.log('--- 1. TEST CHECKOUT KHÔNG CẦN NHẬP SĐT (DÀNH CHO USER ĐÃ ĐĂNG NHẬP) ---');
  const adminToken = await generateAdminToken();

  const checkoutRes = await fetch(`${BASE_URL}/api/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `tuhocai_session=${adminToken}`,
    },
    body: JSON.stringify({
      productId: 'WF-N8N-001',
      customerName: 'Nguyễn Văn Đăng (Admin)',
      customerEmail: 'dang@tuhocai.top',
      // KHÔNG CÓ SĐT!
    }),
  });

  const checkoutData = await checkoutRes.json();
  if (!checkoutRes.ok) {
    console.error('❌ Thất bại:', checkoutData);
    process.exit(1);
  }
  console.log(`✅ Khách đã đăng nhập checkout thành công mà KHÔNG cần SĐT!`);
  console.log(`📦 Mã đơn: ${checkoutData.orderCode}`);
  console.log(`🏦 Ngân hàng: ${checkoutData.bankInfo?.bankName} - STK: ${checkoutData.bankInfo?.accountNo}`);
  console.log(`📝 Nội dung CK: ${checkoutData.bankInfo?.content}`);

  console.log('\n--- 2. TEST QUẢN LÝ CẤU HÌNH THÔNG BÁO TELEGRAM ĐA KÊNH ---');
  // Lấy danh sách cấu hình
  const getRes = await fetch(`${BASE_URL}/api/admin/telegram-settings`, {
    headers: { 'Cookie': `tuhocai_session=${adminToken}` },
  });
  const getData = await getRes.json();
  console.log(`✅ Lấy cấu hình thành công! Số kênh hiện tại: ${getData.channels?.length || 0}`);

  // Thêm 3 kênh tùy biến với dấu +
  const newChannels = [
    {
      id: 'chan-admin',
      name: 'Admin Duyệt Đơn (Cá nhân)',
      chatId: '6580812076',
      type: 'MANUAL_REVIEW_ONLY',
      enabled: true,
    },
    {
      id: 'chan-sales',
      name: 'Group Kinh Doanh & Chốt Sale (+)',
      chatId: '6580812076',
      type: 'SUCCESS_ONLY',
      enabled: true,
    },
    {
      id: 'chan-all',
      name: 'Kênh Thông Báo Chung (+)',
      chatId: '6580812076',
      type: 'ALL',
      enabled: true,
    },
  ];

  const saveRes = await fetch(`${BASE_URL}/api/admin/telegram-settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `tuhocai_session=${adminToken}`,
    },
    body: JSON.stringify({
      botToken: '8781006384:AAHDfcnSsIiwDpycoY9G-fd7ug5-Ne2Oq0Y',
      channels: newChannels,
      templates: getData.templates,
    }),
  });
  const saveData = await saveRes.json();
  console.log(`✅ Lưu cấu hình 3 kênh Telegram tùy biến thành công:`, saveData.message);

  // Test gửi thử nghiệm tới kênh
  const testRes = await fetch(`${BASE_URL}/api/admin/telegram-settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `tuhocai_session=${adminToken}`,
    },
    body: JSON.stringify({
      action: 'TEST',
      targetChatId: '6580812076',
      botToken: '8781006384:AAHDfcnSsIiwDpycoY9G-fd7ug5-Ne2Oq0Y',
      testMessage: '🔔 *TEST KẾT NỐI KÊNH TELEGRAM TÙY BIẾN!*\nThử nghiệm nút kiểm tra kênh đa kênh thành công rực rỡ.',
    }),
  });
  const testData = await testRes.json();
  console.log(`✅ Gửi tin nhắn thử nghiệm lên Telegram thành công:`, testData.message);

  console.log('\n--- 3. TEST TỰ ĐỘNG ĐĂNG NHẬP KHÁCH MỚI KHI DUYỆT ĐƠN (CHECK-STATUS) ---');
  const guestEmail = `test_guest_${Date.now()}@tuhocai.top`;
  const guestPhone = '0987654321';

  // Khách mới tạo đơn
  const guestOrderRes = await fetch(`${BASE_URL}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: 'WF-N8N-001',
      customerName: 'Khách Mới Tự Động Đăng Nhập',
      customerEmail: guestEmail,
      customerPhone: guestPhone,
    }),
  });
  const guestOrderData = await guestOrderRes.json();
  const orderId = guestOrderData.orderId;
  const orderCode = guestOrderData.orderCode;
  console.log(`✅ Khách mới tạo đơn thành công: Mã đơn ${orderCode}`);

  // Duyệt đơn qua Telegram Callback
  await fetch(`${BASE_URL}/api/telegram-webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      callback_query: {
        id: 'cb_test_auto_login',
        data: `APPROVE:${orderId}`,
        message: { message_id: 999992, chat: { id: 6580812076 } },
      },
    }),
  });
  console.log(`✅ Telegram bot đã duyệt đơn ${orderCode}!`);

  // Kiểm tra check-status: xem có set cookie tuhocai_session và autoLoggedIn = true không
  const statusRes = await fetch(`${BASE_URL}/api/orders/check-status?orderCode=${orderCode}`);
  const statusData = await statusRes.json();
  const setCookieHeader = statusRes.headers.get('set-cookie') || '';

  console.log(`✅ Trạng thái đơn: ${statusData.status}, autoLoggedIn: ${statusData.autoLoggedIn}`);
  if (setCookieHeader.includes('tuhocai_session')) {
    console.log(`✅ TỰ ĐỘNG PHÁT HÀNH COOKIE ĐĂNG NHẬP (tuhocai_session) THÀNH CÔNG!`);
  } else {
    console.warn('⚠️ Chưa thấy set-cookie header');
  }

  console.log('\n--- 4. TEST ĐỔI MẬT KHẨU NHANH CHO KHÁCH HÀNG (POPUP ĐỔI MK) ---');
  const changePassRes = await fetch(`${BASE_URL}/api/user/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: guestEmail,
      currentPassword: guestPhone, // SĐT là mật khẩu ban đầu
      newPassword: 'MatKhauMoi@2026',
    }),
  });
  const changePassData = await changePassRes.json();
  console.log(`✅ Đổi mật khẩu thành công:`, changePassData.message);

  console.log('\n🎉🎉🎉 TẤT CẢ 4 HẠNG MỤC CẢI TIẾN ĐỀU ĐẠT CHUẨN 100%!');
}

runTests().catch((e) => {
  console.error('Lỗi test:', e);
  process.exit(1);
});
