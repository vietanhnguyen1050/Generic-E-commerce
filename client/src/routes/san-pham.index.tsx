import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage, type ProductsSearch } from "@/frontend/pages/ProductsPage";
import type { ProductSort } from "@/shared/types";

const SORTS: ProductSort[] = ["pho-bien", "moi-nhat", "danh-gia", "gia-tang", "gia-giam"];

function toPrice(value: unknown): number | undefined {
  const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
}

export const Route = createFileRoute("/san-pham/")({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    q: typeof search['q'] === "string" ? search['q'].slice(0, 120) : undefined,
    danh_muc: typeof search['danh_muc'] === "string" ? search['danh_muc'] : undefined,
    sap_xep: SORTS.includes(search['sap_xep'] as ProductSort)
      ? (search['sap_xep'] as ProductSort)
      : undefined,
    gia_min: toPrice(search['gia_min']),
    gia_max: toPrice(search['gia_max']),
  }),
  head: () => ({
    meta: [
      { title: "Tất cả sản phẩm | Zenova" },
      {
        name: "description",
        content:
          "Khám phá toàn bộ sản phẩm tại Zenova: lọc theo danh mục, khoảng giá và sắp xếp theo giá hoặc độ phổ biến.",
      },
      { property: "og:title", content: "Tất cả sản phẩm | Zenova" },
      { property: "og:description", content: "Lọc theo danh mục, khoảng giá và sắp xếp linh hoạt." },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  return <ProductsPage search={search} />;
}
