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

// Danh mục con chỉ gồm những danh mục đang có sản phẩm (danh mục rỗng bị noindex).
const c = (slug, label, children) => ({ href: `/${slug}/`, label, ...(children ? { children } : {}) });
export const MAIN_MENU = [
  { href: '/may-cham-cong/', label: 'Máy chấm công', children: [
    c('may-cham-cong-bang-van-tay', 'Máy chấm công vân tay'),
    c('may-cham-cong-bang-khuon-mat', 'Máy chấm công khuôn mặt'),
    c('may-cham-cong-bang-the', 'Máy chấm công thẻ từ'),
    c('may-cham-cong-kiem-soat-ra-vao-cua', 'Máy chấm công kiểm soát cửa'),
    c('may-cham-cong-ronald-jack', 'Máy chấm công Ronald Jack'),
    c('may-cham-cong-wise-eye', 'Máy chấm công Wise Eye'),
    c('may-cham-cong-zkteco', 'Máy chấm công ZKTeco'),
    c('may-cham-cong-suprema', 'Máy chấm công Suprema'),
    c('may-cham-cong-virdi', 'Máy chấm công Virdi'),
    c('may-cham-cong-soyal', 'Máy chấm công Soyal'),
    c('phu-kien-may-cham-cong', 'Phụ kiện máy chấm công'),
  ] },
  { href: '/he-thong-thiet-bi-kiem-soat-ra-vao/', label: 'Kiểm soát ra vào', children: [
    c('kiem-soat-cua-ra-vao', 'Kiểm soát cửa ra vào', [
      c('kiem-soat-cua-ra-vao-bang-the', 'Kiểm soát cửa bằng thẻ'),
      c('kiem-soat-cua-bang-van-tay', 'Kiểm soát cửa bằng vân tay'),
      c('he-thong-kiem-soat-ra-vao-khuon-mat', 'Kiểm soát cửa bằng khuôn mặt'),
      c('phu-kien-kiem-soat-ra-vao', 'Khóa thả chốt, khóa nam châm & phụ kiện'),
    ]),
    c('kiem-soat-an-ninh-cong', 'Kiểm soát an ninh cổng', [
      c('tripod-barrier', 'Tripod barrier'),
      c('phu-kien-an-ninh-cong', 'Phụ kiện an ninh cổng'),
    ]),
    c('kiem-soat-thang-may', 'Kiểm soát thang máy'),
    c('bo-dieu-khien-chung-tam', 'Bộ điều khiển trung tâm'),
  ] },
  { href: '/khoa-dien-tu-thong-minh/', label: 'Khóa điện tử', children: [
    c('khoa-cua-bang-van-tay', 'Khóa cửa vân tay'),
    c('khoa-cua-go', 'Khóa điện tử cửa gỗ'),
    c('khoa-cua-sat', 'Khóa cửa cổng sắt – cửa thép'),
    c('khoa-cua-kinh', 'Khóa cửa kính'),
    c('khoa-khuon-mat', 'Khóa điện tử khuôn mặt'),
    c('khoa-khach-san', 'Khóa khách sạn'),
    c('khoa-tu-ca-nhan-locker-thong-minh', 'Khóa tủ locker thông minh'),
    c('khoa-tu-locker-the-tu', 'Khóa tủ locker thẻ từ'),
    c('bo-san-pham-kiem-soat-cua', 'Bộ sản phẩm kiểm soát cửa'),
  ] },
  { href: '/phan-mem/', label: 'Phần mềm', children: [
    c('phan-mem-cham-cong', 'Phần mềm chấm công'),
    c('phan-mem-kiem-soat', 'Phần mềm kiểm soát'),
  ] },
  { href: '/cua-hang/', label: 'Cửa hàng' },
  { href: '/dich-vu/', label: 'Dịch vụ' },
  { href: '/gioi-thieu-cpstech/', label: 'Giới thiệu' },
  { href: '/tin-tuc/', label: 'Tin tức' },
  { href: '/video/', label: 'Video' },
  { href: '/lien-he/', label: 'Liên hệ' },
];

export const formatVND = (n) =>
  n == null ? null : new Intl.NumberFormat('vi-VN').format(n) + '₫';

// Every internal URL ends with "/" (same as the old WordPress site).
export const href = (slug) => (slug ? `/${String(slug).replace(/^\/+|\/+$/g, '')}/` : '/');
export const absUrl = (path = '/') => SITE.url.replace(/\/$/, '') + path;

// Titles/descriptions Google already shows for cpstech.vn (from Rank Math), kept verbatim.
export const STATIC_SEO = {
  home: {
    title: 'Khóa cửa thông minh, hệ thống kiểm soát tối ưu, tự động, tích kiệm',
    description: 'Khóa cửa thông minh tích hợp hệ thống kiểm soát ra vào tự động, hiện đại – an ninh, tiết kiệm chi phí cho gia đình, văn phòng, khách sạn',
  },
  shop: { title: 'Sản phẩm', description: 'Sản phẩm Archive - CPSTECH - CHUYÊN THIẾT BỊ AN NINH' },
  news: { title: 'Tin tức – CPSTECH – CHUYÊN THIẾT BỊ AN NINH', description: 'Tin tức, hướng dẫn sử dụng máy chấm công, khóa vân tay, hệ thống kiểm soát ra vào từ CPSTECH.' },
  contact: {
    title: 'Liên Hệ CPSTECH - Tư Vấn & Báo Giá Giải Pháp Kiểm Soát Ra Vào',
    description: 'Liên hệ CPSTECH ngay để được tư vấn, khảo sát và báo giá giải pháp kiểm soát ra vào chuyên nghiệp. Hỗ trợ nhanh qua hotline 0944.343.868.',
  },
};
