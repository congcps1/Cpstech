'use client';
import { useEffect, useState, useCallback } from 'react';
import { rest } from '@/lib/adminApi';
import { formatVND } from '@/lib/site';
import ProductEditor from './ProductEditor';
import QuickPrice from './QuickPrice';

const PAGE = 30;

export default function Products() {
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [pub, setPub] = useState('');
  const [page, setPage] = useState(0);
  const [res, setRes] = useState(null);
  const [editing, setEditing] = useState(null); // slug | 'new' | null
  const [err, setErr] = useState('');
  const [quick, setQuick] = useState(false);

  useEffect(() => { rest('cps_categories?select=slug,name,parent_slug&order=name').then(setCats).catch((e) => setErr(e.message)); }, []);

  const load = useCallback(async () => {
    try {
      setErr('');
      let p = `cps_products?select=slug,name,price,sale_price,image_url,is_published,category_slug&order=created_at.desc,id.desc&limit=${PAGE}&offset=${page * PAGE}`;
      if (q.trim()) p += `&name=ilike.${encodeURIComponent(`*${q.trim()}*`)}`;
      if (cat) p += `&category_slugs=cs.${encodeURIComponent(`{${cat}}`)}`;
      if (pub) p += `&is_published=eq.${pub}`;
      setRes(await rest(p, { count: true }));
    } catch (e) { setErr(e.message); }
  }, [q, cat, pub, page]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  if (quick)
    return (
      <div>
        <div className="adm-bar"><button className="adm-link" onClick={() => { setQuick(false); load(); }}>← Danh sách sản phẩm</button><strong>Sửa giá nhanh</strong></div>
        <QuickPrice cats={cats} />
      </div>
    );

  if (editing)
    return <ProductEditor slug={editing === 'new' ? null : editing} cats={cats} onClose={(changed) => { setEditing(null); if (changed) load(); }} />;

  const catName = Object.fromEntries(cats.map((c) => [c.slug, c.name]));
  const pages = res ? Math.ceil(res.total / PAGE) : 0;
  return (
    <div>
      <div className="adm-bar">
        <input type="search" placeholder="Tìm theo tên sản phẩm…" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} />
        <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(0); }} aria-label="Danh mục">
          <option value="">Tất cả danh mục</option>
          {cats.map((c) => <option key={c.slug} value={c.slug}>{c.parent_slug ? '— ' : ''}{c.name}</option>)}
        </select>
        <select value={pub} onChange={(e) => { setPub(e.target.value); setPage(0); }} aria-label="Hiển thị">
          <option value="">Đang hiện + đang ẩn</option>
          <option value="true">Đang hiện</option>
          <option value="false">Đang ẩn</option>
        </select>
        <button className="btn btn-sm btn-ghost-dark" onClick={() => setQuick(true)}>Sửa giá nhanh</button>
        <button className="btn btn-sm" onClick={() => setEditing('new')}>+ Thêm sản phẩm</button>
      </div>
      {err && <div className="alert err">{err}</div>}
      {!res ? <p className="muted">Đang tải…</p> : (
        <>
          <p className="muted">{res.total} sản phẩm</p>
          <div className="adm-plist">
            {res.data.map((p) => (
              <button key={p.slug} className={`card adm-prow ${p.is_published ? '' : 'off'}`} onClick={() => setEditing(p.slug)}>
                <span className="adm-thumb">{p.image_url ? <img src={p.image_url} alt="" loading="lazy" /> : null}</span>
                <span className="adm-pinfo">
                  <strong>{p.name}</strong>
                  <small className="muted">{catName[p.category_slug] || p.category_slug || '—'}{p.is_published ? '' : ' · Đang ẩn'}</small>
                </span>
                <span className="adm-price">{p.sale_price || p.price ? formatVND(p.sale_price || p.price) : 'Liên hệ'}</span>
              </button>
            ))}
          </div>
          {pages > 1 && (
            <div className="pagination">
              <button className="chip" disabled={page === 0} onClick={() => setPage(page - 1)}>← Trước</button>
              <span className="muted">Trang {page + 1}/{pages}</span>
              <button className="chip" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Sau →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
