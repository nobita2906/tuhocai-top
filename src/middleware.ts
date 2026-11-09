import { NextResponse, userAgent } from 'next/server';
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

  // 2. Nhận diện thiết bị di động (Device Detection: Mobile / Tablet / Desktop)
  const { device } = userAgent(req);
  const uaString = req.headers.get('user-agent') || '';
  const isMobile =
    device.type === 'mobile' ||
    device.type === 'tablet' ||
    /android|iphone|ipad|ipod|mobile|blackberry|iemobile|opera mini/i.test(uaString);
  const deviceType = isMobile ? 'mobile' : 'desktop';

  // Hàm gán Header và Cookie thiết bị cho phản hồi
  const applyDeviceHeaders = (response: NextResponse) => {
    response.headers.set('x-device-type', deviceType);
    response.cookies.set('tuhocai_device', deviceType, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 ngày
      sameSite: 'lax',
    });
    return response;
  };

  // 3. Extract subdomain
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

  // 4. Dynamic Subdomain Routing:
  // Any subdomain is automatically forwarded to /lp/{subdomain}
  if (subdomain) {
    // Root of subdomain: e.g. copypage.tuhocai.top/ -> /lp/copypage
    if (pathname === '/' || pathname === '') {
      const url = req.nextUrl.clone();
      url.pathname = `/lp/${subdomain}`;
      const res = NextResponse.rewrite(url);
      return applyDeviceHeaders(res);
    }

    // Thank you page on subdomain: e.g. copypage.tuhocai.top/cam-on -> /lp/copypage/cam-on
    if (pathname === '/cam-on') {
      const url = req.nextUrl.clone();
      url.pathname = `/lp/${subdomain}/cam-on`;
      const res = NextResponse.rewrite(url);
      return applyDeviceHeaders(res);
    }
  }

  const res = NextResponse.next();
  return applyDeviceHeaders(res);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
