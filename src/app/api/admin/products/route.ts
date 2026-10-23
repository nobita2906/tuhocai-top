import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { query, execute } from '@/lib/db';
import { slugifyVietnamese } from '@/lib/slugify';

export async function GET() {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const products = await query('SELECT * FROM products ORDER BY created_at DESC');
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const body = await req.json();
    const { pid, name, description, price, original_price, download_url, preview_url, category, is_active } = body;

    if (!pid || !name) {
      return NextResponse.json({ error: 'Mã PID và Tên sản phẩm không được để trống' }, { status: 400 });
    }

    const slug = slugifyVietnamese(name) || `san-pham-${Date.now()}`;
    const id = randomUUID();

    await execute(
      `INSERT INTO products (id, pid, name, slug, description, price, original_price, download_url, preview_url, category, is_active, sales_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        id,
        pid.trim().toUpperCase(),
        name.trim(),
        slug,
        description || '',
        Number(price) || 0,
        Number(original_price) || 0,
        download_url?.trim() || '',
        preview_url?.trim() || '',
        category || 'workflow',
        is_active ? 1 : 0,
      ]
    );

    return NextResponse.json({ success: true, message: 'Đã tạo sản phẩm thành công!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const body = await req.json();
    const { id, name, description, price, original_price, download_url, preview_url, category, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID sản phẩm' }, { status: 400 });
    }

    await execute(
      `UPDATE products SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        original_price = COALESCE(?, original_price),
        download_url = COALESCE(?, download_url),
        preview_url = COALESCE(?, preview_url),
        category = COALESCE(?, category),
        is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [
        name ? name.trim() : null,
        description !== undefined ? description : null,
        price !== undefined ? Number(price) : null,
        original_price !== undefined ? Number(original_price) : null,
        download_url !== undefined ? download_url.trim() : null,
        preview_url !== undefined ? preview_url.trim() : null,
        category !== undefined ? category : null,
        is_active !== undefined ? (is_active ? 1 : 0) : null,
        id,
      ]
    );

    return NextResponse.json({ success: true, message: 'Cập nhật sản phẩm thành công!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
