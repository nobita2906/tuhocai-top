import sys
import json
import urllib.request
import urllib.error
import http.cookiejar

sys.stdout.reconfigure(encoding='utf-8')
BASE_URL = "http://localhost:8899"

# Dùng CookieJar để lưu cookie phiên đăng nhập
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def test_logged_in_checkout_without_phone():
    print("--- 1. TEST ĐĂNG NHẬP ADMIN VÀ CHECKOUT KHÔNG CẦN NHẬP SĐT ---")
    # Đăng nhập Admin trước
    login_data = json.dumps({"email": "dang@tuhocai.top", "password": "admin"}).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/api/auth/login", data=login_data, headers={"Content-Type": "application/json"})
    with opener.open(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        assert res.get("success") is True
        print(f"✅ Đăng nhập Admin thành công: {res.get('user', {}).get('email')}")

    # Tạo đơn hàng KHÔNG gửi SĐT
    checkout_data = json.dumps({
        "productId": "WF-N8N-001",
        "customerName": "Nguyễn Văn Đăng (Admin)",
        "customerEmail": "dang@tuhocai.top"
        # Không có customerPhone!
    }).encode('utf-8')
    
    c_req = urllib.request.Request(f"{BASE_URL}/api/checkout", data=checkout_data, headers={"Content-Type": "application/json"})
    with opener.open(c_req) as resp:
        c_res = json.loads(resp.read().decode('utf-8'))
        assert c_res.get("success") is True
        print(f"✅ Khách đã đăng nhập checkout thành công mà KHÔNG cần SĐT! Mã đơn: {c_res.get('orderCode')}")

def test_telegram_settings_api():
    print("\n--- 2. TEST QUẢN LÝ CẤU HÌNH THÔNG BÁO TELEGRAM ĐA KÊNH ---")
    # Lấy cấu hình
    req = urllib.request.Request(f"{BASE_URL}/api/admin/telegram-settings")
    with opener.open(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        assert data.get("success") is True
        print(f"✅ Lấy cấu hình thành công! Số kênh hiện tại: {len(data.get('channels', []))}")

    # Thêm nhiều kênh với nút + (giả lập lưu 3 kênh: Admin, Group Kinh Doanh, Kênh Chốt Sale)
    new_channels = [
        {
            "id": "chan-admin",
            "name": "Admin Duyệt Đơn (Cá nhân)",
            "chatId": "6580812076",
            "type": "MANUAL_REVIEW_ONLY",
            "enabled": True
        },
        {
            "id": "chan-group-sales",
            "name": "Group Kinh Doanh & Chốt Sale",
            "chatId": "6580812076", # Giả lập cùng chat id test
            "type": "SUCCESS_ONLY",
            "enabled": True
        },
        {
            "id": "chan-all",
            "name": "Kênh Tổng Hợp Tự Học AI",
            "chatId": "6580812076",
            "type": "ALL",
            "enabled": True
        }
    ]

    save_payload = json.dumps({
        "botToken": "8781006384:AAHDfcnSsIiwDpycoY9G-fd7ug5-Ne2Oq0Y",
        "channels": new_channels,
        "templates": data.get("templates")
    }).encode('utf-8')

    save_req = urllib.request.Request(f"{BASE_URL}/api/admin/telegram-settings", data=save_payload, headers={"Content-Type": "application/json"})
    with opener.open(save_req) as resp:
        save_res = json.loads(resp.read().decode('utf-8'))
        assert save_res.get("success") is True
        print("✅ Lưu cấu hình 3 kênh tùy biến thành công!")

    # Test gửi tin thử nghiệm
    test_payload = json.dumps({
        "action": "TEST",
        "targetChatId": "6580812076",
        "botToken": "8781006384:AAHDfcnSsIiwDpycoY9G-fd7ug5-Ne2Oq0Y",
        "testMessage": "🔔 *KIỂM TRA TÍNH NĂNG TÙY BIẾN ĐA KÊNH TELEGRAM!*\nĐã test thành công nút kiểm tra kênh."
    }).encode('utf-8')
    test_req = urllib.request.Request(f"{BASE_URL}/api/admin/telegram-settings", data=test_payload, headers={"Content-Type": "application/json"})
    with opener.open(test_req) as resp:
        test_res = json.loads(resp.read().decode('utf-8'))
        assert test_res.get("success") is True
        print("✅ Test gửi tin nhắn thử nghiệm lên Telegram thành công!")

def test_auto_login_on_approval():
    print("\n--- 3. TEST TỰ ĐỘNG ĐĂNG NHẬP KHÁCH MỚI KHI DUYỆT ĐƠN (CHECK-STATUS) ---")
    # Tạo client mới (chưa đăng nhập)
    guest_opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
    guest_email = "khach_moi_auto_login_test@tuhocai.top"
    guest_phone = "0987654321"

    c_payload = json.dumps({
        "productId": "WF-N8N-001",
        "customerName": "Khách Mới Auto Login",
        "customerEmail": guest_email,
        "customerPhone": guest_phone,
    }).encode('utf-8')

    req = urllib.request.Request(f"{BASE_URL}/api/checkout", data=c_payload, headers={"Content-Type": "application/json"})
    with guest_opener.open(req) as resp:
        order = json.loads(resp.read().decode('utf-8'))
        order_id = order.get("orderId")
        order_code = order.get("orderCode")
        print(f"✅ Khách mới tạo đơn: {order_code}")

    # Duyệt đơn qua Telegram callback
    tg_payload = json.dumps({
        "callback_query": {
            "id": "cb_guest_test",
            "data": f"APPROVE:{order_id}",
            "message": { "message_id": 999991, "chat": { "id": 6580812076 } }
        }
    }).encode('utf-8')
    with guest_opener.open(urllib.request.Request(f"{BASE_URL}/api/telegram-webhook", data=tg_payload, headers={"Content-Type": "application/json"})) as resp:
        pass

    # Gọi check-status để nhận cookie phiên đăng nhập tự động
    status_req = urllib.request.Request(f"{BASE_URL}/api/orders/check-status?orderCode={order_code}")
    with guest_opener.open(status_req) as resp:
        st = json.loads(resp.read().decode('utf-8'))
        assert st.get("status") == "APPROVED"
        assert st.get("autoLoggedIn") is True
        print(f"✅ Đơn hàng APPROVED và đã tự động đăng nhập khách hàng: {st.get('user', {}).get('email')}")

    # Kiểm tra gọi /api/auth/me xem khách đã đăng nhập chưa
    me_req = urllib.request.Request(f"{BASE_URL}/api/auth/me")
    with guest_opener.open(me_req) as resp:
        me_res = json.loads(resp.read().decode('utf-8'))
        assert me_res.get("authenticated") is True
        print("✅ Kiểm tra /api/auth/me xác nhận khách hàng ĐÃ ĐƯỢC ĐĂNG NHẬP TỰ ĐỘNG THÀNH CÔNG!")

if __name__ == "__main__":
    test_logged_in_checkout_without_phone()
    test_telegram_settings_api()
    test_auto_login_on_approval()
    print("\n🎉🎉🎉 TẤT CẢ 3 BỘ TÍNH NĂNG MỚI ĐỀU HOÀN THÀNH VÀ TEST ĐẠT 100%!")
