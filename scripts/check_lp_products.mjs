import { query } from '../src/lib/db.ts';

async function main() {
  const lps = await query("SELECT id, slug, title, product_id, is_published FROM landing_pages");
  console.log('Existing LPs in DB:', lps);

  const products = await query("SELECT id, pid, name, slug, category, preview_url FROM products");
  console.log('Products count:', products.length);
  for (const p of products) {
    console.log(`[${p.pid}] ${p.name} | slug: ${p.slug} | cat: ${p.category} | preview: ${p.preview_url}`);
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
