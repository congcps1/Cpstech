// Lightweight Supabase REST (PostgREST) client — no extra dependencies.
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function q(path, { revalidate = 300 } = {}) {
  if (!URL_ || !KEY) {
    console.warn('Missing Supabase env vars');
    return [];
  }
  try {
    const res = await fetch(`${URL_}/rest/v1/${path}`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      next: { revalidate },
    });
    if (!res.ok) {
      console.error('Supabase error', res.status, await res.text());
      return [];
    }
    return res.json();
  } catch (e) {
    console.error('Supabase fetch failed', e);
    return [];
  }
}

const enc = encodeURIComponent;
const PRODUCT_COLS = 'slug,name,brand,price,sale_price,image_url,category_slug';
export const PER_PAGE = 24;

// Fetch one page; returns { items, hasNext }
async function paged(path, page) {
  const p = Math.max(1, Number(page) || 1);
  const rows = await q(`${path}&limit=${PER_PAGE + 1}&offset=${(p - 1) * PER_PAGE}`);
  return { items: rows.slice(0, PER_PAGE), hasNext: rows.length > PER_PAGE, page: p };
}

export const getCategories = () => q('cps_categories?select=slug,name,parent_slug,sort,description&order=sort.asc');

export const getCategory = async (slug) =>
  (await q(`cps_categories?slug=eq.${enc(slug)}&select=*&limit=1`))[0] || null;

export const getFeaturedProducts = (limit = 8) =>
  q(`cps_products?is_featured=eq.true&select=${PRODUCT_COLS}&order=wp_id.desc&limit=${limit}`);

export const getProductsPage = (page) =>
  paged(`cps_products?select=${PRODUCT_COLS}&order=has_price.desc,wp_id.desc`, page);

export const getProducts = (limit = 1000) =>
  q(`cps_products?select=slug,created_at,category_slugs&limit=${limit}`);

const ov = (slugs) => `category_slugs=ov.${enc('{' + slugs.join(',') + '}')}`;

export const getCategoryProductsPage = (slugs, page) =>
  paged(`cps_products?${ov(slugs)}&select=${PRODUCT_COLS}&order=has_price.desc,wp_id.desc`, page);

export const getRelatedProducts = (slug, cat, limit = 4) =>
  cat
    ? q(`cps_products?category_slugs=cs.${enc('{' + cat + '}')}&slug=neq.${enc(slug)}&select=${PRODUCT_COLS}&order=has_price.desc,wp_id.desc&limit=${limit}`)
    : Promise.resolve([]);

export const getProduct = async (slug) =>
  (await q(`cps_products?slug=eq.${enc(slug)}&select=*&limit=1`))[0] || null;

export const getPostsPage = (page, cat = null) =>
  paged(`cps_posts?${cat ? `category_slugs=cs.${enc('{' + cat + '}')}&` : ''}select=slug,title,excerpt,cover_url,published_at&order=published_at.desc`, page);

export const getPostCategory = async (slug) =>
  (await q(`cps_post_categories?slug=eq.${enc(slug)}&select=*&limit=1`))[0] || null;

export const getPostCategories = () => q('cps_post_categories?select=slug,name&order=id.asc');

export const getRedirect = async (slug) =>
  (await q(`cps_redirects?from_slug=eq.${enc(slug.toLowerCase())}&select=to_path&limit=1`))[0]?.to_path || null;

// WordPress-style "guess" for a missing slug: a post/product whose slug starts with it.
export async function guessSlug(slug) {
  if (!slug || slug.length < 6 || /[^a-z0-9-]/.test(slug)) return null;
  const like = enc(`${slug}*`);
  const [post] = await q(`cps_posts?slug=like.${like}&select=slug&order=published_at.desc&limit=1`);
  if (post) return post.slug;
  const [prod] = await q(`cps_products?slug=like.${like}&select=slug&limit=1`);
  return prod ? prod.slug : null;
}

export const getLatestPosts = (limit = 3) =>
  q(`cps_posts?select=slug,title,excerpt,cover_url,published_at&order=published_at.desc&limit=${limit}`);

export const getPostSlugs = () => q('cps_posts?select=slug,published_at,updated_at&limit=2000');

export const getPost = async (slug) =>
  (await q(`cps_posts?slug=eq.${enc(slug)}&select=*&limit=1`))[0] || null;

export const getPage = async (slug) =>
  (await q(`cps_pages?slug=eq.${enc(slug)}&select=*&limit=1`))[0] || null;

// All descendant slugs of a category (including itself)
export function descendants(all, slug) {
  const out = [slug];
  for (let i = 0; i < out.length; i++) {
    all.filter((c) => c.parent_slug === out[i]).forEach((c) => out.push(c.slug));
  }
  return out;
}
