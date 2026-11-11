import { execute, query } from '../src/lib/db.ts';

async function main() {
  try {
    await execute("ALTER TABLE posts ADD COLUMN visibility VARCHAR(50) DEFAULT 'PUBLIC' AFTER category");
    console.log('✅ Added visibility to posts');
  } catch (e) {
    console.log('posts.visibility status:', e.message);
  }

  try {
    await execute("ALTER TABLE posts ADD COLUMN required_pid VARCHAR(100) DEFAULT NULL AFTER visibility");
    console.log('✅ Added required_pid to posts');
  } catch (e) {
    console.log('posts.required_pid status:', e.message);
  }

  // Cập nhật bài viết quy trình tạo video AI thành COURSE_BUYERS, required_pid = WF-VIP-297
  await execute(`
    UPDATE posts 
    SET visibility = 'COURSE_BUYERS', required_pid = 'WF-VIP-297' 
    WHERE slug = 'quy-trinh-tao-video-ai-trieu-view-tu-1-anh-tinh-tiktok-reels'
  `);
  console.log('✅ Updated post quy-trinh-tao-video-ai-trieu-view-tu-1-anh-tinh-tiktok-reels to COURSE_BUYERS (WF-VIP-297)');

  const res = await query("SELECT slug, title, visibility, required_pid FROM posts WHERE slug = 'quy-trinh-tao-video-ai-trieu-view-tu-1-anh-tinh-tiktok-reels'");
  console.log('Post status:', JSON.stringify(res, null, 2));

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

