import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/frontend/components/site/SiteLayout";
import { useAuth } from "@/frontend/lib/auth";

export function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/dang-nhap", replace: true });
  }, [loading, user, navigate]);

  return (
    <SiteLayout>
      <div className="container mx-auto max-w-2xl px-4 py-14">
        <div className="rounded-2xl border border-border bg-surface p-8">
          <h1 className="font-display text-2xl font-bold tracking-tight">Tài khoản của tôi</h1>
          {user ? (
            <>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Họ và tên</dt>
                  <dd>{user.displayName ?? "—"}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>{user.email}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="brand" asChild>
                  <Link to="/san-pham">Mua sắm tiếp</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await signOut();
                    navigate({ to: "/", replace: true });
                  }}
                >
                  Đăng xuất
                </Button>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Đang kiểm tra phiên đăng nhập…</p>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
