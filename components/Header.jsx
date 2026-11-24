import Link from 'next/link';
import { SITE, MAIN_MENU } from '@/lib/site';

export default function Header() {
  return (
    <header className="header">
      <div className="topbar">
        <div className="container topbar-inner">
          <span>{SITE.hours}</span>
          <span>
            Hotline: <a href={`tel:${SITE.hotlineTel}`}>{SITE.hotline}</a> · <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </span>
        </div>
      </div>
      <div className="container nav-row">
        <Link href="/" className="logo" aria-label="CPSTECH – Trang chủ">
          <span className="logo-mark">CPS</span>
          <span className="logo-text">
            <strong>CPSTECH</strong>
            <small>{SITE.tagline}</small>
          </span>
        </Link>
        <input type="checkbox" id="nav-toggle" className="nav-toggle" />
        <label htmlFor="nav-toggle" className="nav-burger" aria-label="Mở menu">☰</label>
        <nav className="nav">
          {MAIN_MENU.map((m) => (
            <Link key={m.href} href={m.href}>{m.label}</Link>
          ))}
          <a className="btn btn-sm" href={`tel:${SITE.hotlineTel}`}>Gọi ngay</a>
        </nav>
      </div>
    </header>
  );
}
