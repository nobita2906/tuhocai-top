'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function AffiliateTrackerInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const ref = searchParams?.get('ref');
      if (ref && ref.trim().length > 0) {
        const cleanRef = ref.trim().toLowerCase();
        
        // Lưu vào localStorage
        localStorage.setItem('tuhocai_aff_ref', cleanRef);

        // Lưu vào cookie (30 ngày)
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        document.cookie = `tuhocai_aff_ref=${cleanRef}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;

        // Gọi API ghi nhận click và chống trùng lặp
        fetch('/api/affiliate/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ref: cleanRef,
            landingPath: window.location.pathname,
            referrer: document.referrer || '',
          }),
        }).catch((err) => console.debug('Affiliate track ping error:', err));
      }
    } catch (e) {
      // Ignore client error
    }
  }, [searchParams]);

  return null;
}

export default function AffiliateTracker() {
  return (
    <Suspense fallback={null}>
      <AffiliateTrackerInner />
    </Suspense>
  );
}
