import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { SiteLayout } from "@/frontend/components/site/SiteLayout";
import { useCreateOrder } from "@/frontend/api/hooks";
import { getApiErrorMessage } from "@/frontend/api/client";
import { useAuth } from "@/frontend/lib/auth";
import { useCart } from "@/frontend/lib/cart";
import { calcShippingFee } from "@/shared/constants";
import { formatVnd } from "@/shared/format";

export function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();

  const [form, setForm] = useState({
    fullName: user?.displayName ?? "",
    phone: "",
    email: user?.email ?? "",
    address: "",
    note: "",
  });
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank" | "momo" | "card">("cod");

  const shippingFee = calcShippingFee(subtotal, shippingMethod);
  const total = subtotal + shippingFee;

  if (lines.length === 0) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Chưa có sản phẩm để thanh toán</h1>
          <Button variant="brand" className="mt-6" asChild>
            <Link to="/san-pham">Mua sắm ngay</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const order = await createOrder.mutateAsync({
        ...form,
        shippingMethod,
        paymentMethod,
        items: lines.map((l) => ({ id: l.id, qty: l.qty })),
      });
      window.sessionStorage.setItem("zenova.lastOrder", JSON.stringify(order));
      clear();
      navigate({ to: "/dat-hang-thanh-cong" });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <SiteLayout>
      <form onSubmit={submit} className="container mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Thanh toán</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-bold">Thông tin nhận hàng</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <Input
                    id="fullName"
                    required
                    maxLength={80}
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    required
                    maxLength={15}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    maxLength={120}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Địa chỉ *</Label>
                  <Input
                    id="address"
                    required
                    maxLength={300}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Textarea
                    id="note"
                    maxLength={500}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-bold">Phương thức vận chuyển</h2>
              <RadioGroup
                value={shippingMethod}
                onValueChange={(v) => setShippingMethod(v as "standard" | "express")}
                className="mt-4 gap-3"
              >
                {[
                  { value: "standard", label: "Tiêu chuẩn (2-4 ngày)" },
                  { value: "express", label: "Hoả tốc (trong 24h)" },
                ].map((o) => (
                  <label
                    key={o.value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-sm"
                  >
                    <RadioGroupItem value={o.value} />
                    {o.label}
                  </label>
                ))}
              </RadioGroup>
            </section>

            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-bold">Phương thức thanh toán</h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as typeof paymentMethod)}
                className="mt-4 gap-3"
              >
                {[
                  { value: "cod", label: "Thanh toán khi nhận hàng (COD)" },
                  { value: "bank", label: "Chuyển khoản ngân hàng" },
                  { value: "momo", label: "Ví MoMo" },
                  { value: "card", label: "Thẻ tín dụng / ghi nợ" },
                ].map((o) => (
                  <label
                    key={o.value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-sm"
                  >
                    <RadioGroupItem value={o.value} />
                    {o.label}
                  </label>
                ))}
              </RadioGroup>
            </section>
          </div>

          <aside className="h-fit rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-40">
            <h2 className="font-display text-lg font-bold">Đơn hàng</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {lines.map((l) => (
                <li key={l.id} className="flex justify-between gap-3">
                  <span className="line-clamp-2 text-muted-foreground">
                    {l.name} × {l.qty}
                  </span>
                  <span className="shrink-0">{formatVnd(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tạm tính</dt>
                <dd>{formatVnd(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Vận chuyển</dt>
                <dd>{shippingFee === 0 ? "Miễn phí" : formatVnd(shippingFee)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                <dt>Tổng cộng</dt>
                <dd className="text-foreground">{formatVnd(total)}</dd>
              </div>
            </dl>
            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="mt-5 w-full"
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? "Đang xử lý..." : "Đặt hàng"}
            </Button>
          </aside>
        </div>
      </form>
    </SiteLayout>
  );
}
