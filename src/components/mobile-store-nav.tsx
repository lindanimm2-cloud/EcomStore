"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  LayoutGrid,
  ShoppingBag,
  Grid2x2,
  User,
  Truck,
  PackageSearch,
  Percent,
  Gift,
  Info,
  ChefHat,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { STORES } from "@/lib/stores";
import { StoreSlug } from "@/lib/types";
import {
  cataloguePath,
  departmentsPath,
  storeHomePath,
} from "@/lib/store-paths";
import { openMiniCart } from "@/components/mini-cart-drawer";

function resolveStoreSlug(pathname: string, activeStore: StoreSlug | null): StoreSlug {
  if (pathname === "/" || pathname.startsWith("/store/supermarket")) return "supermarket";
  const m = pathname.match(/^\/store\/([^/]+)/);
  if (m && STORES.some((s) => s.slug === m[1])) return m[1] as StoreSlug;
  return activeStore ?? "supermarket";
}

function shouldHide(pathname: string) {
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/driver")) return true;
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/register")) return true;
  if (pathname.startsWith("/nexus")) return true;
  return false;
}

type TabId = "home" | "shop" | "cart" | "services" | "account";

export function MobileStoreNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { activeStore, getCartCount, setActiveStore } = useCart();
  const [servicesOpen, setServicesOpen] = useState(false);

  const slug = resolveStoreSlug(pathname, activeStore);
  const cartCount = getCartCount(slug);
  const store = STORES.find((s) => s.slug === slug)!;

  useEffect(() => {
    setServicesOpen(false);
  }, [pathname]);

  if (shouldHide(pathname)) return null;

  const homeHref = storeHomePath(slug);
  const shopHref = departmentsPath(slug);
  const accountHref = user?.role === "customer" ? "/portal" : "/login/customer?next=/portal";

  const shopLabel =
    store.type === "takeaway"
      ? "Menu"
      : store.type === "wholesale"
        ? "Trade"
        : store.type === "hardware"
          ? "Aisle"
          : "Shop";

  const activeTab: TabId = (() => {
    if (pathname.includes("/cart") || pathname.includes("/checkout")) return "cart";
    if (pathname.startsWith("/portal") || pathname.startsWith("/login/customer")) return "account";
    if (
      pathname.includes("/departments") ||
      pathname.includes("/department/") ||
      pathname.includes("/category/") ||
      pathname.includes("/catalogue") ||
      pathname.includes("/product/")
    )
      return "shop";
    if (
      pathname.startsWith("/delivery") ||
      pathname.startsWith("/track-order") ||
      pathname.startsWith("/order/") ||
      pathname.startsWith("/specials") ||
      pathname.startsWith("/recipes") ||
      pathname.includes("/about") ||
      pathname.startsWith("/rewards")
    )
      return "services";
    if (pathname === "/" || pathname === `/store/${slug}`) return "home";
    return "home";
  })();

  const tabs: {
    id: TabId;
    label: string;
    icon: typeof Home;
    href?: string;
    onClick?: () => void;
    badge?: number;
  }[] = [
    { id: "home", label: "Home", icon: Home, href: homeHref },
    { id: "shop", label: shopLabel, icon: LayoutGrid, href: shopHref },
    {
      id: "cart",
      label: store.type === "takeaway" ? "Order" : "Cart",
      icon: ShoppingBag,
      onClick: () => {
        setActiveStore(slug);
        openMiniCart(slug);
      },
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      id: "services",
      label: "Services",
      icon: Grid2x2,
      onClick: () => setServicesOpen(true),
    },
    { id: "account", label: "Account", icon: User, href: accountHref },
  ];

  const fulfilmentLabel =
    store.type === "takeaway"
      ? "Order ahead"
      : store.type === "wholesale"
        ? "Delivery & tele-order"
        : store.type === "hardware"
          ? "Delivery & collection"
          : "Delivery & pickup";
  const fulfilmentDesc =
    store.type === "takeaway"
      ? "Ready in ~10 min"
      : store.type === "wholesale"
        ? "Cases & outlying areas"
        : store.type === "hardware"
          ? "Project loads & pickup"
          : "Slots and coverage";
  const specialsDesc =
    store.type === "takeaway"
      ? "Combos & deals"
      : store.type === "wholesale"
        ? "Trade bulk deals"
        : store.type === "hardware"
          ? "Contractor offers"
          : store.type === "food"
            ? "Fresh meat deals"
            : "Weekly deals";
  const catalogueLabel =
    store.type === "takeaway"
      ? "Full menu"
      : store.type === "wholesale"
        ? "Case catalogue"
        : "Full catalogue";

  const services = [
    { href: "/delivery", label: fulfilmentLabel, icon: Truck, desc: fulfilmentDesc },
    { href: "/track-order", label: "Track order", icon: PackageSearch, desc: "Live status" },
    { href: "/specials", label: "Specials", icon: Percent, desc: specialsDesc },
    ...(slug === "supermarket"
      ? [{ href: "/recipes", label: "Recipes", icon: ChefHat, desc: "Cook with what you buy" }]
      : []),
    { href: "/portal", label: "Infinity Rewards", icon: Gift, desc: "Points & cashback" },
    {
      href: `/store/${slug}/about`,
      label: `About ${store.shortName}`,
      icon: Info,
      desc: "Hours & story",
    },
    {
      href: cataloguePath(slug),
      label: catalogueLabel,
      icon: LayoutGrid,
      desc: `${store.shortName} products`,
    },
  ];

  function go(href: string) {
    setActiveStore(slug);
    setServicesOpen(false);
    router.push(href);
  }

  return (
    <>
      {/* Services sheet */}
      {servicesOpen && (
        <div className="fixed inset-0 z-[55] md:hidden">
          <button
            type="button"
            aria-label="Close services"
            className="absolute inset-0 bg-black/40 animate-fade-in"
            onClick={() => setServicesOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 animate-fade-up rounded-t-[1.75rem] bg-white pb-[calc(5.5rem+env(safe-area-inset-bottom))] shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                  {store.shortName}
                </p>
                <h2 className="font-display text-lg font-semibold text-aheers-green-dark">Services</h2>
              </div>
              <button
                type="button"
                onClick={() => setServicesOpen(false)}
                className="rounded-xl p-2 text-gray-400 hover:bg-aheers-mist hover:text-aheers-green"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="max-h-[55vh] overflow-y-auto px-3 py-2">
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.href}>
                    <button
                      type="button"
                      onClick={() => go(s.href)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left transition hover:bg-aheers-mist"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-aheers-mist text-aheers-green">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-aheers-charcoal">{s.label}</span>
                        <span className="text-xs text-gray-400">{s.desc}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Floating pill nav — mobile only */}
      <nav
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] md:hidden"
        aria-label="Store navigation"
      >
        <div className="pointer-events-auto mx-auto flex max-w-md items-stretch justify-between rounded-[1.75rem] border border-aheers-green/10 bg-white/95 px-1.5 py-1.5 shadow-[0_12px_40px_rgba(13,61,38,0.18)] backdrop-blur-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id || (tab.id === "services" && servicesOpen);
            const className = `relative flex min-h-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-[1.35rem] px-1 transition ${
              active
                ? "bg-aheers-mist text-aheers-green-dark"
                : "text-gray-400 hover:text-aheers-green"
            }`;

            const inner = (
              <>
                <span className="relative">
                  <Icon className="h-[1.35rem] w-[1.35rem]" strokeWidth={active ? 2.35 : 1.75} />
                  {tab.badge != null && tab.badge > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-aheers-gold px-1 text-[9px] font-bold text-aheers-green-dark">
                      {tab.badge > 99 ? "99+" : tab.badge}
                    </span>
                  )}
                </span>
                <span className={`text-[10px] leading-none ${active ? "font-bold" : "font-medium"}`}>
                  {tab.label}
                </span>
              </>
            );

            if (tab.onClick) {
              return (
                <button key={tab.id} type="button" onClick={tab.onClick} className={className}>
                  {inner}
                </button>
              );
            }

            return (
              <Link
                key={tab.id}
                href={tab.href!}
                onClick={() => setActiveStore(slug)}
                className={className}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
