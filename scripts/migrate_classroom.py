import pymysql
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

DB_CONFIG = {
    'host': '103.127.195.56',
    'user': 'postgress_user',
    'password': 'Nvdang@1',
    'port': 3306,
    'database': 'tuhocai_top',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def migrate():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            print(">>> Tạo bảng user_lesson_progress...")
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS user_lesson_progress (
                    id VARCHAR(36) PRIMARY KEY,
                    user_id VARCHAR(36) NOT NULL,
                    course_slug VARCHAR(100) NOT NULL,
                    lesson_id VARCHAR(100) NOT NULL,
                    completed BOOLEAN DEFAULT TRUE,
                    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    UNIQUE KEY uniq_user_lesson (user_id, course_slug, lesson_id),
                    INDEX idx_user_course (user_id, course_slug),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """)
            conn.commit()
            print("✅ Đã tạo thành công bảng user_lesson_progress!")
    finally:
        conn.close()

if __name__ == '__main__':
    migrate()
