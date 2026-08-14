# API Contract — Zenova

> Tài liệu hợp đồng API giữa FE và BE. **FE chỉ gọi các endpoint dưới đây.**
> Cập nhật file này mỗi khi có thay đổi về request/response.
>
> Cập nhật lần cuối: 2026-08-10

## Quy ước chung

- Base URL: `VITE_API_BASE_URL` (nếu không set → cùng origin với FE).
- Content-Type: `application/json`.
- Auth: FE gắn `Authorization: Bearer <Firebase ID token>` khi user đã đăng nhập
  (xem `src/frontend/api/client.ts`). BE nên verify token bằng Firebase Admin SDK.
- Lỗi luôn trả về dạng:

```json
{ "message": "Thông báo lỗi cho người dùng", "details": {} }
```

| Status | Ý nghĩa |
| --- | --- |
| 200 / 201 | Thành công |
| 400 | Tham số / body sai |
| 404 | Không tìm thấy |
| 422 | Validate thất bại (`details` = zod flatten) |

Kiểu dữ liệu chuẩn: `src/shared/types.ts`. Validate: `src/shared/schemas.ts`.

---

## 1. `GET /api/products`

Danh sách sản phẩm kèm dữ liệu dựng filter.

### Query params

| Tên | Kiểu | Ghi chú |
| --- | --- | --- |
| `q` | string (≤120) | Tìm kiếm theo tên/brand/mô tả, không phân biệt dấu |
| `category` | string (≤80) | Slug danh mục chính |
| `sort` | `pho-bien` \| `moi-nhat` \| `gia-tang` \| `gia-giam` \| `danh-gia` | Mặc định `pho-bien` |
| `minPrice` | int ≥ 0 | VND |
| `maxPrice` | int ≥ 0 | VND |
| `limit` | int 1..100 | Số item mỗi trang |
| `offset` | int 0..10000 | Vị trí bắt đầu (infinite scroll) |

### Response `200`

```json
{
  "items": [ /* Product[] */ ],
  "total": 120,
  "offset": 0,
  "hasMore": true,
  "categories": [
    { "slug": "dien-tu", "name": "Điện tử", "icon": "Laptop",
      "sub": [{ "slug": "laptop", "name": "Laptop" }] }
  ],
  "priceBounds": { "min": 49000, "max": 42990000 },
  "categoryCounts": { "dien-tu": 24, "thoi-trang": 18 }
}
```

- `categoryCounts`: số sản phẩm mỗi danh mục **bỏ qua filter danh mục hiện tại**
  (nhưng vẫn áp dụng `q`, `minPrice`, `maxPrice`).
- `priceBounds`: khoảng giá của toàn bộ catalog → FE dựng slider min/max.
- `hasMore = offset + items.length < total`.

### `Product`

```ts
{
  id: string;
  name: string;          // tên dài, có thông số
  brand: string;
  category: string;      // slug danh mục chính
  subcategory: string;   // slug danh mục phụ
  price: number;         // giá đang bán (hiển thị chính)
  listPrice: number;     // giá gốc (gạch bỏ)
  image: string;         // URL ảnh
  rating: number;        // 0..5
  reviews: number;
  sold: number;
  stock: number;
  freeShip: boolean;
  description: string;
  highlights: string[];
}
```

> % khuyến mãi do FE tự tính: `round((listPrice - price) / listPrice * 100)`.

---

## 2. `GET /api/products/:id`

### Response `200`

```json
{
  "product": { /* Product */ },
  "related": [ /* Product[] — tối đa 4, cùng danh mục, khác id */ ],
  "mainCategory": { "slug": "dien-tu", "name": "Điện tử", "icon": "Laptop", "sub": [] },
  "subcategory": { "slug": "laptop", "name": "Laptop" }
}
```

`404` khi không tìm thấy sản phẩm. `mainCategory` / `subcategory` có thể `null`.

---

## 3. `POST /api/orders`

### Body

```json
{
  "fullName": "Nguyễn Văn A",
  "phone": "0901234567",
  "email": "a@example.com",
  "address": "123 Lê Lợi, Q1, TP.HCM",
  "note": "",
  "shippingMethod": "standard",
  "paymentMethod": "cod",
  "userId": "firebase-uid",
  "items": [{ "id": "p-001", "qty": 2 }]
}
```

Ràng buộc: `fullName` 2..80; `phone` regex `^[0-9+\s-]{8,15}$`; `email` optional;
`address` 5..300; `note` ≤500; `shippingMethod` ∈ `standard|express`;
`paymentMethod` ∈ `cod|bank|momo|card`; `items` 1..50 item, `qty` 1..99.

### Response `201`

```json
{
  "id": "ZN12345678",
  "createdAt": "2026-08-10T07:00:00.000Z",
  "customer": { "fullName": "...", "phone": "...", "shippingMethod": "standard", "paymentMethod": "cod" },
  "items": [{ "id": "p-001", "name": "...", "image": "...", "qty": 2, "price": 199000 }],
  "subtotal": 398000,
  "shippingFee": 25000,
  "total": 423000
}
```

**BE bắt buộc tính lại giá**, không tin `price` từ client.
Phí ship (xem `src/shared/constants.ts`): `express` = 55.000đ; `standard` = 0đ nếu
`subtotal ≥ 500.000đ`, ngược lại 25.000đ.

`422` khi validate lỗi, `400` khi item không tồn tại.

---

## 4. `GET /api/orders?id=<orderId>`

Trả về `Order` như trên. `400` nếu thiếu `id`, `404` nếu không tìm thấy.

---

## Endpoint dự kiến (chưa implement)

| Method | Path | Mục đích |
| --- | --- | --- |
| `GET` | `/api/orders/me` | Lịch sử đơn của user đang đăng nhập (cần auth) |
| `GET` | `/api/categories` | Tách danh mục ra khỏi `/api/products` |
| `POST` | `/api/reviews` | Gửi đánh giá sản phẩm |
