// URL structure mirrors the old WordPress site (cpstech.vn): every page ends with "/".
const STORAGE = 'https://grrgzgncwzvidwuyycdv.supabase.co/storage/v1/object/public/cpstech';

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'grrgzgncwzvidwuyycdv.supabase.co', pathname: '/storage/v1/object/public/**' }],
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    return [
      // Old Rank Math / WordPress sitemaps → new sitemap
      { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/wp-sitemap.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/:name(post|page|product|category|product_cat)-sitemap:n(\\d*).xml', destination: '/sitemap.xml', permanent: true },
      // WordPress pagination: /page/2/ and /<category>/page/2/
      { source: '/page/:n(\\d+){/}?', destination: '/tin-tuc/?trang=:n', permanent: true },
      { source: '/:slug/page/:n(\\d+){/}?', destination: '/:slug/?trang=:n', permanent: true },
      // RSS feeds
      { source: '/feed{/}?', destination: '/tin-tuc/', permanent: true },
      { source: '/comments/feed{/}?', destination: '/tin-tuc/', permanent: true },
      { source: '/:slug/feed{/}?', destination: '/:slug/', permanent: true },
      // WooCommerce product tags and taxonomies
      { source: '/tu-khoa-san-pham/:tag{/}?', destination: '/cua-hang/', permanent: true },
      { source: '/tu-khoa-san-pham/:tag/page/:n{/}?', destination: '/cua-hang/', permanent: true },
      { source: '/tag/:tag{/}?', destination: '/tin-tuc/', permanent: true },
      { source: '/author/:name{/}?', destination: '/gioi-thieu-cpstech/', permanent: true },
      { source: '/tai-khoan/:path*', destination: '/lien-he/', permanent: true },
      // Old media library → Supabase Storage copy
      { source: '/wp-content/uploads/:path*', destination: `${STORAGE}/:path*`, permanent: true },
      { source: '/template/uploads/:path*', destination: `${STORAGE}/:path*`, permanent: true },
    ];
  },
};

export default nextConfig;
