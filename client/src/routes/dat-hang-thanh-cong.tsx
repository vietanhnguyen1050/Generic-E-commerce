import { createFileRoute } from "@tanstack/react-router";
import { OrderSuccessPage } from "@/frontend/pages/OrderSuccessPage";

export const Route = createFileRoute("/dat-hang-thanh-cong")({
  head: () => ({
    meta: [
      { title: "Đặt hàng thành công | Zenova" },
      { name: "description", content: "Đơn hàng của bạn đã được ghi nhận. Xem lại mã đơn và tổng tiền." },
      { property: "og:title", content: "Đặt hàng thành công | Zenova" },
      { property: "og:description", content: "Cảm ơn bạn đã mua sắm tại Zenova." },
    ],
  }),
  component: OrderSuccessPage,
});
