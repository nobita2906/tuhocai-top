import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  const db = await mysql.createConnection(process.env.DATABASE_URL || 'mysql://root:123456@localhost:3306/tuhocai_db');
  const [post] = await db.query('SELECT * FROM posts WHERE id = ?', ['7cc33baa-d3b7-44ed-967c-d7611eabcbed']);
  console.log('Post Title:', post[0].title);
  console.log('Post Content:\n', post[0].content);
  await db.end();
}
check();

