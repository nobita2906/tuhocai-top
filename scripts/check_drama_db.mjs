import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL || {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tuhocai',
    port: Number(process.env.DB_PORT) || 3306,
  });

  const [rows] = await connection.query('SELECT * FROM landing_pages WHERE slug = ?', ['video-drama-gia-dinh-nho']);
  console.log(JSON.stringify(rows[0], null, 2));

  await connection.end();
}

main().catch(console.error);
