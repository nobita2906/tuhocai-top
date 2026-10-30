import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const pathname = req.nextUrl.pathname;

  // 1. Skip static assets, internal next.js files, and API endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Extract subdomain
  // Examples:
  // - "copypage.tuhocai.top" -> "copypage"
  // - "copypage.localhost:8899" -> "copypage"
  // - "drama.tuhocai.top" -> "drama"
  // - "tuhocai.top" or "www.tuhocai.top" -> ""
  const hostWithoutPort = host.split(':')[0];
  const hostParts = hostWithoutPort.split('.');

  let subdomain = '';
  if (hostParts.length >= 3 && hostParts[0].toLowerCase() !== 'www') {
    subdomain = hostParts[0].toLowerCase();
  } else if (hostParts.length === 2 && hostParts[1] === 'localhost') {
    subdomain = hostParts[0].toLowerCase();
  }

  // 3. Mapping subdomain to landing page routes
  const subdomainMap: Record<string, string> = {
    copypage: '/lp/sao-chep-landing-page',
    drama: '/lp/video-drama-gia-dinh-nho',
    vip: '/lp/video-ai-tu-1-anh',
  };

  if (subdomain && subdomainMap[subdomain]) {
    const targetBase = subdomainMap[subdomain];

    // Root of subdomain: copypage.tuhocai.top/ -> /lp/sao-chep-landing-page
    if (pathname === '/' || pathname === '') {
      const url = req.nextUrl.clone();
      url.pathname = targetBase;
      return NextResponse.rewrite(url);
    }

    // Thank you page on subdomain: copypage.tuhocai.top/cam-on -> /lp/sao-chep-landing-page/cam-on
    if (pathname === '/cam-on') {
      const url = req.nextUrl.clone();
      url.pathname = `${targetBase}/cam-on`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
