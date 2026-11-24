import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getCategories, getProducts } from '@/lib/db';

export const revalidate = 300;
export const metadata = { title: 'Cửa hàng', description: 'Tất cả sản phẩm máy chấm công, kiểm soát ra vào, khóa điện tử tại CPSTECH.' };

export default async function Shop() {
  const [cats, products] = await Promise.all([getCategories(), getProducts()]);
  const roots = cats.filter((c) => !c.parent_slug);
  return (
    <div className="container page">
      <h1>Cửa hàng</h1>
      <div className="chips">
        {roots.map((c) => <Link key={c.slug} href={`/${c.slug}`} className="chip">{c.name}</Link>)}
      </div>
      <div className="product-grid">{products.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
    </div>
  );
}
