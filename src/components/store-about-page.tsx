"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Clock, MapPin, Phone, ChevronRight } from "lucide-react";
import { StoreSwitcher, StoreHeader, SiteFooter } from "@/components/layout";
import { useCart } from "@/lib/cart-context";
import { STORE_ABOUT } from "@/lib/store-about";
import { cataloguePath, departmentsPath, storeHomePath } from "@/lib/store-paths";
import { Store, StoreSlug } from "@/lib/types";
import { STORES } from "@/lib/stores";

export function StoreAboutPageClient({ store }: { store: Store }) {
  const { setActiveStore } = useCart();
  const about = STORE_ABOUT[store.slug];
  const others = STORES.filter((s) => s.slug !== store.slug);

  useEffect(() => {
    setActiveStore(store.slug);
  }, [store.slug, setActiveStore]);

  return (
    <>
      <StoreSwitcher />
      <StoreHeader storeSlug={store.slug as StoreSlug} />
      <main className="pb-28 md:pb-24">
        <section className={`relative overflow-hidden text-white ${store.accentBg}`}>
          <div className="hero-mesh absolute inset-0 opacity-70" />
          <div className={`absolute inset-0 ${store.accentBg} opacity-40`} />
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
          <div className="page-shell relative py-12 md:py-16">
            <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">
              <Link href={storeHomePath(store.slug)} className="hover:text-white">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-aheers-gold">About</span>
            </nav>
            <p className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
              {store.name}
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
              About · Greytown · KZN
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-2xl font-semibold tracking-tight md:text-3xl">
              {about.headline}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
              {store.tagline}
              {store.promotion ? ` · ${store.promotion}` : ""}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Link
                href={cataloguePath(store.slug)}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-aheers-green-dark shadow-lift"
              >
                Shop catalogue
              </Link>
              <Link
                href={departmentsPath(store.slug)}
                className="rounded-xl border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Departments
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/35 bg-transparent px-5 py-2.5 text-sm font-semibold text-white"
              >
                Contact
              </Link>
            </div>
          </div>
        </section>

        <div className="page-shell -mt-5 relative z-10">
          <div className="rounded-2xl border border-aheers-green/10 bg-white p-6 shadow-soft md:p-8">
            <p className="section-label">Our story</p>
            <div className="mt-3 space-y-4 text-[15px] leading-relaxed text-gray-600">
              {about.story.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="page-shell mt-10 grid gap-4 md:grid-cols-3">
          {about.highlights.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-aheers-green/10 bg-white p-5 shadow-[0_6px_24px_rgba(13,61,38,0.04)]"
            >
              <h2 className="font-display text-lg font-semibold text-aheers-green-dark">{h.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{h.body}</p>
            </div>
          ))}
        </div>

        <div className="page-shell mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-aheers-green/10 bg-[#f7f9f8] p-6 md:p-7">
            <h2 className="font-display text-xl font-semibold text-aheers-green-dark">Visit us</h2>
            <ul className="mt-5 space-y-4 text-sm text-aheers-charcoal">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-aheers-green" />
                <span>{store.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-aheers-green" />
                <a href={`tel:${store.phone.replace(/\s/g, "")}`} className="hover:text-aheers-green">
                  {store.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-aheers-green" />
                <span>{about.hours}</span>
              </li>
            </ul>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Status · {store.status === "open" ? "Open today" : "Currently closed"}
            </p>
          </div>

          <div className="rounded-2xl border border-aheers-green/10 bg-white p-6 md:p-7">
            <h2 className="font-display text-xl font-semibold text-aheers-green-dark">What we offer</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {about.services.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-aheers-mist px-3.5 py-1.5 text-xs font-semibold text-aheers-green-dark"
                >
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={cataloguePath(store.slug)} className="btn-primary">
                Browse products
              </Link>
              <Link href="/portal" className="btn-secondary">
                Infinity Rewards
              </Link>
            </div>
          </div>
        </div>

        <section className="page-shell mt-12 border-t border-aheers-green/10 pt-10">
          <p className="section-label">Also part of Aheers</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-aheers-green-dark">
            Explore the group
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/store/${s.slug}/about`}
                className="group rounded-2xl border border-aheers-green/10 bg-white p-4 transition hover:-translate-y-0.5 hover:border-aheers-green/25 hover:shadow-soft"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg text-white ${s.accentBg}`}
                >
                  {s.icon}
                </span>
                <p className="mt-3 text-sm font-semibold text-aheers-charcoal group-hover:text-aheers-green">
                  {s.shortName}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{s.tagline}</p>
              </Link>
            ))}
          </div>
          <p className="mt-6">
            <Link href="/about" className="text-sm font-semibold text-aheers-green hover:underline">
              About the Aheers group →
            </Link>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
