import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import ThankYouCopyLpPage from '../../sao-chep-landing-page/cam-on/page';
import ThankYouDramaPage from '../../video-drama-gia-dinh-nho/cam-on/page';
import ThankYouAiPage from '../../video-ai-tu-1-anh/cam-on/page';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DynamicThankYouRoute({ params }: Props) {
  const { slug } = await params;

  const pages = await query<any>(
    'SELECT * FROM landing_pages WHERE (slug = ? OR subdomain = ?) AND is_published = TRUE LIMIT 1',
    [slug, slug]
  );

  if (pages.length === 0) {
    notFound();
  }

  const lp = pages[0];

  if (lp.slug === 'sao-chep-landing-page') {
    return <ThankYouCopyLpPage />;
  }
  if (lp.slug === 'video-drama-gia-dinh-nho') {
    return <ThankYouDramaPage />;
  }
  if (lp.slug === 'video-ai-tu-1-anh') {
    return <ThankYouAiPage />;
  }

  // Fallback default thank you
  return <ThankYouCopyLpPage />;
}
