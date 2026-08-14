// FE — gọi API sản phẩm qua axios.
import { api } from "@/frontend/api/client";
import { API_ROUTES } from "@/shared/constants";
import type { ProductDetailResponse, ProductListResponse, ProductQuery } from "@/shared/types";

export async function fetchProducts(query: ProductQuery = {}) {
  const { data } = await api.get<ProductListResponse>(API_ROUTES.products, { params: query });
  return data;
}

export async function fetchProduct(id: string) {
  const { data } = await api.get<ProductDetailResponse>(API_ROUTES.product(id));
  return data;
}
