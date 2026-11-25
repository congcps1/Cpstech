import { getCategories, getProducts, getPostSlugs, getPostCategories } from '@/lib/db';
import { SITE, href } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap() {
  const [cats, products, posts, postCats] = await Promise.all([getCategories(), getProducts(2000), getPostSlugs(), getPostCategories()]);
  const base = SITE.url.replace(/\/$/, '');
  const u = (slug) => base + href(slug);
  const statics = ['', 'cua-hang', 'gioi-thieu-cpstech', 'dich-vu', 'tin-tuc', 'video', 'lien-he'];
  const latestPost = posts.reduce((m, p) => (p.published_at > m ? p.published_at : m), '');
  return [
    ...statics.map((s) => ({ url: u(s), lastModified: s === '' || s === 'tin-tuc' ? latestPost || undefined : undefined })),
    ...cats.map((c) => ({ url: u(c.slug) })),
    ...postCats.filter((c) => c.slug !== 'tin-tuc').map((c) => ({ url: u(c.slug) })),
    ...products.map((p) => ({ url: u(p.slug), lastModified: p.created_at })),
    ...posts.map((p) => ({ url: u(p.slug), lastModified: p.updated_at || p.published_at })),
  ];
}
