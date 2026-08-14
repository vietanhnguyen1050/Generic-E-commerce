import { Link } from "@tanstack/react-router";
import { Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/frontend/lib/cart";
import { formatVnd } from "@/shared/format";
import type { Product } from "@/shared/types";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const discount = Math.round((1 - product.price / product.listPrice) * 100);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <Link
        to="/san-pham/$id"
        params={{ id: product.id }}
        className="relative block overflow-hidden bg-white"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="aspect-square w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-brand-foreground">
            -{discount}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 border-t border-border p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>
        <Link to="/san-pham/$id" params={{ id: product.id }}>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug hover:text-teal">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-brand text-brand" />
          {product.rating.toFixed(1)}
          <span>· Đã bán {product.sold.toLocaleString("vi-VN")}</span>
        </div>
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-foreground">{formatVnd(product.price)}</span>
            <span className="text-xs text-muted-foreground line-through">
              {formatVnd(product.listPrice)}
            </span>
          </div>
          {product.freeShip && (
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-teal">
              <Truck className="size-3.5" /> Miễn phí vận chuyển
            </p>
          )}
          <Button
            variant="brand"
            size="sm"
            className="mt-3 w-full"
            onClick={() => {
              add(product);
              toast.success("Đã thêm vào giỏ hàng", { description: product.name });
            }}
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </article>
  );
}
