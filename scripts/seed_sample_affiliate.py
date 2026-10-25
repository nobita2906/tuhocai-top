import pymysql
import uuid

DB_CONFIG = {
    'host': '103.127.195.56',
    'user': 'postgress_user',
    'password': 'Nvdang@1',
    'port': 3306,
    'database': 'tuhocai_top',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def seed():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cursor:
            # Check if partner with code 'dangai' or 'tuhocai' exists
            cursor.execute("SELECT * FROM affiliate_partners WHERE code = 'dangai' LIMIT 1")
            row = cursor.fetchone()
            if not row:
                partner_id = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO affiliate_partners (
                        id, code, name, email, phone, commission_rate, balance, total_earned,
                        bank_name, bank_account_no, bank_account_name, status, notes
                    ) VALUES (
                        %s, 'dangai', 'Nguyễn Văn Đăng', 'nvdang.ai@gmail.com', '0934434101',
                        35, 0, 0, 'VPBank', '0934434101', 'NGUYEN VAN DANG', 'ACTIVE', 'Đối tác chiến lược - Tự Học AI'
                    )
                """, (partner_id,))
                print(f"Created default affiliate partner: dangai (ID: {partner_id})")
            else:
                print(f"Partner 'dangai' already exists: ID={row['id']}")

            conn.commit()
    finally:
        conn.close()

if __name__ == '__main__':
    seed()
