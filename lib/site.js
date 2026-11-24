export const SITE = {
  name: 'CPSTECH',
  company: 'Công ty TNHH Đầu tư Công nghệ CPS',
  tagline: 'Chuyên thiết bị an ninh',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cpstech.vn',
  description:
    'CPSTECH cung cấp và lắp đặt máy chấm công, hệ thống kiểm soát ra vào, khóa điện tử thông minh cho gia đình, văn phòng, khách sạn. Chính hãng – đổi mới trong 1 tuần nếu lỗi nhà sản xuất.',
  hotline: '0944.343.868',
  hotlineTel: '0944343868',
  zalo: 'https://zalo.me/0944343868',
  zaloLabel: '0944.343.868',
  email: 'congpv.hmi@gmail.com',
  facebook: 'https://www.facebook.com/congnghecps',
  youtube: 'https://www.youtube.com/channel/UC8TArdLmRKi_goKSN3oxInA',
  payment: 'Nhận thanh toán: tiền mặt khi nhận hàng, chuyển khoản ngân hàng.',
  hours: 'Thứ 2 – Chủ nhật: 8:30–12:00, 14:00–17:30 · Hỗ trợ kỹ thuật 24/24',
  offices: [
    { city: 'Hà Nội', address: 'Tòa N01, 87 Lĩnh Nam, Vĩnh Tuy, Hà Nội', phone: '0944.343.868', tel: '0944343868', email: 'congpv.hmi@gmail.com' },
    { city: 'TP. Hồ Chí Minh', address: '821 An Dương Vương, Phường Phú Lâm, TP.HCM', phone: '0931.783.111', tel: '0931783111', email: 'kinhdoanh1.cps@gmail.com' },
  ],
};

export const MAIN_MENU = [
  { href: '/may-cham-cong', label: 'Máy chấm công' },
  { href: '/he-thong-thiet-bi-kiem-soat-ra-vao', label: 'Kiểm soát ra vào' },
  { href: '/khoa-dien-tu-thong-minh', label: 'Khóa điện tử' },
  { href: '/phan-mem', label: 'Phần mềm' },
  { href: '/cua-hang', label: 'Cửa hàng' },
  { href: '/dich-vu', label: 'Dịch vụ' },
  { href: '/gioi-thieu-cpstech', label: 'Giới thiệu' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/video', label: 'Video' },
  { href: '/lien-he', label: 'Liên hệ' },
];

export const formatVND = (n) =>
  n == null ? null : new Intl.NumberFormat('vi-VN').format(n) + '₫';
