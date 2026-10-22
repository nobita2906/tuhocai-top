const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: '103.127.195.56',
    port: 3306,
    user: 'postgress_user',
    password: 'Nvdang@1',
    database: 'tuhocai_top'
  });

  await conn.query(`
    UPDATE products 
    SET download_url = 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing'
    WHERE download_url IS NULL OR download_url = ''
  `);

  const [rows] = await conn.query('SELECT pid, name, download_url FROM products LIMIT 3');
  console.log('Updated products successfully:', rows);
  await conn.end();
}

run().catch(console.error);
