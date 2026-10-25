import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get('q')?.trim() || '';

    if (!identifier || identifier.length < 3) {
      return NextResponse.json(
        { error: 'Vui lòng nhập Email hoặc Số điện thoại hợp lệ (tối thiểu 3 ký tự)' },
        { status: 400 }
      );
    }

    const cleanId = identifier.toLowerCase();

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
      [cleanId, identifier]
    );

    return NextResponse.json({
      success: true,
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
  } catch (err: any) {
    console.error('Lỗi tra cứu Kho Của Tôi:', err);
    return NextResponse.json({ error: 'Lỗi máy chủ khi tra cứu dữ liệu' }, { status: 500 });
  }
}
