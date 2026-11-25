import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import SearchBox from '@/components/SearchBox';
import { searchProducts, searchPosts } from '@/lib/db';
import { SITE } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }) {
  const q = String((await searchParams)?.q || '').trim();
  return {
    title: q ? `Tìm kiếm “${q}”` : 'Tìm kiếm sản phẩm',
    robots: { index: false, follow: true },
    alternates: { canonical: '/tim-kiem/' },
  };
}

export default async function SearchPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = String(sp.q || '').trim().slice(0, 100);
  const [{ items, hasNext, page, total }, posts] = q
    ? await Promise.all([searchProducts(q, sp.trang), Number(sp.trang) > 1 ? [] : searchPosts(q)])
    : [{ items: [], hasNext: false, page: 1 }, []];

  return (
    <div className="container page">
      <h1>{q ? <>Kết quả tìm kiếm: “{q}”</> : 'Tìm kiếm sản phẩm'}</h1>
      <div className="search-page-box"><SearchBox defaultValue={q} autoFocus={!q} /></div>
      {q && (
        items.length ? (
          <>
            <p className="muted">{total} sản phẩm{hasNext || page > 1 ? ` · Trang ${page}` : ''}</p>
            <div className="product-grid">{items.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
            <Pagination base={`/tim-kiem/?q=${encodeURIComponent(q)}`} page={page} hasNext={hasNext} />
          </>
        ) : (
          <div className="card empty">
            <p>Không tìm thấy sản phẩm phù hợp với “{q}”. Thử từ khóa ngắn hơn (ví dụ: “vân tay”, “khóa tủ”, mã sản phẩm) hoặc gọi để được tư vấn.</p>
            <a className="btn" href={`tel:${SITE.hotlineTel}`}>Gọi {SITE.hotline}</a>
          </div>
        )
      )}
      {posts.length > 0 && (
        <section className="section-tight">
          <h2 className="section-title">Bài viết liên quan</h2>
          <div className="project-grid">{posts.map((p) => <PostCard key={p.slug} p={p} />)}</div>
        </section>
      )}
      {!q && (
        <div className="chips">
          {['Máy chấm công khuôn mặt', 'Khóa vân tay', 'Khóa tủ locker', 'Khóa cửa kính', 'Thẻ từ', 'Ronald Jack', 'ZKTeco'].map((t) => (
            <Link key={t} className="chip" href={`/tim-kiem/?q=${encodeURIComponent(t)}`}>{t}</Link>
          ))}
        </div>
      )}
    </div>
  );
}
