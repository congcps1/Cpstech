'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function SearchBox({ defaultValue = '', autoFocus = false, onDone }) {
  const router = useRouter();
  const ref = useRef(null);
  useEffect(() => { if (autoFocus) ref.current?.focus(); }, [autoFocus]);
  return (
    <form
      role="search"
      className="search-box"
      action="/tim-kiem/"
      onSubmit={(e) => {
        e.preventDefault();
        const q = ref.current.value.trim();
        if (!q) return ref.current.focus();
        router.push(`/tim-kiem/?q=${encodeURIComponent(q)}`);
        onDone?.();
      }}
    >
      <input ref={ref} type="search" name="q" defaultValue={defaultValue} placeholder="Tìm sản phẩm: khóa vân tay, máy chấm công…" aria-label="Tìm sản phẩm" maxLength={100} enterKeyHint="search" />
      <button type="submit" aria-label="Tìm kiếm">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
      </button>
    </form>
  );
}
