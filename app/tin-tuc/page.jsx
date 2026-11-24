import PostCard from '@/components/PostCard';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import { getPostsPage } from '@/lib/db';

export const revalidate = 300;
export const metadata = { title: 'Tin tức', description: 'Hướng dẫn sử dụng, cài đặt máy chấm công, khóa vân tay và tin tức từ CPSTECH.' };

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
