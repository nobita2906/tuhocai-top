import os
import sys
import io
import json
import time
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

def post_json(url: str, data: dict, headers: dict = None) -> tuple:
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
            return resp.status, json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(body)
        except Exception:
            return e.code, {"error": f"HTTP {e.code}: {body}"}
    except Exception as e:
        return 500, {"error": str(e)}

def run_tests():
    print("==================================================")
    print("🚀 BẮT ĐẦU KIỂM THỬ GIẢ LẬP CÁC YÊU CẦU MỚI BỔ SUNG")
    print("   Thực hiện bởi: Thùy Linh (Trợ lý điều hành Tự Học AI)")
    print("==================================================")

    # TEST 1: Validate Email sai định dạng
    print("\n[TEST 1] Kiểm tra chặn Email sai định dạng:")
    status, res = post_json(f"{BASE_URL}/api/checkout", {
        "productId": "WF-DRAMA-069",
        "customerName": "Test Sai Email",
        "customerEmail": "nguyendang.sai-dinh-dang",
        "customerPhone": "0934434101"
    })
    print(f"    Status: {status} | Response: {res}")
    assert status == 400, "Should reject invalid email"
    assert "Email không đúng định dạng" in res.get("error", ""), "Should return email format error"
    print("    ✅ TEST 1 PASSED: Đã chặn email sai định dạng thành công!")

    # TEST 2: Validate Số điện thoại không đủ 10 số
    print("\n[TEST 2] Kiểm tra chặn Số điện thoại không đúng 10 số (VD: 9 số):")
    status, res = post_json(f"{BASE_URL}/api/checkout", {
        "productId": "WF-DRAMA-069",
        "customerName": "Test Sai SĐT",
        "customerEmail": "nguyendang@tuhocai.top",
        "customerPhone": "093443410" # 9 số
    })
    print(f"    Status: {status} | Response: {res}")
    assert status == 400, "Should reject phone != 10 digits"
    assert "đúng 10 chữ số" in res.get("error", ""), "Should return 10-digit phone error"
    print("    ✅ TEST 2 PASSED: Đã chặn số điện thoại không đúng 10 số thành công!")

    # TEST 3: Tạo đơn hàng chuẩn (Email chuẩn + SĐT 10 số) và tự động tạo tài khoản với pass = SĐT
    test_id = int(time.time())
    test_email = f"hocvien_{test_id}@tuhocai.top"
    test_phone = "0934434101" # 10 số
    print(f"\n[TEST 3] Tạo đơn hàng chuẩn:")
    print(f"    - Email: {test_email}")
    print(f"    - SĐT: {test_phone}")
    status, checkout_res = post_json(f"{BASE_URL}/api/checkout", {
        "productId": "WF-DRAMA-069",
        "customerName": f"Học Viên VIP {test_id}",
        "customerEmail": test_email,
        "customerPhone": test_phone,
        "landingSlug": "video-drama-gia-dinh-nho"
    })
    print(f"    Status: {status} | Order Code: {checkout_res.get('orderCode')}")
    assert status == 200, f"Checkout failed: {checkout_res}"
    order_code = checkout_res["orderCode"]
    order_amount = checkout_res["product"]["price"]

    # Kiểm tra trong DB xem User đã được tự động tạo với password là test_phone chưa
    conn = pymysql.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute("SELECT id, name, email, password_hash FROM users WHERE LOWER(email) = %s", (test_email.lower(),))
    created_user = cur.fetchone()
    print(f"    -> Đã tự động tạo User: {created_user['name']} (ID: {created_user['id']})")
    assert created_user is not None, "User should be automatically created in DB"

    # Giả lập SePay duyệt đơn để đơn thành APPROVED
    sepay_payload = {
        "id": test_id,
        "gateway": "VIB",
        "transactionDate": time.strftime("%Y-%m-%d %H:%M:%S"),
        "accountNumber": "0934434101",
        "transferType": "in",
        "transferAmount": order_amount,
        "content": f"Thanh toan {order_code}",
        "description": f"Thanh toan {order_code}"
    }
    status, sepay_res = post_json(f"{BASE_URL}/api/webhook/sepay", sepay_payload)
    assert status == 200, f"SePay failed: {sepay_res}"
    print(f"    -> Đã duyệt thanh toán SePay thành công!")
    print("    ✅ TEST 3 PASSED: Tạo đơn và tài khoản tự động thành công!")

    # TEST 4: Tra cứu Kho Của Tôi - Sai Mật Khẩu
    print("\n[TEST 4] Tra cứu Kho Của Tôi với Mật khẩu SAI:")
    status, vault_err = post_json(f"{BASE_URL}/api/orders/my-vault", {
        "identifier": test_email,
        "password": "wrong_password_123"
    })
    print(f"    Status: {status} | Response: {vault_err}")
    assert status == 401, "Should reject wrong password"
    assert "Mật khẩu không chính xác" in vault_err.get("error", ""), "Should return wrong password error"
    print("    ✅ TEST 4 PASSED: Đã chặn truy cập khi sai mật khẩu!")

    # TEST 5: Tra cứu Kho Của Tôi - Đúng Mật Khẩu Mặc Định (SĐT 10 số)
    print(f"\n[TEST 5] Tra cứu Kho Của Tôi với Mật khẩu MẶC ĐỊNH (SĐT: {test_phone}):")
    status, vault_ok = post_json(f"{BASE_URL}/api/orders/my-vault", {
        "identifier": test_email,
        "password": test_phone
    })
    print(f"    Status: {status} | Khách hàng: {vault_ok.get('customer', {}).get('name')}")
    print(f"    Số sản phẩm mở khóa: {len(vault_ok.get('orders', []))}")
    assert status == 200, f"Vault lookup failed: {vault_ok}"
    assert len(vault_ok.get('orders', [])) > 0, "Should return approved products"
    print("    ✅ TEST 5 PASSED: Mở khóa Kho Của Tôi bằng SĐT thành công 100%!")

    # TEST 6: Đổi Mật Khẩu sang Mật Khẩu Mới
    new_password = "MySecurePassword2026@"
    print(f"\n[TEST 6] Đổi Mật Khẩu sang mật khẩu mới ({new_password}):")
    status, change_res = post_json(f"{BASE_URL}/api/user/change-password", {
        "email": test_email,
        "currentPassword": test_phone, # pass cũ là SĐT
        "newPassword": new_password
    })
    print(f"    Status: {status} | Response: {change_res}")
    assert status == 200, f"Change password failed: {change_res}"
    print("    ✅ TEST 6 PASSED: Đổi mật khẩu thành công!")

    # TEST 7: Thử tra cứu lại bằng SĐT cũ (phải bị từ chối)
    print(f"\n[TEST 7] Tra cứu lại bằng mật khẩu cũ (SĐT):")
    status, old_lookup = post_json(f"{BASE_URL}/api/orders/my-vault", {
        "identifier": test_email,
        "password": test_phone
    })
    print(f"    Status: {status} | Response: {old_lookup}")
    assert status == 401, "Old password should now be rejected"
    print("    ✅ TEST 7 PASSED: Mật khẩu cũ đã bị vô hiệu hóa chính xác!")

    # TEST 8: Tra cứu lại bằng Mật Khẩu Mới vừa đổi
    print(f"\n[TEST 8] Tra cứu lại bằng Mật Khẩu MỚI ({new_password}):")
    status, new_lookup = post_json(f"{BASE_URL}/api/orders/my-vault", {
        "identifier": test_email,
        "password": new_password
    })
    print(f"    Status: {status} | Mở khóa thành công: {len(new_lookup.get('orders', []))} sản phẩm")
    assert status == 200, "New password must unlock vault"
    print("    ✅ TEST 8 PASSED: Mật khẩu mới mở khóa Kho Của Tôi thành công 100%!")

    conn.close()
    print("\n==================================================")
    print("🎉 TOÀN BỘ 8 BÀI KIỂM THỬ GIẢ LẬP ĐÃ HOÀN TẤT THÀNH CÔNG 100%!")
    print("==================================================")

if __name__ == '__main__':
    run_tests()
