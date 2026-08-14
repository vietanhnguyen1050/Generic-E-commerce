// FE — gọi API sản phẩm qua axios, dịch data từ BE qua hàm toData.
import { api } from "@/frontend/api/client";
import {
  toData,
  type BeProductListResponse,
  type BeProductDetailResponse,
} from "@/frontend/api/products.adapter";
import { API_ROUTES } from "@/shared/constants";
import type { ProductDetailResponse, ProductListResponse, ProductQuery } from "@/shared/types";

export async function fetchProducts(query: ProductQuery = {}): Promise<ProductListResponse> {
  const { data } = await api.get<BeProductListResponse>(API_ROUTES.products, { params: query });
  return toData(data);
}

export async function fetchProduct(id: string): Promise<ProductDetailResponse> {
  const { data } = await api.get<BeProductDetailResponse>(API_ROUTES.product(id));
  return toData(data);
}
