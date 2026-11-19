import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

async function main() {
  const connection = await mysql.createConnection({ uri: databaseUrl });
  console.log('🔌 Kết nối database thành công...');

  // 1. Cập nhật slug của COMBO-VIDEO-299 sang tên chuẩn không còn từ "trieu-view"
  await connection.query(
    'UPDATE products SET slug = ? WHERE pid = ?',
    ['combo-video-ai-ban-hang', 'COMBO-VIDEO-299']
  );
  console.log('✅ Đã cập nhật slug COMBO-VIDEO-299 -> combo-video-ai-ban-hang');

  // 2. Cập nhật bài viết gỡ bỏ "Triệu View"
  await connection.query(
    'UPDATE posts SET title = ? WHERE slug LIKE ? OR title LIKE ?',
    [
      'Quy Trình Tạo Video AI Bán Hàng Từ 1 Ảnh Tĩnh: Hướng Dẫn Từng Bước Cho TikTok & Reels',
      '%trieu-view%',
      '%Triệu View%'
    ]
  );
  console.log('✅ Đã cập nhật tiêu đề bài viết không còn từ "Triệu View"');

  // 3. Thêm hoặc cập nhật sản phẩm đầu vào cho Dân Văn Phòng & Người Mới (69K)
  const [existingOffice] = await connection.query('SELECT id FROM products WHERE pid = ?', ['PACK-OFFICE-069']);
  if (!Array.isArray(existingOffice) || existingOffice.length === 0) {
    await connection.query(`
      INSERT INTO products (id, pid, name, slug, description, price, original_price, category, is_active, sales_count, download_url, thumbnail, created_at)
      VALUES (UUID(), 'PACK-OFFICE-069', 'Bộ Prompt & Skill AI Văn Phòng 4.0: Tối Ưu Năng Suất', 'bo-prompt-ai-van-phong', 'Bộ hơn 50+ prompt và quy trình ứng dụng ChatGPT, Claude & Gemini thực chiến cho dân văn phòng: soạn thảo văn bản, viết email đối tác, tóm tắt biên bản họp và xử lý dữ liệu Excel/Sheets chỉ trong 5 phút.', 69000, 69000, 'skill', TRUE, 42, 'https://drive.google.com/drive/folders/1TuhocAI_OfficePack_2026?usp=sharing', '/images/products/skill-chatgpt.svg', NOW())
    `);
    console.log('✅ Đã tạo mới sản phẩm đầu vào PACK-OFFICE-069 (69K)');
  } else {
    await connection.query(`
      UPDATE products SET 
        name = 'Bộ Prompt & Skill AI Văn Phòng 4.0: Tối Ưu Năng Suất',
        slug = 'bo-prompt-ai-van-phong',
        price = 69000,
        original_price = 69000,
        description = 'Bộ hơn 50+ prompt và quy trình ứng dụng ChatGPT, Claude & Gemini thực chiến cho dân văn phòng: soạn thảo văn bản, viết email đối tác, tóm tắt biên bản họp và xử lý dữ liệu Excel/Sheets chỉ trong 5 phút.'
      WHERE pid = 'PACK-OFFICE-069'
    `);
    console.log('✅ Đã cập nhật sản phẩm PACK-OFFICE-069 (69K)');
  }

  // 4. Cập nhật SKILL-CLONE-099 đảm bảo original_price = 99000 (không giá gạch ngang ảo)
  await connection.query(
    'UPDATE products SET original_price = 99000 WHERE pid = ?',
    ['SKILL-CLONE-099']
  );
  console.log('✅ Đã chuẩn hóa original_price = 99000 cho SKILL-CLONE-099');

  await connection.end();
  console.log('🎉 Hoàn tất cập nhật DB!');
}

main().catch(console.error);
