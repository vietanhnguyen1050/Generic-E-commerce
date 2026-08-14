// BE — sinh biến thể sản phẩm từ danh sách gốc (deterministic, không random)
// để catalog đủ lớn cho phân trang / infinite scroll.
import type { Product } from "@/shared/types";

const VARIANTS = [
  { suffix: "Bản tiêu chuẩn", priceFactor: 1, tag: "std" },
  { suffix: "Bản cao cấp", priceFactor: 1.18, tag: "pro" },
  { suffix: "Bản Lite", priceFactor: 0.82, tag: "lite" },
  { suffix: "Phiên bản 2026", priceFactor: 1.09, tag: "2026" },
  { suffix: "Màu Titan", priceFactor: 1.04, tag: "titan" },
  { suffix: "Màu Ivory", priceFactor: 0.97, tag: "ivory" },
  { suffix: "Bộ đôi tiết kiệm", priceFactor: 1.75, tag: "combo" },
  { suffix: "Hàng trưng bày", priceFactor: 0.71, tag: "demo" },
  { suffix: "Bản quốc tế", priceFactor: 1.12, tag: "intl" },
  { suffix: "Bản giới hạn", priceFactor: 1.26, tag: "limited" },
] as const;

const round = (value: number) => Math.round(value / 1000) * 1000;
const clampRating = (value: number) => Math.min(5, Math.max(3.5, Math.round(value * 10) / 10));

export function buildCatalog(base: Product[]): Product[] {
  const out: Product[] = [];

  base.forEach((product, productIndex) => {
    VARIANTS.forEach((variant, variantIndex) => {
      if (variantIndex === 0) {
        out.push(product);
        return;
      }
      const drift = ((productIndex * 7 + variantIndex * 3) % 9) / 100;
      out.push({
        ...product,
        id: `${product.id}-${variant.tag}`,
        name: `${product.name} — ${variant.suffix}`,
        price: round(product.price * variant.priceFactor),
        listPrice: round(product.listPrice * variant.priceFactor * (1 + drift)),
        rating: clampRating(product.rating - variantIndex * 0.05 + drift),
        reviews: Math.max(12, Math.round(product.reviews / (variantIndex + 1))),
        sold: Math.max(5, Math.round(product.sold / (variantIndex + 1))),
        stock: Math.max(1, product.stock - variantIndex * 3),
        freeShip: variantIndex % 3 !== 1 ? product.freeShip : !product.freeShip,
      });
    });
  });

  return out;
}
