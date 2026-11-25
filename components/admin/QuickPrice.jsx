'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { rest, revalidateSite } from '@/lib/adminApi';

const num = (v) => { const n = String(v ?? '').replace(/[^\d]/g, ''); return n ? Number(n) : null; };
const show = (n) => (n == null ? '' : new Intl.NumberFormat('vi-VN').format(n));

// Bảng sửa giá nhanh: gõ giá, rời ô (hoặc Enter) là lưu dòng đó. Enter nhảy xuống ô giá dòng dưới.
export default function QuickPrice({ cats }) {
  const [cat, setCat] = useState('khoa-tu-ca-nhan-locker-thong-minh');
  const [onlyEmpty, setOnlyEmpty] = useState(true);
  const [q, setQ] = useState('');
  const [rows, setRows] = useState(null);
  const [state, setState] = useState({}); // slug -> 'saving' | 'ok' | error text
  const dirty = useRef(false);

  const load = useCallback(async () => {
    let p = 'cps_products?select=slug,name,price,sale_price,image_url&order=name.asc&limit=500';
    if (cat) p += `&category_slugs=cs.${encodeURIComponent(`{${cat}}`)}`;
    if (onlyEmpty) p += '&price=is.null';
    if (q.trim()) p += `&name=ilike.${encodeURIComponent(`*${q.trim()}*`)}`;
    setRows(await rest(p));
  }, [cat, onlyEmpty, q]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);
  // Làm mới web 1 lần khi rời bảng (không phải mỗi ô).
  useEffect(() => () => { if (dirty.current) revalidateSite(); }, []);

  async function save(slug, field, raw) {
    const row = rows.find((r) => r.slug === slug);
    const val = num(raw);
    if (row[field] === val) return;
    const next = { ...row, [field]: val };
    if (next.sale_price && next.price && next.sale_price >= next.price) {
      setState((s) => ({ ...s, [slug]: 'Giá KM phải nhỏ hơn giá gốc' }));
      return;
    }
    setState((s) => ({ ...s, [slug]: 'saving' }));
    try {
      await rest(`cps_products?slug=eq.${encodeURIComponent(slug)}`, { method: 'PATCH', body: { [field]: val }, prefer: 'return=minimal' });
      setRows((rs) => rs.map((r) => (r.slug === slug ? next : r)));
      setState((s) => ({ ...s, [slug]: 'ok' }));
      dirty.current = true;
    } catch (e) { setState((s) => ({ ...s, [slug]: e.message })); }
  }

  function onKey(e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const all = [...document.querySelectorAll('.qp-input[data-col="' + e.currentTarget.dataset.col + '"]')];
    const i = all.indexOf(e.currentTarget);
    e.currentTarget.blur();
    all[i + 1]?.focus();
  }

  return (
    <div>
      <div className="adm-bar">
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Danh mục">
          <option value="">Tất cả danh mục</option>
          {cats.map((c) => <option key={c.slug} value={c.slug}>{c.parent_slug ? '— ' : ''}{c.name}</option>)}
        </select>
        <input type="search" placeholder="Lọc theo tên…" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="adm-check"><input type="checkbox" checked={onlyEmpty} onChange={(e) => setOnlyEmpty(e.target.checked)} /> Chỉ sản phẩm chưa có giá</label>
        <button className="btn btn-sm" onClick={() => { revalidateSite(); dirty.current = false; alert('Đã cập nhật giá lên web.'); }}>Cập nhật lên web</button>
      </div>
      <p className="muted">Gõ giá (chỉ số, vd 1250000), nhấn Enter để lưu và xuống dòng. Để trống = “Liên hệ báo giá”.{rows ? ` ${rows.length} sản phẩm.` : ''}</p>
      {!rows ? <p className="muted">Đang tải…</p> : (
        <div className="qp-table">
          <div className="qp-row qp-head"><span /><span>Sản phẩm</span><span>Giá gốc (đ)</span><span>Giá KM (đ)</span><span /></div>
          {rows.map((r) => (
            <div key={r.slug} className="qp-row">
              <span className="adm-thumb">{r.image_url ? <img src={r.image_url} alt="" loading="lazy" /> : null}</span>
              <a href={`/${r.slug}/`} target="_blank" rel="noopener" className="qp-name">{r.name}</a>
              <input className="qp-input" data-col="price" inputMode="numeric" defaultValue={show(r.price)} placeholder="Liên hệ"
                onBlur={(e) => { e.target.value = show(num(e.target.value)); save(r.slug, 'price', e.target.value); }} onKeyDown={onKey} />
              <input className="qp-input" data-col="sale" inputMode="numeric" defaultValue={show(r.sale_price)} placeholder="—"
                onBlur={(e) => { e.target.value = show(num(e.target.value)); save(r.slug, 'sale_price', e.target.value); }} onKeyDown={onKey} />
              <span className={`qp-st ${state[r.slug] === 'ok' ? 'ok' : state[r.slug] && state[r.slug] !== 'saving' ? 'err' : ''}`}>
                {state[r.slug] === 'ok' ? '✓' : state[r.slug] === 'saving' ? '…' : state[r.slug] || ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
