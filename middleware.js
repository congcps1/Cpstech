import { NextResponse } from 'next/server';

const PRIMARY = 'cpstech.vn';

export function middleware(req) {
  const host = (req.headers.get('host') || '').toLowerCase().split(':')[0];

  // www.cpstech.vn → cpstech.vn (same as the old site's canonical)
  if (host === `www.${PRIMARY}`) {
    const url = req.nextUrl.clone();
    url.host = PRIMARY;
    url.port = '';
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
  }

  // WordPress query permalinks (?p=123, ?page_id=45) and search (?s=) → home / shop
  const sp = req.nextUrl.searchParams;
  if (sp.has('p') || sp.has('page_id') || sp.has('post_type')) {
    return NextResponse.redirect(new URL('/', req.url), 301);
  }

  const res = NextResponse.next();
  // Only the real domain may be indexed; *.vercel.app previews stay out of Google.
  if (host !== PRIMARY) res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|og-default.png|robots.txt|sitemap.xml).*)'],
};
