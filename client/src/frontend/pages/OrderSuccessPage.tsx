import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/frontend/components/site/SiteLayout";
import { formatVnd } from "@/shared/format";
import type { Order } from "@/shared/types";

export function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem("zenova.lastOrder");
      if (raw) setOrder(JSON.parse(raw) as Order);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <SiteLayout>
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <CheckCircle2 className="mx-auto size-12 text-teal" />
          <h1 className="mt-4 font-display text-2xl font-bold">Đặt hàng thành công!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cảm ơn bạn đã mua sắm tại Zenova. Chúng tôi sẽ liên hệ để xác nhận đơn hàng.
          </p>
          {order && (
            <div className="mt-6 rounded-xl bg-secondary p-5 text-left text-sm">
              <p className="font-semibold">
                Mã đơn hàng: <span className="text-foreground">{order.id}</span>
              </p>
              <ul className="mt-3 space-y-2">
                {order.items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      {i.name} × {i.qty}
                    </span>
                    <span>{formatVnd(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex justify-between border-t border-border pt-3 font-bold">
                <span>Tổng cộng</span>
                <span className="text-foreground">{formatVnd(order.total)}</span>
              </p>
            </div>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="brand" asChild>
              <Link to="/san-pham">Tiếp tục mua sắm</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Về trang chủ</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
