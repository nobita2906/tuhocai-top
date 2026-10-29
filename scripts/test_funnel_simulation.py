import os
import sys
import io
import json
import time
import uuid
import urllib.request
import urllib.error
import pymysql

# Fix Windows console utf-8 print
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_URL = "http://localhost:8899"
DB_CONFIG = {
    "host": "103.127.195.56",
    "port": 3306,
    "user": "postgress_user",
    "password": "Nvdang@1",
    "database": "tuhocai_top",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor
}

def post_json(url: str, data: dict, headers: dict = None) -> dict:
    req_headers = {'Content-Type': 'application/json'}
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers=req_headers,
        method='POST'
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode('utf-8')
            return json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return json.loads(body)
        except Exception:
            return {"error": f"HTTP {e.code}: {body}"}
    except Exception as e:
        return {"error": str(e)}

def run_simulation():
    print("==================================================")
    print("🚀 BẮT ĐẦU KIỂM THỬ GIẢ LẬP PHỄU & TRACKING DOANH THU")
    print("   Thực hiện bởi: Thùy Linh (Trợ lý điều hành Tự Học AI)")
    print("==================================================")

    # 1. Kết nối DB để lưu trạng thái ban đầu
    conn = pymysql.connect(**DB_CONFIG)
    cur = conn.cursor()

    cur.execute("SELECT slug, title, views, cta_clicks, conversions FROM landing_pages WHERE slug = 'video-drama-gia-dinh-nho'")
    lp_before = cur.fetchone()
    print(f"\n[1] TRẠNG THÁI TRƯỚC TEST CỦA LANDING PAGE '{lp_before['slug']}':")
    print(f"    - Views hiện tại: {lp_before['views']}")
    print(f"    - CTA Clicks hiện tại: {lp_before['cta_clicks']}")
    print(f"    - Đơn thành công: {lp_before['conversions']}")

    # 2. Giả lập Pageview từ chiến dịch TikTok Ads
    test_session_id = f"sim_sess_{int(time.time())}"
    print(f"\n[2] GIẢ LẬP KHÁCH TRUY CẬP TỪ TIKTOK ADS...")
    track_pv_payload = {
        "landingSlug": "video-drama-gia-dinh-nho",
        "eventType": "pageview",
        "sessionId": test_session_id,
        "utmSource": "tiktok",
        "utmMedium": "short_video",
        "utmCampaign": "drama_family_viral_01",
        "referrer": "https://www.tiktok.com/@tuhocai"
    }
    pv_res = post_json(f"{BASE_URL}/api/analytics/track", track_pv_payload)
    print(f"    -> Track Pageview Response: {pv_res}")
    assert pv_res.get("success") is True, "Pageview tracking failed!"

    # 3. Giả lập Khách Bấm Nút CTA (Đặt mua)
    print(f"\n[3] GIẢ LẬP KHÁCH HÀNG BẤM NÚT CTA 'KÍCH HOẠT QUY TRÌNH'...")
    track_cta_payload = {
        "landingSlug": "video-drama-gia-dinh-nho",
        "eventType": "cta_click",
        "sessionId": test_session_id,
        "utmSource": "tiktok",
        "utmMedium": "short_video",
        "utmCampaign": "drama_family_viral_01"
    }
    cta_res = post_json(f"{BASE_URL}/api/analytics/track", track_cta_payload)
    print(f"    -> Track CTA Click Response: {cta_res}")
    assert cta_res.get("success") is True, "CTA Click tracking failed!"

    # 4. Giả lập Đặt Hàng qua API Checkout kèm Landing Slug & UTM
    test_email = f"dang_sim_{int(time.time())}@tuhocai.top"
    print(f"\n[4] GIẢ LẬP TẠO ĐƠN HÀNG QUA /api/checkout...")
    print(f"    - Email học viên: {test_email}")
    print(f"    - Nguồn Landing: video-drama-gia-dinh-nho")
    print(f"    - Chiến dịch: tiktok / short_video / drama_family_viral_01")
    
    checkout_payload = {
        "productId": "WF-DRAMA-069",
        "customerName": "Nguyễn Đăng Tester",
        "customerEmail": test_email,
        "customerPhone": "0934434101",
        "landingSlug": "video-drama-gia-dinh-nho",
        "utmSource": "tiktok",
        "utmMedium": "short_video",
        "utmCampaign": "drama_family_viral_01"
    }
    checkout_res = post_json(f"{BASE_URL}/api/checkout", checkout_payload)
    print(f"    -> Checkout Response: {checkout_res}")
    order_code = checkout_res["orderCode"]
    order_id = checkout_res["orderId"]
    order_amount = checkout_res["product"]["price"]
    print(f"    ✅ ĐÃ TẠO ĐƠN HÀNG: {order_code} (ID: {order_id}, Số tiền: {order_amount:,.0f} đ)")

    # Kiểm tra trong DB xem order đã lưu chuẩn landing_slug và UTM chưa
    cur.execute("SELECT id, order_code, customer_email, landing_slug, utm_source, utm_medium, utm_campaign, payment_status FROM orders WHERE order_code = %s", (order_code,))
    saved_order = cur.fetchone()
    print(f"\n[5] KIỂM TRA ĐƠN HÀNG TRONG DATABASE:")
    print(f"    - Order Code: {saved_order['order_code']}")
    print(f"    - Landing Slug: {saved_order['landing_slug']}")
    print(f"    - UTM Source: {saved_order['utm_source']}")
    print(f"    - UTM Medium: {saved_order['utm_medium']}")
    print(f"    - UTM Campaign: {saved_order['utm_campaign']}")
    print(f"    - Trạng thái ban đầu: {saved_order['payment_status']}")

    assert saved_order['landing_slug'] == 'video-drama-gia-dinh-nho', "Landing slug not matching in DB!"
    assert saved_order['utm_source'] == 'tiktok', "UTM source not matching in DB!"

    # 5. Giả lập Ngân hàng VIB gửi Webhook SePay báo nhận tiền
    print(f"\n[6] GIẢ LẬP WEBHOOK SEPAY GỬI THÔNG BÁO TIỀN VỀ VIB (0934434101)...")
    sepay_webhook_payload = {
        "id": int(time.time()),
        "gateway": "VIB",
        "transactionDate": time.strftime("%Y-%m-%d %H:%M:%S"),
        "accountNumber": "0934434101",
        "subAccount": None,
        "transferType": "in",
        "transferAmount": order_amount,
        "accumulated": 10000000,
        "code": None,
        "content": f"Thanh toan don hang {order_code} tu hoc ai",
        "referenceCode": f"FT{int(time.time())}",
        "description": f"Thanh toan don hang {order_code} tu hoc ai"
    }
    
    sepay_res = post_json(f"{BASE_URL}/api/webhook/sepay", sepay_webhook_payload)
    print(f"    -> SePay Webhook Response: {sepay_res}")
    assert sepay_res.get("success") is True, f"SePay webhook processing failed: {sepay_res}"

    # 6. Kiểm tra lại trạng thái đơn hàng sau khi duyệt SePay
    cur.execute("SELECT payment_status FROM orders WHERE order_code = %s", (order_code,))
    approved_order = cur.fetchone()
    print(f"\n[7] TRẠNG THÁI ĐƠN HÀNG SAU SEPAY:")
    print(f"    - Payment Status: {approved_order['payment_status']}")
    assert approved_order['payment_status'] == 'APPROVED', "Order was not automatically APPROVED by SePay!"
    print(f"    ✅ DUYỆT ĐƠN HÀNG TỰ ĐỘNG THÀNH CÔNG 100%!")

    # 7. Kiểm tra dữ liệu Phễu tổng hợp trong DB
    cur.execute("SELECT slug, views, cta_clicks, conversions FROM landing_pages WHERE slug = 'video-drama-gia-dinh-nho'")
    lp_after = cur.fetchone()
    
    # Tính toán doanh thu thực tế ghi nhận từ LP này
    cur.execute("""
        SELECT 
            COUNT(*) as total_orders,
            SUM(CASE WHEN payment_status = 'APPROVED' THEN 1 ELSE 0 END) as paid_orders,
            SUM(CASE WHEN payment_status = 'APPROVED' THEN price ELSE 0 END) as total_revenue
        FROM orders 
        WHERE landing_slug = 'video-drama-gia-dinh-nho'
    """)
    stats = cur.fetchone()

    # Bóc tách nguồn UTM
    cur.execute("""
        SELECT 
            utm_source,
            COUNT(*) as orders_count,
            SUM(CASE WHEN payment_status = 'APPROVED' THEN price ELSE 0 END) as revenue
        FROM orders 
        WHERE landing_slug = 'video-drama-gia-dinh-nho' AND utm_source IS NOT NULL
        GROUP BY utm_source
    """)
    utm_breakdown = cur.fetchall()

    print(f"\n[8] THỐNG KÊ PHỄU THỰC TẾ CỦA LANDING PAGE:")
    print(f"    - Tổng Lượt Xem (Views): {lp_after['views']} (Tăng {lp_after['views'] - lp_before['views']})")
    print(f"    - Lượt Bấm Mua (CTA Clicks): {lp_after['cta_clicks']} (Tăng {lp_after['cta_clicks'] - lp_before['cta_clicks']})")
    print(f"    - Tổng đơn phát sinh: {stats['total_orders']}")
    print(f"    - Đơn thanh toán thành công: {stats['paid_orders']}")
    print(f"    - Doanh thu ghi nhận từ LP này: {stats['total_revenue']:,.0f} đ")
    print(f"    - Bóc tách theo nguồn kênh (UTM Source):")
    for row in utm_breakdown:
        print(f"      • Kênh [{row['utm_source']}]: {row['orders_count']} đơn, Doanh thu: {row['revenue']:,.0f} đ")

    conn.close()
    print("\n==================================================")
    print("🎉 TOÀN BỘ KỊCH BẢN GIẢ LẬP & KIỂM THỬ ĐÃ THÀNH CÔNG 100%!")
    print("==================================================")

if __name__ == '__main__':
    run_simulation()
