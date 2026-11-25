'use client';
// Client gọi thẳng Supabase (Auth + PostgREST + Storage) bằng token của người đăng nhập.
// Quyền ghi được kiểm soát bởi RLS: chỉ tài khoản trong bảng cps_admins mới đọc/sửa được.
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const LS = 'cps_admin_session';

export const STORAGE_PUBLIC = `${URL_}/storage/v1/object/public/cpstech/`;

function load() {
  try { return JSON.parse(localStorage.getItem(LS) || 'null'); } catch { return null; }
}
function save(s) {
  try { s ? localStorage.setItem(LS, JSON.stringify(s)) : localStorage.removeItem(LS); } catch { /* ignore */ }
}

async function authCall(path, body) {
  const r = await fetch(`${URL_}/auth/v1/${path}`, {
    method: 'POST',
    headers: { apikey: KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error_description || j.msg || j.message || 'Đăng nhập thất bại');
  const s = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + (j.expires_in - 60) * 1000, email: j.user?.email };
  save(s);
  return s;
}

export const login = (email, password) => authCall('token?grant_type=password', { email, password });
export const logout = () => save(null);
export const currentEmail = () => load()?.email || null;

export async function token() {
  let s = load();
  if (!s) return null;
  if (Date.now() > s.expires_at) {
    try { s = await authCall('token?grant_type=refresh_token', { refresh_token: s.refresh_token }); } catch { save(null); return null; }
  }
  return s.access_token;
}

export async function isAdmin() {
  const t = await token();
  if (!t) return false;
  const r = await fetch(`${URL_}/rest/v1/rpc/cps_is_admin`, { method: 'POST', headers: { apikey: KEY, Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }, body: '{}' });
  return r.ok && (await r.json()) === true;
}

export async function changePassword(password) {
  const t = await token();
  const r = await fetch(`${URL_}/auth/v1/user`, { method: 'PUT', headers: { apikey: KEY, Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
  if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.msg || j.message || 'Không đổi được mật khẩu'); }
}

// PostgREST. Trả về { data, total } khi count=true.
export async function rest(path, { method = 'GET', body, count = false, prefer } = {}) {
  const t = await token();
  if (!t) throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
  const headers = { apikey: KEY, Authorization: `Bearer ${t}` };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const pf = [prefer, count && 'count=exact'].filter(Boolean).join(',');
  if (pf) headers.Prefer = pf;
  const r = await fetch(`${URL_}/rest/v1/${path}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined, cache: 'no-store' });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    if (j.code === '23505') throw new Error('Đường dẫn (slug) này đã tồn tại, vui lòng đổi slug khác.');
    throw new Error(j.message || `Lỗi ${r.status}`);
  }
  const text = await r.text();
  const data = text ? JSON.parse(text) : null;
  if (!count) return data;
  const range = r.headers.get('content-range') || '';
  return { data, total: Number(range.split('/')[1]) || 0 };
}

// Logo nhỏ, mờ ở góc dưới phải: ô "CPS" + chữ cpstech.vn.
function drawWatermark(ctx, w, h) {
  const s = Math.max(0.6, Math.min(w, h) / 900); // tỉ lệ theo kích thước ảnh
  const box = 34 * s, pad = 14 * s, font = 15 * s;
  ctx.save();
  ctx.font = `600 ${font}px Arial, sans-serif`;
  const text = 'cpstech.vn';
  const tw = ctx.measureText(text).width;
  const W = box + 8 * s + tw + 14 * s, H = box + 8 * s;
  const x = w - W - pad, y = h - H - pad;
  ctx.globalAlpha = 0.72;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.roundRect(x, y, W, H, 8 * s); ctx.fill();
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#d9472b';
  ctx.beginPath(); ctx.roundRect(x + 4 * s, y + 4 * s, box, box, 6 * s); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `800 ${13 * s}px Arial, sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('CPS', x + 4 * s + box / 2, y + 4 * s + box / 2 + 1);
  ctx.fillStyle = '#0b1f3a';
  ctx.font = `600 ${font}px Arial, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(text, x + box + 10 * s, y + H / 2 + 1);
  ctx.restore();
}

// Thu nhỏ ảnh (tối đa 1600px, WebP) trước khi tải lên để trang nhẹ; tùy chọn đóng logo.
async function shrink(file, watermark = false) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') return { blob: file, ext: file.name.split('.').pop().toLowerCase() };
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  if (watermark) drawWatermark(ctx, c.width, c.height);
  const blob = await new Promise((res) => c.toBlob(res, 'image/webp', 0.86));
  return { blob, ext: 'webp' };
}

export async function uploadImage(file, baseName, { watermark = false } = {}) {
  const t = await token();
  const { blob, ext } = await shrink(file, watermark);
  const path = `uploads/${new Date().toISOString().slice(0, 7)}/${slugify(baseName || file.name.replace(/\.[^.]+$/, ''))}-${Date.now().toString(36)}.${ext}`;
  const r = await fetch(`${URL_}/storage/v1/object/cpstech/${path}`, {
    method: 'POST',
    headers: { apikey: KEY, Authorization: `Bearer ${t}`, 'Content-Type': blob.type || 'application/octet-stream', 'cache-control': 'max-age=31536000' },
    body: blob,
  });
  if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.message || 'Tải ảnh thất bại'); }
  return STORAGE_PUBLIC + path;
}

// Làm mới bản lưu tạm của website sau khi sửa (không phải chờ 5 phút).
export async function revalidateSite() {
  const t = await token();
  await fetch('/api/revalidate/', { method: 'POST', headers: { Authorization: `Bearer ${t}` } }).catch(() => {});
}

export const slugify = (s) =>
  String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
