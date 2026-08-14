# Cấu trúc fullstack

```
src/
├── shared/                  # Dùng chung FE ↔ BE
│   ├── types.ts             # Book, Order, ApiError...
│   ├── schemas.ts           # Zod validate (BE dùng, FE có thể tái sử dụng)
│   ├── constants.ts         # Phí ship, đường dẫn API
│   ├── format.ts            # formatVnd
│   └── data/books.ts        # Nguồn dữ liệu catalog (thay bằng DB sau)
│
├── backend/                 # BE (chạy trên server)
│   ├── repositories/        # Truy cập dữ liệu
│   ├── services/            # Nghiệp vụ (tính giá, tạo đơn)
│   └── http/respond.ts      # Chuẩn hoá response JSON
│
├── routes/api/              # HTTP endpoints (BE)
│   ├── books.ts             # GET /api/books?q&category&sort&limit
│   ├── books.$slug.ts       # GET /api/books/:slug
│   └── orders.ts            # POST /api/orders, GET /api/orders?id=
│
├── frontend/api/            # FE — tầng gọi API
│   ├── client.ts            # axios instance + interceptors
│   ├── books.api.ts
│   ├── orders.api.ts
│   └── hooks.ts             # useBooks / useBook / useCreateOrder
│
├── components/  hooks/  lib/  routes/   # UI, state, các trang
```

## Axios
`src/frontend/api/client.ts` tạo instance với `baseURL = VITE_API_BASE_URL` (nếu có),
mặc định là cùng origin. Request interceptor gắn `Authorization: Bearer <token>`
từ `localStorage`, response interceptor chuẩn hoá lỗi về `ApiError { message, details }`.

Muốn trỏ sang BE riêng: thêm `VITE_API_BASE_URL=https://api.example.com` vào env.

## Quy ước
- FE **không** gọi trực tiếp `backend/*`; chỉ đi qua `frontend/api/*`.
- BE luôn validate input bằng `shared/schemas.ts` và tính lại giá ở server.
