# Mô Tả Lược Đồ Dữ Liệu (Database Schema)

Dự án sử dụng **PostgreSQL** làm cơ sở dữ liệu chính và **Prisma ORM** để tương tác.
Dưới đây là mô tả chi tiết về các bảng, các trường trong bảng và các mối quan hệ (khóa ngoại - Foreign Keys) trong hệ thống:

## 1. Catalog Sản Phẩm (Product Catalog)

### Bảng `MainCategories` (Danh mục chính)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `mainCategory` (String): Tên danh mục chính (Unique).

### Bảng `SubCategories` (Danh mục con)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `subCategory` (String): Tên danh mục con (Unique).
- `mainCategoryId` (Int?): Khóa ngoại tham chiếu đến `MainCategories(id)`.

### Bảng `Products` (Sản phẩm)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `mainCategoryId` (Int): Khóa ngoại tham chiếu đến `MainCategories(id)`.
- `subCategoryId` (Int): Khóa ngoại tham chiếu đến `SubCategories(id)`.
- `name` (String): Tên sản phẩm.
- `imageUrl` (String): Đường dẫn ảnh hiển thị.
- `originalUrl` (String): Đường dẫn ảnh gốc.
- `ratings` (Float): Điểm đánh giá trung bình.
- `numberOfRatings` (Int): Số lượng đánh giá.
- `discountPrice` (Int): Giá sau khi giảm.
- `actualPrice` (Int): Giá gốc.
- `quantity` (Int): Số lượng tồn kho.
- `available` (Boolean): Trạng thái khả dụng (Mặc định: true).
- `updatedAt` (DateTime): Thời gian cập nhật lần cuối.

## 2. Người Dùng và Vị Trí (Users and Locations)

### Bảng `Roles` (Phân quyền người dùng)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `Role` (String): Tên quyền (Unique) (VD: Admin, User).

### Bảng `Cities` (Thành phố / Khu vực giao hàng)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `City` (String): Tên thành phố (Unique).

### Bảng `Users` (Người dùng hệ thống)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `roleId` (Int): Khóa ngoại tham chiếu đến `Roles(id)`.
- `firebase_Uid` (String): UID từ Firebase Authentication (Unique).
- `email` (String): Email người dùng (Unique).
- `displayName` (String): Tên hiển thị.
- `phoneNumber` (String): Số điện thoại (Unique).
- `createdAt` (DateTime): Thời gian tạo tài khoản.
- `totalValuePurchased` (Float): Tổng giá trị đã mua (Mặc định: 0).
- `deleted` (Boolean): Trạng thái xóa mềm (Mặc định: false).

### Bảng `Address` (Địa chỉ giao hàng)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `userId` (Int): Khóa ngoại tham chiếu đến `Users(id)`.
- `phoneNumber` (String): Số điện thoại liên hệ giao hàng.
- `customName` (String): Tên người nhận.
- `cityId` (Int): Khóa ngoại tham chiếu đến `Cities(id)`.
- `addressLine` (String): Địa chỉ chi tiết (số nhà, đường...).
- `isDefault` (Boolean): Là địa chỉ mặc định (Mặc định: false).
- `noteForDelivery` (String): Ghi chú giao hàng.

## 3. Giỏ Hàng và Thanh Toán (Cart and Checkout)

### Bảng `Carts` (Giỏ hàng)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `userId` (Int): Khóa ngoại tham chiếu đến `Users(id)`.
- `sessionToken` (String): Token phiên giao dịch, dùng cho guest hoặc user (Unique).
- `updatedAt` (DateTime): Thời gian cập nhật giỏ hàng.

### Bảng `CartItems` (Sản phẩm trong giỏ hàng)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `cartId` (Int): Khóa ngoại tham chiếu đến `Carts(id)`.
- `productId` (Int): Khóa ngoại tham chiếu đến `Products(id)`.
- `quantity` (Int): Số lượng sản phẩm.

### Bảng `Orders` (Đơn đặt hàng)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `userId` (Int): Khóa ngoại tham chiếu đến `Users(id)`.
- `totalAmount` (Float): Tổng tiền đơn hàng.
- `status` (OrderStatus): Trạng thái đơn hàng (Enum: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, FAILED).
- `createdAt` (DateTime): Thời gian tạo đơn.
- `updatedAt` (DateTime): Thời gian cập nhật đơn.

### Bảng `OrderItems` (Chi tiết sản phẩm trong đơn hàng)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `orderId` (Int): Khóa ngoại tham chiếu đến `Orders(id)`.
- `productId` (Int): Khóa ngoại tham chiếu đến `Products(id)`.
- `quantity` (Int): Số lượng mua.
- `priceAtPurchase` (Float): Giá sản phẩm tại thời điểm mua.

### Bảng `Payments` (Thanh toán)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `orderId` (Int): Khóa ngoại tham chiếu đến `Orders(id)`.
- `transactionId` (String): Mã giao dịch từ cổng thanh toán (Unique).
- `paymentMethod` (String): Phương thức thanh toán (MoMo, ZaloPay, COD...).
- `status` (String): Trạng thái giao dịch.
- `gatewayResponse` (String): Phản hồi chi tiết từ cổng thanh toán.
- `amount` (Float): Số tiền thanh toán.
- `createdAt` (DateTime): Thời gian tạo.
- `updatedAt` (DateTime): Thời gian cập nhật.

## 4. Tương Tác và Đánh Giá (Reviews and Recommendations)

### Bảng `Reviews` (Đánh giá sản phẩm)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `userId` (Int): Khóa ngoại tham chiếu đến `Users(id)`.
- `productId` (Int): Khóa ngoại tham chiếu đến `Products(id)`.
- `rating` (Int): Điểm đánh giá.
- `comment` (String): Nội dung bình luận.
- `createdAt` (DateTime): Thời gian đánh giá.

### Bảng `Activities` (Định nghĩa hành động)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `activity` (String): Tên hành động (Unique) (VD: VIEW, ADD_TO_CART, PURCHASE).
- `point` (Int): Điểm số tương ứng với hành động.

### Bảng `UserActivities` (Lịch sử hoạt động của người dùng)
- `id` (Int): Khóa chính (PK), tự động tăng.
- `userId` (Int): Khóa ngoại tham chiếu đến `Users(id)`.
- `productId` (Int): Khóa ngoại tham chiếu đến `Products(id)`.
- `mainCategoryId` (Int): Khóa ngoại tham chiếu đến `MainCategories(id)`.
- `subCategoryId` (Int): Khóa ngoại tham chiếu đến `SubCategories(id)`.
- `activityId` (Int): Khóa ngoại tham chiếu đến `Activities(id)`.
- `timeStamp` (DateTime): Thời gian xảy ra hành động (Mặc định: now()).
- `metaData` (String): Dữ liệu bổ sung (JSON hoặc chuỗi).
