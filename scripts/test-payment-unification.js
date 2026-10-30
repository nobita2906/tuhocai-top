const http = require('http');

async function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (_) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('BẮT ĐẦU KIỂM THỬ TOÀN DIỆN HỆ THỐNG THANH TOÁN ACB');
  console.log('Ngân hàng: ACB - STK: 4747827 - NGUYEN VAN DANG');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(title, condition, extra = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`[PASS] ${title} ${extra ? `(${extra})` : ''}`);
    } else {
      console.error(`[FAIL] ${title} ${extra ? `(${extra})` : ''}`);
    }
  }

  // 1. Kiểm tra API public settings
  console.log('--- 1. Kiểm tra API Cài đặt ngân hàng Public ---');
  const resSettings = await request({
    hostname: 'localhost',
    port: 8899,
    path: '/api/settings/public',
    method: 'GET'
  });
  assert('API Settings trả về HTTP 200', resSettings.status === 200);
  assert('Bank ID chuẩn là ACB', resSettings.data?.bank_id === 'ACB', resSettings.data?.bank_id);
  assert('STK chuẩn là 4747827', resSettings.data?.account_no === '4747827', resSettings.data?.account_no);
  assert('Tên chủ TK chuẩn NGUYEN VAN DANG', resSettings.data?.account_name === 'NGUYEN VAN DANG', resSettings.data?.account_name);

  // 2. Kịch bản 1: Mua từ Landing page Sao Chép Landing Page (99K)
  console.log('\n--- 2. Kịch bản 1: Sao Chép Landing Page (SKILL-CLONE-099) ---');
  const testEmail1 = `test_clone_${Date.now()}@gmail.com`;
  const testPhone1 = '0981112233';
  const resOrder1 = await request({
    hostname: 'localhost',
    port: 8899,
    path: '/api/checkout',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    productId: 'SKILL-CLONE-099',
    customerName: 'Học Viên Clone LP',
    customerEmail: testEmail1,
    customerPhone: testPhone1,
    landingSlug: 'sao-chep-landing-page'
  });

  assert('Tạo đơn hàng Clone LP thành công', resOrder1.status === 200 && resOrder1.data?.orderCode);
  const code1 = resOrder1.data?.orderCode;
  const qr1 = resOrder1.data?.vietQrUrl || '';
  assert('Mã VietQR chứa đúng ACB và 4747827', qr1.includes('ACB-4747827'));
  assert('Mã VietQR chứa đúng số tiền 99.000đ', qr1.includes('amount=99000'));
  assert('Nội dung chuyển khoản chứa CLONELP', qr1.includes('CLONELP') || resOrder1.data?.transferContent?.includes('CLONELP'));

  // Giả lập SePay ACB webhook thanh toán 99.000đ
  const sepayWebhook1 = await request({
    hostname: 'localhost',
    port: 8899,
    path: '/api/webhook/sepay',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    id: `trans_${Date.now()}_1`,
    gateway: 'ACB',
    transactionDate: new Date().toISOString(),
    accountNumber: '4747827',
    subAccount: null,
    amountIn: 99000,
    amountOut: 0,
    accumulated: 99000,
    code: null,
    transactionContent: `CLONELP ${code1} NGUYEN VAN DANG`,
    referenceNumber: `REF_${Date.now()}`
  });
  assert('SePay Webhook nhận và xử lý giao dịch ACB', sepayWebhook1.status === 200 && sepayWebhook1.data?.success);

  // Kiểm tra polling status
  const checkStatus1 = await request({
    hostname: 'localhost',
    port: 8899,
    path: `/api/orders/check-status?orderCode=${code1}`,
    method: 'GET'
  });
  assert('Trạng thái đơn hàng tự động kích hoạt APPROVED', checkStatus1.data?.status === 'APPROVED');

  // 3. Kịch bản 2: Mua từ Landing page Video Drama (69K)
  console.log('\n--- 3. Kịch bản 2: Video Drama Gia Đình Nhỏ (WF-DRAMA-069) ---');
  const testEmail2 = `test_drama_${Date.now()}@gmail.com`;
  const testPhone2 = '0982223344';
  const resOrder2 = await request({
    hostname: 'localhost',
    port: 8899,
    path: '/api/checkout',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    productId: 'WF-DRAMA-069',
    customerName: 'Học Viên Drama AI',
    customerEmail: testEmail2,
    customerPhone: testPhone2,
    landingSlug: 'video-drama-gia-dinh-nho'
  });

  assert('Tạo đơn hàng Drama thành công', resOrder2.status === 200 && resOrder2.data?.orderCode);
  const code2 = resOrder2.data?.orderCode;
  const qr2 = resOrder2.data?.vietQrUrl || '';
  assert('Mã VietQR Drama đúng số tiền 69.000đ', qr2.includes('amount=69000'));
  assert('Nội dung chuyển khoản chứa DRAMA', qr2.includes('DRAMA') || resOrder2.data?.transferContent?.includes('DRAMA'));

  // Giả lập SePay ACB webhook thanh toán 69.000đ
  const sepayWebhook2 = await request({
    hostname: 'localhost',
    port: 8899,
    path: '/api/webhook/sepay',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    id: `trans_${Date.now()}_2`,
    gateway: 'ACB',
    transactionDate: new Date().toISOString(),
    accountNumber: '4747827',
    amountIn: 69000,
    amountOut: 0,
    accumulated: 168000,
    transactionContent: `DRAMA ${code2} chuyen tien khoa hoc`,
    referenceNumber: `REF_${Date.now()}`
  });
  assert('SePay Webhook kích hoạt đơn hàng Drama thành công', sepayWebhook2.status === 200 && sepayWebhook2.data?.success);

  // 4. Kịch bản 3: Mua từ Landing page Video AI 1 Ảnh (297K)
  console.log('\n--- 4. Kịch bản 3: Video AI Từ 1 Ảnh (WF-VIP-297) ---');
  const testEmail3 = `test_vip_${Date.now()}@gmail.com`;
  const testPhone3 = '0983334455';
  const resOrder3 = await request({
    hostname: 'localhost',
    port: 8899,
    path: '/api/checkout',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    productId: 'WF-VIP-297',
    customerName: 'Học Viên Video AI VIP',
    customerEmail: testEmail3,
    customerPhone: testPhone3,
    landingSlug: 'video-ai-tu-1-anh'
  });

  assert('Tạo đơn hàng Video AI VIP thành công', resOrder3.status === 200 && resOrder3.data?.orderCode);
  const code3 = resOrder3.data?.orderCode;
  const qr3 = resOrder3.data?.vietQrUrl || '';
  assert('Mã VietQR VIP đúng số tiền 297.000đ', qr3.includes('amount=297000'));
  assert('Nội dung chuyển khoản chứa VIDEOAI', qr3.includes('VIDEOAI') || resOrder3.data?.transferContent?.includes('VIDEOAI'));

  // Giả lập SePay ACB webhook thanh toán 297.000đ
  const sepayWebhook3 = await request({
    hostname: 'localhost',
    port: 8899,
    path: '/api/webhook/sepay',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    id: `trans_${Date.now()}_3`,
    gateway: 'ACB',
    transactionDate: new Date().toISOString(),
    accountNumber: '4747827',
    amountIn: 297000,
    amountOut: 0,
    accumulated: 465000,
    transactionContent: `VIDEOAI ${code3} chuyen tien`,
    referenceNumber: `REF_${Date.now()}`
  });
  assert('SePay Webhook kích hoạt đơn hàng VIP thành công', sepayWebhook3.status === 200 && sepayWebhook3.data?.success);

  // 5. Kịch bản 4: Mua từ Bài viết / Chi tiết sản phẩm (WF-THAI-099)
  console.log('\n--- 5. Kịch bản 4: Mua từ Bài viết Khóa Học (WF-THAI-099) ---');
  const testEmail4 = `test_post_${Date.now()}@gmail.com`;
  const testPhone4 = '0984445566';
  const resOrder4 = await request({
    hostname: 'localhost',
    port: 8899,
    path: '/api/checkout',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    productId: 'WF-THAI-099',
    customerName: 'Độc Giả Bài Viết',
    customerEmail: testEmail4,
    customerPhone: testPhone4
  });

  assert('Tạo đơn từ bài viết thành công', resOrder4.status === 200 && resOrder4.data?.orderCode);
  const code4 = resOrder4.data?.orderCode;
  const qr4 = resOrder4.data?.vietQrUrl || '';
  assert('Mã VietQR bài viết đúng số tiền 99.000đ', qr4.includes('amount=99000'));
  assert('Mã VietQR bài viết đúng STK ACB 4747827', qr4.includes('ACB-4747827'));

  // 6. Kịch bản 5: Kiểm tra tính năng Đổi Mật Khẩu (mật khẩu mặc định là SĐT)
  console.log('\n--- 6. Kịch bản 5: Đổi Mật Khẩu với Pass mặc định là SĐT ---');
  const resChangePass = await request({
    hostname: 'localhost',
    port: 8899,
    path: '/api/user/change-password',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: testEmail1,
    currentPassword: testPhone1, // Mật khẩu ban đầu do hệ thống gán tự động
    newPassword: 'MatKhauMoi@2026'
  });
  assert('Đổi mật khẩu thành công bằng SĐT mặc định', resChangePass.status === 200 && resChangePass.data?.success);

  // Thử đăng nhập lại bằng mật khẩu mới
  const resLogin = await request({
    hostname: 'localhost',
    port: 8899,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: testEmail1,
    password: 'MatKhauMoi@2026'
  });
  assert('Đăng nhập thành công với mật khẩu mới vừa đổi', resLogin.status === 200 && resLogin.data?.success);

  // Kiểm tra nhận diện khách hàng cũ và tự điền thông tin (Autofill Returning Customer)
  console.log('\n--- 7. Kịch bản 6: Tự Nhận Diện & Điền Sẵn Khách Hàng Cũ ---');
  const resLookup = await request({
    hostname: 'localhost',
    port: 8899,
    path: `/api/checkout/lookup-customer?email=${encodeURIComponent(testEmail1)}`,
    method: 'GET'
  });
  assert('Tìm thấy khách hàng cũ theo email', resLookup.data?.exists === true);
  assert('Tự điền đúng tên khách hàng cũ', resLookup.data?.name === 'Học Viên Clone LP', resLookup.data?.name);
  assert('Tự điền đúng SĐT khách hàng cũ', resLookup.data?.phone === testPhone1, resLookup.data?.phone);

  // 8. Kịch bản 7: Khách yêu cầu duyệt tay khẩn cấp qua Telegram
  console.log('\n--- 8. Kịch bản 7: Yêu Cầu Duyệt Nhanh Qua Telegram ---');
  const resManual = await request({
    hostname: 'localhost',
    port: 8899,
    path: '/api/orders/request-manual-review',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    orderCode: code4
  });
  assert('Gửi yêu cầu duyệt nhanh qua Telegram thành công', resManual.status === 200 && resManual.data?.success);

  console.log('\n====================================================');
  console.log(`KẾT QUẢ KIỂM THỬ: ${passed}/${total} TIÊU CHÍ ĐẠT (TỶ LỆ ${(passed/total*100).toFixed(1)}%)`);
  console.log('====================================================');
}

runTests().catch(console.error);
