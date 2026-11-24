import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata = { title: 'Giới thiệu CPSTECH', description: 'CPSTECH – hơn 12 năm cung cấp thiết bị an ninh, máy chấm công, kiểm soát ra vào và khóa điện tử thông minh.' };

export default function About() {
  return (
    <div className="container page narrow">
      <h1>Giới thiệu CPSTECH</h1>
      <p className="lead">
        CPSTECH là đơn vị chuyên cung cấp và lắp đặt thiết bị an ninh: máy chấm công, hệ thống kiểm soát ra vào,
        kiểm soát thang máy, an ninh cổng và khóa điện tử thông minh cho gia đình, văn phòng, nhà xưởng và khách sạn.
      </p>
      <div className="stats-grid stats-inline">
        <div><strong>12+</strong><span>Năm kinh nghiệm</span></div>
        <div><strong>80+</strong><span>Nhân sự</span></div>
        <div><strong>100K+</strong><span>Khách hàng</span></div>
        <div><strong>55+</strong><span>Nhà cung cấp</span></div>
      </div>
      <h2>Thương hiệu phân phối</h2>
      <p>ZKTeco, Ronald Jack, Wise Eye, Soyal, Suprema, Virdi, Chiyu, IDteck, ADEL…</p>
      <h2>Cam kết của chúng tôi</h2>
      <ul className="checks">
        <li>Sản phẩm chính hãng, giá cạnh tranh</li>
        <li>Bảo hành 1 đổi 1 trong 10 ngày đầu sử dụng</li>
        <li>Giao hàng trong 2 giờ nội thành, nhận hàng rồi thanh toán</li>
        <li>Hỗ trợ kỹ thuật 24/24</li>
      </ul>
      <h2>Văn phòng</h2>
      {SITE.offices.map((o) => (
        <p key={o.city}><strong>{o.city}:</strong> {o.address} – ĐT {o.phone}</p>
      ))}
      <Link href="/lien-he" className="btn">Liên hệ tư vấn</Link>
    </div>
  );
}
