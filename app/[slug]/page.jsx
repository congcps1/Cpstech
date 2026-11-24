import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ContactForm from '@/components/ContactForm';
import {
  getCategories, getCategory, getProduct, getProductsByCategories, getPost, descendants,
} from '@/lib/db';
import { SITE, formatVND } from '@/lib/site';

export const revalidate = 300;

const clean = (s) => { try { return decodeURIComponent(s); } catch { return s; } };

async function resolve(slug) {
  const cat = await getCategory(slug);
  if (cat) return { type: 'category', cat };
  const product = await getProduct(slug);
  if (product) return { type: 'product', product };
  const post = await getPost(slug);
  if (post) return { type: 'post', post };
  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = await resolve(clean(slug));
  if (!r) return { title: 'Không tìm thấy trang' };
  if (r.type === 'category') return { title: r.cat.name, description: r.cat.description || `${r.cat.name} chính hãng tại CPSTECH. Tư vấn, lắp đặt, bảo hành tận nơi.` };
  if (r.type === 'product') return { title: r.product.name, description: r.product.summary || `${r.product.name} – chính hãng, bảo hành 1 đổi 1. Liên hệ CPSTECH ${SITE.hotline}.`, openGraph: { images: r.product.image_url ? [r.product.image_url] : [] } };
  return { title: r.post.title, description: r.post.excerpt };
}

function Breadcrumb({ trail }) {
  return (
    <nav className="breadcrumb">
      <Link href="/">Trang chủ</Link>
      {trail.map((t) => (
        <span key={t.slug}> / <Link href={`/${t.slug}`}>{t.name}</Link></span>
      ))}
    </nav>
  );
}

function trailOf(all, slug) {
  const out = [];
  let cur = all.find((c) => c.slug === slug);
  while (cur) { out.unshift(cur); cur = all.find((c) => c.slug === cur.parent_slug); }
  return out;
}

export default async function SlugPage({ params }) {
  const { slug: raw } = await params;
  const slug = clean(raw);
  const r = await resolve(slug);
  if (!r) notFound();
  const all = await getCategories();

  if (r.type === 'category') {
    const { cat } = r;
    const children = all.filter((c) => c.parent_slug === cat.slug);
    const products = await getProductsByCategories(descendants(all, cat.slug));
    return (
      <div className="container page">
        <Breadcrumb trail={trailOf(all, cat.slug)} />
        <h1>{cat.name}</h1>
        {cat.description && <p className="lead">{cat.description}</p>}
        {children.length > 0 && (
          <div className="chips">
            {children.map((c) => <Link key={c.slug} href={`/${c.slug}`} className="chip">{c.name}</Link>)}
          </div>
        )}
        {products.length ? (
          <div className="product-grid">{products.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        ) : (
          <div className="empty card">
            <p>Danh mục đang được cập nhật sản phẩm. Vui lòng liên hệ để được tư vấn và báo giá.</p>
            <a className="btn" href={`tel:${SITE.hotlineTel}`}>Gọi {SITE.hotline}</a>
          </div>
        )}
      </div>
    );
  }

  if (r.type === 'product') {
    const p = r.product;
    const hasSale = p.sale_price && p.price && p.sale_price < p.price;
    const related = p.category_slug
      ? (await getProductsByCategories([p.category_slug])).filter((x) => x.slug !== p.slug).slice(0, 4)
      : [];
    return (
      <div className="container page">
        <Breadcrumb trail={[...trailOf(all, p.category_slug), { slug: p.slug, name: p.name }]} />
        <div className="product-detail">
          <div className="card product-detail-img">
            {p.image_url ? <img src={p.image_url} alt={p.name} /> : <div className="img-placeholder">CPSTECH</div>}
          </div>
          <div>
            {p.brand && <span className="brand">{p.brand}</span>}
            <h1>{p.name}</h1>
            <div className="price price-lg">
              {p.sale_price || p.price ? (
                <>
                  <strong>{formatVND(p.sale_price || p.price)}</strong>
                  {hasSale && <del>{formatVND(p.price)}</del>}
                </>
              ) : <strong className="contact-price">Liên hệ báo giá</strong>}
            </div>
            {p.summary && <p>{p.summary}</p>}
            <ul className="checks">
              <li>Sản phẩm chính hãng, đầy đủ hóa đơn VAT</li>
              <li>Bảo hành 1 đổi 1 trong 10 ngày đầu</li>
              <li>Giao hàng trong 2 giờ nội thành, lắp đặt tận nơi</li>
              <li>Kiểm tra hàng rồi mới thanh toán</li>
            </ul>
            <div className="hero-cta">
              <a className="btn" href={`tel:${SITE.hotlineTel}`}>Gọi đặt hàng {SITE.hotline}</a>
              <a className="btn btn-ghost-dark" href={SITE.zalo} target="_blank" rel="noopener">Chat Zalo</a>
            </div>
            <div className="card" style={{ marginTop: 24 }}>
              <h3>Yêu cầu báo giá sản phẩm này</h3>
              <ContactForm productSlug={p.slug} compact />
            </div>
          </div>
        </div>
        {p.content && (
          <section className="card prose" dangerouslySetInnerHTML={{ __html: p.content }} />
        )}
        {related.length > 0 && (
          <section className="section-tight">
            <h2 className="section-title">Sản phẩm liên quan</h2>
            <div className="product-grid">{related.map((x) => <ProductCard key={x.slug} p={x} />)}</div>
          </section>
        )}
      </div>
    );
  }

  const post = r.post;
  return (
    <article className="container page narrow">
      <Breadcrumb trail={[{ slug: 'tin-tuc', name: 'Tin tức' }]} />
      <h1>{post.title}</h1>
      <p className="muted">{new Date(post.published_at).toLocaleDateString('vi-VN')}</p>
      {post.cover_url && <img className="cover" src={post.cover_url} alt={post.title} />}
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
    </article>
  );
}
