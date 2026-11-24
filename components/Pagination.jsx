import Link from 'next/link';

export default function Pagination({ base, page, hasNext }) {
  if (page <= 1 && !hasNext) return null;
  const href = (p) => (p <= 1 ? base : `${base}?trang=${p}`);
  return (
    <nav className="pagination">
      {page > 1 ? <Link href={href(page - 1)} className="chip">← Trang trước</Link> : <span />}
      <span className="muted">Trang {page}</span>
      {hasNext ? <Link href={href(page + 1)} className="chip">Trang sau →</Link> : <span />}
    </nav>
  );
}
