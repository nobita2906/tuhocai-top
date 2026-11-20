const mysql = require('mysql2/promise');
const databaseUrl = process.env.DATABASE_URL || 'mysql://postgress_user:Nvdang%401@103.127.195.56:3306/tuhocai_top';

async function run() {
  const conn = await mysql.createConnection({ uri: databaseUrl });
  
  await conn.execute(
    'UPDATE posts SET slug = "quy-trinh-tao-video-ai-ban-hang-tu-1-anh-tinh-tiktok-reels" WHERE id = "7cc33baa-d3b7-44ed-967c-d7611eabcbed"'
  );
  console.log('Updated slug successfully!');

  await conn.end();
}

run().catch(console.error);

