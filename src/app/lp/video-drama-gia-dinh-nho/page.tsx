import type { Metadata } from 'next';
import { query, execute } from '@/lib/db';
import VideoDramaLandingClient from './VideoDramaLandingClient';

export async function generateMetadata(): Promise<Metadata> {
  const pages = await query<any>(
    'SELECT * FROM landing_pages WHERE slug = "video-drama-gia-dinh-nho" LIMIT 1'
  );

  if (pages.length === 0) {
    return {
      title: 'Quy trình Video AI Câu Chuyện Gia Đình Nhỏ — PHƯỚC AI & TỰ HỌC AI',
      description: 'Toàn bộ quy trình làm video AI Câu chuyện gia đình nhỏ từ ý tưởng đến thành phẩm triệu view.',
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

export default async function VideoDramaLandingPage() {
  const pages = await query<any>(
    'SELECT * FROM landing_pages WHERE slug = "video-drama-gia-dinh-nho" LIMIT 1'
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

  return <VideoDramaLandingClient lp={parsedLp} />;
}
