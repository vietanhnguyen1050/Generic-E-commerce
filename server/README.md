# Backend Server (Express + Prisma + PostgreSQL)

Máy chủ Backend RESTful API xây dựng bằng **Node.js**, **Express**, **Prisma ORM**, và **PostgreSQL**.

---

## 📂 Cấu trúc thư mục chi tiết

```
server/
├── prisma/
│   ├── schema.prisma           # Định nghĩa toàn bộ lược đồ cơ sở dữ liệu (Prisma Schema):
│   │                           # - Danh mục & Sản phẩm: MainCategories, SubCategories, Products
│   │                           # - Người dùng & Phân quyền: Roles, Users, Cities, Address
│   │                           # - Giỏ hàng: Carts, CartItems
│   │                           # - Đơn hàng & Thanh toán: Orders, OrderItems, Payments
│   │                           # - Tương tác & Đánh giá: Reviews, Activities, UserActivities
│   └── import.csv.py           # Kịch bản nạp dữ liệu mẫu từ CSV vào cơ sở dữ liệu
│
├── src/
│   ├── config/                 # Cấu hình biến môi trường
│   │   └── env.ts              # Đọc và xác thực PORT (5000), NODE_ENV, CORS_ORIGIN
│   │
│   ├── controllers/            # Tầng điều khiển tiếp nhận request và xử lý nghiệp vụ
│   │   ├── products.controller.ts # Xử lý API sản phẩm: lọc, tìm kiếm theo tên, khoảng giá,
│   │   │                       # phân trang, lấy danh mục kèm số lượng sản phẩm, chi tiết & liên quan
│   │   ├── carts.controller.ts    # Xử lý API giỏ hàng: lấy giỏ hàng, thêm sản phẩm, cập nhật
│   │   │                       # số lượng, xóa sản phẩm hoặc xóa toàn bộ giỏ (lưu vào PostgreSQL)
│   │   ├── orders.controller.ts   # Xử lý API đơn hàng: xác thực thông tin, kiểm tra giá gốc từ DB,
│   │   │                       # tạo người dùng/khách, lưu Orders, OrderItems và Payments
│   │   ├── items.controller.ts    # Controller mẫu quản lý item
│   │   └── health.controller.ts   # Kiểm tra tình trạng hoạt động của server (Health Check)
│   │
│   ├── routes/                 # Định nghĩa các tuyến đường API (Endpoints)
│   │   ├── index.ts            # Gom toàn bộ router và mount vào prefix `/api` & `/api/v1`
│   │   ├── products.routes.ts  # Endpoint `/api/products` (GET danh sách, GET chi tiết theo ID)
│   │   ├── carts.routes.ts     # Endpoint `/api/cart` (GET, POST /items, PATCH /items/:id, DELETE)
│   │   ├── orders.routes.ts    # Endpoint `/api/orders` (POST tạo đơn, GET tra cứu đơn hàng)
│   │   ├── items.routes.ts     # Endpoint `/api/items`
│   │   └── health.routes.ts    # Endpoint `/api/health`
│   │
│   ├── lib/                    # Các thư viện kết nối cơ sở hạ tầng
│   │   └── prisma.ts           # Khởi tạo PrismaClient singleton với driver adapter `@prisma/adapter-pg`
│   │
│   ├── middleware/             # Các middleware trung gian xử lý request
│   │   ├── error-handler.ts    # Middleware bắt và định dạng lỗi hệ thống trả về JSON
│   │   └── not-found.ts        # Middleware xử lý các route không tồn tại (404 Not Found)
│   │
│   ├── generated/              # Mã nguồn sinh tự động
│   │   └── prisma/             # Prisma Client type-safe được sinh từ schema.prisma
│   │
│   ├── types/                  # Kiểu dữ liệu TypeScript nội bộ của server
│   ├── utils/                  # Tiện ích chung (`http-error.ts` xử lý HTTP Exception)
│   ├── validations/            # Hàm kiểm tra hợp lệ dữ liệu đầu vào
│   ├── app.ts                  # Cấu hình Express application, CORS origin và routes
│   └── server.ts               # Điểm bắt đầu khởi chạy máy chủ Express trên cổng 5000
│
├── .env                        # Biến môi trường cục bộ (DATABASE_URL kết nối PostgreSQL)
├── .env.example                # Tệp mẫu hướng dẫn cấu hình biến môi trường
├── package.json                # Danh sách dependencies và scripts của Backend
├── prisma.config.ts            # Cấu hình Prisma CLI
└── tsconfig.json               # Cấu hình TypeScript
```

---

## ⚡ Các lệnh thường dùng

```bash
# Chạy máy chủ môi trường phát triển (Port mặc định: 5000)
npm run dev

# Sinh lại Prisma Client khi có thay đổi trong schema.prisma
npx prisma generate

# Kiểm tra lỗi kiểu dữ liệu TypeScript
npx tsc --noEmit
```
