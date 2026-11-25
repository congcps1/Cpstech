'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SITE, MAIN_MENU } from '@/lib/site';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState(null); // submenu đang mở (mobile / bàn phím)
  const pathname = usePathname();
  useEffect(() => { setOpen(false); setSub(null); }, [pathname]);
  const isActive = (m) =>
    pathname === m.href || (m.children || []).some((c) => pathname === c.href || (c.children || []).some((g) => pathname === g.href));

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
        <button
          type="button"
          className="nav-burger"
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
        <nav className={`nav ${open ? 'open' : ''}`}>
          {MAIN_MENU.map((m) =>
            m.children ? (
              <div key={m.href} className={`nav-item has-sub ${sub === m.href ? 'sub-open' : ''}`}>
                <Link href={m.href} className={isActive(m) ? 'active' : ''}>{m.label}</Link>
                <button
                  type="button"
                  className="sub-toggle"
                  aria-label={`Danh mục ${m.label}`}
                  aria-expanded={sub === m.href}
                  onClick={() => setSub((v) => (v === m.href ? null : m.href))}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                </button>
                <div className={`submenu ${m.children.some((c) => c.children) ? 'submenu-wide' : ''}`}>
                  {m.children.map((c) => (
                    <div key={c.href} className="submenu-group">
                      <Link href={c.href} className={`submenu-link ${c.children ? 'submenu-head' : ''} ${pathname === c.href ? 'active' : ''}`}>{c.label}</Link>
                      {c.children?.map((g) => (
                        <Link key={g.href} href={g.href} className={`submenu-link submenu-child ${pathname === g.href ? 'active' : ''}`}>{g.label}</Link>
                      ))}
                    </div>
                  ))}
                  <Link href={m.href} className="submenu-all">Xem tất cả {m.label.toLowerCase()} →</Link>
                </div>
              </div>
            ) : (
              <Link key={m.href} href={m.href} onClick={() => setOpen(false)} className={pathname === m.href ? 'active' : ''}>
                {m.label}
              </Link>
            )
          )}
          <a className="btn btn-sm" href={`tel:${SITE.hotlineTel}`}>Gọi ngay</a>
        </nav>
      </div>
    </header>
  );
}
