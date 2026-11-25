import { SITE } from '@/lib/site';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/quan-tri/', '/api/'] },
    sitemap: `${SITE.url.replace(/\/$/, '')}/sitemap.xml`,
  };
}
