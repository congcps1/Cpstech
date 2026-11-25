import Link from 'next/link';
import { SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo logo-light">
            <span className="logo-mark">CPS</span>
            <span className="logo-text"><strong>CPSTECH</strong><small>{SITE.tagline}</small></span>
          </div>
          <p className="muted-light">{SITE.description}</p>
          <p className="footer-social">
            <a href={SITE.facebook} target="_blank" rel="noopener">Facebook</a> ·{' '}
            <a href={SITE.youtube} target="_blank" rel="noopener">YouTube</a> ·{' '}
            <a href={SITE.zalo} target="_blank" rel="noopener">Zalo</a>
          </p>
        </div>
        {SITE.offices.map((o) => (
          <div key={o.city}>
            <p className="footer-title">CPSTECH {o.city}</p>
            <p>{o.address}</p>
            <p>ĐT: <a href={`tel:${o.tel}`}>{o.phone}</a></p>
            <p>Email: <a href={`mailto:${o.email}`}>{o.email}</a></p>
          </div>
        ))}
        <div>
          <p className="footer-title">Liên kết</p>
          <ul className="footer-links">
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/gioi-thieu-cpstech/">Giới thiệu</Link></li>
            <li><Link href="/cua-hang/">Cửa hàng</Link></li>
            <li><Link href="/tin-tuc/">Tin tức</Link></li>
            <li><Link href="/video/">Video</Link></li>
            <li><Link href="/lien-he/">Liên hệ – Gửi yêu cầu</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} CPSTECH – {SITE.company}</span>
        <span>{SITE.payment}</span>
      </div>
      <div className="float-contact">
        <a href={SITE.zalo} target="_blank" rel="noopener" className="float-btn zalo">Zalo</a>
        <a href={`tel:${SITE.hotlineTel}`} className="float-btn call">Gọi</a>
      </div>
    </footer>
  );
}
