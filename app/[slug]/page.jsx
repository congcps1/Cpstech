import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ContactForm from '@/components/ContactForm';
import Gallery from '@/components/Gallery';
import Pagination from '@/components/Pagination';
import {
  getCategories, getCategory, getProduct, getCategoryProductsPage, getRelatedProducts,
  getPost, getPage, getLatestPosts, descendants,
} from '@/lib/db';
import { SITE, formatVND } from '@/lib/site';

export const revalidate = 300;

const clean = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
const strip = (h = '') => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

async function resolve(slug) {
  const cat = await getCategory(slug);
  if (cat) return { type: 'category', cat };
  const product = await getProduct(slug);
  if (product) return { type: 'product', product };
  const post = await getPost(slug);
  if (post) return { type: 'post', post };
  const page = await getPage(slug);
  if (page) return { type: 'page', page };
  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = await resolve(clean(slug));
  if (!r) return { title: 'Không tìm thấy trang' };
  const canonical = `/${clean(slug)}`;
  if (r.type === 'category')
    return { title: r.cat.name, alternates: { canonical }, description: r.cat.description || `${r.cat.name} chính hãng tại CPSTECH. Tư vấn, lắp đặt, bảo hành tận nơi.` };
  if (r.type === 'product')
    return {
      title: r.product.name, alternates: { canonical },
      description: (r.product.summary || `${r.product.name} – chính hãng, bảo hành 1 đổi 1. Liên hệ CPSTECH ${SITE.hotline}.`).slice(0, 160),
      openGraph: { images: r.product.image_url ? [r.product.image_url] : [] },
    };
  if (r.type === 'post')
    return { title: r.post.title, alternates: { canonical }, description: r.post.excerpt?.slice(0, 160), openGraph: { type: 'article', images: r.post.cover_url ? [r.post.cover_url] : [] } };
  return { title: r.page.title, alternates: { canonical }, description: strip(r.page.content).slice(0, 160) };
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

export default async function SlugPage({ params, searchParams }) {
  const { slug: raw } = await params;
  const sp = (await searchParams) || {};
  const slug = clean(raw);
  const r = await resolve(slug);
  if (!r) notFound();

  if (r.type === 'category') {
    const all = await getCategories();
    const { cat } = r;
    const children = all.filter((c) => c.parent_slug === cat.slug);
    const { items, hasNext, page } = await getCategoryProductsPage(descendants(all, cat.slug), sp.trang);
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
        {items.length ? (
          <>
            <div className="product-grid">{items.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
            <Pagination base={`/${cat.slug}`} page={page} hasNext={hasNext} />
          </>
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
    const all = await getCategories();
    const p = r.product;
    const hasSale = p.sale_price && p.price && p.sale_price < p.price;
    const related = await getRelatedProducts(p.slug, p.category_slug);
    const images = p.images?.length ? p.images : p.image_url ? [p.image_url] : [];
    return (
      <div className="container page">
        <Breadcrumb trail={[...trailOf(all, p.category_slug), { slug: p.slug, name: p.name }]} />
        <div className="product-detail">
          <Gallery images={images} alt={p.name} />
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
            {p.short_html ? <div className="prose short" dangerouslySetInnerHTML={{ __html: p.short_html }} /> : null}
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
          <section className="card prose">
            <h2>Thông tin chi tiết</h2>
            <div dangerouslySetInnerHTML={{ __html: p.content }} />
          </section>
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

  if (r.type === 'page') {
    const pg = r.page;
    const hasH1 = /<h1[\s>]/i.test(pg.content || '');
    return (
      <article className="container page narrow">
        <Breadcrumb trail={[]} />
        {!hasH1 && <h1>{pg.title}</h1>}
        <div className="prose" dangerouslySetInnerHTML={{ __html: pg.content || '' }} />
        <div className="card" style={{ marginTop: 32 }}>
          <h3>Cần tư vấn?</h3>
          <ContactForm compact />
        </div>
      </article>
    );
  }

  const post = r.post;
  const latest = (await getLatestPosts(4)).filter((x) => x.slug !== post.slug).slice(0, 3);
  return (
    <article className="container page narrow">
      <Breadcrumb trail={[{ slug: 'tin-tuc', name: 'Tin tức' }]} />
      <h1>{post.title}</h1>
      <p className="muted">{new Date(post.published_at).toLocaleDateString('vi-VN')}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
      {latest.length > 0 && (
        <section className="section-tight">
          <h2 className="section-title">Bài viết mới</h2>
          <div className="project-grid">
            {latest.map((x) => <PostCard key={x.slug} p={x} />)}
          </div>
        </section>
      )}
    </article>
  );
}
