import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container page narrow" style={{ textAlign: 'center' }}>
      <h1>Không tìm thấy trang</h1>
      <p className="muted">Trang bạn tìm có thể đã được chuyển hoặc không còn tồn tại.</p>
      <Link href="/" className="btn">Về trang chủ</Link>
    </div>
  );
}
