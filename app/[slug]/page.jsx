import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import PostCard from '@/components/PostCard';
import ProductCard from '@/components/ProductCard';
import ContactForm from '@/components/ContactForm';
import Gallery from '@/components/Gallery';
import Pagination from '@/components/Pagination';
import JsonLd from '@/components/JsonLd';
import {
  getCategories, getCategory, getProduct, getCategoryProductsPage, getRelatedProducts,
  getPost, getPage, getLatestPosts, getPostCategory, getPostsPage, getRedirect, guessSlug, descendants,
} from '@/lib/db';
import { SITE, formatVND, href } from '@/lib/site';
import { breadcrumb, product as productLd, article as articleLd } from '@/lib/schema';

export const revalidate = 300;

const clean = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
const strip = (h = '') => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const pageNo = (sp) => Math.max(1, Number(sp?.trang) || 1);

const POST_CAT_NAMES = {
  'giai-phap-kiem-soat': 'Giải pháp kiểm soát',
  'khach-hang': 'Khách hàng',
  'tuyen-dung': 'Tuyển dụng',
  'cong-trinh-da-thi-cong': 'Công trình đã thi công',
  'tin-tuc': 'Tin tức',
};

async function resolve(slug) {
  const redirect = await getRedirect(slug);
  if (redirect) return { type: 'redirect', to: redirect };
  const cat = await getCategory(slug);
  if (cat) return { type: 'category', cat };
  const product = await getProduct(slug);
  if (product) return { type: 'product', product };
  const post = await getPost(slug);
  if (post) return { type: 'post', post };
  const pcat = await getPostCategory(slug);
  if (pcat) return { type: 'postcat', pcat };
  const page = await getPage(slug);
  if (page) return { type: 'page', page };
  const guess = await guessSlug(slug);
  if (guess) return { type: 'redirect', to: href(guess) };
  return null;
}

const titleOf = (seo, fallback) => (seo ? { absolute: seo } : fallback);

export async function generateMetadata({ params, searchParams }) {
  const { slug: raw } = await params;
  const sp = (await searchParams) || {};
  const slug = clean(raw);
  const r = await resolve(slug);
  if (!r || r.type === 'redirect') return { title: 'Không tìm thấy trang', robots: { index: false } };
  const n = pageNo(sp);
  const canonical = href(slug) + (n > 1 ? `?trang=${n}` : '');
  const paged = (t) => (n > 1 ? (typeof t === 'object' ? { absolute: `${t.absolute} – Trang ${n}` } : `${t} – Trang ${n}`) : t);

  if (r.type === 'category') {
    const c = r.cat;
    const all = await getCategories();
    const { items } = await getCategoryProductsPage(descendants(all, c.slug), 1);
    return {
      robots: items.length ? undefined : { index: false, follow: true },
      title: paged(titleOf(c.seo_title, c.name)),
      description: c.seo_description || c.description || `${c.name} chính hãng tại CPSTECH. Tư vấn, lắp đặt, bảo hành tận nơi. Hotline ${SITE.hotline}.`,
      alternates: { canonical },
    };
  }
  if (r.type === 'product') {
    const p = r.product;
    return {
      title: titleOf(p.seo_title, p.name),
      description: p.seo_description || (p.summary || `${p.name} – chính hãng, đổi mới trong 1 tuần. Liên hệ CPSTECH ${SITE.hotline}.`).slice(0, 300),
      alternates: { canonical },
      openGraph: { type: 'website', images: p.image_url ? [p.image_url] : undefined },
    };
  }
  if (r.type === 'post') {
    const p = r.post;
    return {
      title: titleOf(p.seo_title, p.title),
      description: p.seo_description || (p.excerpt || '').slice(0, 300),
      alternates: { canonical },
      openGraph: { type: 'article', publishedTime: p.published_at, modifiedTime: p.updated_at || undefined, images: p.cover_url ? [p.cover_url] : undefined },
    };
  }
  if (r.type === 'postcat') {
    const c = r.pcat;
    return {
      title: paged(titleOf(c.seo_title, c.name)),
      description: c.seo_description || c.description || `${c.name} – bài viết từ CPSTECH, chuyên thiết bị an ninh, máy chấm công, kiểm soát ra vào.`,
      alternates: { canonical },
    };
  }
  const pg = r.page;
  return {
    title: titleOf(pg.seo_title, pg.title),
    description: pg.seo_description || strip(pg.content).slice(0, 300),
    alternates: { canonical },
  };
}

