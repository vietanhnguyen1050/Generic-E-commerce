import { Link, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryFilter } from "@/frontend/components/site/CategoryFilter";
import { PriceRangeFilter } from "@/frontend/components/site/PriceRangeFilter";
import { InfiniteProductGrid } from "@/frontend/components/site/InfiniteProductGrid";

import { SiteLayout } from "@/frontend/components/site/SiteLayout";
import { useProducts } from "@/frontend/api/hooks";
import { SORT_OPTIONS } from "@/shared/constants";
import { formatVnd } from "@/shared/format";
import type { ProductSort } from "@/shared/types";

export type ProductsSearch = {
  q?: string | undefined;
  danh_muc?: string | undefined;
  sap_xep?: ProductSort | undefined;
  gia_min?: number | undefined;
  gia_max?: number | undefined;
};

export function ProductsPage({ search }: { search: ProductsSearch }) {
  const navigate = useNavigate();

  const query = {
    q: search.q,
    category: search.danh_muc,
    sort: search.sap_xep,
    minPrice: search.gia_min,
    maxPrice: search.gia_max,
  };

  // Query nhẹ chỉ để lấy facet (danh mục, khoảng giá, tổng số) cho sidebar.
  const { data, isPending, isError } = useProducts({ ...query, limit: 1 });

  const categories = data?.categories ?? [];
  const bounds = data?.priceBounds ?? { min: 0, max: 0 };
  const total = data?.total ?? 0;
  const totalAll = data ? Object.values(data.categoryCounts).reduce((s, n) => s + n, 0) : undefined;
  const activeCategory = categories.find((c) => c.slug === search.danh_muc);


  const update = (patch: Partial<ProductsSearch>) =>
    navigate({ to: "/san-pham", search: { ...search, ...patch } });

  const chips: { key: keyof ProductsSearch | "gia"; label: string; clear: Partial<ProductsSearch> }[] =
    [];
  if (search.q) chips.push({ key: "q", label: `Từ khoá: ${search.q}`, clear: { q: undefined } });
  if (activeCategory)
    chips.push({ key: "danh_muc", label: activeCategory.name, clear: { danh_muc: undefined } });
  if (search.gia_min !== undefined || search.gia_max !== undefined)
    chips.push({
      key: "gia",
      label: `${formatVnd(search.gia_min ?? bounds.min)} – ${formatVnd(search.gia_max ?? bounds.max)}`,
      clear: { gia_min: undefined, gia_max: undefined },
    });

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-teal">
            Trang chủ
          </Link>
          <span className="mx-1">/</span>
          <span className="text-foreground">{activeCategory?.name ?? "Tất cả sản phẩm"}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[264px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-surface p-4">
              <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide">
                <SlidersHorizontal className="size-4" /> Bộ lọc
              </h2>

              <Separator className="my-4" />

              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Danh mục
              </h3>
              <CategoryFilter
                categories={categories}
                counts={data?.categoryCounts}
                total={totalAll}
                value={search.danh_muc}
                isLoading={isPending && categories.length === 0}
                onChange={(slug) => update({ danh_muc: slug })}
              />

              <Separator className="my-4" />

              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Khoảng giá
              </h3>
              {isPending && !data ? (
                <Skeleton className="h-28 rounded-md" />
              ) : (
                <PriceRangeFilter
                  bounds={bounds}
                  min={search.gia_min}
                  max={search.gia_max}
                  onChange={({ min, max }) => update({ gia_min: min, gia_max: max })}
                />
              )}
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4">
              <div>
                <h1 className="font-display text-xl font-bold tracking-tight">
                  {search.q
                    ? `Kết quả cho “${search.q}”`
                    : (activeCategory?.name ?? "Tất cả sản phẩm")}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {isPending ? "Đang tải…" : `${total.toLocaleString("vi-VN")} sản phẩm`}
                </p>

              </div>
              <Select
                value={search.sap_xep ?? "pho-bien"}
                onValueChange={(v) => update({ sap_xep: v as ProductSort })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {chips.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {chips.map((chip) => (
                  <Badge
                    key={chip.key}
                    variant="secondary"
                    className="cursor-pointer gap-1 py-1"
                    onClick={() => update(chip.clear)}
                  >
                    {chip.label}
                    <X className="size-3" />
                  </Badge>
                ))}
                <button
                  className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                  onClick={() => navigate({ to: "/san-pham", search: {} })}
                >
                  Xoá tất cả
                </button>
              </div>
            )}

            {isError && (
              <p className="mt-8 text-sm text-destructive">
                Không tải được bộ lọc. Vui lòng thử lại.
              </p>
            )}

            <div className="mt-5">
              <InfiniteProductGrid
                query={query}
                pageSize={12}
                gridClassName="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                emptyDescription="Thử bỏ bộ lọc hoặc tìm với từ khoá khác."
                emptyAction={
                  <Button variant="outline" onClick={() => navigate({ to: "/san-pham", search: {} })}>
                    Xoá bộ lọc
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );

}
