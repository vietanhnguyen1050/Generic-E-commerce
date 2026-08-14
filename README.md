# Zenova E-Commerce Fullstack Platform

Dự án website thương mại điện tử hiện đại, xây dựng theo kiến trúc fullstack tách biệt giữa **Frontend (React + TanStack Router + Tailwind CSS)** và **Backend (Node.js + Express + Prisma + PostgreSQL)**.

---

Link video demo:
https://drive.google.com/file/d/1zqXu69ulfkQzI8fZ-syMJDm0c0SL6rdF/view?usp=sharing

## 🛒 Luồng chức năng chính (User Flow)

1. **Khám phá & Tìm kiếm sản phẩm**:
   - Trang chủ hiển thị deal nổi bật, sản phẩm bán chạy, sản phẩm mới nhất và danh mục sản phẩm.
   - Trang **Tất cả sản phẩm** hỗ trợ lọc theo danh mục (Top 5 nhiều nhất & Dropdown mở rộng), khoảng giá, từ khóa tìm kiếm và sắp xếp đa tiêu chí.
   - Trang **Chi tiết sản phẩm** hiển thị giá bán, giá gốc, tồn kho, tính năng nổi bật, ảnh sản phẩm (có cơ chế tự động fallback ảnh lỗi) và danh sách sản phẩm liên quan.

2. **Xác thực & Người dùng (Authentication)**:
   - Đăng ký, Đăng nhập và Đăng xuất thông qua **Firebase Authentication**.
   - Quản lý thông tin tài khoản cá nhân.

3. **Quản lý Giỏ hàng (Cart)**:
   - Thêm sản phẩm, tăng/giảm số lượng, xóa từng món hoặc xóa toàn bộ giỏ hàng.
   - **Dữ liệu giỏ hàng được đồng bộ và lưu trực tiếp vào cơ sở dữ liệu PostgreSQL** thông qua `sessionToken` (hỗ trợ cả khách vãng lai và người dùng đã đăng nhập).

4. **Đặt hàng & Thanh toán (Checkout & Orders)**:
   - Điền thông tin nhận hàng, ghi chú giao hàng.
   - Chọn phương thức vận chuyển (Tiêu chuẩn / Hỏa tốc) với chính sách tự động miễn phí vận chuyển cho đơn hàng từ 500.000đ.
   - Chọn phương thức thanh toán (COD, Chuyển khoản ngân hàng, Ví MoMo, Thẻ tín dụng).
   - Đơn hàng được kiểm tra giá thực và lưu trữ đầy đủ vào các bảng `Orders`, `OrderItems`, `Payments` trong PostgreSQL.
   - Chuyển hướng sang trang **Đặt hàng thành công** hiển thị mã đơn hàng (`ZN...`) và tóm tắt thông tin đơn mua.

---

## 🌐 Cổng hoạt động mặc định (Default Ports)

| Ứng dụng | Cổng mặc định | URL truy cập |
|---|---|---|
| **Frontend (Client)** | `8080` (hoặc `8081` nếu 8080 bận) | [http://localhost:8080/](http://localhost:8080/) / [http://localhost:8081/](http://localhost:8081/) |
| **Backend (Server)** | `5000` | [http://localhost:5000/](http://localhost:5000/) |

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### 1. Cài đặt toàn bộ dependencies
Chạy lệnh sau tại thư mục gốc để tự động cài đặt gói cho cả Root, Server và Client:
```bash
npm run install:all
```

### 2. Khởi chạy toàn bộ hệ thống
Khởi động đồng thời cả Backend và Frontend chỉ với một câu lệnh:
```bash
npm run dev
```

Hoặc có thể chạy riêng từng phần:
- Chạy riêng Server: `npm run dev:server` (hoặc `cd server && npm run dev`)
- Chạy riêng Client: `npm run dev:client` (hoặc `cd client && npm run dev`)

---

## ⚠️ Tuyên bố miễn trừ trách nhiệm (Disclaimer)

> **Lưu ý quan trọng**: Dữ liệu cơ sở dữ liệu **PostgreSQL** (`DATABASE_URL`) và các tệp dữ liệu mẫu trong dự án hiện chỉ được cấu hình và chạy trên **môi trường cục bộ (Local Development)** của nhà phát triển, **hoàn toàn không được deploy hay phát hành lên môi trường Cloud / Public Production**. Khi triển khai thực tế, cần cung cấp chuỗi kết nối PostgreSQL tương ứng trong tệp `server/.env`.
