import { Link } from "@tanstack/react-router";
import { Baby, Dumbbell, Headphones, Lamp, Laptop, Shirt, Smartphone, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Headphones,
  Laptop,
  Smartphone,
  Shirt,
  Lamp,
  Dumbbell,
  Sparkles,
  Baby,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = CATEGORY_ICONS[name] ?? Sparkles;
  return <Icon className={className} />;
}

export function CategoryTile({
  slug,
  name,
  icon,
}: {
  slug: string;
  name: string;
  icon: string;
}) {
  return (
    <Link
      to="/san-pham"
      search={{ danh_muc: slug }}
      className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 text-center transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-lift"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
        <CategoryIcon name={icon} className="size-5" />
      </span>
      <span className="text-xs font-medium leading-snug">{name}</span>
    </Link>
  );
}
