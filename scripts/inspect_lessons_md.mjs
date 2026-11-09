import { query } from '../src/lib/db.ts';

async function check() {
  const lessons = await query(
    'SELECT id, title, content_markdown FROM course_lessons WHERE course_id = ? ORDER BY sort_order',
    ['db11d5a0-49b8-44c0-82e8-63c284724c31']
  );
  console.log(`Found ${lessons.length} lessons`);
  lessons.forEach((l, i) => {
    console.log(`\n[${i+1}] ${l.id} - ${l.title}`);
    console.log(l.content_markdown || '(no markdown)');
  });
}

check();

