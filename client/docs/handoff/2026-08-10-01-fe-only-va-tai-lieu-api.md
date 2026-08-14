# 2026-08-10 · 01 — Chốt phạm vi FE-only + khởi tạo tài liệu API/handoff

## Yêu cầu

- Từ nay chỉ phụ trách FE; giữ nguyên `src/backend` để các lần sau chỉ cần thay FE.
- Viết các đầu API cần thiết vào một file `.md`, cập nhật thường xuyên.
- Mỗi lần thay đổi ghi một file handoff md trong thư mục riêng.
- `src/backend` sẽ bỏ dần, thay bằng hướng dẫn kết nối backend thật.

## Thay đổi FE

Không thay đổi code FE trong lần này (chỉ thiết lập tài liệu & quy trình).

## Tài liệu mới

| File | Nội dung |
| --- | --- |
| `docs/API.md` | Hợp đồng API: 4 endpoint (`GET /api/products`, `GET /api/products/:id`, `POST /api/orders`, `GET /api/orders?id=`), query params, schema response, format lỗi, quy tắc auth, endpoint dự kiến |
| `docs/BACKEND_INTEGRATION.md` | Cách trỏ FE sang BE thật qua `VITE_API_BASE_URL`, yêu cầu CORS/auth, thứ tự gỡ mock `src/backend`, checklist bàn giao |
| `docs/handoff/README.md` | Quy ước đặt tên & nội dung file handoff |
| `docs/handoff/2026-08-10-01-...md` | Bản ghi này |

## Ảnh hưởng API

Không đổi hợp đồng — chỉ tài liệu hoá đúng hành vi hiện tại của mock BE.

## Ghi chú / việc còn lại

- `src/backend` được coi là **mock đóng băng**: không sửa nữa.
- FE chỉ import qua `src/frontend/api/*`; kiểu dữ liệu dùng `src/shared/*`.
- Khi BE thật sẵn sàng: set `VITE_API_BASE_URL`, rồi xoá `src/routes/api` + `src/backend`
  theo checklist trong `docs/BACKEND_INTEGRATION.md`.
