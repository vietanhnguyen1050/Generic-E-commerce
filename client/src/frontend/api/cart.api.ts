// FE — gọi API giỏ hàng qua axios, lưu trực tiếp vào database PostgreSQL.
import { api } from "@/frontend/api/client";
import { API_ROUTES } from "@/shared/constants";

export type CartLine = {
  id: string;
  name: string;
  image: string;
  price: number;
  listPrice: number;
  qty: number;
};

export type CartResponse = {
  id: number;
  sessionToken: string;
  items: CartLine[];
  count: number;
  subtotal: number;
  savings: number;
};

export async function fetchCart(): Promise<CartResponse> {
  const { data } = await api.get<CartResponse>(API_ROUTES.cart);
  return data;
}

export async function addToCartApi(productId: string | number, qty = 1): Promise<CartResponse> {
  const { data } = await api.post<CartResponse>(`${API_ROUTES.cart}/items`, {
    productId,
    qty,
  });
  return data;
}

export async function updateCartItemApi(productId: string | number, qty: number): Promise<CartResponse> {
  const { data } = await api.patch<CartResponse>(API_ROUTES.cartItem(String(productId)), {
    qty,
  });
  return data;
}

export async function removeCartItemApi(productId: string | number): Promise<CartResponse> {
  const { data } = await api.delete<CartResponse>(API_ROUTES.cartItem(String(productId)));
  return data;
}

export async function clearCartApi(): Promise<CartResponse> {
  const { data } = await api.delete<CartResponse>(API_ROUTES.cart);
  return data;
}
