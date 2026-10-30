const mysql = require('mysql2/promise');
require('dotenv').config();

async function testTelegramButton() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Lấy product UUID thực tế
  const [prods] = await conn.query("SELECT id FROM products WHERE pid = 'SKILL-CLONE-099' LIMIT 1");
  const prodId = prods[0].id;

  // 1. Tạo 1 đơn hàng test PENDING
  const orderId = 'test-tg-' + Date.now();
  const orderCode = 'THAI' + Math.floor(100000 + Math.random() * 900000);
  await conn.query(
    'INSERT INTO orders (id, order_code, customer_name, customer_email, product_id, product_name, price, payment_status, payment_method, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())', 
    [orderId, orderCode, 'Anh Đăng Test Telegram', 'dangtest@tuhocai.top', prodId, 'Skill Clone Landing Page', 99000, 'PENDING', 'VIETQR']
  );

  console.log('1. Đã tạo đơn hàng test:', orderCode, '| ID:', orderId);

  // 2. Giả lập Telegram gửi callback_query khi bấm nút DUYỆT
  const payload = {
    callback_query: {
      id: 'cb_query_' + Date.now(),
      data: 'APPROVE:' + orderId,
      message: {
        message_id: 123456,
        chat: { id: 6580812076 }
      }
    }
  };

  const res = await fetch('http://localhost:8899/api/telegram-webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const resData = await res.json();
  console.log('2. Webhook response:', resData);

  // 3. Kiểm tra lại trạng thái đơn hàng trong Database
  const [rows] = await conn.query('SELECT order_code, payment_status, approved_by, approved_at FROM orders WHERE id = ?', [orderId]);
  console.log('3. Trạng thái đơn hàng sau khi duyệt qua Telegram:', rows[0]);

  // Xóa đơn test
  await conn.query('DELETE FROM orders WHERE id = ?', [orderId]);
  console.log('4. Đã dọn dẹp đơn test.');

  await conn.end();
}

testTelegramButton().catch(console.error);
