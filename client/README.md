# Frontend Client (Zenova E-Commerce)

Ứng dụng Frontend Single Page Application (SPA) xây dựng bằng **React 19**, **TanStack Router**, **TanStack Query**, **Tailwind CSS**, và **Axios**.

---

## 📂 Cấu trúc thư mục chi tiết

```
client/
├── public/                     # Tài nguyên tĩnh phục vụ trực tiếp cho web
│   ├── products/               # Hình ảnh demo và tệp placeholder.svg dự phòng
│   └── favicon.ico             # Biểu tượng website
│
├── src/
│   ├── components/
│   │   └── ui/                 # Thư viện UI cơ sở (Radix UI + Tailwind CSS)
│   │                           # Bao gồm: button, input, dialog, select, collapsible,
│   │                           # dropdown-menu, sheet, skeleton, badge, slider, toast...
│   │
│   ├── frontend/
│   │   ├── api/                # Tầng kết nối & xử lý dữ liệu API Backend
│   │   │   ├── client.ts       # Axios instance, cấu hình Base URL, interceptors gắn
│   │   │   │                   # Bearer token Firebase & x-session-token giỏ hàng
│   │   │   ├── products.api.ts # Hàm gọi API lấy danh sách và chi tiết sản phẩm
│   │   │   ├── products.adapter.ts # Adapter chuyển đổi dữ liệu thô từ BE sang kiểu dữ liệu FE
│   │   │   │                   # (Viết hoa chữ cái đầu danh mục, fallback trường thiếu)
│   │   │   ├── cart.api.ts     # Hàm gọi API quản lý giỏ hàng (PostgreSQL)
│   │   │   ├── orders.api.ts   # Hàm gọi API tạo và tra cứu đơn hàng (PostgreSQL)
│   │   │   └── hooks.ts        # TanStack Query custom hooks (useProducts, useProduct,...)
│   │   │
│   │   ├── components/
│   │   │   └── site/           # Các components nghiệp vụ giao diện
│   │   │       ├── Header.tsx           # Thanh điều hướng trên cùng, tìm kiếm, tài khoản, giỏ hàng
│   │   │       ├── Footer.tsx           # Chân trang thông tin liên hệ và chính sách
│   │   │       ├── ProductCard.tsx      # Thẻ hiển thị sản phẩm trong danh sách
│   │   │       ├── ProductImage.tsx     # Component hiển thị ảnh kèm fallback ảnh lỗi tự động
│   │   │       ├── CategoryFilter.tsx   # Bộ lọc danh mục (Top 5 nhiều nhất & Dropdown mở rộng)
│   │   │       ├── CategoryTile.tsx     # Khối danh mục trên trang chủ
│   │   │       ├── PriceRangeFilter.tsx # Bộ lọc theo khoảng giá sản phẩm
│   │   │       ├── InfiniteProductGrid.tsx # Lưới sản phẩm tải phân trang vô tận (Infinite Scroll)
│   │   │       ├── ThemeToggle.tsx      # Nút chuyển đổi Dark/Light mode
│   │   │       ├── LanguageToggle.tsx   # Nút chuyển đổi ngôn ngữ Việt/Anh
│   │   │       └── SiteLayout.tsx       # Layout khung chuẩn bọc Header + Nội dung + Footer
│   │   │
│   │   ├── lib/                # Contexts và thư viện tiện ích phía client
│   │   │   ├── auth.tsx        # React Context quản lý trạng thái đăng nhập/đăng xuất Firebase
│   │   │   ├── cart.tsx        # React Context quản lý giỏ hàng đồng bộ với database PostgreSQL
│   │   │   ├── firebase.ts     # Cấu hình khởi tạo Firebase Client SDK
│   │   │   ├── i18n.tsx        # Quản lý đa ngôn ngữ (Tiếng Việt / English)
│   │   │   └── theme.tsx       # Quản lý chế độ giao diện sáng/tối
│   │   │
│   │   └── pages/              # Các màn hình/trang giao diện chính
│   │       ├── HomePage.tsx             # Trang chủ (Banner, Ưu đãi hôm nay, Bán chạy, Hàng mới)
│   │       ├── ProductsPage.tsx         # Trang danh sách tất cả sản phẩm kèm bộ lọc
│   │       ├── ProductDetailPage.tsx   # Trang chi tiết sản phẩm và gợi ý liên quan
│   │       ├── CartPage.tsx             # Trang quản lý giỏ hàng
│   │       ├── CheckoutPage.tsx         # Trang nhập thông tin đặt hàng và thanh toán
│   │       ├── OrderSuccessPage.tsx     # Trang thông báo đặt hàng thành công
│   │       ├── AuthPage.tsx             # Trang đăng nhập / đăng ký tài khoản
│   │       └── AccountPage.tsx          # Trang thông tin tài khoản người dùng
│   │
│   ├── routes/                 # File-based routing theo TanStack Router
│   │   ├── __root.tsx          # Route gốc chứa RouterContext, Providers, Toaster
│   │   ├── index.tsx           # Route `/` trỏ đến HomePage
│   │   ├── san-pham.index.tsx  # Route `/san-pham` trỏ đến ProductsPage
│   │   ├── san-pham.$id.tsx    # Route `/san-pham/:id` trỏ đến ProductDetailPage
│   │   ├── gio-hang.tsx        # Route `/gio-hang` trỏ đến CartPage
│   │   ├── thanh-toan.tsx      # Route `/thanh-toan` trỏ đến CheckoutPage
│   │   ├── dat-hang-thanh-cong.tsx # Route `/dat-hang-thanh-cong` trỏ đến OrderSuccessPage
│   │   ├── dang-nhap.tsx       # Route `/dang-nhap` trỏ đến AuthPage
│   │   ├── dang-ky.tsx         # Route `/dang-ky` trỏ đến AuthPage
│   │   └── tai-khoan.tsx       # Route `/tai-khoan` trỏ đến AccountPage
│   │
│   ├── shared/                 # Định nghĩa dùng chung giữa Frontend & Backend
│   │   ├── types.ts            # Kiểu dữ liệu TypeScript (Product, Category, Order, CartLine...)
│   │   ├── constants.ts        # Hằng số API_ROUTES, phí ship, tên cửa hàng, tùy chọn sắp xếp
│   │   ├── format.ts           # Hàm định dạng tiền tệ VND (`formatVnd`)
│   │   └── schemas.ts          # Zod validation schema cho query và form nhập liệu
│   │
│   ├── router.tsx              # Khởi tạo TanStack router instance
│   ├── routeTree.gen.ts        # Cây định tuyến được sinh tự động bởi TanStack Router
│   ├── server.ts               # Wrapper bắt lỗi SSR cho Vite/Nitro
│   ├── start.ts                # Điểm khởi chạy của TanStack Start
│   └── styles.css              # Tệp CSS chính (Tailwind CSS v4 & theme variables)
│
├── .env                        # Biến môi trường (Firebase credentials, VITE_API_BASE_URL)
├── package.json                # Danh sách dependencies và scripts của Frontend
├── tsconfig.json               # Cấu hình TypeScript
└── vite.config.ts              # Cấu hình Vite bundler
```

---

## ⚡ Các lệnh thường dùng

```bash
# Chạy môi trường phát triển (Port mặc định: 8080 hoặc 8081)
npm run dev

# Kiểm tra lỗi kiểu dữ liệu TypeScript
npx tsc --noEmit

# Đóng gói ứng dụng cho production
npm run build
```
