# CPSTECH – Website mới

Làm lại website [cpstech.vn](https://cpstech.vn) bằng **Next.js (App Router)** + **Supabase**, deploy trên **Vercel**.

## Kiến trúc

- `app/` – các trang: Trang chủ, Cửa hàng, Giới thiệu, Tin tức, Liên hệ.
- `app/[slug]` – một route chung cho danh mục, sản phẩm và bài viết, **giữ nguyên URL cũ** của cpstech.vn (vd. `/may-cham-cong`, `/adel-4910-khoa-dien-tu-ma-van-tay`) để không mất SEO.
- `lib/db.js` – gọi Supabase REST trực tiếp (không cần thư viện thêm), cache ISR 5 phút.
- Form liên hệ ghi vào bảng `cps_contact_requests` (RLS: chỉ cho phép insert).

## Supabase (dự án `idmart`, bảng tiền tố `cps_`)

| Bảng | Nội dung |
|---|---|
| `cps_categories` | Danh mục (cây cha–con qua `parent_slug`) |
| `cps_products` | 193 sản phẩm (giá, khuyến mãi, gallery, mô tả, `category_slugs` = mọi danh mục) |
| `cps_posts` | Tin tức / hướng dẫn (155 bài từ WordPress) |
| `cps_pages` | Trang nội dung: Giới thiệu, Dịch vụ, Liên hệ |
| `cps_contact_requests` | Yêu cầu tư vấn từ khách |

Xem yêu cầu tư vấn: Supabase Dashboard → Table Editor → `cps_contact_requests`.

## Biến môi trường

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://cpstech.vn
```

## Chạy local

```bash
npm install
cp .env.example .env.local   # điền key
npm run dev
```

## Dữ liệu từ site cũ

- Nhập ngày 24/11/2026 qua WordPress REST API công khai (`/wp-json/wc/store/v1/products`, `/wp-json/wp/v2/posts`, `/wp-json/wp/v2/pages`). Dữ liệu gốc lưu trong `cps_import_data`.
- Ảnh được chép sang Supabase Storage, bucket công khai `cpstech` (cùng cấu trúc thư mục `YYYY/MM/` như `wp-content/uploads`, tên file bỏ dấu). Hàng chờ: bảng `cps_media`; hàm sao chép: Edge Function `cps-media-copy`.
- 30 ảnh không chép được vì đã mất trên chính site cũ (xem `cps_media` có `status='error'`).
