// Hằng số nghiệp vụ dùng chung FE/BE.

export const STORE_NAME = "Zenova";
export const CURRENCY = "VND";

export const FREE_SHIPPING_THRESHOLD = 500_000;
export const SHIPPING_FEE_STANDARD = 25_000;
export const SHIPPING_FEE_EXPRESS = 55_000;

export const API_ROUTES = {
  products: "/api/products",
  product: (id: string) => `/api/products/${id}`,
  orders: "/api/orders",
  cart: "/api/cart",
  cartItem: (productId: string) => `/api/cart/items/${productId}`,
} as const;

export const SORT_OPTIONS = [
  { value: "pho-bien", label: "Phổ biến" },
  { value: "moi-nhat", label: "Mới nhất" },
  { value: "danh-gia", label: "Đánh giá cao" },
  { value: "gia-tang", label: "Giá thấp đến cao" },
  { value: "gia-giam", label: "Giá cao đến thấp" },
] as const;

export function calcShippingFee(subtotal: number, method: "standard" | "express") {
  if (method === "express") return SHIPPING_FEE_EXPRESS;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE_STANDARD;
}
