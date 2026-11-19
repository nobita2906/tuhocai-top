import mysql from 'mysql2/promise';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

async function main() {
  const connection = await mysql.createConnection({ uri: databaseUrl });

  const [products] = await connection.query('SELECT id, pid, name, slug, price, original_price, category FROM products');
  console.log('=== PRODUCTS IN DB ===');
  console.log(JSON.stringify(products, null, 2));

  const [settings] = await connection.query('SELECT * FROM site_settings');
  console.log('=== SETTINGS IN DB ===');
  console.log(JSON.stringify(settings, null, 2));

  await connection.end();
}

main().catch(console.error);
