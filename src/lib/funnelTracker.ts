declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export function trackLandingPageView(landingSlug: string) {
  if (typeof window === 'undefined') return;

  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source') || params.get('source') || '';
    const utmMedium = params.get('utm_medium') || '';
    const utmCampaign = params.get('utm_campaign') || '';
    const utmContent = params.get('utm_content') || '';
    const fbclid = params.get('fbclid') || '';

    // Lưu UTM vào sessionStorage để không bị mất khi khách chuyển tab/form
    if (utmSource) sessionStorage.setItem(`utm_source_${landingSlug}`, utmSource);
    if (utmMedium) sessionStorage.setItem(`utm_medium_${landingSlug}`, utmMedium);
    if (utmCampaign) sessionStorage.setItem(`utm_campaign_${landingSlug}`, utmCampaign);
    if (utmContent) sessionStorage.setItem(`utm_content_${landingSlug}`, utmContent);
    if (fbclid) sessionStorage.setItem(`fbclid_${landingSlug}`, fbclid);

    // Kích hoạt Facebook Pixel nếu có
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
      window.fbq('track', 'ViewContent', {
        content_name: landingSlug,
        content_category: 'Course / Landing Page',
      });
    }

    // Gửi sự kiện PAGEVIEW lên backend
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        landingSlug,
        eventType: 'PAGEVIEW',
        utmSource: utmSource || sessionStorage.getItem(`utm_source_${landingSlug}`) || null,
        utmMedium: utmMedium || sessionStorage.getItem(`utm_medium_${landingSlug}`) || null,
        utmCampaign: utmCampaign || sessionStorage.getItem(`utm_campaign_${landingSlug}`) || null,
        referrer: document.referrer || null,
      }),
    }).catch(() => {});
  } catch (err) {
    console.error('[Funnel Tracker] Pageview tracking error:', err);
  }
}

export function trackLandingPageCtaClick(landingSlug: string) {
  if (typeof window === 'undefined') return;

  try {
    const utmSource = sessionStorage.getItem(`utm_source_${landingSlug}`) || null;
    const utmMedium = sessionStorage.getItem(`utm_medium_${landingSlug}`) || null;
    const utmCampaign = sessionStorage.getItem(`utm_campaign_${landingSlug}`) || null;

    // Kích hoạt Facebook Pixel InitiateCheckout
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout', {
        content_name: landingSlug,
      });
    }

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        landingSlug,
        eventType: 'CTA_CLICK',
        utmSource,
        utmMedium,
        utmCampaign,
      }),
    }).catch(() => {});
  } catch (err) {
    console.error('[Funnel Tracker] CTA click tracking error:', err);
  }
}

export function getStoredUtm(landingSlug: string) {
  if (typeof window === 'undefined') {
    return { utmSource: null, utmMedium: null, utmCampaign: null, utmContent: null };
  }

  return {
    utmSource: sessionStorage.getItem(`utm_source_${landingSlug}`) || null,
    utmMedium: sessionStorage.getItem(`utm_medium_${landingSlug}`) || null,
    utmCampaign: sessionStorage.getItem(`utm_campaign_${landingSlug}`) || null,
    utmContent: sessionStorage.getItem(`utm_content_${landingSlug}`) || null,
  };
}
