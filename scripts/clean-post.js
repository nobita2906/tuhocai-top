const mysql = require('mysql2/promise');
const databaseUrl = process.env.DATABASE_URL || 'mysql://postgress_user:Nvdang%401@103.127.195.56:3306/tuhocai_top';

async function run() {
  const conn = await mysql.createConnection({ uri: databaseUrl });
  
  const [rows] = await conn.execute(
    'SELECT id, slug, title, summary FROM posts WHERE id = "7cc33baa-d3b7-44ed-967c-d7611eabcbed"'
  );
  console.log('Post details:', rows[0]);

  // Clean summary
  if (rows[0].summary && rows[0].summary.toLowerCase().includes('triệu view')) {
    const newSummary = rows[0].summary.replace(/triệu view/gi, 'thu hút khách hàng');
    await conn.execute('UPDATE posts SET summary = ? WHERE id = ?', [newSummary, rows[0].id]);
    console.log('Updated summary successfully!');
  }

  await conn.end();
}

run().catch(console.error);

