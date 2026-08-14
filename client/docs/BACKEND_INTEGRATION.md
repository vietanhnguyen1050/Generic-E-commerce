# Kết nối backend thật (thay thế `src/backend`)

`src/backend/*` hiện chỉ là **mock in-memory** để FE chạy được độc lập.
Mục tiêu: xoá dần thư mục này, FE chỉ còn phụ thuộc `docs/API.md`.

## Nguyên tắc

1. FE **không bao giờ** import từ `@/backend/*`. Chỉ đi qua `src/frontend/api/*`.
2. Mọi kiểu dữ liệu dùng chung nằm ở `src/shared/` — đây là hợp đồng, giữ nguyên.
3. Khi BE thật lên, chỉ cần đổi env, không sửa code FE.

## Bước 1 — Trỏ FE sang BE thật

Thêm vào `.env`:

```
VITE_API_BASE_URL=https://api.example.com
```

`src/frontend/api/client.ts` sẽ tự dùng base URL này. Không set → gọi cùng origin.

## Bước 2 — BE thật cần implement đúng `docs/API.md`

Bốn endpoint tối thiểu:

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/orders`
- `GET /api/orders?id=`

Yêu cầu bắt buộc:

- CORS: cho phép origin của FE, header `Authorization`, `Content-Type`.
- Response lỗi theo format `{ message, details }`.
- Tính lại giá + phí ship ở server (công thức trong `docs/API.md`).

## Bước 3 — Xác thực

FE dùng Firebase Auth và gắn `Authorization: Bearer <ID token>`.
BE verify bằng Firebase Admin SDK:

```ts
const decoded = await admin.auth().verifyIdToken(token);
// decoded.uid → chủ sở hữu đơn hàng
```

## Bước 4 — Gỡ mock

Khi BE thật đã chạy, xoá theo thứ tự (kiểm tra `rg "@/backend"` trả về rỗng trước khi xoá):

1. `src/routes/api/*` — route mock của TanStack Start.
2. `src/backend/services/*`, `src/backend/repositories/*`.
3. `src/backend/data/*`, `src/backend/http/*`.

Giữ lại: `src/shared/*` (types, schemas, constants, format) và `src/frontend/*`.

## Checklist bàn giao

- [ ] `VITE_API_BASE_URL` đã cấu hình cho từng môi trường
- [ ] 4 endpoint trả đúng schema trong `docs/API.md`
- [ ] Verify Firebase ID token ở BE
- [ ] CORS ok
- [ ] `rg "@/backend" src/frontend src/routes` không còn kết quả
- [ ] Xoá `src/backend` và `src/routes/api`
