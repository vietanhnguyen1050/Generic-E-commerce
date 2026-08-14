// Kiểu dữ liệu dùng chung cho cả frontend và backend.

export type SubCategory = {
  slug: string;
  name: string;
};

export type Category = {
  slug: string;
  name: string;
  icon: string;
  /** Danh mục phụ thuộc danh mục chính này. */
  sub: SubCategory[];
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string; // slug của danh mục chính
  subcategory: string; // slug của danh mục phụ
  price: number;
  listPrice: number;
  image: string;
  rating: number;
  reviews: number;
  sold: number;
  stock: number;
  freeShip: boolean;
  description: string;
  highlights: string[];
};


export type ProductSort = "pho-bien" | "moi-nhat" | "gia-tang" | "gia-giam" | "danh-gia";

export type ProductQuery = {
  q?: string | undefined;
  category?: string | undefined;
  sort?: ProductSort | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
};

export type PriceBounds = {
  min: number;
  max: number;
};

export type ProductListResponse = {
  items: Product[];
  /** Tổng số sản phẩm khớp filter (không tính offset/limit). */
  total: number;
  /** Offset của trang hiện tại. */
  offset: number;
  /** Còn dữ liệu để tải tiếp hay không. */
  hasMore: boolean;
  categories: Category[];
  priceBounds: PriceBounds;
  /** Số sản phẩm theo từng danh mục (bỏ qua filter danh mục hiện tại). */
  categoryCounts: Record<string, number>;
};

export type ProductDetailResponse = {
  product: Product;
  related: Product[];
  /** Danh mục chính của sản phẩm (kèm toàn bộ danh mục phụ). */
  mainCategory: Category | null;
  /** Danh mục phụ của sản phẩm. */
  subcategory: SubCategory | null;
};


export type OrderItemInput = {
  id: string;
  qty: number;
};

export type OrderInput = {
  fullName: string;
  phone: string;
  email?: string | undefined;
  address: string;
  note?: string | undefined;
  shippingMethod: "standard" | "express";
  paymentMethod: "cod" | "bank" | "momo" | "card";
  items: OrderItemInput[];
  userId?: string | undefined;
};

export type Order = {
  id: string;
  createdAt: string;
  customer: Omit<OrderInput, "items">;
  items: { id: string; name: string; image: string; qty: number; price: number }[];
  subtotal: number;
  shippingFee: number;
  total: number;
};

export type ApiError = {
  message: string;
  details?: unknown;
};
