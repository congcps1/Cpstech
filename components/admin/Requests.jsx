'use client';
import { useEffect, useState, useCallback } from 'react';
import { rest } from '@/lib/adminApi';

export const STATUSES = [
  ['moi', 'Mới'],
  ['da-lien-he', 'Đã liên hệ'],
  ['da-bao-gia', 'Đã báo giá'],
  ['thanh-cong', 'Chốt đơn'],
  ['huy', 'Không mua / Hủy'],
];
const label = (s) => (STATUSES.find(([k]) => k === s) || [, s || 'Mới'])[1];
const fmt = (d) => new Date(d).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });

export default function Requests({ onCount }) {
  const [rows, setRows] = useState(null);
  const [filter, setFilter] = useState('');
  const [names, setNames] = useState({});
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      setErr('');
      const q = `cps_contact_requests?select=*&order=created_at.desc&limit=300${filter ? `&status=eq.${filter}` : ''}`;
      const data = await rest(q);
      setRows(data);
      const slugs = [...new Set(data.map((r) => r.product_slug).filter(Boolean))];
      if (slugs.length) {
        const ps = await rest(`cps_products?select=slug,name&slug=in.(${slugs.map((s) => `"${s}"`).join(',')})`);
        setNames(Object.fromEntries(ps.map((p) => [p.slug, p.name])));
      }
      const { total } = await rest('cps_contact_requests?select=id&status=eq.moi&limit=1', { count: true });
      onCount?.(total);
    } catch (e) { setErr(e.message); }
  }, [filter, onCount]);

  useEffect(() => { load(); const t = setInterval(load, 60000); return () => clearInterval(t); }, [load]);

  async function update(id, patch) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    try { await rest(`cps_contact_requests?id=eq.${id}`, { method: 'PATCH', body: patch }); if ('status' in patch) load(); } catch (e) { alert(e.message); load(); }
  }
  async function remove(id) {
    if (!confirm('Xóa yêu cầu này? Không khôi phục được.')) return;
    try { await rest(`cps_contact_requests?id=eq.${id}`, { method: 'DELETE' }); load(); } catch (e) { alert(e.message); }
  }

  return (
    <div>
      <div className="adm-bar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Lọc trạng thái">
          <option value="">Tất cả trạng thái</option>
          {STATUSES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <button className="btn btn-sm btn-ghost-dark" onClick={load}>Làm mới</button>
        <span className="muted">Tự cập nhật mỗi phút</span>
      </div>
      {err && <div className="alert err">{err}</div>}
      {rows === null ? <p className="muted">Đang tải…</p> : rows.length === 0 ? (
        <div className="card"><p className="muted" style={{ margin: 0 }}>Chưa có yêu cầu nào{filter ? ' ở trạng thái này' : ''}.</p></div>
      ) : (
        <div className="adm-reqs">
          {rows.map((r) => (
            <div key={r.id} className={`card adm-req st-${r.status || 'moi'}`}>
              <div className="adm-req-head">
                <strong>{r.name}</strong>
                <a href={`tel:${r.phone}`} className="adm-phone">{r.phone}</a>
                <a href={`https://zalo.me/${String(r.phone).replace(/^\+?84/, '0')}`} target="_blank" rel="noopener" className="adm-link">Zalo</a>
                <span className="muted adm-time">{fmt(r.created_at)}</span>
              </div>
              {r.email && <div><a href={`mailto:${r.email}`}>{r.email}</a></div>}
              {r.product_slug && (
                <div className="adm-req-prod">Sản phẩm: <a href={`/${r.product_slug}/`} target="_blank" rel="noopener">{names[r.product_slug] || r.product_slug}</a></div>
              )}
              {r.message && <p className="adm-req-msg">{r.message}</p>}
              <div className="adm-req-actions">
                <select value={r.status || 'moi'} onChange={(e) => update(r.id, { status: e.target.value })} aria-label="Trạng thái">
                  {STATUSES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
                <input
                  defaultValue={r.note || ''}
                  placeholder="Ghi chú nội bộ (Enter để lưu)"
                  onBlur={(e) => e.target.value !== (r.note || '') && update(r.id, { note: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                />
                <button className="adm-link adm-danger" onClick={() => remove(r.id)}>Xóa</button>
              </div>
              <span className="adm-st">{label(r.status)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
