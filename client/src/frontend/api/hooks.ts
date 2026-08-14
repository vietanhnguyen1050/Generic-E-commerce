// FE — hooks TanStack Query bọc quanh tầng axios.
import {
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { fetchProduct, fetchProducts } from "@/frontend/api/products.api";
import { createOrder } from "@/frontend/api/orders.api";
import type { OrderInput, ProductQuery } from "@/shared/types";

export const productsQueryOptions = (query: ProductQuery = {}) =>
  queryOptions({
    queryKey: ["products", query],
    queryFn: () => fetchProducts(query),
  });

export const productQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });

export function useProducts(query: ProductQuery = {}) {
  return useQuery(productsQueryOptions(query));
}

export function useProduct(id: string) {
  return useQuery(productQueryOptions(id));
}

/** Tải sản phẩm theo trang, dùng cho infinite scroll. */
export function useInfiniteProducts(query: ProductQuery = {}, pageSize = 12) {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", query, pageSize],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchProducts({ ...query, limit: pageSize, offset: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.offset + lastPage.items.length : undefined,
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (input: OrderInput) => createOrder(input),
  });
}
