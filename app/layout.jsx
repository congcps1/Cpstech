import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE } from '@/lib/site';

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'CPSTECH – Máy chấm công, Kiểm soát ra vào, Khóa điện tử thông minh',
    template: '%s | CPSTECH',
  },
  description: SITE.description,
  openGraph: { siteName: 'CPSTECH', locale: 'vi_VN', type: 'website' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
