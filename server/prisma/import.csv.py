import pandas as pd
from sqlalchemy import create_engine

# 1. Đọc file CSV (file đặt tại thư mục gốc TTCM/)
csv_file_path = "../../Amazon-Products_processed - Main.csv"
print("Đang đọc file CSV...")
df = pd.read_csv(csv_file_path, on_bad_lines="skip")

# 2. Cấu hình thông tin kết nối PostgreSQL
DB_USER = "postgres"
DB_PASS = "12345678"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "postgres"

connection_string = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(connection_string)

# 3. Lấy dữ liệu MainCategories và SubCategories đã tạo trong DB để lấy ID
print("Đang lấy thông tin danh mục từ PostgreSQL...")
main_cats = pd.read_sql('SELECT id as "mainCategoryId", "mainCategory" FROM "MainCategories"', engine)
sub_cats = pd.read_sql('SELECT id as "subCategoryId", "subCategory" FROM "SubCategories"', engine)

# Chuẩn hoá chuỗi để khớp chính xác không phân biệt hoa thường / khoảng trắng
df["main_clean"] = df["main_category"].astype(str).str.strip().str.lower()
df["sub_clean"] = df["sub_category"].astype(str).str.strip().str.lower()
main_cats["main_clean"] = main_cats["mainCategory"].astype(str).str.strip().str.lower()
sub_cats["sub_clean"] = sub_cats["subCategory"].astype(str).str.strip().str.lower()

# 4. Khớp dữ liệu lấy mainCategoryId và subCategoryId
print("Đang ghép ID danh mục...")
df = df.merge(main_cats[["main_clean", "mainCategoryId"]], on="main_clean", how="inner")
df = df.merge(sub_cats[["sub_clean", "subCategoryId"]], on="sub_clean", how="inner")

# 5. Xử lý giá tiền (Làm tròn đến hàng 1.000 và ép kiểu int)
# Ví dụ: 9,084,624.7 -> 9,085,000
print("Đang làm tròn giá tiền đến hàng 1.000...")
df["actualPrice"] = pd.to_numeric(df["actualPrice"], errors="coerce").fillna(0).round(-3).astype(int)
df["discountPrice"] = pd.to_numeric(df["discountPrice"], errors="coerce").fillna(0).round(-3).astype(int)

# 6. Chuẩn hoá các cột khác & điền thông tin bổ sung (available, updatedAt)
df["ratings"] = pd.to_numeric(df["numberOfRatings"], errors="coerce").fillna(0)
df["numberOfRatings"] = pd.to_numeric(df["no_of_ratings"], errors="coerce").fillna(0).astype(int)
df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce").fillna(0).astype(int)
df["available"] = True
df["updatedAt"] = pd.Timestamp.now()

# 7. Lọc đúng danh sách cột khớp 100% với Schema Prisma của bảng Products
products_df = df[[
    "mainCategoryId",
    "subCategoryId",
    "name",
    "imageUrl",
    "originalUrl",
    "ratings",
    "numberOfRatings",
    "actualPrice",
    "discountPrice",
    "quantity",
    "available",
    "updatedAt",
]]

# 8. Đẩy dữ liệu chuẩn vào bảng "Products"
print(f"Đang ghi {len(products_df)} sản phẩm vào bảng 'Products'...")
products_df.to_sql("Products", engine, if_exists="append", index=False, chunksize=5000, method="multi")

print("✅ Import thành công và làm tròn giá hoàn tất!")

