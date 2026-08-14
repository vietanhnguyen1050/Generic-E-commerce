import { createFileRoute } from "@tanstack/react-router";
import { ProductDetailPage } from "@/frontend/pages/ProductDetailPage";

export const Route = createFileRoute("/san-pham/$id")({
  head: () => ({
    meta: [
      { title: "Chi tiết sản phẩm | Zenova" },
      {
        name: "description",
        content:
          "Thông tin chi tiết sản phẩm: giá, đặc điểm nổi bật, đánh giá và các sản phẩm liên quan tại Zenova.",
      },
      { property: "og:title", content: "Chi tiết sản phẩm | Zenova" },
      { property: "og:description", content: "Giá tốt, hàng chính hãng, bảo hành 12 tháng." },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <ProductDetailPage id={id} />;
}
