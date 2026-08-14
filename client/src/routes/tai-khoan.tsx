import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "@/frontend/pages/AccountPage";

export const Route = createFileRoute("/tai-khoan")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Tài khoản của tôi | Zenova" },
      { name: "description", content: "Quản lý thông tin tài khoản Zenova và đăng xuất khỏi thiết bị." },
      { property: "og:title", content: "Tài khoản của tôi | Zenova" },
      { property: "og:description", content: "Thông tin cá nhân và trạng thái đăng nhập." },
    ],
  }),
  component: AccountPage,
});
