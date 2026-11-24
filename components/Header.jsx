'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SITE, MAIN_MENU } from '@/lib/site';

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

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
          {MAIN_MENU.map((m) => (
            <Link key={m.href} href={m.href} onClick={() => setOpen(false)} className={pathname === m.href ? 'active' : ''}>
              {m.label}
            </Link>
          ))}
          <a className="btn btn-sm" href={`tel:${SITE.hotlineTel}`}>Gọi ngay</a>
        </nav>
      </div>
    </header>
  );
}
