import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { execute, query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, phone, resource_id, resource_name } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Vui lòng cung cấp họ tên và email để nhận tài liệu.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if user is logged in
    const session = await getCurrentUser();
    let userId = session?.id || null;

    if (!userId) {
      // Find if email is already in users table
      const users = await query<any>('SELECT id FROM users WHERE email = ? LIMIT 1', [cleanEmail]);
      if (users.length > 0) {
        userId = users[0].id;
      }
    }

    // Save lead
    const leadId = randomUUID();
    await execute(
      `INSERT INTO leads (id, user_id, name, email, phone, resource_id, resource_name, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'free_download')`,
      [leadId, userId, cleanName, cleanEmail, phone || null, resource_id || 'FREE-ALL', resource_name || 'Bộ Tài Liệu AI Miễn Phí']
    );

    // If resource_id corresponds to a product in products table, find its download link
    let downloadUrl = 'https://drive.google.com/drive/folders/1TuhocAI_FreeResources_2026?usp=sharing';
    if (resource_id) {
      const prods = await query<any>('SELECT * FROM products WHERE pid = ? OR id = ? LIMIT 1', [resource_id, resource_id]);
      if (prods.length > 0) {
        downloadUrl = prods[0].download_url || downloadUrl;
        
        // If user exists, unlock directly in their library
        if (userId) {
          await execute(
            'INSERT IGNORE INTO user_library (id, user_id, product_id) VALUES (?, ?, ?)',
            [randomUUID(), userId, prods[0].id]
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng ký nhận tài liệu thành công!',
      download_url: downloadUrl,
      zalo_group: process.env.NEXT_PUBLIC_ZALO_GROUP || 'https://zalo.me/g/tuhocai',
      zalo_support: process.env.NEXT_PUBLIC_ZALO_SUPPORT || '0938494303'
    });
  } catch (err: any) {
    console.error('Lead capture error:', err);
    return NextResponse.json({ error: 'Lỗi ghi nhận thông tin: ' + (err.message || 'Lỗi máy chủ') }, { status: 500 });
  }
}
