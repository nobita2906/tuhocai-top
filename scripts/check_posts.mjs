import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  const db = await mysql.createConnection(process.env.DATABASE_URL || 'mysql://root:123456@localhost:3306/tuhocai_db');
  const [posts] = await db.query("SELECT id, title, slug FROM posts WHERE title LIKE '%Video%' OR title LIKE '%Ảnh%' OR title LIKE '%Triệu%'");
  console.log('Posts matching:', posts);
  const [allPosts] = await db.query('SELECT id, title, slug FROM posts');
  console.log('All posts count:', allPosts.length);
  for (const p of allPosts) {
    console.log(`- [${p.id}] ${p.title} (${p.slug})`);
  }
  await db.end();
}
check();

