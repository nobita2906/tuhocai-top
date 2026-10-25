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

AFF_TABLES = [
    """
    CREATE TABLE IF NOT EXISTS affiliate_partners (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36),
      code VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      phone VARCHAR(30),
      commission_rate INT DEFAULT 30,
      balance INT DEFAULT 0,
      total_earned INT DEFAULT 0,
      bank_name VARCHAR(100),
      bank_account_no VARCHAR(50),
      bank_account_name VARCHAR(100),
      status ENUM('ACTIVE', 'PENDING', 'BANNED') DEFAULT 'ACTIVE',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_aff_code (code),
      INDEX idx_aff_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS affiliate_clicks (
      id VARCHAR(36) PRIMARY KEY,
      affiliate_id VARCHAR(36) NOT NULL,
      code VARCHAR(50) NOT NULL,
      ip_address VARCHAR(45),
      user_agent TEXT,
      landing_path VARCHAR(500),
      referrer VARCHAR(500),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_aff_clicks (affiliate_id, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS affiliate_commissions (
      id VARCHAR(36) PRIMARY KEY,
      affiliate_id VARCHAR(36) NOT NULL,
      order_id VARCHAR(36) UNIQUE NOT NULL,
      order_code VARCHAR(50) NOT NULL,
      order_amount INT NOT NULL,
      rate INT NOT NULL,
      commission_amount INT NOT NULL,
      status ENUM('PENDING', 'APPROVED', 'CANCELLED', 'PAID') DEFAULT 'PENDING',
      approved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_aff_comm (affiliate_id, status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """,
    """
    CREATE TABLE IF NOT EXISTS affiliate_payouts (
      id VARCHAR(36) PRIMARY KEY,
      affiliate_id VARCHAR(36) NOT NULL,
      amount INT NOT NULL,
      bank_info VARCHAR(255),
      status ENUM('REQUESTED', 'TRANSFERRED', 'REJECTED') DEFAULT 'REQUESTED',
      proof_image VARCHAR(500),
      transferred_at DATETIME,
      transferred_by VARCHAR(100),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_aff_payout (affiliate_id, status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
]

def migrate():
    print("Connecting to MySQL at 103.127.195.56:3306...")
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            for sql in AFF_TABLES:
                cursor.execute(sql)
            print("Affiliate tables verified/created.")

            cursor.execute("SHOW COLUMNS FROM orders LIKE 'affiliate_code';")
            if not cursor.fetchone():
                cursor.execute("ALTER TABLE orders ADD COLUMN affiliate_code VARCHAR(50) NULL AFTER product_id;")
                cursor.execute("ALTER TABLE orders ADD COLUMN affiliate_id VARCHAR(36) NULL AFTER affiliate_code;")
                cursor.execute("ALTER TABLE orders ADD INDEX idx_orders_aff_code (affiliate_code);")
                print("Added affiliate_code and affiliate_id to orders table.")
            else:
                print("Columns affiliate_code and affiliate_id already exist in orders.")

            conn.commit()
            print("All affiliate database structures successfully migrated!")
    finally:
        conn.close()

if __name__ == '__main__':
    migrate()
