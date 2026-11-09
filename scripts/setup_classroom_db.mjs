import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { COURSES } from '../src/lib/classroomData.ts';

dotenv.config();

async function main() {
  console.log('🔄 Đang kết nối MySQL để khởi tạo các bảng Khu Vực Học Tập...');
  const connection = await mysql.createConnection(process.env.DATABASE_URL || {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tuhocai',
    port: Number(process.env.DB_PORT) || 3306,
  });

  // 1. Tạo bảng courses
  await connection.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(36) PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      pid VARCHAR(100) DEFAULT NULL,
      title VARCHAR(255) NOT NULL,
      headline TEXT,
      category VARCHAR(50) DEFAULT 'course',
      price INT DEFAULT 0,
      level VARCHAR(100) DEFAULT 'Thực chiến A-Z',
      thumbnail VARCHAR(500) DEFAULT '',
      instructor VARCHAR(255) DEFAULT 'Tự Học AI',
      is_published BOOLEAN DEFAULT TRUE,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✓ Bảng `courses` sẵn sàng.');

  // 2. Tạo bảng course_modules
  await connection.query(`
    CREATE TABLE IF NOT EXISTS course_modules (
      id VARCHAR(36) PRIMARY KEY,
      course_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_course_id (course_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✓ Bảng `course_modules` sẵn sàng.');

  // 3. Tạo bảng course_lessons
  await connection.query(`
    CREATE TABLE IF NOT EXISTS course_lessons (
      id VARCHAR(36) PRIMARY KEY,
      course_id VARCHAR(36) NOT NULL,
      module_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      duration VARCHAR(50) DEFAULT '10:00',
      video_url VARCHAR(500) DEFAULT '',
      summary TEXT,
      content_markdown LONGTEXT,
      action_checklist JSON DEFAULT NULL,
      resources JSON DEFAULT NULL,
      sort_order INT DEFAULT 0,
      is_free_preview BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_module_id (module_id),
      INDEX idx_course_id (course_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✓ Bảng `course_lessons` sẵn sàng.');

  // 4. Kiểm tra xem đã có dữ liệu chưa, nếu chưa thì seed từ classroomData
  const [existingCourses] = await connection.query('SELECT COUNT(*) as count FROM courses');
  if (existingCourses[0].count === 0) {
    console.log(`📥 Đang nạp ${COURSES.length} khóa học ban đầu từ classroomData.ts vào Database...`);

    for (let cIdx = 0; cIdx < COURSES.length; cIdx++) {
      const c = COURSES[cIdx];
      const courseId = randomUUID();

      await connection.query(`
        INSERT INTO courses (id, slug, pid, title, headline, category, price, level, thumbnail, instructor, is_published, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?)
      `, [
        courseId,
        c.slug,
        c.pid || null,
        c.title,
        c.headline || '',
        c.category || 'course',
        c.price || 0,
        c.level || 'Thực chiến A-Z',
        c.thumbnail || '',
        c.instructor || 'Tự Học AI',
        cIdx + 1,
      ]);

      // Nạp modules
      if (Array.isArray(c.modules)) {
        for (let mIdx = 0; mIdx < c.modules.length; mIdx++) {
          const mod = c.modules[mIdx];
          const moduleId = randomUUID();

          await connection.query(`
            INSERT INTO course_modules (id, course_id, title, sort_order)
            VALUES (?, ?, ?, ?)
          `, [
            moduleId,
            courseId,
            mod.title,
            mIdx + 1,
          ]);

          // Nạp lessons
          if (Array.isArray(mod.lessons)) {
            for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
              const lesson = mod.lessons[lIdx];
              const lessonId = lesson.id || randomUUID();

              await connection.query(`
                INSERT INTO course_lessons (
                  id, course_id, module_id, title, duration, video_url,
                  summary, content_markdown, action_checklist, resources, sort_order, is_free_preview
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                lessonId,
                courseId,
                moduleId,
                lesson.title,
                lesson.duration || '10:00',
                lesson.videoUrl || '',
                lesson.summary || '',
                lesson.contentMarkdown || '',
                JSON.stringify(lesson.actionChecklist || []),
                JSON.stringify(lesson.resources || []),
                lesson.sortOrder || lIdx + 1,
                lIdx === 0 ? 1 : 0, // bài đầu tiên cho xem thử
              ]);
            }
          }
        }
      }
      console.log(`  + Đã nạp khóa học: [${c.slug}] ${c.title}`);
    }
    console.log('✅ Nạp dữ liệu ban đầu hoàn tất!');
  } else {
    console.log(`ℹ️ Đã có sẵn ${existingCourses[0].count} khóa học trong database.`);
  }

  await connection.end();
}

main().catch(console.error);

