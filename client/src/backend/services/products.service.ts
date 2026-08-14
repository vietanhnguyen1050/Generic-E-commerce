// BE — nghiệp vụ sản phẩm.
import {
  countByCategory,
  countProducts,
  findCategories,
  findPriceBounds,
  findProductById,
  findProducts,
} from "@/backend/repositories/products.repository";
import type { ProductDetailResponse, ProductListResponse, ProductQuery } from "@/shared/types";

export function listProducts(query: ProductQuery): ProductListResponse {
  const items = findProducts(query);
  const offset = query.offset ?? 0;
  const total = countProducts(query);
  return {
    items,
    total,
    offset,
    hasMore: offset + items.length < total,
    categories: findCategories(),
    priceBounds: findPriceBounds(),
    categoryCounts: countByCategory(query),
  };
}


export function getProductDetail(id: string): ProductDetailResponse | null {
  const product = findProductById(id);
  if (!product) return null;
  const related = findProducts({ category: product.category })
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  const mainCategory = findCategories().find((c) => c.slug === product.category) ?? null;
  const subcategory = mainCategory?.sub.find((s) => s.slug === product.subcategory) ?? null;
  return { product, related, mainCategory, subcategory };
}

