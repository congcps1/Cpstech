import { revalidatePath } from 'next/cache';

// Chỉ admin (kiểm tra bằng RPC cps_is_admin với token của người gọi) mới được làm mới cache.
export async function POST(req) {
  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return Response.json({ ok: false }, { status: 401 });
  const r = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/cps_is_admin`, {
    method: 'POST',
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, Authorization: auth, 'Content-Type': 'application/json' },
    body: '{}',
    cache: 'no-store',
  });
  if (!r.ok || (await r.json()) !== true) return Response.json({ ok: false }, { status: 403 });
  revalidatePath('/', 'layout');
  return Response.json({ ok: true });
}
