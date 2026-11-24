'use client';
import { useState } from 'react';

export default function ContactForm({ productSlug = null, compact = false }) {
  const [state, setState] = useState('idle'); // idle | sending | ok | error
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = {
      name: String(f.get('name') || '').trim(),
      phone: String(f.get('phone') || '').replace(/[^\d+]/g, ''),
      email: String(f.get('email') || '').trim() || null,
      message: String(f.get('message') || '').trim() || null,
      product_slug: productSlug,
    };
    if (!body.name || body.phone.length < 8) {
      setError('Vui lòng nhập họ tên và số điện thoại hợp lệ.');
      setState('error');
      return;
    }
    setState('sending');
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const res = await fetch(`${url}/rest/v1/cps_contact_requests`, {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      setState('ok');
      e.target.reset();
    } catch (err) {
      console.error(err);
      setError('Gửi không thành công, vui lòng gọi hotline 0931.783.111.');
      setState('error');
    }
  }

  if (state === 'ok')
    return <div className="alert ok">Cảm ơn bạn! CPSTECH sẽ liên hệ lại trong thời gian sớm nhất.</div>;

  return (
    <form className={`form ${compact ? 'form-compact' : ''}`} onSubmit={onSubmit}>
      <div className="form-row">
        <input name="name" placeholder="Họ và tên *" required maxLength={120} />
        <input name="phone" placeholder="Số điện thoại *" required inputMode="tel" maxLength={20} />
      </div>
      {!compact && <input name="email" type="email" placeholder="Email" maxLength={200} />}
      <textarea name="message" rows={compact ? 2 : 5} placeholder="Nội dung cần tư vấn" maxLength={3000} />
      {state === 'error' && <div className="alert err">{error}</div>}
      <button className="btn" disabled={state === 'sending'}>
        {state === 'sending' ? 'Đang gửi…' : 'Gửi yêu cầu tư vấn'}
      </button>
    </form>
  );
}
