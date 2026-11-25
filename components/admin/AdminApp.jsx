'use client';
import { useEffect, useState } from 'react';
import { login, logout, isAdmin, currentEmail, changePassword } from '@/lib/adminApi';
import Requests from './Requests';
import Products from './Products';

export default function AdminApp() {
  const [state, setState] = useState('loading'); // loading | login | denied | ok
  const [tab, setTab] = useState('requests');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [newCount, setNewCount] = useState(null);

  useEffect(() => {
    isAdmin().then((ok) => setState(ok ? 'ok' : currentEmail() ? 'denied' : 'login'));
    try { const t = new URLSearchParams(location.search).get('tab'); if (t) setTab(t); } catch { /* ignore */ }
  }, []);

  async function onLogin(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setErr('');
    try {
      await login(String(f.get('email')).trim(), String(f.get('password')));
      setState((await isAdmin()) ? 'ok' : 'denied');
    } catch (ex) {
      setErr(ex.message === 'Invalid login credentials' ? 'Sai email hoặc mật khẩu.' : ex.message);
    }
    setBusy(false);
  }

  function out() { logout(); setState('login'); }

  async function onChangePw() {
    const p = prompt('Nhập mật khẩu mới (tối thiểu 8 ký tự):');
    if (!p) return;
    if (p.length < 8) return alert('Mật khẩu cần ít nhất 8 ký tự.');
    try { await changePassword(p); alert('Đã đổi mật khẩu.'); } catch (ex) { alert(ex.message); }
  }

  if (state === 'loading') return <div className="container adm-page"><p className="muted">Đang tải…</p></div>;

  if (state === 'login' || state === 'denied')
    return (
      <div className="container adm-page">
        <form className="card adm-login form" onSubmit={onLogin}>
          <h1 className="h3">Đăng nhập quản trị</h1>
          {state === 'denied' && <div className="alert err">Tài khoản {currentEmail()} không có quyền quản trị CPSTECH.</div>}
          <input name="email" type="email" placeholder="Email" required autoComplete="username" defaultValue="" />
          <input name="password" type="password" placeholder="Mật khẩu" required autoComplete="current-password" />
          {err && <div className="alert err">{err}</div>}
          <button className="btn" disabled={busy}>{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
        </form>
      </div>
    );

  return (
    <div className="container adm-page">
      <div className="adm-top">
        <div className="adm-tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'requests'} className={tab === 'requests' ? 'on' : ''} onClick={() => setTab('requests')}>
            Yêu cầu báo giá{newCount ? <span className="adm-badge">{newCount}</span> : null}
          </button>
          <button role="tab" aria-selected={tab === 'products'} className={tab === 'products' ? 'on' : ''} onClick={() => setTab('products')}>Sản phẩm</button>
        </div>
        <div className="adm-user">
          <span className="muted">{currentEmail()}</span>
          <button className="adm-link" onClick={onChangePw}>Đổi mật khẩu</button>
          <button className="adm-link" onClick={out}>Đăng xuất</button>
        </div>
      </div>
      {tab === 'requests' ? <Requests onCount={setNewCount} /> : <Products />}
    </div>
  );
}
