import { getCategories, getProducts, getPosts } from '@/lib/db';
import { SITE } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap() {
  const [cats, products, posts] = await Promise.all([getCategories(), getProducts(1000), getPosts(1000)]);
  const base = SITE.url.replace(/\/$/, '');
  const statics = ['', '/cua-hang', '/gioi-thieu-cpstech', '/tin-tuc', '/lien-he'];
  return [
    ...statics.map((p) => ({ url: `${base}${p}` })),
    ...cats.map((c) => ({ url: `${base}/${c.slug}` })),
    ...products.map((p) => ({ url: `${base}/${p.slug}` })),
    ...posts.map((p) => ({ url: `${base}/${p.slug}` })),
  ];
}
