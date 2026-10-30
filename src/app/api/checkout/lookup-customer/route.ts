import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email || !email.includes('@')) {
      return NextResponse.json({ exists: false });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Tìm trong bảng orders đơn hàng gần nhất có tên và SĐT
    const rows = await query<any>(
      `SELECT customer_name, customer_phone 
       FROM orders 
       WHERE LOWER(customer_email) = ? AND customer_phone IS NOT NULL AND customer_phone != '' 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [cleanEmail]
    );

    if (rows.length > 0) {
      return NextResponse.json({
        exists: true,
        name: rows[0].customer_name || '',
        phone: rows[0].customer_phone || '',
      });
    }

    // Nếu chưa có đơn hàng, kiểm tra trong bảng users
    const userRows = await query<any>(
      'SELECT name FROM users WHERE LOWER(email) = ? LIMIT 1',
      [cleanEmail]
    );

    if (userRows.length > 0) {
      return NextResponse.json({
        exists: true,
        name: userRows[0].name || '',
        phone: '',
      });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    return NextResponse.json({ exists: false });
  }
}
