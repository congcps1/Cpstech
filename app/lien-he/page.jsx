import ContactForm from '@/components/ContactForm';
import { SITE, STATIC_SEO } from '@/lib/site';

export const metadata = {
  title: { absolute: STATIC_SEO.contact.title },
  description: STATIC_SEO.contact.description,
  alternates: { canonical: '/lien-he/' },
};

export default function Contact() {
  return (
    <div className="container page">
      <h1>Liên hệ CPSTECH</h1>
      <p className="lead">{SITE.company}</p>
      <div className="contact-grid">
        <div>
          {SITE.offices.map((o) => (
            <div key={o.city} className="card" style={{ marginBottom: 16 }}>
              <h2 className="h3">Văn phòng {o.city}</h2>
              <p>📍 {o.address}</p>
              <p>📞 <a href={`tel:${o.tel}`}>{o.phone}</a></p>
              <p>✉️ <a href={`mailto:${o.email}`}>{o.email}</a></p>
            </div>
          ))}
          <div className="card">
            <p>Hotline/Zalo: <a href={SITE.zalo} target="_blank" rel="noopener">{SITE.zaloLabel}</a></p>
            <p>Facebook: <a href={SITE.facebook} target="_blank" rel="noopener">facebook.com/congnghecps</a></p>
            <p>YouTube: <a href={SITE.youtube} target="_blank" rel="noopener">Kênh CPSTECH</a></p>
            <p className="muted">{SITE.payment}</p>
            <p className="muted">{SITE.hours}</p>
          </div>
        </div>
        <div className="card">
          <h2 className="h3">Gửi yêu cầu tư vấn</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
