import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/frontend/components/site/SiteLayout";
import { useCart } from "@/frontend/lib/cart";
import { FREE_SHIPPING_THRESHOLD, calcShippingFee } from "@/shared/constants";
import { formatVnd } from "@/shared/format";

export function CartPage() {
  const { lines, subtotal, savings, setQty, remove } = useCart();
  const shippingFee = calcShippingFee(subtotal, "standard");

  if (lines.length === 0) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="mx-auto size-12 text-muted-foreground" />
          <h1 className="mt-4 font-display text-2xl font-bold">Giỏ hàng đang trống</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Khám phá hàng nghìn sản phẩm đang giảm giá hôm nay.
          </p>
          <Button variant="brand" className="mt-6" asChild>
            <Link to="/san-pham">Bắt đầu mua sắm</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Giỏ hàng của bạn</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            {lines.map((l) => (
              <div
                key={l.id}
                className="flex gap-4 rounded-xl border border-border bg-surface p-4"
              >
                <img
                  src={l.image}
                  alt={l.name}
                  width={120}
                  height={120}
                  className="size-24 shrink-0 rounded-lg bg-white object-contain p-1"
                />
                <div className="flex flex-1 flex-col">
                  <Link
                    to="/san-pham/$id"
                    params={{ id: l.id }}
                    className="line-clamp-2 text-sm font-medium hover:text-teal"
                  >
                    {l.name}
                  </Link>
                  <p className="mt-1 text-base font-bold text-foreground">{formatVnd(l.price)}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-border">
                      <button
                        aria-label="Giảm"
                        className="px-2.5 py-1.5 hover:bg-accent"
                        onClick={() => setQty(l.id, l.qty - 1)}
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold">{l.qty}</span>
                      <button
                        aria-label="Tăng"
                        className="px-2.5 py-1.5 hover:bg-accent"
                        onClick={() => setQty(l.id, l.qty + 1)}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(l.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" /> Xoá
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-40">
            <h2 className="font-display text-lg font-bold">Tóm tắt đơn hàng</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tạm tính</dt>
                <dd>{formatVnd(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tiết kiệm</dt>
                <dd className="text-teal">-{formatVnd(savings)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Phí vận chuyển</dt>
                <dd>{shippingFee === 0 ? "Miễn phí" : formatVnd(shippingFee)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                <dt>Tổng cộng</dt>
                <dd className="text-foreground">{formatVnd(subtotal + shippingFee)}</dd>
              </div>
            </dl>
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="mt-3 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
                Mua thêm {formatVnd(FREE_SHIPPING_THRESHOLD - subtotal)} để được miễn phí vận chuyển.
              </p>
            )}
            <Button variant="brand" size="lg" className="mt-5 w-full" asChild>
              <Link to="/thanh-toan">Tiến hành thanh toán</Link>
            </Button>
            <Button variant="ghost" className="mt-2 w-full" asChild>
              <Link to="/san-pham">Tiếp tục mua sắm</Link>
            </Button>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
