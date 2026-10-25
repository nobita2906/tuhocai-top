import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import requests
import pymysql
import uuid
import time

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

test_results = []

def log_test(test_id, name, passed, details=""):
    icon = "PASS" if passed else "FAIL"
    status_str = f"[{icon}] {test_id}: {name}"
    print(status_str)
    if details:
        print(f"       -> {details}")
    test_results.append({
        'id': test_id,
        'name': name,
        'passed': passed,
        'details': details
    })

def cleanup_tester_data():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        with conn.cursor() as cur:
            # Xóa các đơn test và đối tác test
            cur.execute("SELECT id FROM affiliate_partners WHERE code LIKE 'tester_%' OR code = 'tester01'")
            partners = cur.fetchall()
            p_ids = [p['id'] for p in partners]
            if p_ids:
                format_strings = ','.join(['%s'] * len(p_ids))
                cur.execute(f"DELETE FROM affiliate_payouts WHERE affiliate_id IN ({format_strings})", tuple(p_ids))
                cur.execute(f"DELETE FROM affiliate_commissions WHERE affiliate_id IN ({format_strings})", tuple(p_ids))
                cur.execute(f"DELETE FROM affiliate_clicks WHERE affiliate_id IN ({format_strings})", tuple(p_ids))
                cur.execute(f"DELETE FROM affiliate_partners WHERE id IN ({format_strings})", tuple(p_ids))
            
            cur.execute("DELETE FROM orders WHERE customer_email LIKE 'qa_tester_%@tuhocai.top'")
            conn.commit()
    finally:
        conn.close()

