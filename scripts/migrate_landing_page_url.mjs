import { query, execute } from '../src/lib/db.ts';

async function main() {
  console.log('--- 1. Kiểm tra cột landing_page_url trong bảng products ---');
  const cols = await query("DESCRIBE products");
  const colNames = cols.map((c) => c.Field);
  
  if (!colNames.includes('landing_page_url')) {
    console.log('Cột landing_page_url chưa có. Tiến hành ALTER TABLE...');
    await execute("ALTER TABLE products ADD COLUMN landing_page_url VARCHAR(255) NULL AFTER preview_url");
    console.log('Đã thêm cột landing_page_url thành công!');
  } else {
    console.log('Cột landing_page_url đã tồn tại.');
  }

  console.log('--- 2. Cập nhật dữ liệu Landing Page cho các sản phẩm chủ lực ---');
  // Cập nhật cho WF-VIP-297 (Video AI 1 ảnh)
  await execute(
    "UPDATE products SET landing_page_url = '/lp/video-ai-tu-1-anh' WHERE pid = 'WF-VIP-297' OR slug = 'video-ai-tu-1-anh'"
  );
  // Cập nhật cho WF-DRAMA-069 (Video Drama gia đình nhỏ)
  await execute(
    "UPDATE products SET landing_page_url = '/lp/video-drama-gia-dinh-nho' WHERE pid = 'WF-DRAMA-069' OR slug = 'video-drama-gia-dinh-nho'"
  );
  // Cập nhật cho SKILL-CLONE-099 (Sao chép landing page)
  await execute(
    "UPDATE products SET landing_page_url = '/lp/sao-chep-landing-page' WHERE pid = 'SKILL-CLONE-099' OR slug = 'sao-chep-landing-page'"
  );

  // Kiểm tra bảng landing_pages xem có LP nào khác khớp với product không
  const lps = await query("SELECT id, slug, product_id, is_published FROM landing_pages WHERE is_published = 1");
  for (const lp of lps) {
    if (lp.product_id) {
      await execute(
        "UPDATE products SET landing_page_url = ? WHERE (id = ? OR pid = ? OR slug = ?) AND (landing_page_url IS NULL OR landing_page_url = '')",
        [`/lp/${lp.slug}`, lp.product_id, lp.product_id, lp.slug]
      );
    }
  }

  const updatedProducts = await query("SELECT id, pid, name, slug, landing_page_url FROM products WHERE landing_page_url IS NOT NULL");
  console.log('Danh sách sản phẩm có Landing Page sau khi update:');
  console.table(updatedProducts);
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});

