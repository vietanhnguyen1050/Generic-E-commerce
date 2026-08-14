import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/frontend/pages/AuthPage";

export const Route = createFileRoute("/dang-ky")({
  head: () => ({
    meta: [
      { title: "Đăng ký tài khoản | Zenova" },
      { name: "description", content: "Tạo tài khoản Zenova để mua sắm nhanh hơn và nhận ưu đãi riêng." },
      { property: "og:title", content: "Đăng ký tài khoản | Zenova" },
      { property: "og:description", content: "Tạo tài khoản chỉ trong một phút." },
    ],
  }),
  component: () => <AuthPage mode="register" />,
});
