"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { StoreSwitcher, StoreHeader, SiteFooter } from "@/components/layout";
import { StoreSearch } from "@/components/store-search";
import { getStore } from "@/lib/stores";
import { getProductsByStore, getCategories } from "@/lib/products";
import { StoreSlug } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { KitchenStatus } from "@/components/kitchen-status";
import { HardwareServices } from "@/components/hardware-services";
import { StoreCartBar } from "@/components/products";

export function StorePageClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const store = getStore(slug);
  const { setActiveStore } = useCart();

  useEffect(() => {
    if (store) setActiveStore(store.slug);
  }, [store, setActiveStore]);

  if (!store) return null;

  const products = getProductsByStore(slug);
  const categories = getCategories(slug);

  return (
    <>
      <StoreSwitcher />
      <StoreHeader storeSlug={store.slug as StoreSlug} />
      <main className="page-shell py-8 pb-28">
        <div className={`relative mb-8 overflow-hidden rounded-3xl ${store.accentBg} p-8 text-white shadow-lift md:p-10`}>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold tracking-tight">{store.name}</h2>
            <p className="mt-3 max-w-xl text-white/90">{store.description}</p>
            <p className="mt-4 text-sm text-white/70">
              {store.address} · {store.phone}
              {store.promotion ? ` · ${store.promotion}` : ""}
            </p>
          </div>
        </div>

        {slug === "grabngo" && <KitchenStatus />}
        {slug === "buildsave" && <HardwareServices />}

        <div className="mb-6 flex flex-wrap gap-2">
          <Link href={`/store/${slug}`} className={!category ? "chip-active" : "chip-idle"}>
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/store/${slug}?category=${encodeURIComponent(cat)}`}
              className={category === cat ? "chip-active" : "chip-idle"}
            >
              {cat}
            </Link>
          ))}
        </div>

        <StoreSearch products={products} slug={store.shortName} category={category} />
      </main>
      <StoreCartBar storeSlug={store.slug} />
      <SiteFooter />
    </>
  );
}
