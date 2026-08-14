// BE — tầng truy cập dữ liệu (in-memory). Đổi sang DB thật chỉ cần sửa file này.
import { categories, products } from "@/backend/data/products";
import type { Category, Product, ProductQuery } from "@/shared/types";

// Bỏ dấu để tìm kiếm không phụ thuộc dấu tiếng Việt.
function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

export function findCategories(): Category[] {
  return categories;
}

// Khoảng giá thực tế của toàn bộ catalog — FE dùng để dựng thanh trượt động.
export function findPriceBounds(): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

// Đếm số sản phẩm mỗi danh mục theo các filter khác (trừ chính filter danh mục).
export function countByCategory(query: ProductQuery = {}): Record<string, number> {
  const rest: ProductQuery = { ...query, category: undefined, limit: undefined, offset: undefined };
  const counts: Record<string, number> = {};
  for (const p of findAllMatching(rest)) {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  }
  return counts;
}

// Danh sách đã filter + sort, chưa phân trang.
export function findAllMatching(query: ProductQuery = {}): Product[] {
  const q = query.q ? normalize(query.q) : undefined;

  let result = products.filter((p) => {
    const haystack = normalize(`${p.name} ${p.brand} ${p.category} ${p.description}`);
    const matchQ = !q || haystack.includes(q);
    const matchCat = !query.category || p.category === query.category;
    const matchMin = query.minPrice === undefined || p.price >= query.minPrice;
    const matchMax = query.maxPrice === undefined || p.price <= query.maxPrice;
    return matchQ && matchCat && matchMin && matchMax;
  });

  switch (query.sort) {
    case "moi-nhat":
      result = [...result].reverse();
      break;
    case "danh-gia":
      result = [...result].sort((a, b) => b.rating - a.rating);
      break;
    case "gia-tang":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "gia-giam":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "pho-bien":
    default:
      result = [...result].sort((a, b) => b.sold - a.sold);
      break;
  }

  return result;
}

// Áp dụng offset/limit lên tập kết quả.
export function findProducts(query: ProductQuery = {}): Product[] {
  const all = findAllMatching(query);
  const offset = query.offset ?? 0;
  return typeof query.limit === "number" ? all.slice(offset, offset + query.limit) : all.slice(offset);
}

export function countProducts(query: ProductQuery = {}): number {
  return findAllMatching(query).length;
}


export function findProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
