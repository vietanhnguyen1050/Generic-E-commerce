// FE — filter danh mục, dữ liệu hoàn toàn từ backend trả về (không hardcode).
import { CategoryIcon } from "@/frontend/components/site/CategoryTile";
import { Skeleton } from "@/components/ui/skeleton";
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
      <CategoryRow
        label="Tất cả danh mục"
        count={total}
        active={!value}
        onClick={() => onChange(undefined)}
      />
      {categories.map((c) => (
        <CategoryRow
          key={c.slug}
          label={c.name}
          icon={c.icon}
          count={counts?.[c.slug] ?? 0}
          active={value === c.slug}
          onClick={() => onChange(value === c.slug ? undefined : c.slug)}
        />
      ))}
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
        active ? "bg-ink text-ink-foreground" : "hover:bg-accent"
      }`}
    >
      {icon ? <CategoryIcon name={icon} className="size-4 shrink-0 opacity-80" /> : null}
      <span className="flex-1 leading-snug">{label}</span>
      {typeof count === "number" && (
        <span className={`text-xs ${active ? "opacity-80" : "text-muted-foreground"}`}>{count}</span>
      )}
    </button>
  );
}
