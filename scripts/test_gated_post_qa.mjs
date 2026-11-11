import { query, execute } from '../src/lib/db.ts';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

async function createToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

const BASE_URL = 'http://localhost:8899';
const GATED_SLUG = 'quy-trinh-tao-video-ai-trieu-view-tu-1-anh-tinh-tiktok-reels';

async function runQA() {
  console.log('🚀 Bắt đầu chạy Visual & Functional QA: Phân quyền bài viết khóa học...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // TEST 1: Kiểm tra database state
  console.log('📌 Test 1: Kiểm tra cấu hình bài viết trong Database');
  const dbPosts = await query(
    'SELECT id, slug, title, visibility, required_pid FROM posts WHERE slug = ?',
    [GATED_SLUG]
  );
  assert(dbPosts.length > 0, `Tìm thấy bài viết ${GATED_SLUG}`);
  const post = dbPosts[0];
  assert(post.visibility === 'COURSE_BUYERS', `visibility là COURSE_BUYERS (hiện tại: ${post.visibility})`);
  assert(post.required_pid === 'WF-VIP-297', `required_pid là WF-VIP-297 (hiện tại: ${post.required_pid})`);

  // TEST 2: Kiểm tra ẩn khỏi danh sách /bai-viet công khai
  console.log('\n📌 Test 2: Kiểm tra ẩn khỏi trang danh sách /bai-viet');
  const resList = await fetch(`${BASE_URL}/bai-viet`);
  const htmlList = await resList.text();
  assert(resList.status === 200, 'Trang /bai-viet trả về 200 OK');
  assert(!htmlList.includes(GATED_SLUG), `Bài viết ${GATED_SLUG} hoàn toàn KHÔNG xuất hiện trên trang /bai-viet`);

  // TEST 3: Kiểm tra truy cập bởi Khách Vãng Lai / Chưa Mua (Paywall Gate)
  console.log('\n📌 Test 3: Khách vãng lai truy cập bài viết bị khóa');
  const resGuest = await fetch(`${BASE_URL}/bai-viet/${GATED_SLUG}`);
  const htmlGuest = await resGuest.text();
  assert(resGuest.status === 200, 'Truy cập bài viết trả về 200 OK');
  
  // Kiểm tra không để lộ nội dung thực hành nhạy cảm
  assert(!htmlGuest.includes('MỤC 2: LẤY BỘ PROMPT AI THỰC CHIẾN'), 'KHÔNG render vùng prompt thực hành');
  assert(!htmlGuest.includes('Ultra-realistic cinematic shot'), 'KHÔNG để lộ nội dung prompt mật trong DOM');
  
  // Kiểm tra hiển thị Paywall Gate
  assert(htmlGuest.includes('Mở Khóa Toàn Bộ Quy Trình'), 'Hiển thị tiêu đề Paywall Gate');
  assert(htmlGuest.includes('/thanh-toan?pid=WF-VIP-297'), 'Hiển thị nút thanh toán VietQR với PID WF-VIP-297');
  assert(htmlGuest.includes('297.000'), 'Hiển thị giá ưu đãi 297.000đ');
  assert(htmlGuest.includes('Đã mua? Đăng nhập ngay'), 'Hiển thị nút đăng nhập cho học viên đã mua');

  // TEST 4: Kiểm tra truy cập với Admin Session
  console.log('\n📌 Test 4: Quản trị viên (Admin) truy cập bài viết');
  // Lấy hoặc tạo admin session token
  const adminUsers = await query("SELECT id, email, name, role FROM users WHERE role = 'ADMIN' LIMIT 1");
  if (adminUsers.length > 0) {
    const adminUser = adminUsers[0];
    const adminToken = await createToken({
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: 'ADMIN',
    });

    const resAdmin = await fetch(`${BASE_URL}/bai-viet/${GATED_SLUG}`, {
      headers: {
        Cookie: `tuhocai_session=${adminToken}`,
      },
    });
    const htmlAdmin = await resAdmin.text();
    assert(resAdmin.status === 200, 'Admin truy cập trả về 200 OK');
    assert(htmlAdmin.includes('Quản trị viên (Admin)'), 'Hiển thị banner Admin quyền truy cập toàn diện');
    assert(htmlAdmin.includes('ArticleBody') || htmlAdmin.includes('prose') || htmlAdmin.includes('Quy Trình 5 Bước') || htmlAdmin.includes('Bí quyết'), 'Nội dung bài viết được mở khóa 100% cho Admin');
  } else {
    console.log('  ⚠️ Bỏ qua Test 4 do chưa có user ADMIN trong DB');
  }

  // TEST 5: Kiểm tra truy cập với Học Viên đã mua khóa học (trong user_library)
  console.log('\n📌 Test 5: Học viên đã mua khóa học (trong user_library) truy cập bài viết');
  const buyers = await query(`
    SELECT ul.user_id, u.email, u.name, u.role
    FROM user_library ul
    JOIN products p ON ul.product_id = p.id
    JOIN users u ON ul.user_id = u.id
    WHERE p.pid = 'WF-VIP-297' OR p.slug = 'video-ai-tu-1-anh'
    LIMIT 1
  `);

  if (buyers.length > 0) {
    const buyer = buyers[0];
    const buyerToken = await createToken({
      id: buyer.user_id,
      email: buyer.email,
      name: buyer.name,
      role: buyer.role || 'USER',
    });

    const resBuyer = await fetch(`${BASE_URL}/bai-viet/${GATED_SLUG}`, {
      headers: {
        Cookie: `tuhocai_session=${buyerToken}`,
      },
    });
    const htmlBuyer = await resBuyer.text();
    assert(resBuyer.status === 200, 'Học viên truy cập trả về 200 OK');
    assert(htmlBuyer.includes('Học viên VIP chính thức'), 'Hiển thị banner Học viên VIP chính thức');
    assert(!htmlBuyer.includes('Mở Khóa Toàn Bộ Quy Trình & Tài Liệu Thực Chiến'), 'KHÔNG còn hiển thị khung khóa Paywall');
  } else {
    console.log('  ℹ️ Chưa có học viên trong user_library cho WF-VIP-297, tạo giả lập kiểm thử...');
    // Lấy 1 user thường bất kỳ
    const regularUsers = await query("SELECT id, email, name, role FROM users WHERE role = 'USER' LIMIT 1");
    if (regularUsers.length > 0) {
      const u = regularUsers[0];
      const p = await query("SELECT id FROM products WHERE pid = 'WF-VIP-297' LIMIT 1");
      if (p.length > 0) {
        // Tạm insert vào user_library
        const tempLibId = 'test-qa-' + Date.now();
        await execute(
          'INSERT INTO user_library (id, user_id, product_id, unlocked_at) VALUES (?, ?, ?, NOW())',
          [tempLibId, u.id, p[0].id]
        );

        const buyerToken = await createToken({
          id: u.id,
          email: u.email,
          name: u.name,
          role: 'USER',
        });

        const resBuyer = await fetch(`${BASE_URL}/bai-viet/${GATED_SLUG}`, {
          headers: {
            Cookie: `tuhocai_session=${buyerToken}`,
          },
        });
        const htmlBuyer = await resBuyer.text();
        assert(htmlBuyer.includes('Học viên VIP chính thức'), 'Hiển thị banner Học viên VIP chính thức');
        assert(!htmlBuyer.includes('Mở Khóa Toàn Bộ Quy Trình & Tài Liệu Thực Chiến'), 'KHÔNG còn hiển thị khung khóa Paywall');

        // Cleanup
        await execute('DELETE FROM user_library WHERE id = ?', [tempLibId]);
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`📊 TỔNG KẾT QA: ${passed} PASS, ${failed} FAIL`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runQA().catch((err) => {
  console.error('QA Script Error:', err);
  process.exit(1);
});
