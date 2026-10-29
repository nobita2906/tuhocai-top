import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { randomUUID } from 'crypto';

/**
 * API QUẢN TRỊ LANDING PAGES & FUNNEL ANALYTICS
 * GET  /api/admin/landing-pages -> Lấy danh sách kèm chỉ số phễu chuyển đổi thời gian thực
 * POST /api/admin/landing-pages -> Tạo mới landing page khóa học
 */

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Lấy toàn bộ Landing Pages
    const landingPages = await query<any>(`
      SELECT 
        lp.*,
        p.name as linked_product_name,
        p.price as linked_product_price,
        (SELECT COUNT(*) FROM orders o WHERE o.landing_slug = lp.slug) as total_orders,
        (SELECT COUNT(*) FROM orders o WHERE o.landing_slug = lp.slug AND o.payment_status = 'APPROVED') as paid_orders,
        (SELECT COALESCE(SUM(o.price), 0) FROM orders o WHERE o.landing_slug = lp.slug AND o.payment_status = 'APPROVED') as total_revenue
      FROM landing_pages lp
      LEFT JOIN products p ON lp.product_id = p.id
      ORDER BY total_revenue DESC, lp.created_at DESC
    `);

    // 2. Lấy thống kê nguồn UTM tổng quan
    const utmStats = await query<any>(`
      SELECT 
        COALESCE(utm_source, 'Trực tiếp / Không rõ') as source,
        COUNT(*) as count,
        SUM(CASE WHEN payment_status = 'APPROVED' THEN 1 ELSE 0 END) as paid_count,
        COALESCE(SUM(CASE WHEN payment_status = 'APPROVED' THEN price ELSE 0 END), 0) as revenue
      FROM orders
      GROUP BY utm_source
      ORDER BY revenue DESC, count DESC
      LIMIT 10
    `);

    // 3. Tính toán các chỉ số phễu chuyển đổi cho từng Landing Page
    const formattedLps = landingPages.map((lp: any) => {
      const views = Number(lp.views || 0);
      const ctaClicks = Number(lp.cta_clicks || 0);
      const totalOrders = Number(lp.total_orders || 0);
      const paidOrders = Number(lp.paid_orders || 0);
      const revenue = Number(lp.total_revenue || 0);

      const ctaRate = views > 0 ? Number(((ctaClicks / views) * 100).toFixed(2)) : 0;
      const conversionRate = views > 0 ? Number(((paidOrders / views) * 100).toFixed(2)) : 0;
      const rpm = views > 0 ? Math.round(revenue / views) : 0; // Revenue per 1 view

      return {
        id: lp.id,
        slug: lp.slug,
        title: lp.title,
        headline: lp.headline,
        subheadline: lp.subheadline,
        productId: lp.product_id,
        productName: lp.linked_product_name,
        price: Number(lp.price || 0),
        originalPrice: Number(lp.original_price || 0),
        ctaText: lp.cta_text,
        videoUrl: lp.video_url,
        isPublished: Boolean(lp.is_published),
        views,
        ctaClicks,
        totalOrders,
        paidOrders,
        revenue,
        ctaRate,
        conversionRate,
        rpm,
        createdAt: lp.created_at,
        updatedAt: lp.updated_at,
      };
    });

    // 4. Tính toán tổng toàn hệ thống
    const totals = formattedLps.reduce(
      (acc: any, lp: any) => {
        acc.totalLps += 1;
        acc.totalViews += lp.views;
        acc.totalCtaClicks += lp.ctaClicks;
        acc.totalOrders += lp.totalOrders;
        acc.totalPaidOrders += lp.paidOrders;
        acc.totalRevenue += lp.revenue;
        return acc;
      },
      {
        totalLps: 0,
        totalViews: 0,
        totalCtaClicks: 0,
        totalOrders: 0,
        totalPaidOrders: 0,
        totalRevenue: 0,
      }
    );

    const overallConversionRate = totals.totalViews > 0 
      ? Number(((totals.totalPaidOrders / totals.totalViews) * 100).toFixed(2)) 
      : 0;

    return NextResponse.json({
      success: true,
      totals: {
        ...totals,
        overallConversionRate,
      },
      landingPages: formattedLps,
      utmStats,
    });
  } catch (err: any) {
    console.error('[Admin Landing Pages GET] Lỗi:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      slug,
      title,
      headline,
      subheadline,
      productId,
      price,
      originalPrice,
      videoUrl,
      ctaText,
      heroBadge,
      features,
      modules,
      isPublished,
    } = body;

    if (!slug || !title || !headline) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ slug, tiêu đề và headline' }, { status: 400 });
    }

    const cleanSlug = String(slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // Kiểm tra trùng slug
    const existing = await query<any>('SELECT id FROM landing_pages WHERE slug = ? LIMIT 1', [cleanSlug]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Đường dẫn slug này đã tồn tại, vui lòng chọn slug khác' }, { status: 400 });
    }

    const newId = randomUUID();

    await execute(
      `INSERT INTO landing_pages (
        id, slug, title, headline, subheadline, product_id, price, original_price, 
        video_url, cta_text, hero_badge, features, modules, is_published, views, cta_clicks, conversions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0)`,
      [
        newId,
        cleanSlug,
        title.trim(),
        headline.trim(),
        subheadline?.trim() || null,
        productId || null,
        Number(price) || 99000,
        Number(originalPrice) || 499000,
        videoUrl?.trim() || null,
        ctaText?.trim() || '⚡ NHẬN QUY TRÌNH NGAY',
        heroBadge?.trim() || '✦ KHÓA HỌC THỰC CHIẾN TỰ HỌC AI',
        features ? JSON.stringify(features) : null,
        modules ? JSON.stringify(modules) : null,
        isPublished !== false,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Tạo Landing Page mới thành công!',
      landingPageId: newId,
      slug: cleanSlug,
    });
  } catch (err: any) {
    console.error('[Admin Landing Pages POST] Lỗi:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, headline, subheadline, price, originalPrice, videoUrl, ctaText, isPublished } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing landing page ID' }, { status: 400 });
    }

    await execute(
      `UPDATE landing_pages 
       SET title = ?, headline = ?, subheadline = ?, price = ?, original_price = ?, video_url = ?, cta_text = ?, is_published = ?
       WHERE id = ?`,
      [
        title,
        headline,
        subheadline,
        Number(price),
        Number(originalPrice),
        videoUrl,
        ctaText,
        Boolean(isPublished),
        id,
      ]
    );

    return NextResponse.json({ success: true, message: 'Cập nhật landing page thành công!' });
  } catch (err: any) {
    console.error('[Admin Landing Pages PUT] Lỗi:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await execute('DELETE FROM landing_pages WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Đã xóa landing page thành công' });
  } catch (err: any) {
    console.error('[Admin Landing Pages DELETE] Lỗi:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
