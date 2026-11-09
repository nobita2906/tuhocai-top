import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  const connectionUrl = process.env.DATABASE_URL || 'mysql://root:123456@localhost:3306/tuhocai_db';
  const db = await mysql.createConnection(connectionUrl);
  
  const [courses] = await db.query('SELECT * FROM courses WHERE slug = "video-ai-tu-1-anh"');
  console.log('Course:', courses[0]);

  const [modules] = await db.query('SELECT * FROM course_modules WHERE course_id = ? ORDER BY sort_order ASC', [courses[0].id]);
  console.log('Modules count:', modules.length);
  for (const m of modules) {
    console.log(`Module: [${m.id}] ${m.title}`);
    const [lessons] = await db.query('SELECT id, title, duration, video_url, resources, action_checklist, summary FROM course_lessons WHERE module_id = ? ORDER BY sort_order ASC', [m.id]);
    for (const l of lessons) {
      console.log(`  Lesson: [${l.id}] ${l.title} (video: ${l.video_url})`);
      console.log(`    Resources:`, l.resources);
      console.log(`    Checklist:`, l.action_checklist);
    }
  }

  const [products] = await db.query('SELECT * FROM products WHERE pid = "WF-VIP-297"');
  console.log('Product WF-VIP-297:', products[0]);

  await db.end();
}

check().catch(console.error);
