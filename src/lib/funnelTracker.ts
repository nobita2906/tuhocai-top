/**
 * FUNNEL ANALYTICS TRACKER HELPER
 * Giúp theo dõi Pageview, CTA Clicks và UTM Parameters đồng bộ trên toàn bộ Landing Pages
 */

export function trackLandingPageView(landingSlug: string) {
  if (typeof window === 'undefined') return;

  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source') || params.get('source') || '';
    const utmMedium = params.get('utm_medium') || '';
    const utmCampaign = params.get('utm_campaign') || '';

    // Lưu UTM vào sessionStorage để không bị mất khi khách chuyển tab/form
    if (utmSource) sessionStorage.setItem(`utm_source_${landingSlug}`, utmSource);
    if (utmMedium) sessionStorage.setItem(`utm_medium_${landingSlug}`, utmMedium);
    if (utmCampaign) sessionStorage.setItem(`utm_campaign_${landingSlug}`, utmCampaign);

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
    return { utmSource: null, utmMedium: null, utmCampaign: null };
  }

  return {
    utmSource: sessionStorage.getItem(`utm_source_${landingSlug}`) || null,
    utmMedium: sessionStorage.getItem(`utm_medium_${landingSlug}`) || null,
    utmCampaign: sessionStorage.getItem(`utm_campaign_${landingSlug}`) || null,
  };
}
