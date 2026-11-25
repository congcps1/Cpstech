import Link from 'next/link';
import Image from 'next/image';
import { href } from '@/lib/site';

export default function PostCard({ p, excerpt = false }) {
  return (
    <Link href={href(p.slug)} className="card post-card">
      <div className="post-cover">
        {p.cover_url ? <Image src={p.cover_url} alt={p.title} fill sizes="(max-width: 560px) 120px, (max-width: 1100px) 46vw, 380px" /> : <span>CPSTECH</span>}
      </div>
      <div className="post-body">
        <h3>{p.title}</h3>
        {excerpt && p.excerpt && <p className="muted">{p.excerpt.slice(0, 140)}…</p>}
      </div>
    </Link>
  );
}
