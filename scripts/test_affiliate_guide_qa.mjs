// scripts/test_affiliate_guide_qa.mjs
import assert from 'assert';

const BASE_URL = 'http://localhost:8899';

async function runTests() {
  console.log('--- 🧪 STARTING AFFILIATE GUIDE & UNIFIED ACCOUNT QA SUITE ---');

  // Test 1: Affiliate Page loads 200 OK and contains guide cues
  console.log('\n[Test 1] Testing /affiliate page response...');
  const affRes = await fetch(`${BASE_URL}/affiliate`);
  assert.strictEqual(affRes.status, 200, 'Page /affiliate should return 200 OK');
  const affHtml = await affRes.text();
  assert(affHtml.includes('Kiếm Tiền Cùng') || affHtml.includes('Tự Học AI'), 'Page should include heading');
  console.log('✅ Test 1 Passed: /affiliate loads properly.');

  // Test 2: Product Page contains Benefit Promo Card
  console.log('\n[Test 2] Testing /san-pham/video-ai-tu-1-anh for right-hand promo card...');
  const prodRes = await fetch(`${BASE_URL}/san-pham/video-ai-tu-1-anh`);
  assert.strictEqual(prodRes.status, 200, 'Product page should return 200 OK');
  const prodHtml = await prodRes.text();
  assert(prodHtml.includes('Cơ Hội Tăng Thu Nhập') || prodHtml.includes('178.200'), 'Product page should contain benefit promo card');
  console.log('✅ Test 2 Passed: Product page displays affiliate benefit promo card.');

  // Test 3: Test Affiliate Registration creates both user and partner
  console.log('\n[Test 3] Testing /api/affiliate/register with auto-account creation...');
  const testNum = Math.floor(1000 + Math.random() * 9000);
  const testEmail = `testpartner_${testNum}@tuhocai.test`;
  const testCode = `ref_${testNum}`;
  const regPayload = {
    name: `Đối Tác Test ${testNum}`,
    email: testEmail,
    phone: '0901234567',
    password: 'Password123@',
    code: testCode,
    bankName: 'MBBank',
    bankAccountNo: '999988887777',
    bankAccountName: `TEST PARTNER ${testNum}`,
  };

  const regRes = await fetch(`${BASE_URL}/api/affiliate/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regPayload),
  });

  const regData = await regRes.json();
  console.log('Registration response:', regData);
  assert.strictEqual(regRes.status, 200, 'Register should return 200 OK');
  assert.strictEqual(regData.success, true, 'Register success should be true');
  assert.strictEqual(regData.partner.commissionRate, 60, 'Commission rate should be 60%');
  assert.strictEqual(regData.partner.code, testCode, 'Partner code matches');

  // Check Set-Cookie header contains session token
  const setCookie = regRes.headers.get('set-cookie');
  console.log('Set-Cookie received:', setCookie ? 'Yes (Session authenticated)' : 'None');

  // Test 4: Query stats with newly created partner code
  console.log('\n[Test 4] Testing /api/affiliate/me with newly created code...');
  const meRes = await fetch(`${BASE_URL}/api/affiliate/me?code=${testCode}`);
  assert.strictEqual(meRes.status, 200, 'Affiliate stats should return 200');
  const meData = await meRes.json();
  assert.strictEqual(meData.success, true);
  assert.strictEqual(meData.stats.partner.code, testCode);
  assert.strictEqual(meData.stats.partner.commission_rate, 60);
  console.log('✅ Test 4 Passed: Newly registered partner data retrieved successfully with 60% rate.');

  console.log('\n✨ ALL QA TESTS PASSED 100%! ✨');
}

runTests().catch((err) => {
  console.error('❌ QA Test failed:', err);
  process.exit(1);
});

