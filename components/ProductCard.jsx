import Link from 'next/link';
import { formatVND } from '@/lib/site';

export default function ProductCard({ p }) {
  const hasSale = p.sale_price && p.price && p.sale_price < p.price;
  const pct = hasSale ? Math.round((1 - p.sale_price / p.price) * 100) : 0;
  return (
    <Link href={`/${p.slug}`} className="card product-card">
      <div className="product-img">
        {hasSale && <span className="badge">-{pct}%</span>}
        {p.image_url ? (
          <img src={p.image_url} alt={p.name} loading="lazy" />
        ) : (
          <div className="img-placeholder">CPSTECH</div>
        )}
      </div>
      <div className="product-body">
        {p.brand && <span className="brand">{p.brand}</span>}
        <h3>{p.name}</h3>
        <div className="price">
          {p.sale_price || p.price ? (
            <>
              <strong>{formatVND(p.sale_price || p.price)}</strong>
              {hasSale && <del>{formatVND(p.price)}</del>}
            </>
          ) : (
            <strong className="contact-price">Liên hệ báo giá</strong>
          )}
        </div>
      </div>
    </Link>
  );
}
