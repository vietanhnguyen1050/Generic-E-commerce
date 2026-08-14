import { useEffect, useRef } from "react";
import { CheckCircle2, Loader2, PackageSearch, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/frontend/components/site/ProductCard";
import { ProductCardSkeleton } from "@/frontend/components/site/ProductCardSkeleton";
import { useInfiniteProducts } from "@/frontend/api/hooks";
import { cn } from "@/lib/utils";
import type { ProductQuery } from "@/shared/types";

/** Lưới sản phẩm tự tải thêm khi người dùng lướt tới cuối danh sách. */
export function InfiniteProductGrid({
  query = {},
  pageSize = 12,
  gridClassName = "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
  emptyTitle = "Không tìm thấy sản phẩm phù hợp",
  emptyDescription = "Thử bỏ bớt bộ lọc hoặc tìm với từ khoá khác.",
  emptyAction,
  onTotalChange,
}: {
  query?: ProductQuery;
  pageSize?: number;
  gridClassName?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  onTotalChange?: (total: number) => void;
}) {
  const {
    data,
    isPending,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteProducts(query, pageSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  useEffect(() => {
    if (data) onTotalChange?.(total);
  }, [data, total, onTotalChange]);

  if (isError) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center">
        <p className="font-medium text-destructive">Không tải được danh sách sản phẩm</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Kết nối có thể bị gián đoạn. Vui lòng thử lại.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => void refetch()}>
          <RefreshCw className="size-4" /> Tải lại
        </Button>
      </div>
    );
  }

  if (!isPending && items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center">
        <PackageSearch className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 font-medium">{emptyTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
        {emptyAction && <div className="mt-4">{emptyAction}</div>}
      </div>
    );
  }

  return (
    <div>
      <div className={cn(gridClassName)}>
        {isPending
          ? Array.from({ length: pageSize }).map((_, i) => <ProductCardSkeleton key={`init-${i}`} />)
          : items.map((p) => <ProductCard key={p.id} product={p} />)}
        {isFetchingNextPage &&
          Array.from({ length: Math.min(pageSize, 4) }).map((_, i) => (
            <ProductCardSkeleton key={`next-${i}`} />
          ))}
      </div>

      <div ref={sentinelRef} className="h-1" aria-hidden="true" />

      <div
        className="mt-8 flex flex-col items-center gap-3 text-sm text-muted-foreground"
        aria-live="polite"
      >
        {isFetchingNextPage && (
          <p className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" /> Đang tải thêm sản phẩm…
          </p>
        )}
        {!isPending && hasNextPage && !isFetchingNextPage && (
          <Button variant="outline" onClick={() => void fetchNextPage()}>
            Xem thêm sản phẩm
          </Button>
        )}
        {!isPending && !hasNextPage && items.length > 0 && (
          <p className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-teal" />
            Bạn đã xem hết {items.length.toLocaleString("vi-VN")}/{total.toLocaleString("vi-VN")} sản
            phẩm
          </p>
        )}
      </div>
    </div>
  );
}
