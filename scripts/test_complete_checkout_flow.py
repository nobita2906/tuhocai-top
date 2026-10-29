import sys
import json
import time
import urllib.request
import urllib.error

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8899"

def test_full_checkout_flow():
    print("--- 1. TEST KHỞI TẠO ĐƠN HÀNG VỚI ACB & TIỀN TỐ KHÓA HỌC ---")
    checkout_payload = {
        "productId": "WF-N8N-001",
        "customerName": "Nguyễn Văn Đăng Test",
        "customerEmail": "dang_test_acb_flow@tuhocai.top",
        "customerPhone": "0934434101",
    }
    
    req = urllib.request.Request(
        f"{BASE_URL}/api/checkout",
        data=json.dumps(checkout_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            assert data.get("success") is True, "Khởi tạo đơn hàng không thành công"
            order_id = data.get("orderId")
            order_code = data.get("orderCode")
            vietqr_url = data.get("vietQrUrl", "")
            bank_info = data.get("bankInfo", {})
            
            print(f"✅ Tạo đơn thành công! Mã đơn: {order_code}, ID: {order_id}")
            print(f"🏦 Ngân hàng: {bank_info.get('bankName')} - STK: {bank_info.get('accountNo')}")
            print(f"📝 Nội dung CK: {bank_info.get('content')}")
            print(f"🔗 VietQR URL: {vietqr_url}")
            
            assert "ACB" in vietqr_url and "4747827" in vietqr_url, "VietQR chưa trỏ đúng ACB 4747827"
            assert bank_info.get("accountNo") == "4747827", "STK chưa phải 4747827"
            assert "THAI" in bank_info.get("content", ""), "Nội dung CK chưa chứa mã đơn"
            
    except Exception as e:
        print(f"❌ Lỗi bước 1: {e}")
        return False

    print("\n--- 2. TEST GỬI YÊU CẦU DUYỆT TAY QUA TELEGRAM (NÚT BẤM SAU 60S) ---")
    review_req = urllib.request.Request(
        f"{BASE_URL}/api/orders/request-manual-review",
        data=json.dumps({"orderCode": order_code}).encode('utf-8'),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(review_req) as resp:
            review_data = json.loads(resp.read().decode('utf-8'))
            print(f"✅ Gửi yêu cầu duyệt tay thành công: {review_data.get('message')}")
            assert review_data.get("success") is True
    except Exception as e:
        print(f"❌ Lỗi bước 2: {e}")
        return False

    print("\n--- 3. TEST TELEGRAM DUYỆT ĐƠN (APPROVE VIA TELEGRAM WEBHOOK CALLBACK) ---")
    # Giả lập payload Telegram callback_query khi anh Đăng bấm nút [✅ DUYỆT ĐƠN & MỞ KHÓA NGAY]
    tg_payload = {
        "callback_query": {
            "id": "cb_test_12345",
            "data": f"APPROVE:{order_id}",
            "message": {
                "message_id": 999999,
                "chat": { "id": 6580812076 }
            }
        }
    }
    tg_req = urllib.request.Request(
        f"{BASE_URL}/api/telegram-webhook",
        data=json.dumps(tg_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(tg_req) as resp:
            tg_data = json.loads(resp.read().decode('utf-8'))
            print(f"✅ Telegram Webhook xử lý phê duyệt thành công: {tg_data}")
            assert tg_data.get("ok") is True
    except Exception as e:
        print(f"❌ Lỗi bước 3: {e}")
        return False

    print("\n--- 4. TEST KIỂM TRA TRẠNG THÁI ĐƠN HÀNG (POLLING TỰ ĐỘNG CHUYỂN TRANG) ---")
    time.sleep(1)
    status_req = urllib.request.Request(f"{BASE_URL}/api/orders/check-status?orderCode={order_code}")
    try:
        with urllib.request.urlopen(status_req) as resp:
            status_data = json.loads(resp.read().decode('utf-8'))
            print(f"✅ Trạng thái đơn hiện tại: {status_data}")
            assert status_data.get("status") == "APPROVED", f"Trạng thái không phải APPROVED: {status_data}"
            assert status_data.get("downloadUrl"), "Không có link tải sau khi duyệt"
            print("🚀 Web nhận tín hiệu APPROVED thành công -> Sẽ tự động chuyển ngay sang trang Tải tài liệu!")
    except Exception as e:
        print(f"❌ Lỗi bước 4: {e}")
        return False

    return True

if __name__ == "__main__":
    success = test_full_checkout_flow()
    if success:
        print("\n🎉🎉🎉 TOÀN BỘ LUỒNG TEST ACB + VIETQR + DUYỆT TELEGRAM ĐÃ HOÀN HẢO 100%!")
    else:
        print("\n⚠️ CÓ BƯỚC TEST THẤT BẠI!")
        sys.exit(1)
