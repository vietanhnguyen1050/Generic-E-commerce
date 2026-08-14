import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, Search, ShoppingCart, User2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useProducts } from "@/frontend/api/hooks";
import { useAuth } from "@/frontend/lib/auth";
import { useCart } from "@/frontend/lib/cart";
import { FREE_SHIPPING_THRESHOLD, STORE_NAME } from "@/shared/constants";
import { formatVnd } from "@/shared/format";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useI18n } from "@/frontend/lib/i18n";

export function Header() {
  const [term, setTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { count } = useCart();
  const { user, signOut } = useAuth();
  const { t } = useI18n();
  const { data } = useProducts({ limit: 1 });
  const categories = data?.categories ?? [];

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/san-pham", search: term.trim() ? { q: term.trim() } : {} });
  }

  return (
    <header className="sticky top-0 z-50 bg-ink text-ink-foreground">
      <div className="border-b border-white/10 bg-black/20">
        <div className="container mx-auto flex h-8 items-center justify-between px-4 text-[11px] text-white/70">
          <span>{t("topbar.freeShipping", { amount: formatVnd(FREE_SHIPPING_THRESHOLD) })}</span>
          <span className="hidden sm:block">{t("topbar.support")}</span>
        </div>
      </div>

      <div className="container mx-auto flex items-center gap-3 px-4 py-3">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button className="lg:hidden" aria-label={t("header.openMenu")}>
              <Menu className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="mt-8 flex flex-col gap-1">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to="/san-pham"
                  search={{ danh_muc: c.slug }}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-sm font-black text-brand-foreground">
            Z
          </span>
          <span className="font-display text-lg font-bold tracking-tight">{STORE_NAME}</span>
        </Link>

        <form onSubmit={submitSearch} className="relative ml-2 hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            maxLength={120}
            placeholder={t("header.searchPlaceholder")}
            aria-label={t("header.searchLabel")}
            className="h-10 rounded-full border-transparent bg-background pl-9 text-foreground"
          />
        </form>

        <div className="ml-auto flex items-center gap-1">
          <LanguageToggle className="text-ink-foreground hover:bg-white/10" />
          <ThemeToggle className="text-ink-foreground hover:bg-white/10" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 text-ink-foreground hover:bg-white/10">
                <User2 className="size-4" />
                <span className="hidden max-w-28 truncate text-sm sm:inline">
                  {user ? (user.displayName ?? user.email) : t("header.account")}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {user ? (
                <>
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/tai-khoan">{t("header.myAccount")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      toast.success(t("header.signedOut"));
                      navigate({ to: "/" });
                    }}
                  >
                    <LogOut className="mr-2 size-4" /> {t("header.signOut")}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/dang-nhap">{t("header.signIn")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dang-ky">{t("header.signUp")}</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/gio-hang"
            className="relative flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/10"
          >
            <ShoppingCart className="size-5" />
            <span className="hidden sm:inline">{t("header.cart")}</span>
            {count > 0 && (
              <span className="absolute -right-0 top-0.5 flex size-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <form onSubmit={submitSearch} className="container mx-auto px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            maxLength={120}
            placeholder={t("header.searchPlaceholderShort")}
            aria-label={t("header.searchLabel")}
            className="h-10 rounded-full border-transparent bg-background pl-9 text-foreground"
          />
        </div>
      </form>

      <nav className="hidden border-t border-white/10 lg:block">
        <div className="container mx-auto flex items-center gap-1 overflow-x-auto px-4 py-2 text-sm">
          <Link
            to="/san-pham"
            className="rounded-md px-3 py-1.5 font-medium text-white/90 hover:bg-white/10"
          >
            {t("header.allProducts")}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/san-pham"
              search={{ danh_muc: c.slug }}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-white/75 hover:bg-white/10 hover:text-white"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
