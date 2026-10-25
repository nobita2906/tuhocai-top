import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { query, execute } from '@/lib/db';
import { getSiteSettings } from '@/lib/settings';

export async function POST(req: Request) {
  try {
    const { partnerId, amount, bankInfo, notes } = await req.json();

    if (!partnerId || !amount || Number(amount) < 200000) {
      return NextResponse.json({ error: 'Số tiền rút tối thiểu là 200,000 đ' }, { status: 400 });
    }

    const numAmount = Math.round(Number(amount));

    const partners = await query<any>('SELECT * FROM affiliate_partners WHERE id = ? LIMIT 1', [partnerId]);
    if (partners.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy đối tác' }, { status: 404 });
    }

    const partner = partners[0];
    if (partner.balance < numAmount) {
      return NextResponse.json({
        error: `Số dư khả dụng (${new Intl.NumberFormat('vi-VN').format(partner.balance)} đ) không đủ để rút ${new Intl.NumberFormat('vi-VN').format(numAmount)} đ`
      }, { status: 400 });
    }

    const finalBankInfo = bankInfo || `${partner.bank_name || ''} - ${partner.bank_account_no || ''} (${partner.bank_account_name || ''})`;

    const payoutId = randomUUID();

    // Khấu trừ số dư ngay lập tức và tạo yêu cầu
    await execute('UPDATE affiliate_partners SET balance = balance - ? WHERE id = ?', [numAmount, partner.id]);

    await execute(
      `INSERT INTO affiliate_payouts (id, affiliate_id, amount, bank_info, status, notes)
       VALUES (?, ?, ?, ?, 'REQUESTED', ?)`,
      [payoutId, partner.id, numAmount, finalBankInfo, notes || null]
    );

    // Gửi Telegram thông báo cho Admin
    const siteSettings = await getSiteSettings();
    const telegramToken = siteSettings.telegram_bot_token;
    const telegramChatId = siteSettings.telegram_chat_id;

    if (telegramToken && telegramChatId) {
      const formattedAmount = new Intl.NumberFormat('vi-VN').format(numAmount) + ' đ';
      const caption = `💸 *YÊU CẦU RÚT TIỀN AFFILIATE MỚI!*

👤 *Đối tác:* ${partner.name} (\`${partner.code}\`)
📧 *Email:* ${partner.email}
📞 *SĐT:* ${partner.phone || 'Không có'}
💰 *Số tiền yêu cầu:* *${formattedAmount}*
🏦 *Thông tin nhận tiền:* ${finalBankInfo}
📝 *Ghi chú:* ${notes || 'Không có'}

👉 *Admin vui lòng kiểm tra tài khoản và chuyển khoản cho đối tác.*`;

      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: caption,
          parse_mode: 'Markdown',
        }),
      }).catch((e) => console.error('Telegram payout notification error:', e));
    }

    return NextResponse.json({
      success: true,
      message: 'Yêu cầu rút tiền thành công! Admin sẽ duyệt và chuyển khoản trong vòng 24h làm việc.',
      payoutId,
    });
  } catch (error: any) {
    console.error('Affiliate payout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
