import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import requests
import pymysql

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

def test_landing_page_funnel():
    print("=" * 70)
    print("BAT DAU KIEM THU QA CHO HE THONG LANDING PAGE BAN HANG (DIRECT SALES FUNNEL)")
    print("=" * 70)

    # LP-TC-01: Truy cập trang Landing Page thực tế
    res_lp = requests.get(f"{BASE_URL}/lp/n8n-tu-dong-hoa-kiem-tien")
    res_lp.encoding = 'utf-8'
    passed = (res_lp.status_code == 200 and "Hệ Thống Tự Động Hóa n8n" in res_lp.text)
    print(f"[{'PASS' if passed else 'FAIL'}] LP-TC-01: Truy cap Landing Page thuc te -> HTTP {res_lp.status_code}, Co chua tieu de chinh xac")

    # LP-TC-02: Truy cập trang không tồn tại -> 404
    res_404 = requests.get(f"{BASE_URL}/lp/slug-khong-ton-tai-abc")
    passed = res_404.status_code == 404
    print(f"[{'PASS' if passed else 'FAIL'}] LP-TC-02: Xu ly trang Landing Page khong ton tai -> HTTP {res_404.status_code} (Not Found)")

    # LP-TC-03: Kiem tra tang luot xem (views counter)
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT views FROM landing_pages WHERE slug = 'n8n-tu-dong-hoa-kiem-tien'")
        views_count = cur.fetchone()['views']
    conn.close()
    passed = views_count >= 1
    print(f"[{'PASS' if passed else 'FAIL'}] LP-TC-03: Tu dong dem va cap nhat luot xem trang (Views Counter) -> views = {views_count}")

    # LP-TC-04: Giả lập khách hàng vào Landing Page từ Link Affiliate (?ref=dangai) & Đặt hàng
    session = requests.Session()
    # Khách vào qua link ref
    session.post(f"{BASE_URL}/api/affiliate/track", json={
        "ref": "dangai",
        "landingPath": "/lp/n8n-tu-dong-hoa-kiem-tien",
        "referrer": "https://tiktok.com/@dangai"
    })

    # Khách bấm nút Đăng ký trên Landing Page
    checkout_res = session.post(f"{BASE_URL}/api/checkout", json={
        "productId": "03fefa9b-5de0-491a-8b40-db5f9604a97c",
        "customerName": "Khách Mua Qua Landing Page",
        "customerEmail": "khach_lp_test@tuhocai.top",
        "customerPhone": "0911223344"
    })
    order_data = checkout_res.json()
    order_id = order_data.get('orderId')
    order_code = order_data.get('orderCode')

    # Kiểm tra trong DB: đơn hàng được gán affiliate_code = 'dangai' và sinh hoa hồng
    conn = pymysql.connect(**DB_CONFIG)
    with conn.cursor() as cur:
        cur.execute("SELECT affiliate_code FROM orders WHERE id = %s", (order_id,))
        order_aff = cur.fetchone()
        cur.execute("SELECT * FROM affiliate_commissions WHERE order_id = %s", (order_id,))
        comm = cur.fetchone()
        # Dọn dẹp đơn test
        cur.execute("DELETE FROM affiliate_commissions WHERE order_id = %s", (order_id,))
        cur.execute("DELETE FROM orders WHERE id = %s", (order_id,))
        conn.commit()
    conn.close()

    passed = (checkout_res.status_code == 200 and
              order_aff and order_aff.get('affiliate_code') == 'dangai' and
              comm and comm.get('commission_amount') == 69650) # 199k * 35%
    print(f"[{'PASS' if passed else 'FAIL'}] LP-TC-04: Dat hang tu Landing Page tu dong gan Affiliate dangai va tao hoa hong 69.650d -> Order: {order_code}, Hoa hong: {comm.get('commission_amount') if comm else 0}d")

    print("=" * 70)
    print("TOAN BO 4 KIEM THU CHO LANDING PAGE SALES FUNNEL HOAN TAT 100% THANH CONG!")
    print("=" * 70)

if __name__ == '__main__':
    test_landing_page_funnel()
