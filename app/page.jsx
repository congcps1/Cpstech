import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ContactForm from '@/components/ContactForm';
import { getCategories, getFeaturedProducts, getLatestPosts } from '@/lib/db';
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

const CAT_ICONS = {
  'may-cham-cong': '🕘',
  'he-thong-thiet-bi-kiem-soat-ra-vao': '🚪',
  'khoa-dien-tu-thong-minh': '🔐',
  'phan-mem': '💻',
};

export default async function Home() {
  const [cats, featured, posts] = await Promise.all([getCategories(), getFeaturedProducts(8), getLatestPosts(3)]);
  const roots = cats.filter((c) => !c.parent_slug);

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

      <section className="section">
        <div className="container">
          <h2 className="section-title">Danh mục sản phẩm</h2>
          <div className="cat-grid">
            {roots.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="card cat-card">
                <span className="cat-icon">{CAT_ICONS[c.slug] || '🔧'}</span>
                <h3>{c.name}</h3>
                <ul>
                  {cats.filter((s) => s.parent_slug === c.slug).slice(0, 5).map((s) => (
                    <li key={s.slug}>{s.name}</li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
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

      {posts.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Tin tức &amp; hướng dẫn</h2>
              <Link href="/tin-tuc">Xem tất cả →</Link>
            </div>
            <div className="project-grid">
              {posts.map((p) => (
                <Link key={p.slug} href={`/${p.slug}`} className="card post-card">
                  {p.cover_url && <img src={p.cover_url} alt={p.title} loading="lazy" />}
                  <h3>{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
