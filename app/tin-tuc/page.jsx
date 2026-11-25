import PostCard from '@/components/PostCard';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import { getPostsPage } from '@/lib/db';
import { STATIC_SEO } from '@/lib/site';

export const revalidate = 300;
export async function generateMetadata({ searchParams }) {
  const n = Math.max(1, Number((await searchParams)?.trang) || 1);
  return {
    title: { absolute: STATIC_SEO.news.title + (n > 1 ? ` – Trang ${n}` : '') },
    description: STATIC_SEO.news.description,
    alternates: { canonical: '/tin-tuc/' + (n > 1 ? `?trang=${n}` : '') },
  };
}

export default async function News({ searchParams }) {
  const sp = (await searchParams) || {};
  const { items, hasNext, page } = await getPostsPage(sp.trang);
  return (
    <div className="container page">
      <h1>Tin tức &amp; hướng dẫn</h1>
      {items.length === 0 ? (
        <div className="empty card"><p>Bài viết đang được cập nhật.</p></div>
      ) : (
        <>
          <div className="project-grid">
            {items.map((p) => <PostCard key={p.slug} p={p} excerpt />)}
          </div>
          <Pagination base="/tin-tuc" page={page} hasNext={hasNext} />
        </>
      )}
    </div>
  );
}
