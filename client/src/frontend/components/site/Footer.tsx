import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";
import { useProducts } from "@/frontend/api/hooks";
import { STORE_NAME } from "@/shared/constants";

export function Footer() {
  const { data } = useProducts({ limit: 1 });
  const categories = (data?.categories ?? []).slice(0, 6);

  return (
    <footer className="mt-16 border-t border-border bg-ink text-ink-foreground">
      <div className="container mx-auto grid gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-sm font-black text-brand-foreground">
              Z
            </span>
            <span className="font-display text-lg font-bold">{STORE_NAME}</span>
          </div>
          <p className="mt-3 text-sm text-white/65">
            Sàn thương mại điện tử đa ngành hàng: công nghệ, thời trang, nhà cửa, thể thao, mẹ và bé.
          </p>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide">Danh mục</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/65">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to="/san-pham" search={{ danh_muc: c.slug }} className="hover:text-brand">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide">Hỗ trợ</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/65">
            <li>Chính sách đổi trả 30 ngày</li>
            <li>Chính sách bảo hành</li>
            <li>Hướng dẫn thanh toán</li>
            <li>Theo dõi đơn hàng</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide">Liên hệ</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/65">
            <li className="flex items-center gap-2">
              <Phone className="size-4" /> 1900 6868
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4" /> hotro@zenova.vn
            </li>
          </ul>
          <div className="mt-4 flex gap-3 text-white/65">
            <Facebook className="size-5" />
            <Instagram className="size-5" />
            <Youtube className="size-5" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {STORE_NAME}. Demo thương mại điện tử.
      </div>
    </footer>
  );
}
