'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { rest, uploadImage, revalidateSite, slugify } from '@/lib/adminApi';

const EMPTY = { slug: '', name: '', price: null, sale_price: null, category_slug: '', category_slugs: [], images: [], image_url: null, short_html: '', content: '', seo_title: '', seo_description: '', is_published: true, brand: '' };
const FIELDS = 'slug,name,price,sale_price,category_slug,category_slugs,images,image_url,short_html,content,seo_title,seo_description,is_published,brand';
const num = (v) => { const n = String(v ?? '').replace(/[^\d]/g, ''); return n ? Number(n) : null; };

export default function ProductEditor({ slug, cats, onClose }) {
  const isNew = !slug;
  const [p, setP] = useState(isNew ? EMPTY : null);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [preview, setPreview] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const fileRef = useRef(null);
  const set = (k, v) => setP((x) => ({ ...x, [k]: v }));

  useEffect(() => {
    if (isNew) return;
    rest(`cps_products?slug=eq.${encodeURIComponent(slug)}&select=${FIELDS}`).then((r) => setP({ ...EMPTY, ...r[0], images: r[0].images || [], category_slugs: r[0].category_slugs || [] })).catch((e) => setErr(e.message));
  }, [slug, isNew]);

  const tree = useMemo(() => {
    const kids = (parent) => cats.filter((c) => (c.parent_slug || null) === parent);
    const out = [];
    const walk = (parent, d) => kids(parent).forEach((c) => { out.push({ ...c, d }); walk(c.slug, d + 1); });
    walk(null, 0);
    return out;
  }, [cats]);

  if (!p) return <p className="muted">{err || 'Đang tải…'}</p>;

  function toggleCat(s) {
    const has = p.category_slugs.includes(s);
    const next = has ? p.category_slugs.filter((x) => x !== s) : [...p.category_slugs, s];
    setP((x) => ({ ...x, category_slugs: next, category_slug: next.includes(x.category_slug) ? x.category_slug : next[0] || '' }));
  }

  async function onFiles(files) {
    const list = [...files];
    setUploading(list.length);
    for (const f of list) {
      try { const url = await uploadImage(f, p.slug || p.name || 'san-pham'); setP((x) => ({ ...x, images: [...x.images, url] })); }
      catch (e) { alert(`${f.name}: ${e.message}`); }
      setUploading((n) => n - 1);
    }
  }
  const moveImg = (i, d) => setP((x) => { const a = [...x.images]; const j = i + d; if (j < 0 || j >= a.length) return x; [a[i], a[j]] = [a[j], a[i]]; return { ...x, images: a }; });
  const delImg = (i) => setP((x) => ({ ...x, images: x.images.filter((_, k) => k !== i) }));
  function addUrl() { const u = prompt('Dán link ảnh (https://…):'); if (u && /^https?:\/\//.test(u)) set('images', [...p.images, u.trim()]); }

  async function save(e) {
    e?.preventDefault();
    setErr('');
    const s = (p.slug || slugify(p.name)).trim();
    if (!p.name.trim()) return setErr('Vui lòng nhập tên sản phẩm.');
    if (!/^[a-z0-9-]+$/.test(s)) return setErr('Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang.');
    if (!p.category_slugs.length) return setErr('Chọn ít nhất một danh mục.');
    const price = num(p.price), sale = num(p.sale_price);
    if (sale && price && sale >= price) return setErr('Giá khuyến mãi phải nhỏ hơn giá gốc.');
    const body = {
      slug: s, name: p.name.trim(), price: price, sale_price: sale, brand: p.brand?.trim() || null,
      category_slug: p.category_slug || p.category_slugs[0], category_slugs: p.category_slugs,
      images: p.images, image_url: p.images[0] || null,
      short_html: p.short_html || null, content: p.content || null,
      seo_title: p.seo_title?.trim() || null, seo_description: p.seo_description?.trim() || null,
      is_published: !!p.is_published,
    };
    setSaving(true);
    try {
      if (isNew || s !== slug) {
        // Slug không được trùng với danh mục, bài viết, trang tĩnh.
        const [c, po, pg] = await Promise.all([
          rest(`cps_categories?slug=eq.${s}&select=slug`), rest(`cps_posts?slug=eq.${s}&select=slug`), rest(`cps_pages?slug=eq.${s}&select=slug`),
        ]);
        if (c.length || po.length || pg.length) throw new Error('Slug này đang được dùng cho danh mục/bài viết/trang khác.');
      }
      if (isNew) await rest('cps_products', { method: 'POST', body, prefer: 'return=minimal' });
      else {
        await rest(`cps_products?slug=eq.${encodeURIComponent(slug)}`, { method: 'PATCH', body, prefer: 'return=minimal' });
        if (s !== slug) await rest('cps_redirects', { method: 'POST', body: { from_slug: slug, to_path: `/${s}/`, note: 'Đổi slug từ trang quản trị' }, prefer: 'resolution=merge-duplicates,return=minimal' }).catch(() => {});
      }
      await revalidateSite();
      onClose(true);
    } catch (ex) { setErr(ex.message); }
    setSaving(false);
  }

  async function remove() {
    if (!confirm(`Xóa vĩnh viễn "${p.name}"? Không khôi phục được.\n\nNếu chỉ muốn tạm ngừng bán, hãy bỏ chọn "Hiển thị trên web" rồi Lưu.`)) return;
    try { await rest(`cps_products?slug=eq.${encodeURIComponent(slug)}`, { method: 'DELETE' }); await revalidateSite(); onClose(true); } catch (e) { setErr(e.message); }
  }

  const titleLen = (p.seo_title || p.name).length, descLen = (p.seo_description || '').length;
  return (
    <form className="adm-editor" onSubmit={save}>
      <div className="adm-bar adm-sticky">
        <button type="button" className="adm-link" onClick={() => onClose(false)}>← Danh sách</button>
        <strong className="adm-ed-title">{isNew ? 'Thêm sản phẩm' : p.name}</strong>
        {!isNew && <a className="adm-link" href={`/${slug}/`} target="_blank" rel="noopener">Xem trên web ↗</a>}
        <button className="btn btn-sm" disabled={saving || uploading > 0}>{saving ? 'Đang lưu…' : uploading ? 'Đang tải ảnh…' : 'Lưu'}</button>
      </div>
      {err && <div className="alert err">{err}</div>}

      <div className="adm-grid">
        <div className="adm-col">
          <section className="card form">
            <label>Tên sản phẩm *<input value={p.name} onChange={(e) => { set('name', e.target.value); if (isNew && !slugTouched) set('slug', slugify(e.target.value)); }} required maxLength={200} /></label>
            <label>Đường dẫn (slug)<input value={p.slug} onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} placeholder="tu-dong-tao-tu-ten" />
              {!isNew && p.slug !== slug && <small className="muted">Đổi slug sẽ tự tạo chuyển hướng 301 từ link cũ.</small>}</label>
            <div className="form-row">
              <label>Giá gốc (đ)<input inputMode="numeric" value={p.price ?? ''} onChange={(e) => set('price', num(e.target.value))} placeholder="Trống = Liên hệ" /></label>
              <label>Giá khuyến mãi (đ)<input inputMode="numeric" value={p.sale_price ?? ''} onChange={(e) => set('sale_price', num(e.target.value))} placeholder="Không bắt buộc" /></label>
            </div>
            <label>Thương hiệu<input value={p.brand || ''} onChange={(e) => set('brand', e.target.value)} placeholder="Không bắt buộc" /></label>
            <label className="adm-check"><input type="checkbox" checked={!!p.is_published} onChange={(e) => set('is_published', e.target.checked)} /> Hiển thị trên web</label>
          </section>

          <section className="card">
            <h2 className="h3">Ảnh sản phẩm <small className="muted">(ảnh đầu tiên là ảnh đại diện)</small></h2>
            <div className="adm-imgs">
              {p.images.map((u, i) => (
                <div key={u + i} className={`adm-img ${i === 0 ? 'main' : ''}`}>
                  <img src={u} alt="" />
                  <div className="adm-img-tools">
                    <button type="button" onClick={() => moveImg(i, -1)} disabled={i === 0} title="Lên trước">◀</button>
                    <button type="button" onClick={() => moveImg(i, 1)} disabled={i === p.images.length - 1} title="Ra sau">▶</button>
                    <button type="button" onClick={() => delImg(i)} title="Bỏ ảnh">✕</button>
                  </div>
                </div>
              ))}
              <button type="button" className="adm-img adm-add" onClick={() => fileRef.current?.click()}>{uploading ? `Đang tải ${uploading}…` : '+ Tải ảnh lên'}</button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { onFiles(e.target.files); e.target.value = ''; }} />
            <button type="button" className="adm-link" onClick={addUrl}>+ Thêm ảnh bằng link</button>
          </section>

          <section className="card form">
            <h2 className="h3">Mô tả</h2>
            <label>Mô tả ngắn (hiện cạnh giá; HTML, mỗi ý một dòng &lt;li&gt;)
              <textarea rows={6} value={p.short_html || ''} onChange={(e) => set('short_html', e.target.value)} /></label>
            <div className="adm-row-between">
              <span>Nội dung chi tiết (HTML)</span>
              <button type="button" className="adm-link" onClick={() => setPreview(!preview)}>{preview ? 'Sửa mã HTML' : 'Xem trước'}</button>
            </div>
            {preview ? <div className="prose adm-preview" dangerouslySetInnerHTML={{ __html: p.content || '<p class="muted">(trống)</p>' }} />
              : <textarea rows={18} className="adm-code" value={p.content || ''} onChange={(e) => set('content', e.target.value)} />}
            <small className="muted">Dùng &lt;h2&gt; cho tiêu đề mục, &lt;p&gt; cho đoạn văn, &lt;ul&gt;&lt;li&gt; cho danh sách, &lt;table&gt; cho thông số.</small>
          </section>
        </div>

        <div className="adm-col">
          <section className="card">
            <h2 className="h3">Danh mục *</h2>
            <div className="adm-cats">
              {tree.map((c) => (
                <label key={c.slug} style={{ paddingLeft: c.d * 16 }} className="adm-check">
                  <input type="checkbox" checked={p.category_slugs.includes(c.slug)} onChange={() => toggleCat(c.slug)} />
                  {c.name}
                  {p.category_slugs.includes(c.slug) && (
                    <button type="button" className={`adm-main ${p.category_slug === c.slug ? 'on' : ''}`} onClick={(e) => { e.preventDefault(); set('category_slug', c.slug); }}>{p.category_slug === c.slug ? 'chính' : 'đặt chính'}</button>
                  )}
                </label>
              ))}
            </div>
          </section>

          <section className="card form">
            <h2 className="h3">SEO</h2>
            <label>Tiêu đề SEO <small className={titleLen > 65 ? 'adm-warn' : 'muted'}>{titleLen}/60</small>
              <input value={p.seo_title || ''} onChange={(e) => set('seo_title', e.target.value)} placeholder={p.name} /></label>
            <label>Mô tả SEO <small className={descLen > 165 || (descLen && descLen < 70) ? 'adm-warn' : 'muted'}>{descLen}/160</small>
              <textarea rows={4} value={p.seo_description || ''} onChange={(e) => set('seo_description', e.target.value)} /></label>
            <div className="adm-serp">
              <div className="t">{p.seo_title || p.name || 'Tiêu đề'}</div>
              <div className="u">cpstech.vn › {p.slug || slugify(p.name)}</div>
              <div className="d">{p.seo_description || 'Mô tả sẽ hiện ở đây trên Google.'}</div>
            </div>
          </section>

          {!isNew && <button type="button" className="adm-link adm-danger" onClick={remove}>Xóa sản phẩm vĩnh viễn</button>}
        </div>
      </div>
    </form>
  );
}
