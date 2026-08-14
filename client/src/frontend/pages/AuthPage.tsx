import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteLayout } from "@/frontend/components/site/SiteLayout";
import { useAuth } from "@/frontend/lib/auth";
import { STORE_NAME } from "@/shared/constants";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: ""});
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (isLogin) await signIn(form.email, form.password);
      else await signUp(form.name, form.email, form.password);
      toast.success(isLogin ? "Đăng nhập thành công" : "Tạo tài khoản thành công");
      navigate({ to: "/" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xác thực");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteLayout>
      <div className="container mx-auto max-w-md px-4 py-14">
        <div className="rounded-2xl border border-border bg-surface p-8">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {isLogin ? `Đăng nhập ${STORE_NAME}` : "Tạo tài khoản mới"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLogin
              ? "Đăng nhập để theo dõi đơn hàng và thanh toán nhanh hơn."
              : "Chỉ mất một phút để bắt đầu mua sắm."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  required
                  maxLength={80}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                maxLength={120}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                maxLength={72}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <Button type="submit" variant="brand" size="lg" className="w-full" disabled={busy}>
              {busy ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> hoặc <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              try {
                await signInWithGoogle();
                navigate({ to: "/" });
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Không thể đăng nhập Google");
              }
            }}
          >
            Tiếp tục với Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? (
              <>
                Chưa có tài khoản?{" "}
                <Link to="/dang-ky" className="font-medium text-teal hover:underline">
                  Đăng ký ngay
                </Link>
              </>
            ) : (
              <>
                Đã có tài khoản?{" "}
                <Link to="/dang-nhap" className="font-medium text-teal hover:underline">
                  Đăng nhập
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