function Breadcrumb({ trail }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link href="/">Trang chủ</Link>
      {trail.map((t) => (
        <span key={t.slug}> / <Link href={href(t.slug)}>{t.name}</Link></span>
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
  if (r.type === 'redirect') permanentRedirect(r.to);

  if (r.type === 'category') {
    const all = await getCategories();
    const { cat } = r;
    const children = all.filter((c) => c.parent_slug === cat.slug);
    const { items, hasNext, page } = await getCategoryProductsPage(descendants(all, cat.slug), sp.trang);
    const trail = trailOf(all, cat.slug);
    return (
      <div className="container page">
        <JsonLd data={breadcrumb(trail)} />
        <Breadcrumb trail={trail} />
        <h1>{cat.name}</h1>
        {cat.description && <p className="lead">{cat.description}</p>}
        {children.length > 0 && (
          <div className="chips">
            {children.map((c) => <Link key={c.slug} href={href(c.slug)} className="chip">{c.name}</Link>)}
          </div>
        )}
        {items.length ? (
          <>
            <h2 className="sr-only">Sản phẩm {cat.name}</h2>
            <div className="product-grid">{items.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
            <Pagination base={href(cat.slug)} page={page} hasNext={hasNext} />
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
    const trail = [...trailOf(all, p.category_slug), { slug: p.slug, name: p.name }];
    return (
      <div className="container page">
        <JsonLd data={productLd(p)} />
        <JsonLd data={breadcrumb(trail)} />
        <Breadcrumb trail={trail} />
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
              <li>Đổi mới trong 1 tuần nếu có lỗi của nhà sản xuất</li>
              <li>Giao hàng trong 2 giờ nội thành, lắp đặt tận nơi</li>
              <li>Kiểm tra hàng rồi mới thanh toán</li>
            </ul>
            <div className="hero-cta">
              <a className="btn" href={`tel:${SITE.hotlineTel}`}>Gọi đặt hàng {SITE.hotline}</a>
              <a className="btn btn-ghost-dark" href={SITE.zalo} target="_blank" rel="noopener">Chat Zalo</a>
            </div>
            <div className="card" style={{ marginTop: 24 }}>
              <h2 className="h3">Yêu cầu báo giá sản phẩm này</h2>
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

  if (r.type === 'postcat') {
    const c = r.pcat;
    const { items, hasNext, page } = await getPostsPage(sp.trang, c.slug);
    return (
      <div className="container page">
        <JsonLd data={breadcrumb([{ slug: c.slug, name: c.name }])} />
        <Breadcrumb trail={[{ slug: c.slug, name: c.name }]} />
        <h1>{c.name}</h1>
        {items.length === 0 ? (
          <div className="empty card"><p>Chuyên mục đang được cập nhật.</p></div>
        ) : (
          <>
            <div className="project-grid">{items.map((p) => <PostCard key={p.slug} p={p} excerpt />)}</div>
            <Pagination base={href(c.slug)} page={page} hasNext={hasNext} />
          </>
        )}
      </div>
    );
  }

  if (r.type === 'page') {
    const pg = r.page;
    const hasH1 = /<h1[\s>]/i.test(pg.content || '');
    return (
      <article className="container page narrow">
        <JsonLd data={breadcrumb([{ slug: pg.slug, name: pg.title }])} />
        <Breadcrumb trail={[]} />
        {!hasH1 && <h1>{pg.title}</h1>}
        <div className="prose" dangerouslySetInnerHTML={{ __html: pg.content || '' }} />
        <div className="card" style={{ marginTop: 32 }}>
          <h2 className="h3">Cần tư vấn?</h2>
          <ContactForm compact />
        </div>
      </article>
    );
  }

  const post = r.post;
  const latest = (await getLatestPosts(4)).filter((x) => x.slug !== post.slug).slice(0, 3);
  const catSlug = post.category_slugs?.[0] || 'tin-tuc';
  const trail = [{ slug: catSlug, name: POST_CAT_NAMES[catSlug] || 'Tin tức' }];
  return (
    <article className="container page narrow">
      <JsonLd data={articleLd(post)} />
      <JsonLd data={breadcrumb([...trail, { slug: post.slug, name: post.title }])} />
      <Breadcrumb trail={trail} />
      <h1>{post.title}</h1>
      <p className="muted"><time dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString('vi-VN')}</time></p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
      {latest.length > 0 && (
        <section className="section-tight">
          <h2 className="section-title">Bài viết mới</h2>
          <div className="project-grid">{latest.map((x) => <PostCard key={x.slug} p={x} />)}</div>
        </section>
      )}
    </article>
  );
}
