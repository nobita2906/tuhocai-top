import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { query, execute } from '@/lib/db';
import LandingPageClient from './LandingPageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pages = await query<any>(
    'SELECT * FROM landing_pages WHERE slug = ? AND is_published = TRUE LIMIT 1',
    [slug]
  );

  if (pages.length === 0) {
    return { title: 'Không tìm thấy trang | Tự Học AI' };
  }

  const lp = pages[0];
  return {
    title: `${lp.title} | Tự Học AI TOP`,
    description: lp.headline || lp.subheadline,
    alternates: {
      canonical: `/lp/${slug}`,
    },
    openGraph: {
      title: lp.title,
      description: lp.headline,
      url: `https://www.tuhocai.top/lp/${slug}`,
      siteName: 'Tự Học AI TOP',
    },
  };
}

export default async function LandingPageRoute({ params }: Props) {
  const { slug } = await params;

  const pages = await query<any>(
    'SELECT * FROM landing_pages WHERE slug = ? AND is_published = TRUE LIMIT 1',
    [slug]
  );

  if (pages.length === 0) {
    notFound();
  }

  const lp = pages[0];

  // Tăng lượt view cho trang landing page
  await execute('UPDATE landing_pages SET views = views + 1 WHERE id = ?', [lp.id]).catch(() => {});

  // Parse JSON fields
  const parseJsonSafe = (val: any) => {
    if (!val) return [];
    if (typeof val === 'object') return val;
    try {
      return JSON.parse(val);
    } catch (_) {
      return [];
    }
  };

  const parsedLp = {
    ...lp,
    features: parseJsonSafe(lp.features),
    modules: parseJsonSafe(lp.modules),
    testimonials: parseJsonSafe(lp.testimonials),
    bonus_items: parseJsonSafe(lp.bonus_items),
  };

  return <LandingPageClient lp={parsedLp} />;
}
