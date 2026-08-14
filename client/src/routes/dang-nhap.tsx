import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/frontend/pages/AuthPage";

export const Route = createFileRoute("/dang-nhap")({
  head: () => ({
    meta: [
      { title: "Đăng nhập | Zenova" },
      { name: "description", content: "Đăng nhập Zenova bằng email hoặc Google để theo dõi đơn hàng." },
      { property: "og:title", content: "Đăng nhập | Zenova" },
      { property: "og:description", content: "Đăng nhập nhanh bằng email hoặc Google." },
    ],
  }),
  component: () => <AuthPage mode="login" />,
});
