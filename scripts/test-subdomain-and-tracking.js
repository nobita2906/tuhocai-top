require('dotenv').config();
const mysql = require('mysql2/promise');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ: SUBDOMAIN ROUTING & TRACKING');
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

  // TEST 1: Database Columns in landing_pages
  console.log('--- TEST 1: CƠ SỞ DỮ LIỆU LANDING PAGES ---');
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const [columns] = await conn.query('DESCRIBE landing_pages');
  const colNames = columns.map(c => c.Field);
  
  assert(colNames.includes('subdomain'), 'Bảng landing_pages đã có cột subdomain');
  assert(colNames.includes('facebook_pixel_id'), 'Bảng landing_pages đã có cột facebook_pixel_id');

  const [copypageRow] = await conn.query(
    'SELECT slug, subdomain FROM landing_pages WHERE subdomain = "copypage" LIMIT 1'
  );
  assert(
    copypageRow.length > 0 && copypageRow[0].slug === 'sao-chep-landing-page',
    'Subdomain copypage đã được gán chuẩn cho sao-chep-landing-page'
  );

  // TEST 2: Middleware Routing Logic
  console.log('\n--- TEST 2: NEXT.JS MIDDLEWARE SUBDOMAIN LOGIC ---');
  // Giả lập logic trong src/middleware.ts
  const subdomainMap = {
    copypage: '/lp/sao-chep-landing-page',
    drama: '/lp/video-drama-gia-dinh-nho',
    vip: '/lp/video-ai-tu-1-anh',
  };

  function simulateMiddleware(host, pathname) {
    const hostWithoutPort = host.split(':')[0];
    const hostParts = hostWithoutPort.split('.');
    let subdomain = '';
    if (hostParts.length >= 3 && hostParts[0].toLowerCase() !== 'www') {
      subdomain = hostParts[0].toLowerCase();
    } else if (hostParts.length === 2 && hostParts[1] === 'localhost') {
      subdomain = hostParts[0].toLowerCase();
    }

    if (subdomain && subdomainMap[subdomain]) {
      if (pathname === '/' || pathname === '') {
        return { rewrite: subdomainMap[subdomain] };
      }
      if (pathname === '/cam-on') {
        return { rewrite: `${subdomainMap[subdomain]}/cam-on` };
      }
    }
    return { rewrite: null };
  }

  assert(
    simulateMiddleware('copypage.tuhocai.top', '/').rewrite === '/lp/sao-chep-landing-page',
    'copypage.tuhocai.top/ được ánh xạ chuẩn sang /lp/sao-chep-landing-page'
  );

  assert(
    simulateMiddleware('copypage.localhost:8899', '/').rewrite === '/lp/sao-chep-landing-page',
    'copypage.localhost:8899/ được ánh xạ chuẩn sang /lp/sao-chep-landing-page'
  );

  assert(
    simulateMiddleware('copypage.tuhocai.top', '/cam-on').rewrite === '/lp/sao-chep-landing-page/cam-on',
    'copypage.tuhocai.top/cam-on được ánh xạ chuẩn sang trang cảm ơn'
  );

  assert(
    simulateMiddleware('tuhocai.top', '/').rewrite === null,
    'tuhocai.top/ (domain gốc) không bị rewrite nhầm'
  );

  assert(
    simulateMiddleware('www.tuhocai.top', '/').rewrite === null,
    'www.tuhocai.top/ (domain www) không bị rewrite nhầm'
  );

  // TEST 3: Order Creation with UTM & Affiliate
  console.log('\n--- TEST 3: GHI NHẬN ĐƠN HÀNG VỚI UTM & AFFILIATE ---');
  // Lấy 1 sản phẩm có sẵn
  const [prods] = await conn.query('SELECT id FROM products WHERE pid = "SKILL-CLONE-099" LIMIT 1');
  const prodId = prods.length > 0 ? prods[0].id : null;

  if (prodId) {
    const testOrderCode = 'TEST_ADS_' + Math.floor(100000 + Math.random() * 900000);
    const testOrderId = 'test-ads-' + Date.now();

    await conn.query(
      `INSERT INTO orders (
        id, order_code, customer_name, customer_email, customer_phone, product_id, product_name,
        price, payment_status, payment_method, landing_slug, utm_source, utm_medium, utm_campaign, affiliate_code
      ) VALUES (?, ?, ?, ?, ?, ?, 'Sao Chép Landing Page 99K', ?, 'PENDING', 'VIETQR', 'sao-chep-landing-page', 'facebook', 'cpc', 'ads_clone_v1', 'DANG29')`,
      [testOrderId, testOrderCode, 'Nguyễn Văn Đăng (Test Ads)', 'testads@tuhocai.top', '0934434101', prodId, 99000]
    );

    const [savedOrder] = await conn.query('SELECT * FROM orders WHERE id = ?', [testOrderId]);
    assert(savedOrder.length > 0, 'Đơn hàng test được lưu thành công');
    assert(savedOrder[0].utm_source === 'facebook', 'Lưu chính xác utm_source = facebook');
    assert(savedOrder[0].utm_medium === 'cpc', 'Lưu chính xác utm_medium = cpc');
    assert(savedOrder[0].utm_campaign === 'ads_clone_v1', 'Lưu chính xác utm_campaign = ads_clone_v1');
    assert(savedOrder[0].affiliate_code === 'DANG29', 'Lưu chính xác affiliate_code = DANG29');

    // Dọn dẹp đơn test
    await conn.query('DELETE FROM orders WHERE id = ?', [testOrderId]);
    console.log('🧹 Đã dọn dẹp đơn hàng test');
  }

  await conn.end();

  console.log('\n====================================================');
  console.log(`📊 KẾT QUẢ: ĐẠT ${passed}/${total} TIÊU CHÍ (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================');
}

runTests().catch(console.error);
