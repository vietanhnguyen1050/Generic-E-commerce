import { createFileRoute } from "@tanstack/react-router";
import { CheckoutPage } from "@/frontend/pages/CheckoutPage";

export const Route = createFileRoute("/thanh-toan")({
  head: () => ({
    meta: [
      { title: "Thanh toán đơn hàng | Zenova" },
      { name: "description", content: "Nhập thông tin nhận hàng, chọn vận chuyển và phương thức thanh toán." },
      { property: "og:title", content: "Thanh toán đơn hàng | Zenova" },
      { property: "og:description", content: "COD, chuyển khoản, MoMo hoặc thẻ tín dụng." },
    ],
  }),
  component: CheckoutPage,
});
