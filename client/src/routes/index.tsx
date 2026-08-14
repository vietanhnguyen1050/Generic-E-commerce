import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/frontend/pages/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zenova — Mua sắm trực tuyến đa ngành hàng" },
      {
        name: "description",
        content:
          "Zenova: hàng nghìn sản phẩm chính hãng công nghệ, thời trang, nhà cửa, thể thao, mẹ & bé. Giá tốt, giao nhanh toàn quốc.",
      },
      { property: "og:title", content: "Zenova — Mua sắm trực tuyến đa ngành hàng" },
      {
        property: "og:description",
        content: "Sản phẩm chính hãng, ưu đãi mỗi ngày, miễn phí vận chuyển cho đơn từ 499.000đ.",
      },
    ],
  }),
  component: HomePage,
});
