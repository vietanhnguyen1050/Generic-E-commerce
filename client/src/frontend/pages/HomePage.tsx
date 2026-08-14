import { Link } from "@tanstack/react-router";
import { CreditCard, Headset, RotateCcw, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryTile } from "@/frontend/components/site/CategoryTile";
import { ProductCard } from "@/frontend/components/site/ProductCard";
import { ProductCardSkeleton } from "@/frontend/components/site/ProductCardSkeleton";
import { InfiniteProductGrid } from "@/frontend/components/site/InfiniteProductGrid";

import { SiteLayout } from "@/frontend/components/site/SiteLayout";
import { useProducts } from "@/frontend/api/hooks";
import { STORE_NAME } from "@/shared/constants";
import type { Product } from "@/shared/types";

const perks = [
  { icon: Truck, title: "Giao nhanh 2h", desc: "Nội thành HN & TP.HCM" },
  { icon: ShieldCheck, title: "Chính hãng 100%", desc: "Hoàn tiền 200% nếu sai" },
  { icon: RotateCcw, title: "Đổi trả 30 ngày", desc: "Miễn phí đổi size, lỗi" },
  { icon: CreditCard, title: "Trả góp 0%", desc: "Qua thẻ tín dụng" },
];

const brands = ["Aurora", "Nova", "Lumen", "ZenMat", "Orbit", "Hearth", "Vera", "Kiddo"];

function ProductRow({
  title,
  subtitle,
  items,
  isPending,
  linkSearch,
}: {
  title: string;
  subtitle: string;
  items: Product[];
  isPending: boolean;
  linkSearch?: Record<string, string>;
}) {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Link
          to="/san-pham"
          search={linkSearch as never}
          className="text-sm font-medium text-teal hover:underline"
        >
          Xem tất cả
        </Link>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isPending
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {!isPending && items.length === 0 && (
        <p className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Chưa có sản phẩm trong mục này.
        </p>
      )}

    </section>
  );
}

export function HomePage() {
  const { data, isPending } = useProducts({ limit: 12 });
  const newest = useProducts({ sort: "moi-nhat", limit: 4 });
  const topRated = useProducts({ sort: "danh-gia", limit: 4 });

  const products = data?.items ?? [];
  const categories = data?.categories ?? [];

  const deals = [...products]
    .sort((a, b) => b.listPrice / b.price - a.listPrice / a.price)
    .slice(0, 4);
  const bestSellers = products.slice(0, 8);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <img
          src="/products/hero.jpg"
          alt=""
          aria-hidden="true"
          width={1600}
          height={700}
          className="absolute inset-0 size-full object-cover opacity-70"
        />
        <div className="relative container mx-auto grid gap-8 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand">
              Sale giữa năm · giảm đến 40%
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Mua sắm mọi thứ bạn cần, một nơi duy nhất
            </h1>
            <p className="mt-4 max-w-lg text-white/70">
              {STORE_NAME} mang đến hàng nghìn sản phẩm chính hãng từ công nghệ, thời trang, nhà cửa
              đến thể thao và mẹ &amp; bé — giá tốt, giao nhanh toàn quốc.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="brand" size="lg" asChild>
                <Link to="/san-pham">Mua sắm ngay</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link to="/san-pham" search={{ sap_xep: "gia-tang" }}>
                  Xem deal giá tốt
                </Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-2xl font-bold text-brand">12K+</dt>
                <dd className="text-white/60">Sản phẩm</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold text-brand">98%</dt>
                <dd className="text-white/60">Khách hài lòng</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold text-brand">24/7</dt>
                <dd className="text-white/60">Hỗ trợ</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="border-b border-border bg-surface">
        <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-6 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.title} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <p.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-2xl font-bold tracking-tight">Danh mục nổi bật</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {isPending
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
            : categories.map((c) => <CategoryTile key={c.slug} {...c} />)}
        </div>
      </section>

      {/* Deals */}
      <section className="container mx-auto px-4 pb-4">
        <div className="rounded-2xl bg-gradient-to-r from-ink to-ink/85 p-6 text-ink-foreground sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Ưu đãi hôm nay</h2>
              <p className="text-sm text-white/65">Giảm sâu nhất trong 24 giờ</p>
            </div>
            <Button variant="brand" size="sm" asChild>
              <Link to="/san-pham">Xem tất cả</Link>
            </Button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isPending
              ? Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} className="border-white/10 bg-white/5" />
                ))
              : deals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

        </div>
      </section>

      {/* Best sellers */}
      <ProductRow
        title="Bán chạy nhất"
        subtitle="Được khách hàng chọn mua nhiều nhất tuần này"
        items={bestSellers}
        isPending={isPending}
      />

      {/* Promo banners */}
      <section className="container mx-auto grid gap-4 px-4 pb-2 lg:grid-cols-3">
        {[
          { title: "Tuần lễ công nghệ", desc: "Laptop & âm thanh giảm tới 30%", cat: "dien-tu" },
          { title: "Tủ đồ mùa mới", desc: "Thời trang từ 199.000đ", cat: "thoi-trang" },
          { title: "Góc nhà tiện nghi", desc: "Đồ gia dụng mua 1 tặng 1", cat: "nha-cua" },
        ].map((b) => (
          <Link
            key={b.cat}
            to="/san-pham"
            search={{ danh_muc: b.cat } as never}
            className="rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <Sparkles className="size-5 text-teal" />
            <h3 className="mt-3 font-display text-lg font-bold">{b.title}</h3>
            <p className="text-sm text-muted-foreground">{b.desc}</p>
            <span className="mt-3 inline-block text-sm font-medium text-teal">Khám phá ngay →</span>
          </Link>
        ))}
      </section>

      {/* New arrivals */}
      <ProductRow
        title="Hàng mới về"
        subtitle="Vừa lên kệ trong 7 ngày qua"
        items={newest.data?.items ?? []}
        isPending={newest.isPending}
        linkSearch={{ sap_xep: "moi-nhat" }}
      />

      {/* Top rated */}
      <ProductRow
        title="Đánh giá cao nhất"
        subtitle="Điểm hài lòng từ 4.7 trở lên"
        items={topRated.data?.items ?? []}
        isPending={topRated.isPending}
        linkSearch={{ sap_xep: "danh-gia" }}
      />

      {/* Brands */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="font-display text-xl font-bold tracking-tight">Thương hiệu chính hãng</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {brands.map((b) => (
            <div
              key={b}
              className="flex h-16 items-center justify-center rounded-xl border border-border bg-surface text-sm font-semibold text-muted-foreground"
            >
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* Infinite feed */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-2">
          <Star className="size-5 fill-brand text-brand" />
          <h2 className="font-display text-2xl font-bold tracking-tight">Gợi ý hôm nay</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Cuộn xuống để xem thêm — sản phẩm được tải dần theo từng trang.
        </p>
        <div className="mt-6">
          <InfiniteProductGrid pageSize={12} />
        </div>
      </section>

      {/* Support band */}
      <section className="container mx-auto px-4 pb-10">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center">
          <Headset className="size-8 text-teal" />
          <h2 className="font-display text-xl font-bold">Cần tư vấn trước khi mua?</h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Đội ngũ {STORE_NAME} hỗ trợ chọn sản phẩm phù hợp, kiểm tra tồn kho và theo dõi đơn hàng
            mọi lúc qua hotline 1900 6868.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
