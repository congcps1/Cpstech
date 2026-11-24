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
const PRODUCT_COLS = 'slug,name,brand,price,sale_price,image_url,category_slug,summary';

export const getCategories = () => q('cps_categories?select=slug,name,parent_slug,sort,description&order=sort.asc');

export const getCategory = async (slug) =>
  (await q(`cps_categories?slug=eq.${enc(slug)}&select=*&limit=1`))[0] || null;

export const getFeaturedProducts = (limit = 8) =>
  q(`cps_products?is_featured=eq.true&select=${PRODUCT_COLS}&order=id.asc&limit=${limit}`);

export const getProducts = (limit = 200) =>
  q(`cps_products?select=${PRODUCT_COLS}&order=id.asc&limit=${limit}`);

export const getProductsByCategories = (slugs) =>
  slugs.length
    ? q(`cps_products?category_slug=in.(${slugs.map(enc).join(',')})&select=${PRODUCT_COLS}&order=id.asc`)
    : Promise.resolve([]);

export const getProduct = async (slug) =>
  (await q(`cps_products?slug=eq.${enc(slug)}&select=*&limit=1`))[0] || null;

export const getPosts = (limit = 20) =>
  q(`cps_posts?select=slug,title,excerpt,cover_url,published_at&order=published_at.desc&limit=${limit}`);

export const getPost = async (slug) =>
  (await q(`cps_posts?slug=eq.${enc(slug)}&select=*&limit=1`))[0] || null;

// All descendant slugs of a category (including itself)
export function descendants(all, slug) {
  const out = [slug];
  for (let i = 0; i < out.length; i++) {
    all.filter((c) => c.parent_slug === out[i]).forEach((c) => out.push(c.slug));
  }
  return out;
}
