import { query } from '../src/lib/db.ts';

async function test() {
  const courses = await query('SELECT id, slug, title FROM courses');
  console.log('Courses in DB:');
  courses.forEach(c => console.log('course:', c.id, c.slug, c.title));

  const lessons = await query('SELECT id, course_id, module_id, title FROM course_lessons');
  console.log('\nLessons in DB:');
  lessons.forEach(l => console.log('lesson:', l.id, 'course_id:', l.course_id, 'mod:', l.module_id, l.title));
}

test();

