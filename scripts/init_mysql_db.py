import pymysql

DB_CONFIG = {
    'host': '103.127.195.56',
    'user': 'postgress_user',
    'password': 'Nvdang@1',
    'port': 3306,
    'database': 'tuhocai_top',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

TABLES = [
    """
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      image VARCHAR(500),
      role ENUM('USER', 'ADMIN') DEFAULT 'USER',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS posts (
      id VARCHAR(36) PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      summary TEXT,
      content LONGTEXT NOT NULL,
      category ENUM('NEWS', 'PROMPT', 'SKILL', 'WORKFLOW') DEFAULT 'NEWS',
      tags VARCHAR(255),
      thumbnail VARCHAR(500),
      is_featured BOOLEAN DEFAULT FALSE,
      is_published BOOLEAN DEFAULT TRUE,
      views INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(36) PRIMARY KEY,
      pid VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      content LONGTEXT,
      price INT DEFAULT 0,
      original_price INT DEFAULT 0,
      thumbnail VARCHAR(500),
      preview_url VARCHAR(500),
      download_url VARCHAR(1000),
      category VARCHAR(50) DEFAULT 'workflow',
      is_active BOOLEAN DEFAULT TRUE,
      sales_count INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(36) PRIMARY KEY,
      order_code VARCHAR(50) UNIQUE NOT NULL,
      user_id VARCHAR(36),
      customer_name VARCHAR(100) NOT NULL,
      customer_email VARCHAR(150) NOT NULL,
      customer_phone VARCHAR(30),
      product_id VARCHAR(36) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      price INT NOT NULL,
      receipt_image_url VARCHAR(1000),
      payment_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
      payment_method VARCHAR(30) DEFAULT 'VIETQR',
      approved_at DATETIME,
      approved_by VARCHAR(100),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_customer_email (customer_email),
      INDEX idx_payment_status (payment_status),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS user_library (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      product_id VARCHAR(36) NOT NULL,
      order_id VARCHAR(36),
      unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_user_product (user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS leads (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      phone VARCHAR(30),
      resource_id VARCHAR(50),
      resource_name VARCHAR(255),
      source VARCHAR(50) DEFAULT 'free_download',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_lead_email (email),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
]

def init_db():
    print("Connecting to MySQL at 103.127.195.56:3306...")
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            for sql in TABLES:
                cursor.execute(sql)
            conn.commit()
            
            cursor.execute("SHOW TABLES;")
            tables = cursor.fetchall()
            print("Successfully initialized all tables in tuhocai_top:")
            for t in tables:
                print(" -", list(t.values())[0])
    finally:
        conn.close()

if __name__ == '__main__':
    init_db()
