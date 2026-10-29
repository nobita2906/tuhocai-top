import hmac
import hashlib
import time
import json
import urllib.request
import urllib.error
import sys

sys.stdout.reconfigure(encoding='utf-8')

SECRET = "whsec_Mb3fdTLikFj3RKluA4iyHRyMYxyXITZB"
BASE_URL = "http://localhost:8899/api/webhook/sepay"

def test_invalid_signature():
    payload = json.dumps({
        "id": 99999,
        "gateway": "VIB",
        "transferType": "in",
        "transferAmount": 69000,
        "content": "TEST SAI CHU KY"
    }).encode('utf-8')

    req = urllib.request.Request(
        BASE_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "x-sepay-signature": "sha256=invalid_hash_value_123456",
            "x-sepay-timestamp": str(int(time.time()))
        },
        method="POST"
    )

    try:
        urllib.request.urlopen(req)
        print("❌ FAIL: Request with invalid signature should have returned 401")
        return False
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("✅ PASS: Request with invalid signature returned 401 Unauthorized as expected")
            return True
        else:
            print(f"❌ FAIL: Expected 401, got {e.code}")
            return False

def test_valid_hmac_signature():
    timestamp = str(int(time.time()))
    payload_dict = {
        "id": 88888,
        "gateway": "VIB",
        "accountNumber": "0938494303",
        "transferType": "in",
        "transferAmount": 69000,
        "content": "TEST SEPAY WEBHOOK HMAC KHOP DON",
        "transactionDate": "2026-10-29 11:00:00"
    }
    raw_body = json.dumps(payload_dict)
    
    # Chuẩn SePay HMAC: Ký "${timestamp}.${rawBody}"
    sign_string = f"{timestamp}.{raw_body}".encode('utf-8')
    computed_hash = hmac.new(SECRET.encode('utf-8'), sign_string, hashlib.sha256).hexdigest()
    signature_header = f"sha256={computed_hash}"

    req = urllib.request.Request(
        BASE_URL,
        data=raw_body.encode('utf-8'),
        headers={
            "Content-Type": "application/json",
            "x-sepay-signature": signature_header,
            "x-sepay-timestamp": timestamp
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            res_json = json.loads(res_body)
            print(f"✅ PASS: Valid signature returned 200 OK. Response: {res_json}")
            assert res_json.get("success") is True
            return True
    except urllib.error.HTTPError as e:
        print(f"❌ FAIL: Expected 200, got {e.code}. Error: {e.read().decode('utf-8')}")
        return False

if __name__ == "__main__":
    print("--- KIỂM TRA BẢO MẬT WEBHOOK SEPAY (HMAC-SHA256) ---")
    t1 = test_invalid_signature()
    t2 = test_valid_hmac_signature()
    if t1 and t2:
        print("\n🎉 TẤT CẢ TEST XÁC THỰC HMAC-SHA256 SEPAY ĐỀU THÀNH CÔNG RỰC RỠ!")
    else:
        print("\n⚠️ CÓ TEST THẤT BẠI!")
