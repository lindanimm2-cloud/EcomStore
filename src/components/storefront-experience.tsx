"use client";

import { ProductRail } from "@/components/product-rail";
import { openDepartmentDrawer } from "@/components/global-department-drawer";
import { getCategories, getDepartments, getProductsByStore } from "@/lib/products";
import { categoryEmoji } from "@/lib/category-emoji";
import { departmentEmoji } from "@/lib/supermarket-taxonomy";
import {
  cataloguePath,
  categoryPath,
  departmentPath,
} from "@/lib/store-paths";
import { Store, StoreSlug } from "@/lib/types";
import { STORES } from "@/lib/stores";
import { useCart } from "@/lib/cart-context";
import { KitchenStatus } from "@/components/kitchen-status";
import { HardwareServices } from "@/components/hardware-services";
import { RewardsSummaryBar } from "@/components/super-app";
import { useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Leaf,
  Truck,
  Shield,
  MapPin,
  Menu,
  Percent,
  Sparkles,
} from "lucide-react";

const TRUST: Record<Store["type"], { icon: typeof Leaf; label: string }[]> = {
  retail: [
    { icon: Leaf, label: "Fresh daily" },
    { icon: Truck, label: "Delivery & pickup" },
    { icon: Shield, label: "Infinity Rewards" },
  ],
  wholesale: [
    { icon: Truck, label: "Trade delivery" },
    { icon: Shield, label: "Bulk pricing" },
    { icon: Leaf, label: "Deep stock" },
  ],
  hardware: [
    { icon: Shield, label: "Contractor rates" },
    { icon: Truck, label: "Site delivery" },
    { icon: Leaf, label: "Full yard" },
  ],
  food: [
    { icon: Leaf, label: "Butcher fresh" },
    { icon: Truck, label: "Same-day" },
    { icon: Shield, label: "Member prices" },
  ],
  takeaway: [
    { icon: Leaf, label: "Made today" },
    { icon: Truck, label: "Quick delivery" },
    { icon: Shield, label: "~10 min ready" },
  ],
};

const HERO_COPY: Record<
  StoreSlug,
  { brand: string; headline: string; secondaryCta: { href: string; label: string } }
> = {
  supermarket: {
    brand: "Aheers",
    headline: "Greytown supermarket, one tap away",
    secondaryCta: { href: "/specials", label: "Specials" },
  },
  powertrade: {
    brand: "PowerTrade",
    headline: "Bulk packs & cases for traders, stokvels & shoppers",
    secondaryCta: { href: "/trade", label: "Trade account" },
  },
  buildsave: {
    brand: "Hardware",
    headline: "Electrical, tools, paint & more — one yard",
    secondaryCta: { href: "/contact?topic=hardware", label: "Get a quote" },
  },
  foodworks: {
    brand: "Foodworks",
    headline: "Fresh produce, butcher & pantry — shop the aisles",
    secondaryCta: { href: "/recipes", label: "Recipes" },
  },
  grabngo: {
    brand: "Grab n Go",
    headline: "Ready to eat & drink — grab and leave",
    secondaryCta: { href: "/track-order", label: "Track order" },
  },
};

function promoBanners(store: Store) {
  const s = store.slug;
  if (s === "supermarket") {
    return [
      { title: "Weekly specials", blurb: "Member cuts across the aisles", href: "/specials", className: "bg-aheers-green" },
      { title: "Fresh produce", blurb: "Daily Greytown deliveries", href: departmentPath(s, "Fruit & Vegetables"), className: "bg-[#145232]" },
      { title: "Recipes tonight", blurb: "Shop the ingredients list", href: "/recipes", className: "bg-aheers-green-dark" },
    ];
  }
  if (s === "powertrade") {
    return [
      { title: "Case pricing", blurb: "6×2L drinks · 24-packs · bags", href: "/trade", className: "bg-powertrade-orange" },
      { title: "Rice & grains", blurb: "5kg · 10kg · 25kg trader bags", href: categoryPath(s, "Rice & Grains"), className: "bg-powertrade-dark" },
      { title: "Packaging", blurb: "Bags & takeaway for spazas", href: categoryPath(s, "Packaging"), className: "bg-[#bf360c]" },
    ];
  }
  if (s === "buildsave") {
    return [
      { title: "Contractor deals", blurb: "Yard-wide bulk rates", href: cataloguePath(s), className: "bg-buildsave-slate" },
      { title: "Paint & decorating", blurb: "Project-ready stock", href: categoryPath(s, "Paint & Decorating"), className: "bg-[#37474f]" },
      { title: "Request a quote", blurb: "Send your materials list", href: "/contact?topic=hardware", className: "bg-[#263238]" },
    ];
  }
  if (s === "foodworks") {
    return [
      { title: "Butcher counter", blurb: "Member mince & chops", href: categoryPath(s, "Meat & Poultry"), className: "bg-foodworks-red" },
      { title: "Fruit & veg", blurb: "Fresh daily deliveries", href: categoryPath(s, "Fruit & Vegetables"), className: "bg-[#8e1b1b]" },
      { title: "Braai packs", blurb: "Weekend fire favourites", href: "/recipes", className: "bg-[#b71c1c]" },
    ];
  }
  return [
    { title: "Order ahead", blurb: "Ready in ~10 minutes", href: categoryPath(s, "Hot Food"), className: "bg-grabngo-teal" },
    { title: "Coffee & hot drinks", blurb: store.promotion ?? "Daily bakery deals", href: categoryPath(s, "Hot Drinks"), className: "bg-[#00695c]" },
    { title: "Kitchen live", blurb: "See what’s cooking", href: cataloguePath(s), className: "bg-[#004d40]" },
  ];
}

