export const SITE = {
  name: 'CPSTECH',
  tagline: 'Chuyên thiết bị an ninh',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cpstech.vn',
  description:
    'CPSTECH cung cấp và lắp đặt máy chấm công, hệ thống kiểm soát ra vào, khóa điện tử thông minh cho gia đình, văn phòng, khách sạn. An ninh – tiết kiệm – bảo hành 1 đổi 1.',
  hotline: '0931.783.111',
  hotlineTel: '0931783111',
  zalo: 'https://zalo.me/0944343868',
  email: 'congpv.cps@gmail.com',
  hours: 'Thứ 2 – Chủ nhật: 8:30–12:00, 14:00–17:30 · Hỗ trợ kỹ thuật 24/24',
  offices: [
    { city: 'Hà Nội', address: 'Số 5, ngõ 293/4 Tam Trinh, Hoàng Mai, Hà Nội', phone: '0931.783.111', tel: '0931783111' },
    { city: 'TP. Hồ Chí Minh', address: '821 An Dương Vương, Phường 13, Quận 6, TP.HCM', phone: '0944.343.868', tel: '0944343868' },
  ],
};

export const MAIN_MENU = [
  { href: '/may-cham-cong', label: 'Máy chấm công' },
  { href: '/he-thong-thiet-bi-kiem-soat-ra-vao', label: 'Kiểm soát ra vào' },
  { href: '/khoa-dien-tu-thong-minh', label: 'Khóa điện tử' },
  { href: '/phan-mem', label: 'Phần mềm' },
  { href: '/cua-hang', label: 'Cửa hàng' },
  { href: '/gioi-thieu-cpstech', label: 'Giới thiệu' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/lien-he', label: 'Liên hệ' },
];

export const formatVND = (n) =>
  n == null ? null : new Intl.NumberFormat('vi-VN').format(n) + '₫';
