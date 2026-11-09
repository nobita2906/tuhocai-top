import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function updatePost() {
  const connectionUrl = process.env.DATABASE_URL || 'mysql://root:123456@localhost:3306/tuhocai_db';
  const db = await mysql.createConnection(connectionUrl);

  const [posts] = await db.query('SELECT * FROM posts WHERE id = ?', ['7cc33baa-d3b7-44ed-967c-d7611eabcbed']);
  if (!posts.length) {
    console.error('Post not found');
    process.exit(1);
  }

  const post = posts[0];
  let content = post.content;

  const downloadBox = `
> 📥 **Tài Liệu Độc Quyền Đi Kèm Bài Viết:**  
> Học viên có thể tải ngay bản in **Cẩm Nang Quy Trình Làm Video AI Triệu View Từ 1 Ảnh Tĩnh (PDF)** và **Bộ Mega-Prompt Kịch Bản & Câu Lệnh Studio 9:16 (JSON)** trực tiếp trong khu vực học tập:  
> - 📄 [Tải Cẩm Nang Thực Chiến PDF (576 KB)](/uploads/classroom/Quy-Trinh-Video-AI-Trieu-View-Tu-1-Anh-Nguyen-Dang-AI-2026.pdf)  
> - 🎓 [Truy cập phòng học thực hành chi tiết](/dashboard/hoc/video-ai-tu-1-anh)  
`;

  if (!content.includes('Tải Cẩm Nang Thực Chiến PDF')) {
    content = content.replace('## 1. Cuộc Cách Mạng Video AI Từ 1 Ảnh Tĩnh', `${downloadBox}\n## 1. Cuộc Cách Mạng Video AI Từ 1 Ảnh Tĩnh`);
    await db.query('UPDATE posts SET content = ? WHERE id = ?', [content, post.id]);
    console.log('✅ Post content updated with classroom resource links!');
  } else {
    console.log('Post already contains resource links.');
  }

  await db.end();
}

updatePost().catch(console.error);

