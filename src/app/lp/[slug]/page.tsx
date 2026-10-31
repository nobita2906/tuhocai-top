import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { query, execute } from '@/lib/db';
import LandingPageClient from './LandingPageClient';
import CopyLandingPage from '../sao-chep-landing-page/page';
import VideoDramaLandingPage from '../video-drama-gia-dinh-nho/page';
import VideoAiTu1AnhPage from '../video-ai-tu-1-anh/page';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pages = await query<any>(
    'SELECT * FROM landing_pages WHERE (slug = ? OR subdomain = ?) AND is_published = TRUE LIMIT 1',
    [slug, slug]
  );

  if (pages.length === 0) {
    return { title: 'Không tìm thấy trang | Tự Học AI' };
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
      description: lp.headline,
      url: `https://www.tuhocai.top/lp/${lp.slug}`,
      siteName: 'Tự Học AI TOP',
    },
  };
}

export default async function LandingPageRoute({ params }: Props) {
  const { slug } = await params;

  const pages = await query<any>(
    'SELECT * FROM landing_pages WHERE (slug = ? OR subdomain = ?) AND is_published = TRUE LIMIT 1',
    [slug, slug]
  );

  if (pages.length === 0) {
    notFound();
  }

  const lp = pages[0];

  // Tăng lượt view cho trang landing page
  await execute('UPDATE landing_pages SET views = views + 1 WHERE id = ?', [lp.id]).catch(() => {});

  // Nếu là các Landing Page đặc biệt có giao diện custom
  if (lp.slug === 'sao-chep-landing-page') {
    return <CopyLandingPage />;
  }
  if (lp.slug === 'video-drama-gia-dinh-nho') {
    return <VideoDramaLandingPage />;
  }
  if (lp.slug === 'video-ai-tu-1-anh') {
    return <VideoAiTu1AnhPage />;
  }

  // Parse JSON fields cho các trang Landing Page động tạo từ Admin
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
