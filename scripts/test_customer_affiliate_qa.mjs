import { SignJWT } from 'jose';
import fs from 'fs';
import path from 'path';

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

async function runAffiliateTests() {
  console.log('================================================================');
  console.log('💎 KIỂM TRA TOÀN DIỆN: CTV REFERRAL 60% DÀNH CHO KHÁCH HÀNG 💎');
  console.log('================================================================\n');

  let total = 0;
  let passed = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  // 1. Unauthenticated checks
  console.log('--- 1. Kiểm tra Bảo Mật & Xác Thực (Unauthorized) ---');
  try {
    const unauthGet = await fetch(`${BASE_URL}/api/dashboard/referral`);
    assert(unauthGet.status === 401, 'GET /api/dashboard/referral từ chối khách chưa login (HTTP 401)');

    const unauthPost = await fetch(`${BASE_URL}/api/dashboard/referral`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankName: 'TEST' }),
    });
    assert(unauthPost.status === 401, 'POST /api/dashboard/referral từ chối khách chưa login (HTTP 401)');
  } catch (err) {
    assert(false, `Lỗi kiểm tra auth: ${err.message}`);
  }

  // 2. Authenticated user session
  console.log('\n--- 2. Kiểm tra API GET /api/dashboard/referral cho User đã đăng nhập ---');
  const testUser = {
    id: '0cf63839-aa90-4c36-9757-1676dee23f57',
    name: 'NGUYỄN HOÀNG PHƯỚC',
    email: 'phuocttt7@gmail.com',
    role: 'USER',
  };

  const token = await createToken(testUser);
  const authHeaders = {
    'Content-Type': 'application/json',
    Cookie: `tuhocai_session=${token}`,
  };

  let referralData = null;
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard/referral`, { headers: authHeaders });
    assert(res.status === 200, 'GET /api/dashboard/referral trả về HTTP 200 OK');

    referralData = await res.json();
    assert(referralData.success === true, 'API trả về { success: true }');
    assert(!!referralData.partner, 'Tự động cấp/lấy thông tin Affiliate Partner');
    assert(!!referralData.partner.code, `Mã giới thiệu hợp lệ: ${referralData.partner?.code}`);
    assert(!!referralData.partner.generalRefUrl, `Link chung giới thiệu: ${referralData.partner?.generalRefUrl}`);
    assert(referralData.stats !== undefined, 'Đối tượng stats thống kê tồn tại');

    console.log(`   -> Partner Code: ${referralData.partner.code}`);
    console.log(`   -> General Ref URL: ${referralData.partner.generalRefUrl}`);
    console.log(`   -> Số dư hiện tại: ${referralData.stats.balance.toLocaleString('vi-VN')}đ`);
    console.log(`   -> Tổng thu nhập: ${referralData.stats.totalEarned.toLocaleString('vi-VN')}đ`);
    console.log(`   -> Clicks: ${referralData.stats.totalClicks} | Đơn hàng: ${referralData.stats.totalOrders} (CR: ${referralData.stats.conversionRate}%)`);
  } catch (err) {
    assert(false, `Lỗi gọi GET /api/dashboard/referral: ${err.message}`);
  }

  // 3. Kiểm tra Cơ Chế Đồng Bộ Chiết Khấu Mặc Định 60%
  console.log('\n--- 3. Kiểm tra Cơ Chế Đồng Bộ Chiết Khấu Mặc Định 60% Cho Toàn Bộ Khóa Học ---');
  if (referralData && referralData.referralProducts) {
    assert(Array.isArray(referralData.referralProducts) && referralData.referralProducts.length > 0, `Có ${referralData.referralProducts.length} khóa học được cấu hình giới thiệu`);

    for (const c of referralData.referralProducts) {
      const displayName = c.name || c.title;
      const expectedCommission = Math.round(c.price * 0.6);
      assert(
        c.commissionRate === 60,
        `Khóa [${displayName}]: Hoa hồng đồng bộ đạt 60% (${c.commissionAmount.toLocaleString('vi-VN')}đ / giá ${c.price.toLocaleString('vi-VN')}đ)`
      );
      assert(c.commissionAmount === expectedCommission, `Số tiền hoa hồng 60% tính chính xác: ${c.commissionAmount}đ`);
      assert(c.refUrl.includes(referralData.partner.code), `Link ref khóa học chứa đúng ref code [${referralData.partner.code}]: ${c.refUrl}`);
    }

    console.log(`\n   -> Toàn bộ ${referralData.referralProducts.length} khóa học đều đồng bộ chiết khấu 60% hoa hồng!`);
  } else {
    assert(false, 'Không tìm thấy danh sách khóa học (referralProducts) trong phản hồi API');
  }

  // 4. Kiểm tra 5 Content Marketing Mẫu DFY
  console.log('\n--- 4. Kiểm tra Kho Mẫu Content Đăng Bài Có Sẵn (DFY Kit) ---');
  if (referralData && referralData.marketingKits) {
    assert(referralData.marketingKits.length === 5, `Có đầy đủ 5 mẫu bài viết sẵn cho CTV (thực tế: ${referralData.marketingKits.length})`);
    
    for (const kit of referralData.marketingKits) {
      assert(!!kit.title && kit.title.length > 10, `Mẫu #${kit.id} có tiêu đề: ${kit.title}`);
      assert(!!kit.content && kit.content.length > 50, `Mẫu #${kit.id} có nội dung đầy đủ chi tiết (${kit.content.length} ký tự)`);
      assert(kit.content.includes(referralData.partner.code), `Mẫu #${kit.id} đã tự động chèn ref link của chính CTV chứa mã [${referralData.partner.code}]`);
    }
  } else {
    assert(false, 'Không tìm thấy kho marketingKits trong dữ liệu API');
  }

  // 5. Kiểm tra Cập Nhật Thông Tin Ngân Hàng POST /api/dashboard/referral
  console.log('\n--- 5. Kiểm tra Lưu Thông Tin Ngân Hàng (Bank Details) ---');
  try {
    const bankPayload = {
      bankName: 'MBBANK',
      bankAccountNo: '0938999888',
      bankAccountName: 'NGUYEN HOANG PHUOC',
    };

    const updateRes = await fetch(`${BASE_URL}/api/dashboard/referral`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(bankPayload),
    });

    assert(updateRes.status === 200, 'POST /api/dashboard/referral cập nhật ngân hàng trả về HTTP 200 OK');
    const updateJson = await updateRes.json();
    assert(updateJson.success === true, 'Cập nhật tài khoản ngân hàng thành công { success: true }');

    // Re-verify GET
    const reGetRes = await fetch(`${BASE_URL}/api/dashboard/referral`, { headers: authHeaders });
    const reGetData = await reGetRes.json();
    assert(
      reGetData.partner.bankName === 'MBBANK' &&
      reGetData.partner.bankAccountNo === '0938999888' &&
      reGetData.partner.bankAccountName === 'NGUYEN HOANG PHUOC',
      'Dữ liệu ngân hàng đã được lưu và đọc lại chính xác từ Database'
    );
  } catch (err) {
    assert(false, `Lỗi cập nhật ngân hàng: ${err.message}`);
  }

  // 6. Kiểm tra Click Tracking API (/api/affiliate/track)
  console.log('\n--- 6. Kiểm tra Hệ Thống Tracking Clicks (/api/affiliate/track) ---');
  try {
    const trackRes = await fetch(`${BASE_URL}/api/affiliate/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: referralData.partner.code,
        landingPath: '/lp/video-ai-tu-1-anh',
        referrer: 'https://facebook.com',
      }),
    });
    assert(trackRes.status === 200, 'Ghi nhận lượt click qua ref link thành công (HTTP 200)');
    const trackJson = await trackRes.json();
    assert(trackJson.success === true, 'Kết quả tracking { success: true }');
  } catch (err) {
    assert(false, `Lỗi kiểm tra Click Tracking: ${err.message}`);
  }

  // 7. Kiểm tra Tích Hợp Frontend Code & File Routing
  console.log('\n--- 7. Kiểm tra Tích Hợp Giao Diện Frontend & Component Code ---');
  try {
    // Check Dashboard Page code
    const dashPageCode = fs.readFileSync(path.join(process.cwd(), 'src/app/dashboard/page.tsx'), 'utf-8');
    assert(dashPageCode.includes('CustomerAffiliateHub'), 'Dashboard Page import CustomerAffiliateHub');
    assert(dashPageCode.includes('Affiliate & CTV'), 'Dashboard có Tab Đối Tác Affiliate & CTV');
    assert(dashPageCode.includes("activeTab === 'referral'"), 'Dashboard render CustomerAffiliateHub khi chọn tab referral');

    // Check Lesson Page code
    const lessonPageCode = fs.readFileSync(path.join(process.cwd(), 'src/app/dashboard/hoc/[courseSlug]/page.tsx'), 'utf-8');
    assert(lessonPageCode.includes('ReferralShareCard'), 'Lesson Page import và nhúng ReferralShareCard');

    // Check ReferralShareCard code
    const shareCardCode = fs.readFileSync(path.join(process.cwd(), 'src/components/ReferralShareCard.tsx'), 'utf-8');
    assert(shareCardCode.includes('partnerRate || 60'), 'ReferralShareCard áp dụng chiết khấu tùy chỉnh (mặc định 60%)');

    // Check Route Responses
    const dashRes = await fetch(`${BASE_URL}/dashboard`, { headers: authHeaders });
    assert(dashRes.status === 200, 'Trang /dashboard phản hồi HTTP 200 OK');

    const lessonRes = await fetch(`${BASE_URL}/dashboard/hoc/video-ai-tu-1-anh`, { headers: authHeaders });
    assert(lessonRes.status === 200, 'Trang /dashboard/hoc/video-ai-tu-1-anh phản hồi HTTP 200 OK');

    const affRes = await fetch(`${BASE_URL}/affiliate`);
    assert(affRes.status === 200, 'Trang /affiliate phản hồi HTTP 200 OK');
  } catch (err) {
    assert(false, `Lỗi kiểm tra Frontend Code: ${err.message}`);
  }

  // Summary
  console.log('\n================================================================');
  console.log(`KẾT QUẢ KIỂM THỬ: ${passed}/${total} tiêu chí ĐẠT (${Math.round((passed / total) * 100)}%)`);
  console.log('================================================================');

  if (passed === total) {
    console.log('🎉 TẤT CẢ TÍNH NĂNG CTV REFERRAL 60% HOẠT ĐỘNG HOÀN HẢO 100%!');
  } else {
    console.error('⚠️ VẪN CÒN TIÊU CHÍ CHƯA ĐẠT, CẦN KIỂM TRA LẠI!');
    process.exit(1);
  }
}

runAffiliateTests().catch((err) => {
  console.error('FATAL TEST ERROR:', err);
  process.exit(1);
});
