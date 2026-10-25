import { randomUUID } from 'crypto';
import { query, execute } from '@/lib/db';
import { AffiliatePartner, AffiliateCommission } from '@/types';

/**
 * Tìm kiếm đối tác Affiliate theo mã ref (code)
 */
export async function getAffiliateByCode(code: string): Promise<AffiliatePartner | null> {
  if (!code) return null;
  const cleanCode = code.trim().toLowerCase();
  const partners = await query<AffiliatePartner>(
    'SELECT * FROM affiliate_partners WHERE LOWER(code) = ? AND status = "ACTIVE" LIMIT 1',
    [cleanCode]
  );
  return partners.length > 0 ? partners[0] : null;
}

/**
 * Tìm kiếm đối tác theo ID
 */
export async function getAffiliateById(id: string): Promise<AffiliatePartner | null> {
  if (!id) return null;
  const partners = await query<AffiliatePartner>(
    'SELECT * FROM affiliate_partners WHERE id = ? LIMIT 1',
    [id]
  );
  return partners.length > 0 ? partners[0] : null;
}

/**
 * Ghi nhận lượt click referral
 */
export async function recordAffiliateClick(params: {
  code: string;
  ip?: string | null;
  userAgent?: string | null;
  landingPath?: string | null;
  referrer?: string | null;
}) {
  const partner = await getAffiliateByCode(params.code);
  if (!partner) return { success: false, reason: 'Invalid or inactive affiliate code' };

  // Chống spam: Kiểm tra xem IP này đã click link của partner trong vòng 5 phút chưa
  if (params.ip) {
    const recent = await query<any>(
      `SELECT id FROM affiliate_clicks 
       WHERE affiliate_id = ? AND ip_address = ? AND created_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE) 
       LIMIT 1`,
      [partner.id, params.ip]
    );
    if (recent.length > 0) {
      return { success: true, duplicate: true, partner };
    }
  }

  const clickId = randomUUID();
  await execute(
    `INSERT INTO affiliate_clicks (id, affiliate_id, code, ip_address, user_agent, landing_path, referrer)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      clickId,
      partner.id,
      partner.code,
      params.ip || null,
      params.userAgent ? params.userAgent.slice(0, 500) : null,
      params.landingPath ? params.landingPath.slice(0, 500) : '/',
      params.referrer ? params.referrer.slice(0, 500) : null,
    ]
  );

  return { success: true, partner };
}

/**
 * Gắn Affiliate vào đơn hàng khi Checkout và tạo hoa hồng PENDING
 */
export async function attachAffiliateToOrder(params: {
  orderId: string;
  orderCode: string;
  orderAmount: number;
  affiliateCode?: string | null;
}) {
  if (!params.affiliateCode || params.orderAmount <= 0) return null;

  const partner = await getAffiliateByCode(params.affiliateCode);
  if (!partner) return null;

  const rate = partner.commission_rate || 30;
  const commissionAmount = Math.round((params.orderAmount * rate) / 100);

  // Cập nhật thông tin affiliate vào bảng orders
  await execute(
    'UPDATE orders SET affiliate_code = ?, affiliate_id = ? WHERE id = ?',
    [partner.code, partner.id, params.orderId]
  );

  // Tạo bản ghi hoa hồng ở trạng thái PENDING
  const commId = randomUUID();
  await execute(
    `INSERT INTO affiliate_commissions 
     (id, affiliate_id, order_id, order_code, order_amount, rate, commission_amount, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')
     ON DUPLICATE KEY UPDATE commission_amount = VALUES(commission_amount)`,
    [
      commId,
      partner.id,
      params.orderId,
      params.orderCode,
      params.orderAmount,
      rate,
      commissionAmount,
    ]
  );

  return {
    partner,
    commissionAmount,
    rate,
  };
}

/**
 * Duyệt hoa hồng khi đơn hàng được duyệt thanh toán (APPROVED)
 */
export async function approveAffiliateCommission(orderId: string) {
  const comms = await query<AffiliateCommission>(
    'SELECT * FROM affiliate_commissions WHERE order_id = ? AND status = "PENDING" LIMIT 1',
    [orderId]
  );

  if (comms.length === 0) return null;
  const comm = comms[0];

  // Đổi trạng thái hoa hồng sang APPROVED
  await execute(
    'UPDATE affiliate_commissions SET status = "APPROVED", approved_at = NOW() WHERE id = ?',
    [comm.id]
  );

  // Cộng số dư ví và tổng tích lũy cho đối tác
  await execute(
    `UPDATE affiliate_partners 
     SET balance = balance + ?, total_earned = total_earned + ? 
     WHERE id = ?`,
    [comm.commission_amount, comm.commission_amount, comm.affiliate_id]
  );

  return comm;
}

/**
 * Hủy hoặc từ chối hoa hồng nếu đơn bị REJECTED / CANCELLED
 */
export async function cancelAffiliateCommission(orderId: string) {
  const comms = await query<AffiliateCommission>(
    'SELECT * FROM affiliate_commissions WHERE order_id = ? LIMIT 1',
    [orderId]
  );

  if (comms.length === 0) return null;
  const comm = comms[0];

  // Nếu trước đó đã APPROVED, cần trừ lại balance
  if (comm.status === 'APPROVED') {
    await execute(
      `UPDATE affiliate_partners 
       SET balance = GREATEST(0, balance - ?), total_earned = GREATEST(0, total_earned - ?) 
       WHERE id = ?`,
      [comm.commission_amount, comm.commission_amount, comm.affiliate_id]
    );
  }

  await execute(
    'UPDATE affiliate_commissions SET status = "CANCELLED" WHERE id = ?',
    [comm.id]
  );

  return comm;
}

/**
 * Thống kê toàn diện cho bảng điều khiển của đối tác Affiliate
 */
export async function getAffiliateDashboardStats(partnerId: string) {
  const partner = await getAffiliateById(partnerId);
  if (!partner) return null;

  // Tổng số clicks
  const clickCountResult = await query<any>(
    'SELECT COUNT(*) as total FROM affiliate_clicks WHERE affiliate_id = ?',
    [partnerId]
  );
  const totalClicks = Number(clickCountResult[0]?.total || 0);

  // Lịch sử hoa hồng
  const commissions = await query<AffiliateCommission>(
    `SELECT * FROM affiliate_commissions 
     WHERE affiliate_id = ? 
     ORDER BY created_at DESC 
     LIMIT 50`,
    [partnerId]
  );

  const pendingAmount = commissions
    .filter((c) => c.status === 'PENDING')
    .reduce((sum, c) => sum + Number(c.commission_amount), 0);

  const approvedAmount = commissions
    .filter((c) => c.status === 'APPROVED')
    .reduce((sum, c) => sum + Number(c.commission_amount), 0);

  // Lịch sử rút tiền
  const payouts = await query<any>(
    `SELECT * FROM affiliate_payouts 
     WHERE affiliate_id = ? 
     ORDER BY created_at DESC 
     LIMIT 20`,
    [partnerId]
  );

  return {
    partner,
    totalClicks,
    pendingAmount,
    approvedAmount,
    commissions,
    payouts,
  };
}
