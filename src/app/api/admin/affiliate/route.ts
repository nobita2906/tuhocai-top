import { NextResponse } from 'next/server';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { query, execute } from '@/lib/db';

export async function GET(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const status = searchParams.get('status') || '';

    let partnersSql = `
      SELECT p.*,
        (SELECT COUNT(*) FROM affiliate_clicks WHERE affiliate_id = p.id) as click_count,
        (SELECT COUNT(*) FROM affiliate_commissions WHERE affiliate_id = p.id) as order_count,
        (SELECT COALESCE(SUM(commission_amount), 0) FROM affiliate_commissions WHERE affiliate_id = p.id AND status = 'APPROVED') as approved_commission,
        (SELECT COALESCE(SUM(commission_amount), 0) FROM affiliate_commissions WHERE affiliate_id = p.id AND status = 'PENDING') as pending_commission
      FROM affiliate_partners p
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'ALL') {
      partnersSql += ' AND p.status = ?';
      params.push(status);
    }

    if (search) {
      partnersSql += ' AND (p.name LIKE ? OR p.code LIKE ? OR p.email LIKE ? OR p.phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    partnersSql += ' ORDER BY p.created_at DESC';

    const partners = await query<any>(partnersSql, params);

    // Lấy danh sách yêu cầu rút tiền
    const payouts = await query<any>(`
      SELECT po.*, p.name as partner_name, p.code as partner_code, p.email as partner_email, p.phone as partner_phone
      FROM affiliate_payouts po
      LEFT JOIN affiliate_partners p ON po.affiliate_id = p.id
      ORDER BY po.created_at DESC
      LIMIT 100
    `);

    // Tổng hợp chỉ số
    const totalPartners = partners.length;
    const totalBalance = partners.reduce((sum, p) => sum + Number(p.balance || 0), 0);
    const totalEarned = partners.reduce((sum, p) => sum + Number(p.total_earned || 0), 0);
    const pendingPayouts = payouts
      .filter((po) => po.status === 'REQUESTED')
      .reduce((sum, po) => sum + Number(po.amount || 0), 0);

    return NextResponse.json({
      success: true,
      partners,
      payouts,
      stats: {
        totalPartners,
        totalBalance,
        totalEarned,
        pendingPayouts,
        pendingPayoutCount: payouts.filter((po) => po.status === 'REQUESTED').length,
      },
    });
  } catch (error: any) {
    console.error('Admin affiliate error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const body = await req.json();
    const { partnerId, commissionRate, status, bankName, bankAccountNo, bankAccountName, notes } = body;

    if (!partnerId) {
      return NextResponse.json({ error: 'Thiếu ID đối tác cần cập nhật' }, { status: 400 });
    }

    const partners = await query<any>('SELECT * FROM affiliate_partners WHERE id = ? LIMIT 1', [partnerId]);
    if (partners.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy đối tác' }, { status: 404 });
    }

    const rate = commissionRate !== undefined ? Math.min(100, Math.max(0, Number(commissionRate))) : partners[0].commission_rate;
    const newStatus = status || partners[0].status;

    await execute(
      `UPDATE affiliate_partners
       SET commission_rate = ?, status = ?, bank_name = ?, bank_account_no = ?, bank_account_name = ?, notes = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        rate,
        newStatus,
        bankName !== undefined ? bankName : partners[0].bank_name,
        bankAccountNo !== undefined ? bankAccountNo : partners[0].bank_account_no,
        bankAccountName !== undefined ? bankAccountName?.toUpperCase() : partners[0].bank_account_name,
        notes !== undefined ? notes : partners[0].notes,
        partnerId,
      ]
    );

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật thông tin đối tác ${partners[0].name} (${partners[0].code}) thành công!`,
    });
  } catch (error: any) {
    console.error('Update partner error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
