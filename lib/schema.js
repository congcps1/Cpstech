import { SITE, absUrl, href } from '@/lib/site';

const strip = (h = '') => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export const organization = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': absUrl('/#organization'),
  name: 'CPSTECH',
  legalName: SITE.company,
  url: absUrl('/'),
  logo: absUrl('/icon.svg'),
  email: SITE.email,
  telephone: SITE.hotline,
  sameAs: [SITE.facebook, SITE.youtube],
  department: SITE.offices.map((o) => ({
    '@type': 'Store',
    name: `CPSTECH ${o.city}`,
    telephone: o.phone,
    email: o.email,
    address: { '@type': 'PostalAddress', streetAddress: o.address, addressCountry: 'VN' },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '08:30', closes: '12:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '14:00', closes: '17:30' },
    ],
  })),
});

export const website = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': absUrl('/#website'),
  url: absUrl('/'),
  name: 'CPSTECH',
  inLanguage: 'vi',
  publisher: { '@id': absUrl('/#organization') },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: absUrl('/tim-kiem/') + '?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
});

export const breadcrumb = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Trang chủ', slug: '' }, ...trail].map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: absUrl(href(t.slug)),
  })),
});

export const product = (p) => {
  const price = p.sale_price || p.price;
  if (!price) return null; // Google requires offers/review/aggregateRating for Product snippets
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    url: absUrl(href(p.slug)),
    image: p.images?.length ? p.images : p.image_url ? [p.image_url] : undefined,
    description: (p.seo_description || p.summary || strip(p.content || '')).slice(0, 500) || undefined,
    brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
    offers: {
          '@type': 'Offer',
          url: absUrl(href(p.slug)),
          priceCurrency: 'VND',
          price,
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@id': absUrl('/#organization') },
        },
  };
};

export const article = (post) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  url: absUrl(href(post.slug)),
  mainEntityOfPage: absUrl(href(post.slug)),
  image: post.cover_url ? [post.cover_url] : undefined,
  datePublished: post.published_at,
  dateModified: post.updated_at || post.published_at,
  author: { '@type': 'Organization', name: 'CPSTECH', url: absUrl('/') },
  publisher: { '@id': absUrl('/#organization') },
  inLanguage: 'vi',
});
