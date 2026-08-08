"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, User, Gift, Menu, X, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { STORES } from "@/lib/stores";
import { useCart } from "@/lib/cart-context";
import { StoreSlug } from "@/lib/types";
import { useStoreNavigation } from "@/components/store-switch";
import { NotificationsBell } from "@/components/notifications-bell";
import { useAuth } from "@/lib/auth-context";
import { openDepartmentDrawer } from "@/components/global-department-drawer";
import { openMiniCart } from "@/components/mini-cart-drawer";

const MAIN_NAV = [
  { href: "/specials", label: "Specials" },
  { href: "/recipes", label: "Recipes" },
  { href: "/delivery", label: "Delivery" },
  { href: "/track-order", label: "Track order" },
  { href: "/competitions", label: "Competitions" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

function resolveCartStore(
  pathname: string,
  activeStore: StoreSlug | null,
  storesWithCart: StoreSlug[]
): StoreSlug {
  if (pathname === "/" || pathname.startsWith("/store/supermarket")) return "supermarket";
  const fromPath = STORES.find((s) => pathname.includes(`/store/${s.slug}`))?.slug;
  if (fromPath) return fromPath;
  if (activeStore && storesWithCart.includes(activeStore)) return activeStore;
  if (storesWithCart[0]) return storesWithCart[0];
  if (activeStore) return activeStore;
  return "supermarket";
}

function activeStoreSlug(pathname: string): StoreSlug | null {
  if (pathname === "/") return "supermarket";
  return STORES.find((s) => pathname.includes(`/store/${s.slug}`))?.slug ?? null;
}

/** Bash / Cotton On style: brand strip on top, then store header + search */
export function StoreSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState("");
  const { goToStore } = useStoreNavigation();
  const { getCartCount, getCartTotal, activeStore, storesWithCart, setActiveStore } = useCart();
  const { user } = useAuth();
  const activeSlug = activeStoreSlug(pathname);
  const currentStore = STORES.find((s) => s.slug === activeSlug) ?? STORES[0];
  const customerLoggedIn = user?.role === "customer";
  const cartStore = resolveCartStore(pathname, activeStore, storesWithCart);
  const cartTotalCount = storesWithCart.reduce((sum, slug) => sum + getCartCount(slug), 0);
  const cartMoney = storesWithCart.reduce((sum, slug) => sum + getCartTotal(slug), 0);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    const slug = activeSlug ?? "supermarket";
    const dest = `/store/${slug}/catalogue${q ? `?q=${encodeURIComponent(q)}` : ""}`;
    router.push(dest);
  }

  return (
    <div className="sticky top-0 z-40">
      {/* ── Group brand strip (Bash-style) ── */}
      <div className="bg-aheers-green-dark text-white">
        <div className="page-shell flex items-center gap-1 overflow-x-auto py-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="mr-2 hidden shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40 sm:inline">
            Aheers
          </span>
          {STORES.map((s) => {
            const active = activeSlug === s.slug;
            const count = getCartCount(s.slug);
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => goToStore(s.slug)}
                className={`relative shrink-0 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition sm:text-xs ${
                  active
                    ? "bg-white/10 text-aheers-gold"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-sm normal-case tracking-normal sm:hidden">{s.icon}</span>
                  <span>{s.shortName}</span>
                  {count > 0 && (
                    <span className="rounded-full bg-aheers-gold px-1.5 py-0.5 text-[9px] font-bold text-aheers-green-dark">
                      {count}
                    </span>
                  )}
                </span>
                {active && (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-aheers-gold" />
                )}
              </button>
            );
          })}
          <div className="ml-auto hidden shrink-0 items-center gap-3 pl-4 text-[11px] text-white/45 lg:flex">
            <Link href="/delivery" className="hover:text-white">
              Delivery
            </Link>
            <Link href="/track-order" className="hover:text-white">
              Track
            </Link>
            <Link href="/portal" className="hover:text-aheers-gold">
              Rewards
            </Link>
          </div>
        </div>
      </div>

      {/* ── Active store header ── */}
      <div className="border-b border-aheers-green/10 bg-white/95 backdrop-blur-xl">
        <div className="page-shell flex items-center gap-3 py-3 md:gap-5">
          <button
            type="button"
            onClick={() => goToStore(currentStore.slug)}
            className="flex shrink-0 items-center gap-2.5 text-left"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl text-white ${currentStore.accentBg}`}
            >
              {currentStore.icon}
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold leading-tight tracking-tight text-aheers-green-dark sm:text-xl">
                {currentStore.shortName}
              </p>
              <p className="hidden text-[11px] text-gray-400 sm:block">Aheers Group</p>
            </div>
          </button>

          <form onSubmit={onSearch} className="relative hidden min-w-0 flex-1 md:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${currentStore.shortName}…`}
              className="w-full rounded-2xl border-0 bg-[#eef1ef] py-2.5 pl-10 pr-24 text-sm outline-none ring-0 focus:bg-white focus:ring-2 focus:ring-aheers-green/15"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-aheers-green px-3.5 py-1.5 text-xs font-bold text-white hover:bg-aheers-green-light"
            >
              Search
            </button>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            {customerLoggedIn && (
              <NotificationsBell audience="customer" fullPageHref="/notifications" />
            )}
            <Link
              href={customerLoggedIn ? "/portal" : "/login/customer"}
              className="hidden items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium text-aheers-charcoal/75 transition hover:bg-aheers-mist hover:text-aheers-green sm:inline-flex"
            >
              <User className="h-4 w-4" />
              <span>{customerLoggedIn ? user.name.split(" ")[0] : "Account"}</span>
            </Link>
            <Link
              href="/portal"
              className="hidden items-center gap-1 rounded-xl bg-aheers-gold/15 px-2.5 py-2 text-xs font-semibold text-aheers-green-dark transition hover:bg-aheers-gold/25 lg:inline-flex"
            >
              <Gift className="h-3.5 w-3.5" />
              Rewards
            </Link>

            <button
              type="button"
              onClick={() => {
                setActiveStore(cartStore);
                openMiniCart(cartStore);
              }}
              className="relative flex items-center gap-2 rounded-2xl bg-aheers-green-dark px-3 py-2 text-white shadow-soft transition hover:bg-aheers-green"
              aria-label={cartTotalCount > 0 ? `Cart, ${cartTotalCount} items` : "Cart"}
            >
              <span className="relative">
                <ShoppingCart className="h-[18px] w-[18px]" />
                <span className="absolute -right-2.5 -top-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-aheers-gold px-1 text-[10px] font-bold text-aheers-green-dark">
                  {cartTotalCount > 99 ? "99+" : cartTotalCount}
                </span>
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-[10px] font-medium uppercase tracking-wide text-white/55">Cart</span>
                <span className="block text-sm font-bold tabular-nums">R {cartMoney.toFixed(2)}</span>
              </span>
            </button>

            <button
              className="rounded-lg p-1.5 text-gray-600 lg:hidden"
              onClick={() => setMobileNav(!mobileNav)}
              aria-label="Menu"
            >
              {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Store site nav — like brand sub-nav */}
        <div className="hidden border-t border-aheers-green/5 md:block">
          <nav className="page-shell flex items-center gap-5 py-2">
            <Link
              href={`/store/${activeSlug ?? "supermarket"}/departments`}
              onClick={(e) => {
                e.preventDefault();
                openDepartmentDrawer();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-aheers-green px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white"
            >
              <Menu className="h-3.5 w-3.5" /> Departments
            </Link>
            {MAIN_NAV.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href
                    ? "nav-link nav-link-active text-xs font-semibold"
                    : "nav-link text-xs"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile search */}
        <form onSubmit={onSearch} className="page-shell pb-3 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${currentStore.shortName}…`}
              className="mobile-search"
            />
          </div>
        </form>

        {mobileNav && (
          <div className="animate-fade-in border-t border-aheers-green/10 px-4 py-4 lg:hidden">
            {/* Primary shopping actions */}
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Shop</p>
            <div className="mb-4 grid gap-2">
              <Link
                href={`/store/${currentStore.slug}/catalogue`}
                onClick={() => setMobileNav(false)}
                className="flex items-center justify-center rounded-2xl bg-aheers-green py-3.5 text-sm font-bold text-white shadow-soft"
              >
                Shop {currentStore.shortName}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileNav(false);
                  openDepartmentDrawer();
                }}
                className="flex items-center justify-center gap-2 rounded-2xl border border-aheers-green/20 bg-aheers-mist py-3 text-sm font-semibold text-aheers-green-dark"
              >
                <Menu className="h-4 w-4" />
                Shop by department
              </button>
              <Link
                href="/specials"
                onClick={() => setMobileNav(false)}
                className="flex items-center justify-center rounded-2xl border border-aheers-green/15 bg-white py-3 text-sm font-semibold text-aheers-charcoal"
              >
                Weekly specials
              </Link>
            </div>

            {/* Compact utility links */}
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Explore</p>
            <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
              {[
                { href: "/recipes", label: "Recipes" },
                { href: "/delivery", label: "Delivery" },
                { href: "/track-order", label: "Track order" },
                { href: "/portal", label: "Rewards" },
                { href: "/competitions", label: "Competitions" },
                { href: "/about", label: "About" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNav(false)}
                  className={`rounded-xl px-3 py-2.5 font-medium ${
                    pathname === item.href
                      ? "bg-aheers-green text-white"
                      : "bg-white text-aheers-charcoal ring-1 ring-aheers-green/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Account — quiet, not competing with Shop */}
            <div className="flex items-center justify-between gap-3 border-t border-aheers-green/10 pt-3 text-sm">
              <Link
                href={customerLoggedIn ? "/portal" : "/login/customer"}
                onClick={() => setMobileNav(false)}
                className="font-semibold text-aheers-green"
              >
                {customerLoggedIn ? "My account" : "Log in"}
              </Link>
              {!customerLoggedIn && (
                <Link
                  href="/register"
                  onClick={() => setMobileNav(false)}
                  className="rounded-full bg-aheers-gold/20 px-3.5 py-1.5 text-xs font-bold text-aheers-green-dark"
                >
                  Register
                </Link>
              )}
              <Link
                href="/contact"
                onClick={() => setMobileNav(false)}
                className="ml-auto text-xs text-gray-400 hover:text-aheers-green"
              >
                Contact
              </Link>
            </div>
            <p className="mt-3 text-center text-[10px] text-gray-400">
              Switch stores anytime from the green bar above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Slim store identity strip — used under global header on store pages */
export function StoreHeader({ storeSlug }: { storeSlug: StoreSlug }) {
  const store = STORES.find((s) => s.slug === storeSlug)!;
  const { setActiveStore } = useCart();

  return (
    <div className={`${store.accentBg} text-white`}>
      <div className="page-shell flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
        <p className="font-medium text-white/90">
          <span className="mr-1.5">{store.icon}</span>
          {store.tagline}
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          {store.delivery && <span className="rounded-md bg-white/15 px-2 py-1">Delivery</span>}
          {store.pickup && <span className="rounded-md bg-white/15 px-2 py-1">Pickup</span>}
          {store.promotion && (
            <span className="rounded-md bg-aheers-gold px-2 py-1 font-semibold text-aheers-green-dark">
              {store.promotion}
            </span>
          )}
          <Link
            href={`/store/${storeSlug}/about`}
            onClick={() => setActiveStore(storeSlug)}
            className="rounded-md bg-white/15 px-2 py-1 hover:bg-white/25"
          >
            About
          </Link>
          <Link
            href={`/store/${storeSlug}`}
            onClick={() => setActiveStore(storeSlug)}
            className="rounded-md bg-white/15 px-2 py-1 hover:bg-white/25"
          >
            Store home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-aheers-green-dark text-slate-300">
      <div className="border-b border-white/10 bg-gradient-to-r from-aheers-green-dark via-aheers-green to-aheers-green-dark">
        <div className="page-shell flex flex-col items-start justify-between gap-5 py-10 md:flex-row md:items-center">
          <div>
            <p className="font-display text-2xl font-semibold text-white">Shelf notes from Greytown</p>
            <p className="mt-1 max-w-md text-sm text-white/70">
              Weekly specials, Grab n Go drops, and Infinity Rewards tips — no spam.
            </p>
          </div>
          <form
            className="flex w-full max-w-md gap-2"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-xl border-0 bg-white/95 px-4 py-3 text-sm text-aheers-charcoal"
            />
            <button type="submit" className="shrink-0 rounded-xl bg-aheers-gold px-5 py-3 text-sm font-bold text-aheers-green-dark">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="page-shell grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-semibold text-white">Aheers</p>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Multi-business commerce — Supermarket, PowerTrade, Hardware, Foodworks & Grab n Go.
          </p>
          <p className="mt-4 text-xs text-white/40">93 Voortrekker St · Greytown, KZN</p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-aheers-gold">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            {STORES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={s.slug === "supermarket" ? "/" : `/store/${s.slug}`}
                  className="transition hover:text-white"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-aheers-gold">Help</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: "/delivery", label: "Delivery & pickup" },
              { href: "/track-order", label: "Track an order" },
              { href: "/contact", label: "Contact" },
              { href: "/about", label: "About Aheers" },
              { href: "/store/supermarket/about", label: "About Supermarket" },
              { href: "/careers", label: "Careers" },
            ].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="transition hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-aheers-gold">Contact</h4>
          <ul className="space-y-2.5 text-sm">
            <li>033 413 1156</li>
            <li>info@aheers.co.za</li>
            <li>
              <Link href="/contact" className="font-medium text-aheers-gold hover:underline">
                Contact form →
              </Link>
            </li>
          </ul>
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Team access</p>
            <Link
              href="/login/staff"
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-aheers-gold transition hover:text-white"
            >
              Employee login →
            </Link>
            <p className="mt-1 text-xs text-white/40">Staff, Aheers App, dispatch & ops hub</p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("aheers:report-issue"))}
              className="mt-3 block text-sm font-semibold text-white/70 transition hover:text-aheers-gold"
            >
              Report issue to developer →
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/35">
        © Aheers Group · Greytown, KZN
        {" · "}
        PayFast · Ozow · Yoco
        {" · "}
        <Link href="/login/customer" className="hover:text-white/60">
          Customer login
        </Link>
      </div>
    </footer>
  );
}

export function FleetBadge() {
  return null;
}