export function StorefrontExperience({
  store,
}: {
  store: Store;
  initialCategory?: string;
  initialDepartment?: string;
  initialShowAll?: boolean;
}) {
  const router = useRouter();
  const products = useMemo(() => getProductsByStore(store.slug), [store.slug]);
  const categories = useMemo(() => getCategories(store.slug), [store.slug]);
  const departments = useMemo(() => getDepartments(store.slug), [store.slug]);
  const isSupermarket = store.slug === "supermarket";
  const { getCartCount } = useCart();
  const cartCount = getCartCount(store.slug as StoreSlug);
  const trust = TRUST[store.type];
  const hero = HERO_COPY[store.slug];
  const banners = promoBanners(store);
  const otherStores = STORES.filter((s) => s.slug !== store.slug);
  const chipItems = isSupermarket ? departments : categories;

  const trending = useMemo(
    () => products.filter((p) => p.badge).concat(products).slice(0, 12),
    [products]
  );
  const specials = useMemo(
    () =>
      products
        .filter((p) => p.badge === "Special" || p.memberPrice || p.badge === "Hot" || p.badge === "New")
        .concat(products.filter((p) => p.badge))
        .slice(0, 10),
    [products]
  );
  const popular = useMemo(() => products.slice(0, 10), [products]);

  const categoryRails = useMemo(() => {
    if (isSupermarket) {
      return departments.slice(0, 5).map((dept) => ({
        cat: dept,
        items: products.filter((p) => p.department === dept).slice(0, 10),
      }));
    }
    return categories.slice(0, 4).map((cat) => ({
      cat,
      items: products.filter((p) => p.category === cat).slice(0, 10),
    }));
  }, [categories, departments, products, isSupermarket]);

  const goCategory = useCallback(
    (next?: string) => {
      if (!next) router.push(cataloguePath(store.slug));
      else router.push(categoryPath(store.slug, next));
    },
    [router, store.slug]
  );

  const goDepartment = useCallback(
    (next?: string) => {
      if (!next) openDepartmentDrawer();
      else router.push(departmentPath(store.slug, next));
    },
    [router, store.slug]
  );

  const goChip = useCallback(
    (name: string) => {
      if (isSupermarket) goDepartment(name);
      else goCategory(name);
    },
    [isSupermarket, goDepartment, goCategory]
  );

  const goCatalogue = useCallback(() => {
    router.push(cataloguePath(store.slug));
  }, [router, store.slug]);

  return (
    <div className="pb-28 md:pb-24">
      {/* Hero */}
      <section className={`relative overflow-hidden text-white ${store.accentBg}`}>
        <div className="hero-mesh absolute inset-0 opacity-70" />
        <div className={`absolute inset-0 ${store.accentBg} opacity-35`} />
        <div className="page-shell relative py-8 md:py-10">
          <div className="max-w-xl animate-fade-up">
            <p className="font-display text-4xl font-semibold tracking-tight md:text-5xl">{hero.brand}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
              {store.status === "open" ? "Open" : "Closed"} · {store.shortName} · Greytown
            </p>
            <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight md:text-3xl">
              {hero.headline}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85 line-clamp-2">
              {store.tagline}
              {store.promotion ? ` · ${store.promotion}` : ""}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/75">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {store.address.split(",")[0]}
              </span>
              {cartCount > 0 && (
                <span className="rounded-md bg-white/15 px-2 py-0.5 font-medium">{cartCount} in cart</span>
              )}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openDepartmentDrawer()}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-aheers-green-dark shadow-lift"
              >
                <Menu className="h-4 w-4" /> Shop by department
              </button>
              <button
                type="button"
                onClick={goCatalogue}
                className="rounded-xl bg-aheers-gold px-4 py-2.5 text-sm font-bold text-aheers-green-dark"
              >
                Shop now
              </button>
              <Link
                href={hero.secondaryCta.href}
                className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold"
              >
                {hero.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell relative z-10 -mt-4 mb-1 md:-mt-5">
        <RewardsSummaryBar />
      </div>

      <div className="page-shell">
        {/* Trust + department chip row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-aheers-green/10 py-3 text-sm text-gray-600">
          <button
            type="button"
            onClick={() => openDepartmentDrawer()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-aheers-green px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white"
          >
            <Menu className="h-3.5 w-3.5" /> Departments
          </button>
          {trust.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 text-xs sm:text-sm">
              <Icon className="h-3.5 w-3.5 text-aheers-green" strokeWidth={1.75} />
              {label}
            </span>
          ))}
        </div>

        {store.slug === "grabngo" && (
          <div id="kitchen" className="mt-4">
            <KitchenStatus />
          </div>
        )}
        {store.slug === "buildsave" && (
          <div className="mt-4">
            <HardwareServices />
          </div>
        )}

        {/* Promo strip — busy like Checkers */}
        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          {banners.map((b, i) => (
            <Link
              key={b.title}
              href={b.href}
              className={`group relative overflow-hidden rounded-2xl p-4 text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift animate-fade-up ${b.className}`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10" />
              <p className="relative text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                {i === 0 ? "Featured" : i === 1 ? "Save" : "Explore"}
              </p>
              <h3 className="relative mt-1 font-display text-lg font-semibold">{b.title}</h3>
              <p className="relative mt-1 text-xs text-white/80">{b.blurb}</p>
              <span className="relative mt-3 inline-flex items-center gap-1 text-xs font-semibold text-aheers-gold">
                Shop <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </section>

        {/* Quick department icons */}
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-[0.06em] text-aheers-green-dark">
              Shop by department
            </h2>
            <button
              type="button"
              onClick={() => openDepartmentDrawer()}
              className="text-xs font-semibold text-aheers-green hover:underline"
            >
              View all
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {chipItems.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => goChip(item)}
                className={`flex w-[4.75rem] shrink-0 flex-col items-center gap-1.5 rounded-2xl px-2 py-2.5 text-center transition hover:-translate-y-0.5 bg-white text-aheers-charcoal ring-1 ring-aheers-green/10`}
              >
                <span className="text-2xl leading-none">
                  {isSupermarket ? departmentEmoji(item) : categoryEmoji(item)}
                </span>
                <span className="line-clamp-2 text-[10px] font-semibold leading-tight">{item}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Product rails */}
        <div id="rail-trending">
          <ProductRail
            title="Trending right now"
            products={trending}
            onViewAll={goCatalogue}
          />
        </div>

        <div id="rail-specials">
          <ProductRail
            title="Specials & deals"
            products={specials}
            onViewAll={() => router.push("/specials")}
          />
        </div>

        {/* Mid-page banners */}
        <section className="my-4 grid gap-3 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-aheers-green-dark to-aheers-green p-5 text-white">
            <Percent className="absolute right-4 top-4 h-10 w-10 text-white/15" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-aheers-gold">Save more</p>
            <h3 className="mt-1 font-display text-xl font-semibold">Infinity Rewards pricing</h3>
            <p className="mt-1 text-sm text-white/75">Earn cashback across every Aheers store.</p>
            <Link href="/portal" className="mt-3 inline-flex text-sm font-semibold text-aheers-gold hover:underline">
              Open rewards →
            </Link>
          </div>
          <div className={`relative overflow-hidden rounded-2xl p-5 text-white ${store.accentBg}`}>
            <Sparkles className="absolute right-4 top-4 h-10 w-10 text-white/15" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">New in store</p>
            <h3 className="mt-1 font-display text-xl font-semibold">{store.promotion ?? "Fresh picks this week"}</h3>
            <p className="mt-1 text-sm text-white/80">{products.length} products ready to shop</p>
            <button
              type="button"
              onClick={goCatalogue}
              className="mt-3 inline-flex text-sm font-semibold text-aheers-gold hover:underline"
            >
              Browse catalogue →
            </button>
          </div>
        </section>

        <ProductRail title="Popular with shoppers" products={popular} onViewAll={goCatalogue} />

        {categoryRails.map((rail, i) =>
          rail.items.length > 0 ? (
            <div key={rail.cat} id={i === 0 ? "rail-cat-0" : i === 1 ? "rail-fresh" : undefined}>
              <ProductRail
                title={rail.cat}
                products={rail.items}
                onViewAll={() => (isSupermarket ? goDepartment(rail.cat) : goCategory(rail.cat))}
              />
            </div>
          ) : null
        )}

        {/* Full catalogue CTA */}
        <div className="mt-8 text-center">
          <Link href={cataloguePath(store.slug)} className="btn-secondary inline-flex">
            Browse full catalogue ({products.length})
          </Link>
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <button
              type="button"
              onClick={() => openDepartmentDrawer()}
              className="text-sm font-semibold text-aheers-green hover:underline"
            >
              Shop by department
            </button>
            <Link
              href={`/store/${store.slug}/about`}
              className="text-sm font-semibold text-aheers-green hover:underline"
            >
              About {store.shortName}
            </Link>
          </p>
        </div>

        <section className="mt-8 border-t border-aheers-green/10 pt-5">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Also shop
            </span>
            <div className="flex shrink-0 items-center gap-2">
              {otherStores.map((s) => (
                <Link
                  key={s.slug}
                  href={s.slug === "supermarket" ? "/" : `/store/${s.slug}`}
                  className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 ${s.accentBg}`}
                >
                  <span className="text-sm leading-none">{s.icon}</span>
                  {s.shortName}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export { categoryEmoji };
