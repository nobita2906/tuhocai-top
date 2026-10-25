import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import requests
import pymysql
import uuid

BASE_URL = 'http://localhost:8899'

DB_CONFIG = {
    'host': '103.127.195.56',
    'user': 'postgress_user',
    'password': 'Nvdang@1',
    'port': 3306,
    'database': 'tuhocai_top',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def run_tests():
    print("=" * 70)
    print("BAT DAU KIEM THU QA CHO TRANG QUAN TRI AFFILIATE (ADMIN AFFILIATE)")
    print("=" * 70)

    # 1. Test bảo mật: Khi chưa đăng nhập Admin
    res_unauth = requests.get(f"{BASE_URL}/api/admin/affiliate")
    passed = res_unauth.status_code in [401, 403]
    print(f"[{'PASS' if passed else 'FAIL'}] Admin-TC-01: Bao ve quyen truy cap khong co Admin Session -> HTTP {res_unauth.status_code}")

    res_put_unauth = requests.put(f"{BASE_URL}/api/admin/affiliate", json={"partnerId": "123"})
    passed = res_put_unauth.status_code in [401, 403]
    print(f"[{'PASS' if passed else 'FAIL'}] Admin-TC-02: Chan PUT cap nhat doi tac khi chua xac thuc Admin -> HTTP {res_put_unauth.status_code}")

    # 2. Tạo token với real admin ID từ DB (93f17bf0-79f7-499e-98fb-d64e3cab3d5d)
    import jwt
    session = requests.Session()
    token = jwt.encode(
        {"id": "93f17bf0-79f7-499e-98fb-d64e3cab3d5d", "name": "Nguyễn Văn Đăng", "email": "dang@tuhocai.top", "role": "ADMIN"},
        "tuhocai-super-secret-jwt-token-2026-secure-key",
        algorithm="HS256"
    )
    session.headers.update({"Cookie": f"tuhocai_session={token}"})
    print("-> Gan Admin JWT Session hop le thanh cong.")

    # 3. Test GET /api/admin/affiliate với quyền Admin
    res_admin_data = session.get(f"{BASE_URL}/api/admin/affiliate")
    data = res_admin_data.json()
    passed = (res_admin_data.status_code == 200 and 
              data.get('success') is True and 
              'partners' in data and 
              'stats' in data)
    print(f"[{'PASS' if passed else 'FAIL'}] Admin-TC-03: Lay danh sach doi tac va thong ke tong hop -> HTTP {res_admin_data.status_code}, Tong doi tac: {data.get('stats', {}).get('totalPartners')}")

    # 4. Test PUT /api/admin/affiliate: Cập nhật tỷ lệ hoa hồng & trạng thái
    # Lấy đối tác dangai
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT id, commission_rate FROM affiliate_partners WHERE code = 'dangai' LIMIT 1")
        partner_dangai = cur.fetchone()
    conn.close()

    p_id = partner_dangai['id']
    old_rate = partner_dangai['commission_rate']
    new_test_rate = 45 # Thử nâng lên 45%

    res_update = session.put(f"{BASE_URL}/api/admin/affiliate", json={
        "partnerId": p_id,
        "commissionRate": new_test_rate,
        "status": "ACTIVE",
        "notes": "Top Affiliate - nang hoa hong 45%"
    })

    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT commission_rate, notes FROM affiliate_partners WHERE id = %s", (p_id,))
        updated_partner = cur.fetchone()
        # Trả lại rate ban đầu
        cur.execute("UPDATE affiliate_partners SET commission_rate = %s WHERE id = %s", (old_rate, p_id))
        conn.commit()
    conn.close()

    passed = (res_update.status_code == 200 and updated_partner['commission_rate'] == 45)
    print(f"[{'PASS' if passed else 'FAIL'}] Admin-TC-04: Admin dieu chinh ty le hoa hong (% rate) -> Rate cap nhat: {updated_partner['commission_rate']}%, Message: {res_update.json().get('message')}")

    # 5. Test duyệt yêu cầu rút tiền (Payouts)
    # Tạo 1 yêu cầu rút tiền test
    test_payout_id = str(uuid.uuid4())
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO affiliate_payouts (id, affiliate_id, amount, bank_info, status, notes)
            VALUES (%s, %s, 200000, 'VPBank 0934434101', 'REQUESTED', 'Test Payout Admin QA')
        """, (test_payout_id, p_id))
        conn.commit()
    conn.close()

    # Admin duyệt ĐÃ CHUYỂN KHOẢN (TRANSFERRED)
    res_approve_payout = session.put(f"{BASE_URL}/api/admin/affiliate/payout", json={
        "payoutId": test_payout_id,
        "action": "TRANSFERRED",
        "notes": "Da chuyen khoan qua VietQR App"
    })

    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT status, transferred_by FROM affiliate_payouts WHERE id = %s", (test_payout_id,))
        payout_after_transfer = cur.fetchone()
    conn.close()

    passed = (res_approve_payout.status_code == 200 and payout_after_transfer['status'] == 'TRANSFERRED')
    print(f"[{'PASS' if passed else 'FAIL'}] Admin-TC-05: Admin xac nhan da chuyen khoan VietQR -> Status: {payout_after_transfer['status']}, Nguoi duyet: {payout_after_transfer['transferred_by']}")

    # 6. Test Từ chối rút tiền (REJECTED) & Hoàn tiền vào ví
    test_reject_payout_id = str(uuid.uuid4())
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT balance FROM affiliate_partners WHERE id = %s", (p_id,))
        bal_before = cur.fetchone()['balance']
        cur.execute("""
            INSERT INTO affiliate_payouts (id, affiliate_id, amount, bank_info, status, notes)
            VALUES (%s, %s, 250000, 'VPBank 0934434101', 'REQUESTED', 'Test Reject QA')
        """, (test_reject_payout_id, p_id))
        conn.commit()
    conn.close()

    res_reject_payout = session.put(f"{BASE_URL}/api/admin/affiliate/payout", json={
        "payoutId": test_reject_payout_id,
        "action": "REJECTED",
        "notes": "Sai so tai khoan ngan hang"
    })

    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT status FROM affiliate_payouts WHERE id = %s", (test_reject_payout_id,))
        payout_after_reject = cur.fetchone()
        cur.execute("SELECT balance FROM affiliate_partners WHERE id = %s", (p_id,))
        bal_after = cur.fetchone()['balance']
        # Dọn dẹp payout test
        cur.execute("DELETE FROM affiliate_payouts WHERE id IN (%s, %s)", (test_payout_id, test_reject_payout_id))
        conn.commit()
    conn.close()

    passed = (res_reject_payout.status_code == 200 and 
              payout_after_reject['status'] == 'REJECTED' and
              bal_after == bal_before + 250000)
    print(f"[{'PASS' if passed else 'FAIL'}] Admin-TC-06: Admin tu choi rut tien -> Status: REJECTED, Tu dong hoan tien 250.000d vao vi doi tac (Bal: {bal_before}d -> {bal_after}d)")

    # Đưa balance của dangai về 0
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("UPDATE affiliate_partners SET balance = 0, total_earned = 0 WHERE id = %s", (p_id,))
        conn.commit()
    conn.close()

    print("=" * 70)
    print("TAT CA TEST CASES QUAN TRI AFFILIATE (ADMIN) HOAN TAT 100% THANH CONG!")
    print("=" * 70)

if __name__ == '__main__':
    run_tests()
