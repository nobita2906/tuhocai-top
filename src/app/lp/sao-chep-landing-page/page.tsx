import type { Metadata } from 'next';
import { query, execute } from '@/lib/db';
import CopyLandingClient from './CopyLandingClient';

export async function generateMetadata(): Promise<Metadata> {
  const pages = await query<any>(
    'SELECT * FROM landing_pages WHERE slug = "sao-chep-landing-page" LIMIT 1'
  );

  if (pages.length === 0) {
    return {
      title: 'Sao Chép Bất Kỳ Landing Page Nào Với 1 Click — Tự Học AI',
      description: 'Skill AI độc quyền giúp sao chép và tái tạo bất kỳ Landing Page bán hàng chuyển đổi cao nào.',
    };
  }

  const lp = pages[0];
  return {
    title: `${lp.title} | Tự Học AI TOP`,
    description: lp.headline || lp.subheadline,
    alternates: {
      canonical: `/lp/${lp.slug}`,
    },
    openGraph: {
      title: lp.title,
      description: lp.headline || lp.subheadline,
      url: `https://www.tuhocai.top/lp/${lp.slug}`,
      siteName: 'Tự Học AI TOP',
    },
  };
}

export default async function CopyLandingPage() {
  const pages = await query<any>(
    'SELECT * FROM landing_pages WHERE slug = "sao-chep-landing-page" LIMIT 1'
  );

  const lp = pages[0] || null;

  if (lp?.id) {
    await execute('UPDATE landing_pages SET views = views + 1 WHERE id = ?', [lp.id]).catch(() => {});
  }

  const parseJsonSafe = (val: any) => {
    if (!val) return null;
    if (typeof val === 'object') return val;
    try {
      return JSON.parse(val);
    } catch (_) {
      return null;
    }
  };

  const parsedLp = lp ? {
    ...lp,
    features: parseJsonSafe(lp.features) || [],
    modules: parseJsonSafe(lp.modules) || [],
    testimonials: parseJsonSafe(lp.testimonials) || [],
    bonus_items: parseJsonSafe(lp.bonus_items) || [],
    faq: parseJsonSafe(lp.faq) || [],
    showcase: parseJsonSafe(lp.showcase) || null,
  } : null;

  return <CopyLandingClient lp={parsedLp} />;
}
