// FE — filter danh mục: hiển thị 5 danh mục nhiều sản phẩm nhất, danh mục còn lại nằm trong dropdown/collapsible mở rộng.
import { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CategoryIcon } from "@/frontend/components/site/CategoryTile";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Category } from "@/shared/types";

export function CategoryFilter({
  categories,
  counts,
  value,
  total,
  isLoading,
  onChange,
}: {
  categories: Category[];
  counts?: Record<string, number> | undefined;
  value?: string | undefined;
  total?: number | undefined;
  isLoading?: boolean | undefined;
  onChange: (slug: string | undefined) => void;
}) {
  // Sắp xếp danh mục theo số lượng sản phẩm giảm dần
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const countA = counts?.[a.slug] ?? 0;
      const countB = counts?.[b.slug] ?? 0;
      return countB - countA;
    });
  }, [categories, counts]);

  const topCategories = useMemo(() => sortedCategories.slice(0, 5), [sortedCategories]);
  const remainingCategories = useMemo(() => sortedCategories.slice(5), [sortedCategories]);

  // Kiểm tra xem danh mục đang chọn có nằm trong nhóm mở rộng không
  const isSelectedInRemaining = useMemo(() => {
    return Boolean(value && remainingCategories.some((c) => c.slug === value));
  }, [value, remainingCategories]);

  // Tự động mở dropdown nếu danh mục đang chọn nằm ở phần mở rộng
  const [isOpen, setIsOpen] = useState(isSelectedInRemaining);

  useEffect(() => {
    if (isSelectedInRemaining) {
      setIsOpen(true);
    }
  }, [isSelectedInRemaining]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Tất cả danh mục */}
      <CategoryRow
        label="Tất cả danh mục"
        count={total}
        active={!value}
        onClick={() => onChange(undefined)}
      />

      {/* Top 5 danh mục nhiều sản phẩm nhất */}
      {topCategories.map((c) => (
        <CategoryRow
          key={c.slug}
          label={c.name}
          icon={c.icon}
          count={counts?.[c.slug] ?? 0}
          active={value === c.slug}
          onClick={() => onChange(value === c.slug ? undefined : c.slug)}
        />
      ))}

      {/* Dropdown mở rộng cho các danh mục còn lại */}
      {remainingCategories.length > 0 && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="pt-1">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide text-teal hover:bg-teal/10 transition-colors"
            >
              <span>
                {isOpen
                  ? "Thu gọn danh mục"
                  : `Xem thêm (${remainingCategories.length} danh mục)`}
              </span>
              {isOpen ? (
                <ChevronUp className="size-4 shrink-0 text-teal" />
              ) : (
                <ChevronDown className="size-4 shrink-0 text-teal" />
              )}
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-1 pt-1 max-h-72 overflow-y-auto pr-1">
            {remainingCategories.map((c) => (
              <CategoryRow
                key={c.slug}
                label={c.name}
                icon={c.icon}
                count={counts?.[c.slug] ?? 0}
                active={value === c.slug}
                onClick={() => onChange(value === c.slug ? undefined : c.slug)}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

function CategoryRow({
  label,
  icon,
  count,
  active,
  onClick,
}: {
  label: string;
  icon?: string | undefined;
  count?: number | undefined;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
        active ? "bg-ink text-ink-foreground font-medium" : "hover:bg-accent"
      }`}
    >
      {icon ? <CategoryIcon name={icon} className="size-4 shrink-0 opacity-80" /> : null}
      <span className="flex-1 leading-snug truncate">{label}</span>
      {typeof count === "number" && (
        <span className={`text-xs ${active ? "opacity-90 font-medium" : "text-muted-foreground"}`}>
          {count.toLocaleString("vi-VN")}
        </span>
      )}
    </button>
  );
}
