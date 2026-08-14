import { Link, useNavigate } from "@tanstack/react-router";
import { Check, Minus, Plus, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/frontend/components/site/ProductCard";
import { SiteLayout } from "@/frontend/components/site/SiteLayout";
import { useProduct } from "@/frontend/api/hooks";
import { useCart } from "@/frontend/lib/cart";
import { formatVnd } from "@/shared/format";

export function ProductDetailPage({ id }: { id: string }) {
  const { data, isPending, isError } = useProduct(id);
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  if (isPending) {
    return (
      <SiteLayout>
        <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (isError || !data) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Không tìm thấy sản phẩm</h1>
          <Button variant="brand" className="mt-6" asChild>
            <Link to="/san-pham">Về trang sản phẩm</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const { product, related, mainCategory, subcategory } = data;
  const discount = Math.round((1 - product.price / product.listPrice) * 100);
  const inStock = product.stock > 0;

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-teal">
            Trang chủ
          </Link>
          <span className="mx-1">/</span>
          <Link to="/san-pham" search={{ danh_muc: product.category }} className="hover:text-teal">
            {mainCategory?.name ?? product.category}
          </Link>
          {subcategory && (
            <>
              <span className="mx-1">/</span>
              <span>{subcategory.name}</span>
            </>
          )}
          <span className="mx-1">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-border bg-white p-6">
            <img
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              className="mx-auto aspect-square w-full max-w-lg object-contain"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {product.brand}
              {mainCategory && <span> · {mainCategory.name}</span>}
              {subcategory && <span> · {subcategory.name}</span>}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.round(product.rating)
                        ? "size-4 fill-brand text-brand"
                        : "size-4 text-muted-foreground/40"
                    }
                  />
                ))}
                <strong className="ml-1 text-foreground">{product.rating.toFixed(1)}</strong>
              </span>
              <span>·</span>
              <span>{product.reviews.toLocaleString("vi-VN")} đánh giá</span>
            </div>

            <div className="mt-5 rounded-xl bg-secondary p-5">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold text-brand">{formatVnd(product.price)}</span>
                <span className="text-muted-foreground line-through">
                  {formatVnd(product.listPrice)}
                </span>
                {discount > 0 && (
                  <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-brand-foreground">
                    -{discount}%
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="mt-1 text-xs text-teal">
                  Tiết kiệm {formatVnd(product.listPrice - product.price)} so với giá gốc
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {inStock ? `Còn ${product.stock.toLocaleString("vi-VN")} sản phẩm trong kho` : "Tạm thời hết hàng"}
              </p>
            </div>

            {mainCategory && mainCategory.sub.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Danh mục phụ trong {mainCategory.name}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mainCategory.sub.map((s) => (
                    <Link
                      key={s.slug}
                      to="/san-pham"
                      search={{ danh_muc: mainCategory.slug }}
                      className={
                        s.slug === subcategory?.slug
                          ? "rounded-full border border-teal bg-teal/10 px-3 py-1 text-xs font-medium text-teal"
                          : "rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-teal hover:text-teal"
                      }
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}


            <ul className="mt-5 space-y-2 text-sm">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-teal" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-border">
                <button
                  aria-label="Giảm số lượng"
                  className="px-3 py-2 hover:bg-accent"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button
                  aria-label="Tăng số lượng"
                  className="px-3 py-2 hover:bg-accent"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                Tạm tính: <strong className="text-foreground">{formatVnd(product.price * qty)}</strong>
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                variant="brand"
                size="lg"
                disabled={!inStock}
                onClick={() => {
                  add(product, qty);
                  toast.success("Đã thêm vào giỏ hàng", { description: product.name });
                }}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled={!inStock}
                onClick={() => {
                  add(product, qty);
                  navigate({ to: "/thanh-toan" });
                }}
              >
                Mua ngay
              </Button>

            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Truck, text: "Giao nhanh 2-4 ngày" },
                { icon: ShieldCheck, text: "Bảo hành 12 tháng" },
                { icon: RotateCcw, text: "Đổi trả 30 ngày" },
              ].map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3 text-xs"
                >
                  <f.icon className="size-4 text-teal" />
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-12 rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-bold">Mô tả sản phẩm</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold tracking-tight">Sản phẩm liên quan</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
