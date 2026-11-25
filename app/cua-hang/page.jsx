import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { getCategories, getProductsPage } from '@/lib/db';
import { STATIC_SEO, href } from '@/lib/site';

export const revalidate = 300;
export async function generateMetadata({ searchParams }) {
  const n = Math.max(1, Number((await searchParams)?.trang) || 1);
  return {
    title: { absolute: STATIC_SEO.shop.title + (n > 1 ? ` – Trang ${n}` : '') },
    description: STATIC_SEO.shop.description,
    alternates: { canonical: '/cua-hang/' + (n > 1 ? `?trang=${n}` : '') },
  };
}

export default async function Shop({ searchParams }) {
  const sp = (await searchParams) || {};
  const [cats, { items, hasNext, page }] = await Promise.all([getCategories(), getProductsPage(sp.trang)]);
  const roots = cats.filter((c) => !c.parent_slug);
  return (
    <div className="container page">
      <h1>Cửa hàng</h1>
      <div className="chips">
        {roots.map((c) => <Link key={c.slug} href={href(c.slug)} className="chip">{c.name}</Link>)}
      </div>
      <div className="product-grid">{items.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      <Pagination base="/cua-hang" page={page} hasNext={hasNext} />
    </div>
  );
}
