import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { randomUUID } from 'crypto';

/**
 * API TRACKING SỰ KIỆN FUNNEL LANDING PAGE
 * POST /api/analytics/track
 * Nhận sự kiện PAGEVIEW hoặc CTA_CLICK theo thời gian thực
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      landingSlug, 
      eventType, // 'PAGEVIEW' | 'CTA_CLICK'
      utmSource, 
      utmMedium, 
      utmCampaign, 
      referrer 
    } = body;

    if (!landingSlug || !eventType) {
      return NextResponse.json({ success: false, message: 'Missing landingSlug or eventType' }, { status: 400 });
    }

    const cleanSlug = String(landingSlug).trim();
    const rawType = String(eventType).toUpperCase().replace(/-/g, '_');
    const cleanType = rawType === 'CTA_CLICK' ? 'CTA_CLICK' : 'PAGEVIEW';
    const cleanUtmSource = utmSource ? String(utmSource).slice(0, 100) : null;
    const cleanUtmMedium = utmMedium ? String(utmMedium).slice(0, 100) : null;
    const cleanUtmCampaign = utmCampaign ? String(utmCampaign).slice(0, 100) : null;
    const cleanReferrer = referrer ? String(referrer).slice(0, 500) : null;

    const userAgent = req.headers.get('user-agent')?.slice(0, 500) || null;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null;

    // 1. Cập nhật bộ đếm nhanh trong bảng landing_pages
    if (cleanType === 'PAGEVIEW') {
      await execute('UPDATE landing_pages SET views = views + 1 WHERE slug = ?', [cleanSlug]).catch(() => {});
    } else if (cleanType === 'CTA_CLICK') {
      await execute('UPDATE landing_pages SET cta_clicks = cta_clicks + 1 WHERE slug = ?', [cleanSlug]).catch(() => {});
    }

    // 2. Ghi nhật ký sự kiện chi tiết vào landing_page_events để phân tích sâu
    const eventId = randomUUID();
    await execute(
      `INSERT INTO landing_page_events (id, landing_slug, event_type, utm_source, utm_medium, utm_campaign, referrer, user_agent, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [eventId, cleanSlug, cleanType, cleanUtmSource, cleanUtmMedium, cleanUtmCampaign, cleanReferrer, userAgent, ip]
    ).catch((err) => {
      console.error('[Analytics Track] Lỗi ghi nhận sự kiện:', err);
    });

    return NextResponse.json({ success: true, eventId });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
