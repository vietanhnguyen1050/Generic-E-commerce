import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/frontend/pages/CartPage";

export const Route = createFileRoute("/gio-hang")({
  head: () => ({
    meta: [
      { title: "Giỏ hàng | Zenova" },
      { name: "description", content: "Xem lại sản phẩm trong giỏ, cập nhật số lượng và phí vận chuyển." },
      { property: "og:title", content: "Giỏ hàng | Zenova" },
      { property: "og:description", content: "Cập nhật số lượng và tiến hành thanh toán nhanh." },
    ],
  }),
  component: CartPage,
});
