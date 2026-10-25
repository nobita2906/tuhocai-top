import { NextResponse } from 'next/server';
import { recordAffiliateClick } from '@/lib/affiliate';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ref, landingPath, referrer } = body;

    if (!ref || typeof ref !== 'string') {
      return NextResponse.json({ error: 'Mã giới thiệu không hợp lệ' }, { status: 400 });
    }

    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip');
    const userAgent = req.headers.get('user-agent');

    const result = await recordAffiliateClick({
      code: ref,
      ip,
      userAgent,
      landingPath,
      referrer,
    });

    if (!result.success || !result.partner) {
      return NextResponse.json({ error: 'Mã đối tác không tồn tại hoặc đã dừng hoạt động' }, { status: 404 });
    }

    const response = NextResponse.json({
      success: true,
      partner: {
        code: result.partner.code,
        name: result.partner.name,
      },
    });

    // Lưu cookie tuhocai_aff_ref tồn tại 30 ngày
    response.cookies.set('tuhocai_aff_ref', result.partner.code, {
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 ngày
      httpOnly: false, // Để client script có thể đọc nếu cần
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Affiliate track error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
