"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, ChevronDown, Gift, Menu, X } from "lucide-react";
import { useState } from "react";
import { STORES } from "@/lib/stores";
import { useCart } from "@/lib/cart-context";
import { StoreSlug } from "@/lib/types";
import { useStoreNavigation } from "@/components/store-switch";
import { NotificationsBell } from "@/components/notifications-bell";
import { useAuth } from "@/lib/auth-context";

const MAIN_NAV = [
  { href: "/specials", label: "Specials" },
  { href: "/rewards", label: "Rewards" },
  { href: "/competitions", label: "Competitions" },
  { href: "/recipes", label: "Recipes" },
  { href: "/delivery", label: "Delivery" },
  { href: "/track-order", label: "Track Order" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

function StoreNavButton({
  store,
  active,
  onNavigate,
  cartCount,
}: {
  store: (typeof STORES)[0];
  active: boolean;
  onNavigate: (slug: StoreSlug) => void;
  cartCount: number;
}) {
  return (
    <button
      onClick={() => onNavigate(store.slug)}
      className={`menu-option ${active ? "menu-option-active" : ""}`}
    >
      <span className="text-xl">{store.icon}</span>
      <div className="min-w-0 flex-1 text-left">
        <p className={`font-semibold ${active ? "text-white" : "text-aheers-charcoal"}`}>{store.shortName}</p>
        <p className={`truncate text-xs ${active ? "text-white/75" : "text-gray-500"}`}>{store.tagline}</p>
      </div>
      {cartCount > 0 && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            active ? "bg-aheers-gold text-aheers-green-dark" : "bg-aheers-gold/90 text-aheers-green-dark"
          }`}
        >
          {cartCount}
        </span>
      )}
    </button>
  );
}

export function StoreSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const { goToStore } = useStoreNavigation();
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const currentStore = STORES.find((s) => pathname.includes(`/store/${s.slug}`));
  const customerLoggedIn = user?.role === "customer";

  const navigate = (slug: StoreSlug) => {
    setOpen(false);
    goToStore(slug);
  };

  return (
    <div className="sticky top-0 z-40 border-b border-aheers-green/10 bg-white/85 backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between gap-3 py-3">
        <Link href="/" className="shrink-0 font-display text-xl font-semibold tracking-tight text-aheers-green-dark">
          Aheers
        </Link>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-full border border-aheers-green/15 bg-aheers-mist/80 px-3 py-1.5 text-sm font-medium text-aheers-charcoal transition hover:border-aheers-green/40"
          >
            <span className="hidden text-gray-400 sm:inline">Store</span>
            <span>{currentStore ? `${currentStore.icon} ${currentStore.shortName}` : "Choose store"}</span>
            {currentStore && getCartCount(currentStore.slug) > 0 && (
              <span className="rounded-full bg-aheers-gold px-1.5 py-0.5 text-[10px] font-bold text-aheers-green-dark">
                {getCartCount(currentStore.slug)}
              </span>
            )}
            <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="menu-panel absolute left-0 top-full z-50 mt-2 w-80 max-w-[90vw] animate-fade-up p-2">
                <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  One account · Separate carts per store
                </p>
                <div className="space-y-0.5">
                  {STORES.map((store) => (
                    <StoreNavButton
                      key={store.slug}
                      store={store}
                      active={currentStore?.slug === store.slug}
                      onNavigate={navigate}
                      cartCount={getCartCount(store.slug)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <nav className="hidden items-center gap-5 lg:flex">
          {MAIN_NAV.slice(0, 6).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "nav-link nav-link-active" : "nav-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 text-sm">
          {customerLoggedIn && (
            <NotificationsBell audience="customer" fullPageHref="/notifications" />
          )}
          {customerLoggedIn ? (
            <Link
              href="/portal"
              className="hidden text-aheers-charcoal/70 transition hover:text-aheers-green sm:inline"
            >
              {user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link href="/login/customer" className="hidden text-aheers-charcoal/70 transition hover:text-aheers-green sm:inline">
              Login
            </Link>
          )}
          {!customerLoggedIn && (
            <Link href="/register" className="hidden rounded-full bg-aheers-green px-3.5 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:bg-aheers-green-light sm:inline">
              Register
            </Link>
          )}
          <Link
            href="/portal"
            className="flex items-center gap-1 rounded-full bg-aheers-gold/15 px-2.5 py-1.5 text-xs font-semibold text-aheers-green-dark transition hover:bg-aheers-gold/25"
          >
            <Gift className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Rewards</span>
          </Link>
          <button
            className="rounded-lg p-1.5 text-gray-600 lg:hidden"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Menu"
          >
            {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileNav && (
        <div className="animate-fade-in border-t border-aheers-green/10 px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNav(false)}
                className={`rounded-xl px-3 py-2.5 font-medium ${
                  pathname === item.href ? "bg-aheers-green text-white" : "bg-aheers-mist text-aheers-charcoal"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login/customer" onClick={() => setMobileNav(false)} className="rounded-xl bg-aheers-mist px-3 py-2.5">
              Customer login
            </Link>
            <Link href="/register" onClick={() => setMobileNav(false)} className="rounded-xl bg-aheers-green px-3 py-2.5 text-white">
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function StoreHeader({ storeSlug }: { storeSlug: StoreSlug }) {
  const store = STORES.find((s) => s.slug === storeSlug)!;
  const { getCartCount, setActiveStore } = useCart();
  const cartCount = getCartCount(storeSlug);

  return (
    <header className={`${store.accentBg} relative overflow-hidden text-white`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
      <div className="page-shell relative flex items-center justify-between py-5">
        <Link
          href={`/store/${storeSlug}`}
          onClick={() => setActiveStore(storeSlug)}
          className="flex items-center gap-3"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur">
            {store.icon}
          </span>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight md:text-2xl">{store.name}</h1>
            <p className="text-sm text-white/80">{store.tagline}</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/portal" className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/25">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </Link>
          <Link
            href={`/store/${storeSlug}/cart`}
            onClick={() => setActiveStore(storeSlug)}
            className="relative flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-aheers-green-dark shadow-soft transition hover:bg-aheers-mist"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-aheers-gold px-1 text-[10px] font-bold text-aheers-green-dark">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      <div className="page-shell relative flex flex-wrap gap-2 pb-4 text-xs">
        {store.delivery && <span className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur">Delivery</span>}
        {store.pickup && <span className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur">Pickup</span>}
        {store.promotion && (
          <span className="rounded-full bg-aheers-gold px-2.5 py-1 font-semibold text-aheers-green-dark">{store.promotion}</span>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-aheers-green-dark text-slate-300">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-semibold text-white">Aheers</p>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Multi-business commerce — Supermarket, PowerTrade, Hardware & Grab n Go. Greytown, KZN.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-aheers-gold">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            {STORES.map((s) => (
              <li key={s.slug}>
                <Link href={`/store/${s.slug}`} className="transition hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-aheers-gold">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            {MAIN_NAV.map((n) => (
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
            <li>93 Voortrekker St, Greytown, 3250</li>
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
