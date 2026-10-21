/**
 * ============================================================
 * Google Apps Script: relabel-blogger-posts.gs
 * Blog: Nguyễn Đăng AI (nguyendangai.blogspot.com)
 *
 * Mục đích: Tự động đổi nhãn (Labels) cho TẤT CẢ bài viết
 * đang có trên Blogger theo cấu trúc danh mục mới.
 *
 * Cách sử dụng:
 *   1. Mở script.google.com > Tạo project mới
 *   2. Paste toàn bộ nội dung file này vào
 *   3. Bật Blogger API:
 *      - Vào Extensions > Apps Script
 *      - Services (+) > Blogger API v3 > Add
 *   4. Chỉnh sửa BLOG_ID bên dưới
 *   5. Chạy hàm runRelabelAllPosts() trước tiên với DRY_RUN = true
 *   6. Kiểm tra log, nếu đúng ý thì đặt DRY_RUN = false và chạy lại
 * ============================================================
 */

// ============================================================
// CẤU HÌNH — SỬA TẠI ĐÂY
// ============================================================

// Tìm Blog ID: vào blogger.com > chọn blog > URL có dạng
// blogger.com/blog/posts/1234567890 → Blog ID = 1234567890
const BLOG_ID = 'BLOG_ID_CUA_BAN';  // ← Thay bằng Blog ID thật

// Đặt thành true để xem trước (không thay đổi thật)
const DRY_RUN = true;

// ============================================================
// BẢNG ĐỔI NHÃN
// ============================================================
const LABEL_MAP = {
  // Nhãn cũ            : Nhãn mới
  'Template n8n'        : 'Workflow',
  'Chia sẻ quy trình'   : 'Workflow',
  'Hướng dẫn'           : 'Skill',
  'Công cụ hình ảnh Ai' : 'Skill',
  'Tin tức Ai'          : 'Skill',
  'Image Prompt'        : 'Image Prompt',   // Giữ nguyên
  'Cửa hàng'            : 'Sản phẩm',
};

// Nhãn cũ nào cần XÓA hoàn toàn (không map sang nhãn mới nào)
const LABELS_TO_REMOVE = [
  // Thêm nhãn vào đây nếu muốn xóa, ví dụ:
  // 'Uncategorized',
];

// ============================================================
// HÀM CHÍNH — CHẠY HÀM NÀY
// ============================================================
function runRelabelAllPosts() {
  if (BLOG_ID === 'BLOG_ID_CUA_BAN') {
    Logger.log('❌ LỖI: Bạn chưa điền BLOG_ID. Mở script và sửa dòng const BLOG_ID.');
    return;
  }

  Logger.log('='.repeat(60));
  Logger.log('Nguyễn Đăng AI — Label Relabeler');
  Logger.log(DRY_RUN ? '[DRY RUN — Không thay đổi thật]' : '[LIVE — Đang thay đổi thật sự!]');
  Logger.log('='.repeat(60));

  let pageToken = null;
  let totalPosts = 0;
  let changedPosts = 0;

  do {
    const params = {
      maxResults: 50,
      status: 'live,draft',
      fields: 'items(id,title,labels),nextPageToken',
    };
    if (pageToken) params.pageToken = pageToken;

    let response;
    try {
      response = Blogger.Posts.list(BLOG_ID, params);
    } catch (e) {
      Logger.log('❌ Lỗi khi gọi Blogger API: ' + e.message);
      Logger.log('Đảm bảo đã bật Blogger API v3 trong Services.');
      return;
    }

    const posts = response.items || [];
    pageToken = response.nextPageToken;
    totalPosts += posts.length;

    for (const post of posts) {
      const oldLabels = post.labels || [];
      const newLabels = remapLabels(oldLabels);

      const changed = JSON.stringify(oldLabels.sort()) !== JSON.stringify(newLabels.sort());

      if (changed) {
        Logger.log(`\n📝 Bài: "${post.title.substring(0, 60)}..."`);
        Logger.log(`   Nhãn cũ: [${oldLabels.join(', ')}]`);
        Logger.log(`   Nhãn mới: [${newLabels.join(', ')}]`);

        if (!DRY_RUN) {
          try {
            Blogger.Posts.patch({ labels: newLabels }, BLOG_ID, post.id);
            Logger.log('   ✅ Đã cập nhật thành công');
            Utilities.sleep(500); // Tránh rate limit
          } catch (e) {
            Logger.log('   ❌ Lỗi khi cập nhật: ' + e.message);
          }
        }
        changedPosts++;
      }
    }

  } while (pageToken);

  Logger.log('\n' + '='.repeat(60));
  Logger.log(`Tổng bài đã xét  : ${totalPosts}`);
  Logger.log(`Bài cần đổi nhãn : ${changedPosts}`);
  if (DRY_RUN) {
    Logger.log('\n⚠️  Đây là DRY RUN — Chưa có gì thay đổi thật sự.');
    Logger.log('Đặt DRY_RUN = false và chạy lại để áp dụng.');
  } else {
    Logger.log('\n🎉 Hoàn tất! Kiểm tra blog tại nguyendangai.blogspot.com');
  }
  Logger.log('='.repeat(60));
}

// ============================================================
// HÀM PHỤ: Tính toán nhãn mới từ nhãn cũ
// ============================================================
function remapLabels(oldLabels) {
  const newSet = new Set();

  for (const label of oldLabels) {
    // Kiểm tra xóa
    if (LABELS_TO_REMOVE.includes(label)) continue;

    // Kiểm tra đổi nhãn
    if (LABEL_MAP.hasOwnProperty(label)) {
      newSet.add(LABEL_MAP[label]);
    } else {
      // Giữ nguyên nhãn không có trong bảng map
      newSet.add(label);
    }
  }

  return Array.from(newSet);
}

// ============================================================
// HÀM PHỤ: Đổi nhãn cho 1 bài cụ thể theo Post ID
// ============================================================
function relabelSinglePost(postId, newLabels) {
  try {
    const result = Blogger.Posts.patch({ labels: newLabels }, BLOG_ID, postId);
    Logger.log(`✅ Đã đổi nhãn bài ${postId}: [${newLabels.join(', ')}]`);
    return result;
  } catch (e) {
    Logger.log(`❌ Lỗi: ${e.message}`);
  }
}

// ============================================================
// HÀM PHỤ: Liệt kê tất cả nhãn hiện có trên blog
// ============================================================
function listAllCurrentLabels() {
  Logger.log('Đang lấy danh sách tất cả nhãn hiện có...');
  const labelCount = {};
  let pageToken = null;

  do {
    const params = { maxResults: 50, fields: 'items(labels),nextPageToken' };
    if (pageToken) params.pageToken = pageToken;
    const response = Blogger.Posts.list(BLOG_ID, params);
    const posts = response.items || [];
    pageToken = response.nextPageToken;

    for (const post of posts) {
      for (const label of (post.labels || [])) {
        labelCount[label] = (labelCount[label] || 0) + 1;
      }
    }
  } while (pageToken);

  Logger.log('\n📋 Danh sách nhãn hiện tại:');
  const sorted = Object.entries(labelCount).sort((a, b) => b[1] - a[1]);
  for (const [label, count] of sorted) {
    Logger.log(`  ${count.toString().padStart(4)} bài  →  "${label}"`);
  }
}
