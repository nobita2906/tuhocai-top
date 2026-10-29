import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { query, execute } from '@/lib/db';
import { verifyPassword, hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const identifier = String(body.identifier || body.q || '').trim();
    const password = String(body.password || body.pass || '').trim();

    return await handleVaultLookup(identifier, password);
  } catch (err: any) {
    return NextResponse.json({ error: 'Dữ liệu yêu cầu không hợp lệ' }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get('q')?.trim() || '';
    const password = searchParams.get('pass')?.trim() || '';

    return await handleVaultLookup(identifier, password);
  } catch (err: any) {
    return NextResponse.json({ error: 'Lỗi xử lý yêu cầu tra cứu' }, { status: 500 });
  }
}

async function handleVaultLookup(identifier: string, password: string) {
  if (!identifier || identifier.length < 3) {
    return NextResponse.json(
      { error: 'Vui lòng nhập Email hoặc Số điện thoại khi mua hàng' },
      { status: 400 }
    );
  }

  if (!password) {
    return NextResponse.json(
      { error: 'Vui lòng nhập mật khẩu. (Mặc định là Số điện thoại 10 số bạn đã dùng khi đặt hàng).' },
      { status: 400 }
    );
  }

  const cleanIdentifier = identifier.replace(/\s+/g, '').trim();
  const cleanId = cleanIdentifier.toLowerCase();

  // 1. Tìm tất cả đơn hàng đã được duyệt của khách hàng
  const orders = await query<any>(
    `SELECT 
      o.id,
      o.order_code,
      o.customer_name,
      o.customer_email,
      o.customer_phone,
      o.product_name,
      o.price,
      o.payment_status,
      o.created_at,
      o.approved_at,
      p.slug as product_slug,
      p.download_url,
      p.thumbnail,
      p.category
    FROM orders o
    LEFT JOIN products p ON o.product_id = p.id
    WHERE (LOWER(TRIM(o.customer_email)) = ? OR TRIM(o.customer_phone) = ?)
      AND o.payment_status = 'APPROVED'
    ORDER BY o.created_at DESC`,
    [cleanId, cleanIdentifier]
  );

  if (orders.length === 0) {
    return NextResponse.json(
      { error: 'Không tìm thấy đơn hàng đã kích hoạt nào với Email/SĐT này. Nếu vừa chuyển khoản, vui lòng đợi 1-3 phút để hệ thống tự động đối soát.' },
      { status: 404 }
    );
  }

  const customerEmail = String(orders[0].customer_email || '').toLowerCase().trim();
  const customerPhone = String(orders[0].customer_phone || '').replace(/\s+/g, '').trim();

  // 2. Xác thực mật khẩu
  let isValidPassword = false;
  const users = await query<any>('SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1', [customerEmail]);

  if (users.length > 0) {
    const user = users[0];
    if (user.password_hash) {
      isValidPassword = await verifyPassword(password, user.password_hash);
    }
  } else {
    // Nếu chưa có user trong bảng users, kiểm tra mật khẩu có khớp với Số điện thoại đơn hàng không
    if (customerPhone && (password === customerPhone)) {
      isValidPassword = true;
      // Tự động tạo user cho khách
      const newUserId = randomUUID();
      const hashedPassword = await hashPassword(password);
      await execute(
        'INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [newUserId, orders[0].customer_name || 'Khách hàng', customerEmail, hashedPassword, 'USER']
      ).catch(() => {});
    }
  }

  if (!isValidPassword) {
    return NextResponse.json(
      { error: 'Mật khẩu không chính xác! Mật khẩu mặc định là Số điện thoại 10 số bạn đã dùng khi đặt hàng.' },
      { status: 401 }
    );
  }

  // 3. Trả về kết quả mở khóa
  return NextResponse.json({
    success: true,
    customer: {
      name: orders[0].customer_name,
      email: customerEmail,
      phone: customerPhone,
    },
    orders: orders.map((o) => ({
      id: o.id,
      orderCode: o.order_code,
      productName: o.product_name,
      productSlug: o.product_slug,
      category: o.category,
      price: o.price,
      downloadUrl: o.download_url,
      thumbnail: o.thumbnail,
      approvedAt: o.approved_at || o.created_at,
    })),
  });
}