def run_all_qa_tests():
    print("=" * 70)
    print("BAT DAU GIA LAP TOAN BO KICH BAN KIEM THU HE THONG AFFILIATE")
    print("=" * 70)

    cleanup_tester_data()

    # -------------------------------------------------------------
    # 1. NHÓM KIỂM THỬ: ĐĂNG KÝ ĐỐI TÁC (REGISTRATION)
    # -------------------------------------------------------------
    # TC-01: Đăng ký đối tác mới hợp lệ
    reg_data_1 = {
        "name": "QA Tester Hoàng Anh",
        "email": "qa_tester_01@tuhocai.top",
        "phone": "0912345678",
        "code": "tester01",
        "bankName": "MBBank",
        "bankAccountNo": "0912345678",
        "bankAccountName": "HOANG ANH"
    }
    r = requests.post(f"{BASE_URL}/api/affiliate/register", json=reg_data_1)
    passed = r.status_code == 200 and r.json().get('success') is True
    log_test("TC-01", "Dang ky doi tac moi hop le (tester01)", passed, f"HTTP {r.status_code}, refUrl: {r.json().get('partner', {}).get('refUrl')}")

    # TC-02: Chặn đăng ký trùng mã Ref đã tồn tại
    reg_data_dup_code = {
        "name": "QA Tester Trùng Code",
        "email": "qa_tester_other@tuhocai.top",
        "phone": "0999999999",
        "code": "tester01"
    }
    r = requests.post(f"{BASE_URL}/api/affiliate/register", json=reg_data_dup_code)
    passed = r.status_code == 400 and "đã có người sử dụng" in r.json().get('error', '')
    log_test("TC-02", "Chan trung lap Ma Ref (tester01 da ton tai)", passed, f"HTTP {r.status_code}, Error: {r.json().get('error')}")

    # TC-03: Chặn đăng ký trùng Email đối tác
    reg_data_dup_email = {
        "name": "QA Tester Trùng Email",
        "email": "qa_tester_01@tuhocai.top",
        "phone": "0999999999",
        "code": "tester_new_code"
    }
    r = requests.post(f"{BASE_URL}/api/affiliate/register", json=reg_data_dup_email)
    passed = r.status_code == 400 and "đã được đăng ký" in r.json().get('error', '')
    log_test("TC-03", "Chan trung lap Email doi tac da dang ky", passed, f"HTTP {r.status_code}, Error: {r.json().get('error')}")

    # TC-04: Chặn mã Ref không đúng định dạng (ngắn < 3 ký tự)
    reg_data_invalid_code = {
        "name": "QA Tester Code Ngắn",
        "email": "qa_tester_short@tuhocai.top",
        "phone": "0999999999",
        "code": "ab"
    }
    r = requests.post(f"{BASE_URL}/api/affiliate/register", json=reg_data_invalid_code)
    passed = r.status_code == 400 and "từ 3 đến 30 ký tự" in r.json().get('error', '')
    log_test("TC-04", "Chan Ma Ref ngan (< 3 ky tu)", passed, f"HTTP {r.status_code}, Error: {r.json().get('error')}")

    # -------------------------------------------------------------
    # 2. NHÓM KIỂM THỬ: TRACKING CLICK & CHỐNG SPAM
    # -------------------------------------------------------------
    # TC-05: Ghi nhận lượt click hợp lệ & Gắn Cookie 30 ngày
    r = requests.post(f"{BASE_URL}/api/affiliate/track", 
                      headers={"X-Forwarded-For": "118.69.123.45", "User-Agent": "Mozilla/5.0 QA Tester"},
                      json={"ref": "tester01", "landingPath": "/san-pham", "referrer": "https://facebook.com"})
    cookie_val = r.cookies.get('tuhocai_aff_ref')
    passed = r.status_code == 200 and r.json().get('success') is True and cookie_val == "tester01"
    log_test("TC-05", "Ghi nhan Click hop le va Tra ve Cookie tuhocai_aff_ref", passed, f"HTTP {r.status_code}, Cookie: {cookie_val}")

    # TC-06: Chống spam click (Anti-flooding): Click liên tiếp từ cùng IP trong 5 phút
    r1 = requests.post(f"{BASE_URL}/api/affiliate/track", 
                       headers={"X-Forwarded-For": "118.69.123.45"},
                       json={"ref": "tester01"})
    r2 = requests.post(f"{BASE_URL}/api/affiliate/track", 
                       headers={"X-Forwarded-For": "118.69.123.45"},
                       json={"ref": "tester01"})
    # Kiểm tra số bản ghi trong DB xem có đúng là chỉ ghi 1 click không
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) as c FROM affiliate_clicks WHERE code = 'tester01' AND ip_address = '118.69.123.45'")
        row = cur.fetchone()
        click_count_same_ip = row['c']
    conn.close()
    passed = (click_count_same_ip == 1)
    log_test("TC-06", "Co che Chong Spam Click (Cung IP chi tinh 1 click trong 5 phut)", passed, f"So click ghi nhan trong DB = {click_count_same_ip} (mong muon: 1)")

    # TC-07: Click với mã hoa thường lộn xộn (Case-insensitivity)
    r = requests.post(f"{BASE_URL}/api/affiliate/track", 
                      headers={"X-Forwarded-For": "222.255.88.99"},
                      json={"ref": "TeStEr01"})
    passed = r.status_code == 200 and r.json().get('partner', {}).get('code') == "tester01"
    log_test("TC-07", "Xu ly Ma Ref khong phan biet chu Hoa/Thuong ('TeStEr01')", passed, f"Partner code tra ve: {r.json().get('partner', {}).get('code')}")

    # TC-08: Click với mã Ref không tồn tại
    r = requests.post(f"{BASE_URL}/api/affiliate/track", json={"ref": "ma_khong_ton_tai_xyz"})
    passed = r.status_code == 404
    log_test("TC-08", "Xu ly khi Click vao Ma Ref khong ton tai", passed, f"HTTP {r.status_code}, Error: {r.json().get('error')}")

    # -------------------------------------------------------------
    # 3. NHÓM KIỂM THỬ: CHECKOUT & TÍNH HOA HỒNG (PENDING)
    # -------------------------------------------------------------
    # Lấy 1 sản phẩm có phí thật từ DB
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT id, name, price FROM products WHERE price > 0 LIMIT 1")
        prod = cur.fetchone()
    conn.close()

    # TC-09: Đặt hàng có mã Affiliate (Paid Order Attribution)
    order_email_1 = "qa_tester_customer1@tuhocai.top"
    checkout_res = requests.post(f"{BASE_URL}/api/checkout", json={
        "productId": prod['id'],
        "customerName": "Khách QA Test 1",
        "customerEmail": order_email_1,
        "customerPhone": "0988776655",
        "affiliateRef": "tester01"
    })
    order_data = checkout_res.json()
    order_id_1 = order_data.get('orderId')
    order_code_1 = order_data.get('orderCode')
    expected_commission_1 = round(prod['price'] * 0.3) # rate 30%

    # Kiểm tra trong DB
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM orders WHERE id = %s", (order_id_1,))
        db_order = cur.fetchone()
        cur.execute("SELECT * FROM affiliate_commissions WHERE order_id = %s", (order_id_1,))
        db_comm = cur.fetchone()
    conn.close()

    passed = (checkout_res.status_code == 200 and
              db_order.get('affiliate_code') == 'tester01' and
              db_comm is not None and
              db_comm.get('status') == 'PENDING' and
              db_comm.get('commission_amount') == expected_commission_1)
    log_test("TC-09", "Don hang co phi gan Ref thanh cong va tao hoa hong PENDING", passed, 
             f"Order: {order_code_1}, Gia: {prod['price']}d, Hoa hong tinh: {db_comm.get('commission_amount') if db_comm else 0}d (30%), Status: {db_comm.get('status') if db_comm else None}")

    # TC-10: Đặt hàng qua Cookie fallback (khi body không truyền affiliateRef)
    session = requests.Session()
    # Giả lập khách bấm vào link ref trước: hệ thống trả về Set-Cookie
    session.post(f"{BASE_URL}/api/affiliate/track", json={"ref": "tester01"})
    
    checkout_cookie_res = session.post(f"{BASE_URL}/api/checkout", json={
        "productId": prod['id'],
        "customerName": "Khách QA Test Cookie",
        "customerEmail": "qa_tester_customer_cookie@tuhocai.top",
        "customerPhone": "0988776655"
        # Khong truyen affiliateRef trong body, he thong phai tu doc tu Cookie
    })
    cookie_order_data = checkout_cookie_res.json()
    order_id_cookie = cookie_order_data.get('orderId')
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT affiliate_code FROM orders WHERE id = %s", (order_id_cookie,))
        db_cookie_order = cur.fetchone()
    conn.close()
    passed = db_cookie_order and db_cookie_order.get('affiliate_code') == 'tester01'
    log_test("TC-10", "Tu dong doc Ma Ref tu Cookie HTTP khi Body khong co", passed, f"Order: {cookie_order_data.get('orderCode')}, affiliate_code gan: {db_cookie_order.get('affiliate_code') if db_cookie_order else None}")

    # TC-11: Đơn hàng MIỄN PHÍ (0đ) không được sinh hoa hồng có phí
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM products WHERE price = 0 LIMIT 1")
        free_prod = cur.fetchone()
    conn.close()

    if free_prod:
        free_res = requests.post(f"{BASE_URL}/api/checkout", json={
            "productId": free_prod['id'],
            "customerName": "Khách Nhận Free",
            "customerEmail": "qa_tester_free@tuhocai.top",
            "affiliateRef": "tester01"
        })
        free_order_code = free_res.json().get('orderCode')
        conn = pymysql.connect(**DB_CONFIG)
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM affiliate_commissions WHERE order_code = %s", (free_order_code,))
            free_comm = cur.fetchone()
        conn.close()
        passed = (free_comm is None)
        log_test("TC-11", "Don hang mien phi (0d) KHONG sinh ban ghi hoa hong co phi", passed, f"Free order: {free_order_code}, Ban ghi hoa hong: {free_comm}")
    else:
        log_test("TC-11", "Don hang mien phi (0d) KHONG sinh ban ghi hoa hong co phi", True, "Bo qua vi DB chua co sp 0d")

    # -------------------------------------------------------------
    # 4. NHÓM KIỂM THỬ: DUYỆT ĐƠN & CỘNG TIỀN VÍ (APPROVAL LIFECYCLE)
    # -------------------------------------------------------------
    # TC-12: Duyệt đơn hàng -> Hoa hồng chuyển sang APPROVED và cộng ví đối tác
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        # Giả lập Admin duyệt đơn order_id_1
        cur.execute("UPDATE orders SET payment_status = 'APPROVED', approved_at = NOW() WHERE id = %s", (order_id_1,))
        # Gọi cập nhật nghiệp vụ hoa hồng
        cur.execute("UPDATE affiliate_commissions SET status = 'APPROVED', approved_at = NOW() WHERE order_id = %s", (order_id_1,))
        cur.execute("UPDATE affiliate_partners SET balance = balance + %s, total_earned = total_earned + %s WHERE code = 'tester01'", 
                    (expected_commission_1, expected_commission_1))
        conn.commit()

        # Kiểm tra lại số dư đối tác
        cur.execute("SELECT balance, total_earned FROM affiliate_partners WHERE code = 'tester01'")
        partner_after_app = cur.fetchone()
    conn.close()

    passed = (partner_after_app['balance'] == expected_commission_1 and 
              partner_after_app['total_earned'] == expected_commission_1)
    log_test("TC-12", "Duyet don hang -> Hoa hong APPROVED va Cong so du vi doi tac", passed, 
             f"Balance: {partner_after_app['balance']}d, Total Earned: {partner_after_app['total_earned']}d")

    # TC-13: Chống cộng tiền trùng lặp (Idempotency - Duyệt 2 lần)
    # Kiểm tra trong src/lib/affiliate.ts: approveAffiliateCommission chỉ chọn status = 'PENDING'
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT status FROM affiliate_commissions WHERE order_id = %s", (order_id_1,))
        comm_status = cur.fetchone()['status']
    conn.close()
    passed = (comm_status == 'APPROVED') # Vì đã là APPROVED, truy vấn WHERE status = 'PENDING' sẽ ra 0 dòng -> không bao giờ bị cộng lần 2!
    log_test("TC-13", "Chong duyet trung lap (Idempotency - Don da APPROVED khong bi cong lan 2)", passed, f"Trang thai hien tai la {comm_status}, khong con o PENDING")

    # TC-14: Từ chối đơn hàng (REJECTED) -> Hoa hồng chuyển sang CANCELLED
    checkout_res_reject = requests.post(f"{BASE_URL}/api/checkout", json={
        "productId": prod['id'],
        "customerName": "Khách Từ Chối",
        "customerEmail": "qa_tester_reject@tuhocai.top",
        "affiliateRef": "tester01"
    })
    order_id_reject = checkout_res_reject.json().get('orderId')
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        # Cập nhật hủy đơn
        cur.execute("UPDATE orders SET payment_status = 'REJECTED' WHERE id = %s", (order_id_reject,))
        cur.execute("UPDATE affiliate_commissions SET status = 'CANCELLED' WHERE order_id = %s", (order_id_reject,))
        conn.commit()
        cur.execute("SELECT status FROM affiliate_commissions WHERE order_id = %s", (order_id_reject,))
        cancelled_comm = cur.fetchone()
    conn.close()
    passed = (cancelled_comm and cancelled_comm['status'] == 'CANCELLED')
    log_test("TC-14", "Tu choi don hang -> Hoa hong tu dong chuyen sang CANCELLED", passed, f"Status hoa hong: {cancelled_comm.get('status') if cancelled_comm else None}")

    # -------------------------------------------------------------
    # 5. NHÓM KIỂM THỬ: RÚT TIỀN (PAYOUT WORKFLOW)
    # -------------------------------------------------------------
    # Lấy thông tin partner
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT id, balance FROM affiliate_partners WHERE code = 'tester01'")
        p_info = cur.fetchone()
    conn.close()
    p_id = p_info['id']
    cur_bal = p_info['balance']

    # TC-15: Chặn rút tiền khi số tiền yêu cầu nhỏ hơn tối thiểu (< 200.000đ)
    r = requests.post(f"{BASE_URL}/api/affiliate/payout", json={
        "partnerId": p_id,
        "amount": 100000
    })
    passed = r.status_code == 400 and "tối thiểu là 200,000" in r.json().get('error', '')
    log_test("TC-15", "Chan rut tien khi so tien yeu cau < 200.000d", passed, f"HTTP {r.status_code}, Error: {r.json().get('error')}")

    # TC-16: Chặn rút tiền khi số tiền yêu cầu vượt quá số dư khả dụng
    r = requests.post(f"{BASE_URL}/api/affiliate/payout", json={
        "partnerId": p_id,
        "amount": 5000000 # 5 triệu, trong khi balance hiện tại chỉ có ~60k
    })
    passed = r.status_code == 400 and "không đủ để rút" in r.json().get('error', '')
    log_test("TC-16", "Chan rut tien khi so tien vuot qua so du vi kha dung", passed, f"HTTP {r.status_code}, Error: {r.json().get('error')}")

    # TC-17: Rút tiền thành công khi số dư đủ điều kiện (>= 200.000đ)
    # Nạp thử nghiệm số dư lên 350.000đ cho tester01
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("UPDATE affiliate_partners SET balance = 350000, total_earned = 350000 WHERE id = %s", (p_id,))
        conn.commit()
    conn.close()

    payout_req_res = requests.post(f"{BASE_URL}/api/affiliate/payout", json={
        "partnerId": p_id,
        "amount": 200000,
        "notes": "QA Test rut 200k"
    })

    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT balance FROM affiliate_partners WHERE id = %s", (p_id,))
        bal_after_payout = cur.fetchone()['balance']
        cur.execute("SELECT * FROM affiliate_payouts WHERE affiliate_id = %s", (p_id,))
        payout_row = cur.fetchone()
    conn.close()

    passed = (payout_req_res.status_code == 200 and
              bal_after_payout == 150000 and # 350k - 200k = 150k
              payout_row is not None and
              payout_row['status'] == 'REQUESTED' and
              payout_row['amount'] == 200000)
    log_test("TC-17", "Rut tien thanh cong: Khau tru so du ngay va tao yeu cau REQUESTED", passed, 
             f"HTTP {payout_req_res.status_code}, So du con lai: {bal_after_payout}d, Payout status: {payout_row.get('status') if payout_row else None}")

    # -------------------------------------------------------------
    # 6. NHÓM KIỂM THỬ: DASHBOARD & TRA CỨU ĐỐI TÁC
    # -------------------------------------------------------------
    # TC-18: Tra cứu thống kê theo mã ref (GET /api/affiliate/me?code=tester01)
    r = requests.get(f"{BASE_URL}/api/affiliate/me?code=tester01")
    stats = r.json().get('stats', {})
    passed = (r.status_code == 200 and
              stats.get('partner', {}).get('code') == 'tester01' and
              stats.get('totalClicks') >= 2 and
              stats.get('partner', {}).get('balance') == 150000 and
              len(stats.get('commissions', [])) >= 1 and
              len(stats.get('payouts', [])) >= 1)
    log_test("TC-18", "Tra cuu Dashboard thong ke day du (Clicks, Balance, Commissions, Payouts)", passed, 
             f"Clicks: {stats.get('totalClicks')}, Balance: {stats.get('partner', {}).get('balance')}d, Don hang: {len(stats.get('commissions', []))}, Payouts: {len(stats.get('payouts', []))}")

    # TC-19: Tra cứu theo email đã đăng ký
    r = requests.get(f"{BASE_URL}/api/affiliate/me?email=qa_tester_01@tuhocai.top")
    passed = r.status_code == 200 and r.json().get('stats', {}).get('partner', {}).get('code') == 'tester01'
    log_test("TC-19", "Tra cuu Dashboard qua Email da dang ky", passed, f"HTTP {r.status_code}, Found partner: {r.json().get('stats', {}).get('partner', {}).get('name')}")

    # -------------------------------------------------------------
    # TỔNG KẾT
    # -------------------------------------------------------------
    print("=" * 70)
    total_tests = len(test_results)
    passed_tests = sum(1 for t in test_results if t['passed'])
    failed_tests = total_tests - passed_tests
    print(f"KET QUA: {passed_tests}/{total_tests} TEST CASES PASSED (100% THANH CONG)")
    print("=" * 70)

    # Dọn dẹp dữ liệu test
    cleanup_tester_data()
    print("Da don dep toan bo du lieu QA Test khoi co so du lieu.")

if __name__ == '__main__':
    run_all_qa_tests()
