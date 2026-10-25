import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { query, execute } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, code, bankName, bankAccountNo, bankAccountName } = body;

    if (!name || !email || !code) {
      return NextResponse.json({ error: 'Vui lòng điền họ tên, email và mã giới thiệu mong muốn' }, { status: 400 });
    }

    const cleanCode = code.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (cleanCode.length < 3 || cleanCode.length > 30) {
      return NextResponse.json({ error: 'Mã giới thiệu phải từ 3 đến 30 ký tự (chỉ gồm chữ cái, số và dấu gạch)' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Kiểm tra xem code hoặc email đã được đăng ký chưa
    const existing = await query<any>(
      'SELECT id, code, email FROM affiliate_partners WHERE LOWER(code) = ? OR LOWER(email) = ? LIMIT 1',
      [cleanCode, cleanEmail]
    );

    if (existing.length > 0) {
      if (existing[0].code.toLowerCase() === cleanCode) {
        return NextResponse.json({ error: `Mã giới thiệu '${cleanCode}' đã có người sử dụng. Vui lòng chọn mã khác!` }, { status: 400 });
      }
      return NextResponse.json({ error: `Email '${cleanEmail}' đã được đăng ký đối tác trước đó.` }, { status: 400 });
    }

    const session = await getCurrentUser();
    const partnerId = randomUUID();

    await execute(
      `INSERT INTO affiliate_partners (
        id, user_id, code, name, email, phone, commission_rate, balance, total_earned,
        bank_name, bank_account_no, bank_account_name, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, 30, 0, 0, ?, ?, ?, 'ACTIVE', 'Đăng ký trực tuyến')`,
      [
        partnerId,
        session?.id || null,
        cleanCode,
        name.trim(),
        cleanEmail,
        phone?.trim() || null,
        bankName?.trim() || null,
        bankAccountNo?.trim() || null,
        bankAccountName?.trim()?.toUpperCase() || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Đăng ký đối tác Affiliate thành công! Bạn có thể bắt đầu chia sẻ link ngay.',
      partner: {
        id: partnerId,
        code: cleanCode,
        name: name.trim(),
        email: cleanEmail,
        commissionRate: 30,
        refUrl: `https://www.tuhocai.top/?ref=${cleanCode}`,
      },
    });
  } catch (error: any) {
    console.error('Affiliate register error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi đăng ký đối tác' }, { status: 500 });
  }
}
