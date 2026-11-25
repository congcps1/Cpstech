import Link from 'next/link';
import { href } from '@/lib/site';

export default function PostCard({ p, excerpt = false }) {
  return (
    <Link href={href(p.slug)} className="card post-card">
      <div className="post-cover">
        {p.cover_url ? <img src={p.cover_url} alt={p.title} loading="lazy" /> : <span>CPSTECH</span>}
      </div>
      <div className="post-body">
        <h3>{p.title}</h3>
        {excerpt && p.excerpt && <p className="muted">{p.excerpt.slice(0, 140)}…</p>}
      </div>
    </Link>
  );
}
