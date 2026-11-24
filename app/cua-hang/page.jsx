import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { getCategories, getProductsPage } from '@/lib/db';

export const revalidate = 300;
export const metadata = { title: 'Cửa hàng', description: 'Tất cả sản phẩm máy chấm công, kiểm soát ra vào, khóa điện tử tại CPSTECH.' };

export default async function Shop({ searchParams }) {
  const sp = (await searchParams) || {};
  const [cats, { items, hasNext, page }] = await Promise.all([getCategories(), getProductsPage(sp.trang)]);
  const roots = cats.filter((c) => !c.parent_slug);
  return (
    <div className="container page">
      <h1>Cửa hàng</h1>
      <div className="chips">
        {roots.map((c) => <Link key={c.slug} href={`/${c.slug}`} className="chip">{c.name}</Link>)}
      </div>
      <div className="product-grid">{items.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      <Pagination base="/cua-hang" page={page} hasNext={hasNext} />
    </div>
  );
}
