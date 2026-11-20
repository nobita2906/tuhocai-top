const mysql = require('mysql2/promise');

const databaseUrl = process.env.DATABASE_URL || 'mysql://postgress_user:Nvdang%401@103.127.195.56:3306/tuhocai_top';

async function run() {
  const conn = await mysql.createConnection({ uri: databaseUrl });
  
  const [posts] = await conn.execute(
    'SELECT id, slug, title, summary FROM posts WHERE title LIKE ? OR summary LIKE ?',
    ['%triệu view%', '%triệu view%']
  );
  console.log('Posts count:', posts.length);
  posts.forEach(p => console.log('POST:', p.id, p.slug, p.title));

  const [products] = await conn.execute(
    'SELECT id, pid, slug, name, description FROM products WHERE name LIKE ? OR description LIKE ?',
    ['%triệu view%', '%triệu view%']
  );
  console.log('Products count:', products.length);
  products.forEach(p => console.log('PROD:', p.id, p.pid, p.slug, p.name));

  await conn.end();
}

run().catch(console.error);
