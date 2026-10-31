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

  // 3. Dynamic Subdomain Routing:
  // Any subdomain is automatically forwarded to /lp/{subdomain}
  // Next.js dynamic route (/lp/[slug]/page.tsx) automatically queries the DB by (slug = ? OR subdomain = ?)
  if (subdomain) {
    // Root of subdomain: e.g. copypage.tuhocai.top/ -> /lp/copypage
    if (pathname === '/' || pathname === '') {
      const url = req.nextUrl.clone();
      url.pathname = `/lp/${subdomain}`;
      return NextResponse.rewrite(url);
    }

    // Thank you page on subdomain: e.g. copypage.tuhocai.top/cam-on -> /lp/copypage/cam-on
    if (pathname === '/cam-on') {
      const url = req.nextUrl.clone();
      url.pathname = `/lp/${subdomain}/cam-on`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
