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
  console.log('🎓 BẮT ĐẦU KIỂM TRA DASHBOARD SKOOL CLASSROOM QA');
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

  // 1. Prepare Auth
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

  // 2. Test Page HTTP 200 Rendering
  console.log('--- 1. Kiểm tra Render các trang Skool Classroom ---');
  const pages = [
    '/dashboard',
    '/dashboard/hoc/video-ai-tu-1-anh',
    '/dashboard/hoc/workflow-n8n-tu-dong-dang-bai-da-kenh',
    '/dashboard/hoc/app-flow-google-auto-bao-cao-sheets',
    '/dashboard/hoc/video-drama-gia-dinh-nho',
  ];

  for (const page of pages) {
    try {
      const res = await fetch(`${BASE_URL}${page}`, { headers: authHeaders });
      assert(res.status === 200, `Trang ${page} trả về HTTP 200 OK`);
    } catch (e) {
      assert(false, `Lỗi truy cập trang ${page}: ${e.message}`);
    }
  }

  // 3. Test GET /api/dashboard/classroom
  console.log('\n--- 2. Kiểm tra API Tổng quan Classroom (/api/dashboard/classroom) ---');
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard/classroom`, { headers: authHeaders });
    assert(res.status === 200, 'API /api/dashboard/classroom trả về HTTP 200');
    const data = await res.json();
    assert(data.success === true, 'Trả về kết quả success: true');
    assert(Array.isArray(data.courses) && data.courses.length >= 4, `Trả về danh sách ${data.courses?.length} khóa học`);
    assert(typeof data.stats?.points === 'number', `Thống kê điểm số hợp lệ: ${data.stats?.points} pts`);
    assert(!!data.stats?.levelName, `Thống kê cấp bậc Skool hợp lệ: ${data.stats?.levelName}`);
  } catch (e) {
    assert(false, `Lỗi API classroom: ${e.message}`);
  }

  // 4. Test GET /api/dashboard/classroom/[courseSlug]
  console.log('\n--- 3. Kiểm tra API Chi tiết khóa học (/api/dashboard/classroom/[courseSlug]) ---');
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard/classroom/video-ai-tu-1-anh`, { headers: authHeaders });
    assert(res.status === 200, 'API chi tiết khóa học trả về HTTP 200');
    const data = await res.json();
    assert(data.success === true, 'Chi tiết khóa học success: true');
    assert(data.course?.slug === 'video-ai-tu-1-anh', 'Slug khóa học khớp chính xác');
    assert(Array.isArray(data.course?.modules) && data.course.modules.length > 0, `Có ${data.course?.modules.length} modules bài học`);
    
    const firstLesson = data.course.modules[0]?.lessons[0];
    assert(!!firstLesson?.title, `Bài học có tiêu đề: "${firstLesson?.title}"`);
    assert(!!firstLesson?.videoUrl, `Bài học có link video embed: ${firstLesson?.videoUrl}`);
    assert(Array.isArray(firstLesson?.actionChecklist), 'Bài học có checklist hành động thực chiến');
    assert(Array.isArray(firstLesson?.resources), 'Bài học có danh sách tài nguyên đính kèm');
  } catch (e) {
    assert(false, `Lỗi API chi tiết khóa học: ${e.message}`);
  }

  // 5. Test 0đ course auto-unlocked
  console.log('\n--- 4. Kiểm tra Khóa học 0đ tự động mở khóa ---');
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard/classroom/app-flow-google-auto-bao-cao-sheets`, { headers: authHeaders });
    const data = await res.json();
    assert(data.course?.isUnlocked === true, 'Khóa học 0đ được mở khóa tự động (isUnlocked = true)');
  } catch (e) {
    assert(false, `Lỗi kiểm tra khóa 0đ: ${e.message}`);
  }

  // 6. Test Mark as Done Progress API (POST /api/dashboard/classroom/progress)
  console.log('\n--- 5. Kiểm tra Đánh dấu hoàn thành bài học (Mark as Done) ---');
  try {
    // Mark as done
    const markRes = await fetch(`${BASE_URL}/api/dashboard/classroom/progress`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        courseSlug: 'video-ai-tu-1-anh',
        lessonId: 'lesson-1-1',
        completed: true,
      }),
    });

    assert(markRes.status === 200, 'POST progress trả về HTTP 200');
    const markData = await markRes.json();
    assert(markData.success === true, 'Đánh dấu hoàn thành thành công');
    assert(markData.isCompleted === true, 'Trạng thái isCompleted là true');
    assert(markData.progressPercent > 0, `Tiến độ khóa học tăng lên: ${markData.progressPercent}%`);

    // Verify progress reflected in course detail
    const detailRes = await fetch(`${BASE_URL}/api/dashboard/classroom/video-ai-tu-1-anh`, { headers: authHeaders });
    const detailData = await detailRes.json();
    const lesson1 = detailData.course.modules[0].lessons[0];
    assert(lesson1.isCompleted === true, 'Bài học 1.1 được ghi nhận isCompleted = true trong database');

    // Toggle undo (Bỏ đánh dấu)
    const undoRes = await fetch(`${BASE_URL}/api/dashboard/classroom/progress`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        courseSlug: 'video-ai-tu-1-anh',
        lessonId: 'lesson-1-1',
        completed: false,
      }),
    });
    const undoData = await undoRes.json();
    assert(undoData.isCompleted === false, 'Đã bỏ đánh dấu thành công (Undo)');
  } catch (e) {
    assert(false, `Lỗi test Progress API: ${e.message}`);
  }

  console.log('\n====================================================');
  console.log(`📊 TỔNG KẾT: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================');

  if (passed === total) {
    console.log('🎉 TẤT CẢ TÍNH NĂNG SKOOL CLASSROOM ĐÃ ĐẠT CHUẨN 100%!');
    process.exit(0);
  } else {
    console.error('❌ MỘT SỐ KIỂM TRA THẤT BẠI!');
    process.exit(1);
  }
}

runTests();

