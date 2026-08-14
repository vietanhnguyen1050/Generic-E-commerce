# Các Task Tiếp Theo

Dưới đây là danh sách các tính năng và công việc cần được thực hiện trong tương lai để hoàn thiện hệ thống E-commerce:

## 1. Tích hợp hệ thống thanh toán
- Tích hợp **Cổng thanh toán MoMo** cho phép người dùng thanh toán trực tuyến dễ dàng và an toàn.
- Xử lý các webhook và callback từ MoMo để cập nhật trạng thái đơn hàng một cách tự động.

## 2. Restructure Giao diện
- Làm đẹp giao diện, có thể đổi tên, màu, bố cục của website theo ý muốn.
- Chỉnh sửa, thêm context để người dùng có thể đổi ngôn ngữ nếu muốn. (VD: hiện tại trong giao diện có thể chỉnh EN - VN nhưng data gửi lên chỉ có EN)

## 3. Admin Panel
- Xây dựng trang quản trị (Admin Panel) để quản lý toàn bộ hệ thống.
- **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm và danh mục.
- **Quản lý đơn hàng**: Theo dõi trạng thái đơn hàng, xác nhận và xử lý giao hàng.
- **Quản lý người dùng**: Xem danh sách người dùng, phân quyền và xử lý các vấn đề liên quan đến tài khoản.

## 4. Hệ thống gợi ý sản phẩm (Recommendation System)
- Phát triển hệ thống gợi ý sản phẩm được cá nhân hóa cho từng người dùng.
- Dựa trên **log hành vi người dùng** (xem, thêm vào giỏ hàng, mua hàng, đánh giá).
- Xây dựng điểm số quan tâm (interest score) cho từng danh mục sản phẩm (Main Category / Sub Category) mà người dùng tương tác.

## 5. Lọc dữ liệu và Xử lý lỗi ảnh
- Xây dựng luồng công việc để tự động phát hiện và lọc các sản phẩm có dữ liệu lỗi, đặc biệt là lỗi ảnh (broken image links).
- Có thể sử dụng các script Python trong thư mục `notebooks` để kiểm tra URL định kỳ và cập nhật trạng thái sản phẩm trong database.

## 6. Bảo mật API
- Tăng cường bảo mật cho các REST API. Áp dụng hide API Endpoint.
- Áp dụng xác thực và phân quyền (Authentication & Authorization) chặt chẽ bằng JWT hoặc Session Token.
- Validate dữ liệu đầu vào và chống các lỗ hổng bảo mật phổ biến (CORS, Rate Limiting, SQL Injection qua ORM).

## 7. Cải thiện trải nghiệm người dùng (UX/UI Flow)
- Cải thiện luồng (flow) mua hàng và thanh toán.
- Bổ sung chức năng **Sổ địa chỉ** (Address Book): Cho phép người dùng lưu nhiều địa chỉ, dễ dàng chọn và thay đổi địa chỉ giao hàng mặc định khi checkout.
