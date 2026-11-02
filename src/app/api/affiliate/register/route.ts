import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { query, execute } from '@/lib/db';
import { getCurrentUser, hashPassword, signJWT, getSessionCookieOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import { DEFAULT_COMMISSION_RATE } from '@/lib/affiliate';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, code, password, bankName, bankAccountNo, bankAccountName } = body;

    if (!name || !email || !code) {
      return NextResponse.json({ error: 'Vui lòng điền họ tên, email và mã giới thiệu mong muốn' }, { status: 400 });
    }

    const cleanCode = code.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (cleanCode.length < 3 || cleanCode.length > 30) {
      return NextResponse.json({ error: 'Mã giới thiệu phải từ 3 đến 30 ký tự (chỉ gồm chữ cái, số và dấu gạch)' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Kiểm tra xem code hoặc email đã được đăng ký đối tác chưa
    const existing = await query<any>(
      'SELECT id, code, email FROM affiliate_partners WHERE LOWER(code) = ? OR LOWER(email) = ? LIMIT 1',
      [cleanCode, cleanEmail]
    );

    if (existing.length > 0) {
      if (existing[0].code.toLowerCase() === cleanCode) {
        return NextResponse.json({ error: `Mã giới thiệu '${cleanCode}' đã có người sử dụng. Vui lòng chọn mã khác!` }, { status: 400 });
      }
      return NextResponse.json({ error: `Email '${cleanEmail}' đã được đăng ký đối tác trước đó. Vui lòng đăng nhập để xem thông tin!` }, { status: 400 });
    }

    let session = await getCurrentUser();
    let userId = session?.id || null;

    // "Đăng ký làm đối tác cũng chính là tạo tài khoản trong hệ thống Tự Học AI"
    // Nếu chưa đăng nhập, tự động tạo tài khoản người dùng hoặc liên kết tài khoản đã có
    if (!userId) {
      const existingUser = await query<any>('SELECT id, name, email FROM users WHERE LOWER(email) = ? LIMIT 1', [cleanEmail]);
      if (existingUser.length > 0) {
        userId = existingUser[0].id;
      } else {
        userId = randomUUID();
        const pwdToHash = password && password.length >= 6 ? password : 'Th' + Math.floor(100000 + Math.random() * 900000) + '@';
        const passwordHash = await hashPassword(pwdToHash);
        await execute(
          'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
          [userId, name.trim(), cleanEmail, passwordHash, 'USER']
        );
      }

      // Tự động đăng nhập phiên cho người dùng
      try {
        const payload = { id: userId as string, email: cleanEmail, name: name.trim(), role: 'USER' as const };
        const token = await signJWT(payload);
        const cookieStore = await cookies();
        const cookieOpts = getSessionCookieOptions();
        cookieStore.set(cookieOpts.name, token, cookieOpts);
      } catch (authErr) {
        console.error('Auto login cookie error:', authErr);
      }
    }

    const partnerId = randomUUID();

    await execute(
      `INSERT INTO affiliate_partners (
        id, user_id, code, name, email, phone, commission_rate, balance, total_earned,
        bank_name, bank_account_no, bank_account_name, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, 'ACTIVE', 'Đăng ký đối tác trực tuyến & tạo tài khoản')`,
      [
        partnerId,
        userId,
        cleanCode,
        name.trim(),
        cleanEmail,
        phone?.trim() || null,
        DEFAULT_COMMISSION_RATE,
        bankName?.trim() || null,
        bankAccountNo?.trim() || null,
        bankAccountName?.trim()?.toUpperCase() || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Đăng ký đối tác & tạo tài khoản thành công! Bạn đã được kích hoạt mức hoa hồng 60% trọn đời.',
      partner: {
        id: partnerId,
        code: cleanCode,
        name: name.trim(),
        email: cleanEmail,
        commissionRate: DEFAULT_COMMISSION_RATE,
        refUrl: `https://www.tuhocai.top/?ref=${cleanCode}`,
      },
    });
  } catch (error: any) {
    console.error('Affiliate register error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi đăng ký đối tác' }, { status: 500 });
  }
}
