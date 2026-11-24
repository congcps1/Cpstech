import PostCard from '@/components/PostCard';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ContactForm from '@/components/ContactForm';
import VideoGrid from '@/components/VideoGrid';
import { getFeaturedProducts, getLatestPosts } from '@/lib/db';
import { getVideos, YT_CHANNEL_URL } from '@/lib/youtube';
import { SITE } from '@/lib/site';

export const revalidate = 300;

const PERKS = [
  { icon: '🛡️', title: 'Bảo hành 1 đổi 1', text: 'Trong 10 ngày đầu sử dụng' },
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

const PROJECTS = [
  { title: 'Trung tâm Anh ngữ TOEIC', text: 'Hệ thống chấm công & kiểm soát cửa ra vào cho học viên, giáo viên.' },
  { title: 'Căn hộ Vinhomes Ocean Park', text: 'Lắp đặt khóa điện tử thông minh vân tay – mã số – thẻ.' },
  { title: 'Chuỗi nhà hàng phở', text: 'Máy chấm công khuôn mặt, quản lý ca làm cho nhân viên.' },
];

export default async function Home() {
  const [featured, posts, videos] = await Promise.all([getFeaturedProducts(8), getLatestPosts(3), getVideos(4)]);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="eyebrow">CPSTECH · Chuyên thiết bị an ninh</span>
            <h1>Hệ thống kiểm soát ra vào, máy chấm công &amp; khóa cửa điện tử thông minh</h1>
            <p>Giải pháp an ninh trọn gói cho gia đình, văn phòng, nhà xưởng và khách sạn — tư vấn, lắp đặt, bảo hành tận nơi tại Hà Nội và TP.HCM.</p>
            <div className="hero-cta">
              <Link href="/cua-hang" className="btn">Xem sản phẩm</Link>
              <a href={`tel:${SITE.hotlineTel}`} className="btn btn-ghost">Hotline {SITE.hotline}</a>
            </div>
          </div>
          <div className="hero-card card">
            <h3>Nhận tư vấn miễn phí</h3>
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
            <Link href="/cua-hang">Xem tất cả →</Link>
          </div>
          <div className="product-grid">
            {featured.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container stats-grid">
          {STATS.map(([n, l]) => (
            <div key={l}><strong>{n}</strong><span>{l}</span></div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Dự án tiêu biểu</h2>
          <div className="project-grid">
            {PROJECTS.map((p) => (
              <div key={p.title} className="card project-card">
                <h3>{p.title}</h3>
                <p className="muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {videos.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Video</h2>
              <Link href="/video">Xem tất cả →</Link>
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
              <Link href="/tin-tuc">Xem tất cả →</Link>
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
