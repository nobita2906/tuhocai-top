import { NextResponse } from 'next/server';
import { verifyAdminSession, unauthorizedAdminResponse } from '@/lib/adminAuth';
import { query, execute } from '@/lib/db';

export async function PUT(req: Request) {
  const admin = await verifyAdminSession();
  if (!admin) return unauthorizedAdminResponse();

  try {
    const { payoutId, action, notes, proofImage } = await req.json();

    if (!payoutId || !['TRANSFERRED', 'REJECTED'].includes(action)) {
      return NextResponse.json({ error: 'Yêu cầu hành động không hợp lệ' }, { status: 400 });
    }

    const payouts = await query<any>('SELECT * FROM affiliate_payouts WHERE id = ? LIMIT 1', [payoutId]);
    if (payouts.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy yêu cầu rút tiền' }, { status: 404 });
    }

    const payout = payouts[0];
    if (payout.status !== 'REQUESTED') {
      return NextResponse.json({ error: `Yêu cầu rút tiền này đã được xử lý trước đó (${payout.status})` }, { status: 400 });
    }

    if (action === 'TRANSFERRED') {
      await execute(
        `UPDATE affiliate_payouts
         SET status = 'TRANSFERRED', transferred_at = NOW(), transferred_by = ?, notes = ?, proof_image = ?
         WHERE id = ?`,
        [admin.name, notes || null, proofImage || null, payout.id]
      );

      return NextResponse.json({
        success: true,
        message: `Đã xác nhận chuyển khoản thành công ${new Intl.NumberFormat('vi-VN').format(payout.amount)} đ cho đối tác!`,
      });
    } else {
      // REJECTED -> Hoàn lại tiền vào ví đối tác
      await execute(
        `UPDATE affiliate_payouts
         SET status = 'REJECTED', notes = ?
         WHERE id = ?`,
        [notes || 'Từ chối bởi Admin', payout.id]
      );

      await execute(
        'UPDATE affiliate_partners SET balance = balance + ? WHERE id = ?',
        [payout.amount, payout.affiliate_id]
      );

      return NextResponse.json({
        success: true,
        message: `Đã từ chối yêu cầu rút tiền và hoàn lại ${new Intl.NumberFormat('vi-VN').format(payout.amount)} đ vào ví đối tác!`,
      });
    }
  } catch (error: any) {
    console.error('Admin payout update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
