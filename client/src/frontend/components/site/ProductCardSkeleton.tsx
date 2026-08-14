import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Khung xương mô phỏng đúng bố cục ProductCard để tránh giật layout khi tải. */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("overflow-hidden rounded-xl border border-border bg-surface p-3", className)}
      aria-hidden="true"
    >
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
