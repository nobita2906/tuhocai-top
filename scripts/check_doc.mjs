import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  const db = await mysql.createConnection(process.env.DATABASE_URL || 'mysql://root:123456@localhost:3306/tuhocai_db');
  const [docs] = await db.query('SELECT * FROM internal_docs WHERE id = ?', ['6ae0184e-0aa1-420a-a60d-5b2f322a4393']);
  console.log('Doc 6ae0184e:\n', docs[0].content);
  await db.end();
}
check();

