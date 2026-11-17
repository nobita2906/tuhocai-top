'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics({ gaId }: { gaId?: string }) {
  const pathname = usePathname();
  const trackingId = gaId || process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (!trackingId || typeof window.gtag !== 'function') return;
    window.gtag('config', trackingId, {
      page_path: pathname,
    });
  }, [pathname, trackingId]);

  if (!trackingId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

