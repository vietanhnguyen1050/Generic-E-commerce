/**
 * products.adapter.ts
 *
 * Dịch data thô từ BE (Prisma schema) → kiểu FE (Product, Category, ...).
 * Đây là điểm duy nhất cần chỉnh khi schema BE thay đổi —
 * không cần đụng đến component hay hook nào khác.
 */

import type {
  Product,
  Category,
  SubCategory,
  ProductListResponse,
  ProductDetailResponse,
} from "@/shared/types";

// ─── Raw types từ BE ──────────────────────────────────────────────────────────

export type BeProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;        // mainCategory.mainCategory
  subcategory: string;     // subCategory.subCategory
  price: number;           // discountPrice
  listPrice: number;       // actualPrice
  image: string;           // imageUrl
  rating: number;          // ratings
  reviews: number;         // numberOfRatings
  sold: number;            // 0
  stock: number;           // quantity
  freeShip: boolean;       // false
  description: string;     // ""
  highlights: string[];    // []
};

export type BeSubCategory = {
  slug: string;
  name: string;
};

export type BeCategory = {
  slug: string;
  name: string;
  icon: string;
  sub: BeSubCategory[];
};

export type BeProductListResponse = {
  items: BeProduct[];
  total: number;
  offset: number;
  hasMore: boolean;
  categories: BeCategory[];
  priceBounds: { min: number; max: number };
  categoryCounts: Record<string, number>;
};

export type BeProductDetailResponse = {
  product: BeProduct;
  related: BeProduct[];
  mainCategory: BeCategory | null;
  subcategory: BeSubCategory | null;
};

// ─── Helpers: Format chuỗi ───────────────────────────────────────────────────

/**
 * Viết hoa chữ cái đầu cho mỗi từ trong tên danh mục (Title Case).
 * Ví dụ: "tv, audio & cameras" → "Tv, Audio & Cameras", "accessories" → "Accessories"
 */
export function formatCategoryName(name: string): string {
  if (!name) return "";
  return name.replace(/\b([a-zà-ỹ])/gi, (char) => char.toUpperCase());
}

/** Gợi ý icon phù hợp cho danh mục nếu BE chưa có icon */
function resolveCategoryIcon(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("audio") || lower.includes("tv") || lower.includes("camera") || lower.includes("music"))
    return "Headphones";
  if (lower.includes("cloth") || lower.includes("fashion") || lower.includes("shoe"))
    return "Shirt";
  if (lower.includes("baby") || lower.includes("toy") || lower.includes("kid"))
    return "Baby";
  if (lower.includes("sport") || lower.includes("fitness") || lower.includes("gym"))
    return "Dumbbell";
  if (lower.includes("home") || lower.includes("kitchen") || lower.includes("appliance"))
    return "Lamp";
  if (lower.includes("tech") || lower.includes("electronic") || lower.includes("computer"))
    return "Laptop";
  if (lower.includes("phone"))
    return "Smartphone";
  return "Sparkles";
}

// ─── Adapter functions ────────────────────────────────────────────────────────

export function toProduct(raw: BeProduct): Product {
  return {
    id: String(raw.id),
    name: raw.name,
    brand: raw.brand ?? "",
    category: raw.category,
    subcategory: raw.subcategory,
    price: raw.price,
    listPrice: raw.listPrice > 0 ? raw.listPrice : raw.price,
    image: raw.image?.trim() ? raw.image : "/products/placeholder.svg",
    rating: raw.rating,
    reviews: raw.reviews,
    sold: raw.sold ?? 0,
    stock: raw.stock,
    freeShip: raw.freeShip ?? false,
    description: raw.description ?? "",
    highlights: raw.highlights ?? [],
  };
}

export function toSubCategory(raw: BeSubCategory): SubCategory {
  return {
    slug: raw.slug,
    name: formatCategoryName(raw.name),
  };
}

export function toCategory(raw: BeCategory): Category {
  return {
    slug: raw.slug,
    name: formatCategoryName(raw.name),
    icon: raw.icon || resolveCategoryIcon(raw.name),
    sub: (raw.sub ?? []).map(toSubCategory),
  };
}

export function toProductListResponse(raw: BeProductListResponse): ProductListResponse {
  return {
    items: (raw.items ?? []).map(toProduct),
    total: raw.total ?? 0,
    offset: raw.offset ?? 0,
    hasMore: Boolean(raw.hasMore),
    categories: (raw.categories ?? []).map(toCategory),
    priceBounds: raw.priceBounds ?? { min: 0, max: 0 },
    categoryCounts: raw.categoryCounts ?? {},
  };
}

export function toProductDetailResponse(raw: BeProductDetailResponse): ProductDetailResponse {
  return {
    product: toProduct(raw.product),
    related: (raw.related ?? []).map(toProduct),
    mainCategory: raw.mainCategory ? toCategory(raw.mainCategory) : null,
    subcategory: raw.subcategory ? toSubCategory(raw.subcategory) : null,
  };
}

// ─── Hàm toData dịch tổng quát từ BE ─────────────────────────────────────────

export function toData(raw: BeProductListResponse): ProductListResponse;
export function toData(raw: BeProductDetailResponse): ProductDetailResponse;
export function toData(raw: BeProduct): Product;
export function toData(raw: BeCategory): Category;
export function toData(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;

  // Dạng danh sách sản phẩm
  if ("items" in raw && Array.isArray((raw as BeProductListResponse).items)) {
    return toProductListResponse(raw as BeProductListResponse);
  }

  // Dạng chi tiết sản phẩm
  if ("product" in raw && typeof (raw as BeProductDetailResponse).product === "object") {
    return toProductDetailResponse(raw as BeProductDetailResponse);
  }

  // Dạng 1 sản phẩm đơn lẻ
  if ("id" in raw && "name" in raw && "price" in raw) {
    return toProduct(raw as BeProduct);
  }

  // Dạng 1 danh mục
  if ("slug" in raw && "name" in raw && "sub" in raw) {
    return toCategory(raw as BeCategory);
  }

  return raw;
}
