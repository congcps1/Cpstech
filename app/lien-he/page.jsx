import ContactForm from '@/components/ContactForm';
import { SITE } from '@/lib/site';

export const metadata = { title: 'Liên hệ', description: 'Liên hệ CPSTECH – hotline 0931.783.111, văn phòng Hà Nội và TP.HCM.' };

export default function Contact() {
  return (
    <div className="container page">
      <h1>Liên hệ CPSTECH</h1>
      <div className="contact-grid">
        <div>
          {SITE.offices.map((o) => (
            <div key={o.city} className="card" style={{ marginBottom: 16 }}>
              <h3>Văn phòng {o.city}</h3>
              <p>{o.address}</p>
              <p>Điện thoại: <a href={`tel:${o.tel}`}>{o.phone}</a></p>
            </div>
          ))}
          <div className="card">
            <p>Hotline: <a href={`tel:${SITE.hotlineTel}`}>{SITE.hotline}</a></p>
            <p>Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
            <p>Zalo: <a href={SITE.zalo} target="_blank" rel="noopener">0944.343.868</a></p>
            <p className="muted">{SITE.hours}</p>
          </div>
        </div>
        <div className="card">
          <h3>Gửi yêu cầu tư vấn</h3>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
