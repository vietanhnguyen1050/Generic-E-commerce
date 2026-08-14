# Chức Năng Của Thư Mục `app` và `notebooks`

Bên cạnh hai thư mục chính là `client` (Frontend) và `server` (Backend), dự án còn bao gồm hai thư mục `app` và `notebooks` nằm ở thư mục gốc (root folder). Dưới đây là mô tả về vai trò của chúng:

## Thư mục `app`
Thư mục `app` chứa các mã nguồn liên quan đến **AI, Machine Learning và hệ thống gợi ý (Recommendation System)**.
- Đóng vai trò như một service độc lập (thường được viết bằng Python).
- Xử lý các logic phức tạp như:
  - Tải model Machine Learning.
  - Chạy các thuật toán gợi ý sản phẩm dựa trên hành vi người dùng.
  - Cung cấp API (thông qua FastAPI hoặc Flask) để Backend Node.js gọi đến khi cần lấy danh sách sản phẩm gợi ý cho một user cụ thể.
- (Ví dụ: Chứa file `recommender.py` xử lý logic AI).

## Thư mục `notebooks`
Thư mục `notebooks` chứa các file **Jupyter Notebook (.ipynb)** và các script phục vụ cho **Data Science và Data Engineering**.
- Chức năng chính:
  - **Làm sạch dữ liệu (Data Cleaning)**: Khám phá, tiền xử lý và dọn dẹp dữ liệu sản phẩm (ví dụ: lọc bỏ dữ liệu lỗi, hình ảnh hỏng).
  - **Feature Engineering**: Rút trích đặc trưng từ dữ liệu thô.
  - **Tạo Embedding và Indexing**: Chạy các mô hình NLP để tạo vector cho sản phẩm, xây dựng các index (như FAISS) để phục vụ cho việc tìm kiếm vector nhanh chóng.
  - Nơi để các nhà phát triển thử nghiệm (experiment) nhanh các mô hình học máy trước khi đưa vào thư mục `app` chạy chính thức.
