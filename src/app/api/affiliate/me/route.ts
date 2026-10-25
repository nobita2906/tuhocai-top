import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getAffiliateDashboardStats } from '@/lib/affiliate';
import { AffiliatePartner } from '@/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const email = searchParams.get('email');

    let partner: AffiliatePartner | null = null;

    if (code) {
      const res = await query<AffiliatePartner>(
        'SELECT * FROM affiliate_partners WHERE LOWER(code) = ? LIMIT 1',
        [code.trim().toLowerCase()]
      );
      if (res.length > 0) partner = res[0];
    } else if (email) {
      const res = await query<AffiliatePartner>(
        'SELECT * FROM affiliate_partners WHERE LOWER(email) = ? LIMIT 1',
        [email.trim().toLowerCase()]
      );
      if (res.length > 0) partner = res[0];
    } else {
      // Check session
      const session = await getCurrentUser();
      if (session?.email) {
        const res = await query<AffiliatePartner>(
          'SELECT * FROM affiliate_partners WHERE LOWER(email) = ? OR user_id = ? LIMIT 1',
          [session.email.toLowerCase(), session.id]
        );
        if (res.length > 0) partner = res[0];
      }
    }

    if (!partner) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin đối tác' }, { status: 404 });
    }

    const stats = await getAffiliateDashboardStats(partner.id);
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('Affiliate me error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
