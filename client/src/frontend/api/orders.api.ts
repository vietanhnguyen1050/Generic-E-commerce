// FE — gọi API đơn hàng qua axios.
import { api } from "@/frontend/api/client";
import { API_ROUTES } from "@/shared/constants";
import type { Order, OrderInput } from "@/shared/types";

export async function createOrder(input: OrderInput) {
  const { data } = await api.post<Order>(API_ROUTES.orders, input);
  return data;
}

export async function fetchOrder(id: string) {
  const { data } = await api.get<Order>(API_ROUTES.orders, { params: { id } });
  return data;
}
