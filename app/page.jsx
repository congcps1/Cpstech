import PostCard from '@/components/PostCard';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ContactForm from '@/components/ContactForm';
import VideoGrid from '@/components/VideoGrid';
import { getFeaturedProducts, getLatestPosts, getCategoryShowcase, getRandomLockers, getPostsBySlugs } from '@/lib/db';
import { getVideos, YT_CHANNEL_URL } from '@/lib/youtube';
import { SITE, STATIC_SEO } from '@/lib/site';
import JsonLd from '@/components/JsonLd';
import { organization, website } from '@/lib/schema';

export const revalidate = 300;
export const metadata = {
  title: { absolute: STATIC_SEO.home.title },
  description: STATIC_SEO.home.description,
  alternates: { canonical: '/' },
};

const PERKS = [
  { icon: '🛡️', title: 'Đổi mới trong 1 tuần', text: 'Nếu có lỗi của nhà sản xuất' },
  { icon: '✅', title: 'Sản phẩm chính hãng', text: 'Nhập khẩu, đầy đủ CO/CQ' },
  { icon: '🚚', title: 'Giao hàng nhanh', text: 'Trong 2 giờ nội thành' },
  { icon: '💵', title: 'Nhận hàng thanh toán', text: 'Kiểm tra hàng rồi mới trả tiền' },
];

const STATS = [
  ['12+', 'Năm kinh nghiệm'],
  ['80+', 'Nhân sự'],
  ['100K+', 'Khách hàng tin dùng'],
  ['55+', 'Nhà cung cấp uy tín'],
];

// Công trình tiêu biểu: lấy từ bài viết thật (ảnh + link).
const PROJECT_SLUGS = [
  'thi-cong-lap-khoa-cua-van-tay-cho-12-co-so-tieng-anh-hoa-toeic',
  'thi-cong-khoa-cua-van-tay-tai-chung-cu-vinhomes-hung-yen',
  'thi-cong-khoa-cua-van-tay-quan-pho-10-ly-quoc-su',
];

export default async function Home() {
  const [featuredAll, lockers, projects, faceTA, posts, videos] = await Promise.all([
    getFeaturedProducts(8),
    getRandomLockers(4),
    getPostsBySlugs(PROJECT_SLUGS),
    getCategoryShowcase('may-cham-cong-bang-khuon-mat', 8, ['suprema']),
    getLatestPosts(3),
    getVideos(4),
  ]);
  // 4 ô đầu: khóa tủ locker ngẫu nhiên; 4 ô sau: sản phẩm nổi bật.
  const lockerSlugs = new Set(lockers.map((p) => p.slug));
  const featured = [...lockers, ...featuredAll.filter((p) => !lockerSlugs.has(p.slug))].slice(0, 8);

  return (
    <>
      <JsonLd data={organization()} />
      <JsonLd data={website()} />
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="eyebrow">CPSTECH · Chuyên thiết bị an ninh</span>
            <h1>Hệ thống kiểm soát ra vào, máy chấm công &amp; khóa cửa điện tử thông minh</h1>
            <p>Giải pháp an ninh trọn gói cho gia đình, văn phòng, nhà xưởng và khách sạn — tư vấn, lắp đặt, bảo hành tận nơi tại Hà Nội và TP.HCM.</p>
            <div className="hero-cta">
              <Link href="/cua-hang/" className="btn">Xem sản phẩm</Link>
              <a href={`tel:${SITE.hotlineTel}`} className="btn btn-ghost">Hotline {SITE.hotline}</a>
            </div>
          </div>
          <div className="hero-card card">
            <h2 className="h3">Nhận tư vấn miễn phí</h2>
            <p className="muted">Để lại số điện thoại, kỹ thuật viên gọi lại trong 15 phút.</p>
            <ContactForm compact />
          </div>
        </div>
      </section>

      <section className="perks">
        <div className="container perks-grid">
          {PERKS.map((p) => (
            <div key={p.title} className="perk">
              <span className="perk-icon">{p.icon}</span>
              <div><strong>{p.title}</strong><small>{p.text}</small></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Sản phẩm nổi bật</h2>
            <Link href="/cua-hang/">Xem tất cả →</Link>
          </div>
          <div className="product-grid">
            {featured.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>

      {faceTA.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Máy chấm công khuôn mặt</h2>
              <Link href="/may-cham-cong-bang-khuon-mat/">Xem tất cả →</Link>
            </div>
            <div className="product-grid">
              {faceTA.map((p) => <ProductCard key={p.slug} p={p} />)}
            </div>
          </div>
        </section>
      )}

      <section className="stats">
        <div className="container stats-grid">
          {STATS.map(([n, l]) => (
            <div key={l}><strong>{n}</strong><span>{l}</span></div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Dự án tiêu biểu</h2>
            <Link href="/cong-trinh-da-thi-cong/">Xem tất cả công trình →</Link>
          </div>
          <div className="project-grid">
            {projects.map((p) => <PostCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>

      {videos.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Video</h2>
              <Link href="/video/">Xem tất cả →</Link>
            </div>
            <VideoGrid videos={videos} />
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <a href={YT_CHANNEL_URL} target="_blank" rel="noopener" className="btn btn-yt">Đăng ký kênh YouTube</a>
            </div>
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Tin tức &amp; hướng dẫn</h2>
              <Link href="/tin-tuc/">Xem tất cả →</Link>
            </div>
            <div className="project-grid">
              {posts.map((p) => <PostCard key={p.slug} p={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
