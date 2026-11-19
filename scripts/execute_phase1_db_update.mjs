import mysql from 'mysql2/promise';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

async function main() {
  const connection = await mysql.createConnection({ uri: databaseUrl });
  console.log('🔌 Kết nối database thành công...');

  // 1. Cập nhật zalo_group_url thống nhất theo kênh YouTube
  await connection.query(
    'UPDATE site_settings SET svalue = ? WHERE skey = ?',
    ['https://zalo.me/g/qnitrawpaxpvl6aj7ixb', 'zalo_group_url']
  );
  console.log('✅ Đã cập nhật zalo_group_url -> https://zalo.me/g/qnitrawpaxpvl6aj7ixb');

  // 2. Cập nhật sản phẩm: Bỏ giá gạch ngang ảo & đổi tên/định vị tránh rủi ro bản quyền và cam kết ảo
  const updates = [
    {
      pid: 'SKILL-CLONE-099',
      name: 'Skill AI Phân Tích & Tự Dựng Landing Page Chuẩn CRO (99K)',
      description: 'Quy trình AI phân tích cấu trúc, trích xuất bố cục trang bán hàng mẫu và hỗ trợ tự dựng lại landing page chuyên nghiệp cho riêng bạn.',
      original_price: 99000,
    },
    {
      pid: 'WF-VIP-297',
      name: 'Khóa Học & Quy Trình Sản Xuất Video AI Ngắn Bán Hàng Từ 1 Ảnh',
      description: 'Trọn bộ quy trình 5 bước: viết kịch bản giữ chân người xem, giữ nét nhân vật nhất quán và tạo chuyển động video mượt mà bằng AI.',
      original_price: 297000,
    },
    {
      pid: 'WF-DRAMA-069',
      name: 'Quy trình Video AI Câu Chuyện Gia Đình Nhỏ (Mini Drama 69K)',
      description: 'Bộ prompt và quy trình tạo chuỗi video ngắn tình huống gia đình, chia sẻ kịch bản phân cảnh chi tiết dễ làm.',
      original_price: 69000,
    },
    {
      pid: 'COMBO-VIDEO-299',
      name: 'Combo Video AI Sáng Tạo Nội Dung Bán Hàng',
      description: 'Trọn bộ công cụ làm video: Khóa học Video AI từ 1 ảnh, Mini Drama và kho prompt hình ảnh thương mại thực chiến.',
      original_price: 299000,
    },
    {
      pid: 'COMBO-AUTO-349',
      name: 'Combo Super Automation n8n Đa Kênh',
      description: 'Hệ thống tự động hóa đăng bài đa kênh, hỗ trợ chăm sóc fanpage và kịch bản gửi email tự động.',
      original_price: 349000,
    },
    {
      pid: 'PROMPT-VIDEO-001',
      name: 'Bộ Prompt Kịch Bản Video Ngắn TikTok & Reels',
      description: 'Tổng hợp 50+ công thức prompt viết kịch bản video ngắn thu hút 3s đầu cho kênh bán hàng.',
      original_price: 99000,
    },
    {
      pid: 'WF-THAI-099',
      name: 'Workflow n8n Tự Động Đăng Bài Đa Kênh (Facebook, Telegram, WordPress)',
      original_price: 99000,
    },
    {
      pid: 'WF-N8N-001',
      original_price: 199000,
    },
    {
      pid: 'WF-N8N-002',
      original_price: 149000,
    },
    {
      pid: 'SKILL-GPT-001',
      original_price: 149000,
    },
    {
      pid: 'SKILL-CODEX-001',
      original_price: 199000,
    }
  ];

  for (const item of updates) {
    if (item.name && item.description) {
      await connection.query(
        'UPDATE products SET name = ?, description = ?, original_price = ? WHERE pid = ?',
        [item.name, item.description, item.original_price, item.pid]
      );
    } else if (item.name) {
      await connection.query(
        'UPDATE products SET name = ?, original_price = ? WHERE pid = ?',
        [item.name, item.original_price, item.pid]
      );
    } else {
      await connection.query(
        'UPDATE products SET original_price = ? WHERE pid = ?',
        [item.original_price, item.pid]
      );
    }
    console.log(`✅ Đã cập nhật sản phẩm ${item.pid} (Giá chuẩn: original_price = ${item.original_price})`);
  }

  await connection.end();
  console.log('🎉 Hoàn tất cập nhật database Phase 1!');
}

main().catch(console.error);

