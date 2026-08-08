"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Heart, Minus, Plus, Share2, ShoppingBag, Store as StoreIcon, Truck } from "lucide-react";
import { StoreSwitcher, StoreHeader, SiteFooter } from "@/components/layout";
import { ProductGrid } from "@/components/products";
import { useCart } from "@/lib/cart-context";
import { getSimilarProducts } from "@/lib/products";
import { getStore } from "@/lib/stores";
import {
  cataloguePath,
  categoryPath,
  departmentPath,
  departmentsPath,
  storeHomePath,
} from "@/lib/store-paths";
import { Product, StoreSlug } from "@/lib/types";

export function ProductDetailClient({
  slug,
  product,
}: {
  slug: string;
  product: Product;
}) {
  const store = getStore(slug)!;
  const { getQty, addItem, updateQty, setActiveStore } = useCart();
  const [infoOpen, setInfoOpen] = useState(true);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setActiveStore(store.slug);
  }, [store.slug, setActiveStore]);

  const qty = getQty(product.id, product.storeSlug);
  const similar = getSimilarProducts(product, 4);
  const displayPrice = product.memberPrice ?? product.bulkPrice ?? product.price;
  const stockLabel =
    product.inStock <= 0 ? "Out of stock" : product.inStock < 20 ? "Low stock" : "In stock";
  const stockClass =
    product.inStock <= 0
      ? "bg-red-50 text-red-700"
      : product.inStock < 20
        ? "bg-amber-50 text-amber-800"
        : "bg-green-50 text-green-700";

  const rands = Math.floor(displayPrice);
  const cents = Math.round((displayPrice - rands) * 100)
    .toString()
    .padStart(2, "0");

  function bump(delta: number) {
    if (qty === 0 && delta > 0) {
      addItem(product, 1);
      return;
    }
    updateQty(product.id, qty + delta, product.storeSlug);
  }

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* ignore */
    }
  }

  const specs: { label: string; value: string }[] = [
    { label: "Department", value: product.department ?? store.shortName },
    { label: "Category", value: product.category },
    { label: "Unit", value: product.unit },
    { label: "SKU", value: product.id },
    ...(product.brand ? [{ label: "Brand", value: product.brand }] : []),
    ...(product.barcode ? [{ label: "Barcode", value: product.barcode }] : []),
    { label: "Availability", value: stockLabel },
    ...(product.memberPrice
      ? [{ label: "Member price", value: `R ${product.memberPrice.toFixed(2)}` }]
      : []),
    ...(product.bulkPrice && product.minQty
      ? [{ label: "Bulk from", value: `${product.minQty}+ @ R ${product.bulkPrice.toFixed(2)}` }]
      : []),
  ];

  return (
    <>
      <StoreSwitcher />
      <StoreHeader storeSlug={store.slug as StoreSlug} />
      <main className="page-shell pb-32 pt-6 md:pb-28 md:pt-8">
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
          <Link href={storeHomePath(slug)} className="hover:text-aheers-green">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={departmentsPath(slug)} className="hover:text-aheers-green">
            Departments
          </Link>
          {product.department && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link
                href={departmentPath(slug, product.department)}
                className="hover:text-aheers-green"
              >
                {product.department}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <Link href={categoryPath(slug, product.category)} className="hover:text-aheers-green">
            {product.category}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="max-w-[12rem] truncate text-aheers-green-dark sm:max-w-none">
            {product.name}
          </span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-aheers-green/10 bg-gradient-to-b from-aheers-mist via-white to-white shadow-soft">
            <div className="flex min-h-[16rem] items-center justify-center py-12 text-[7rem] leading-none md:min-h-[22rem] md:text-[9rem]">
              {product.image}
            </div>
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-aheers-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-aheers-green-dark">
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                {store.delivery && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-aheers-mist px-2.5 py-1 text-[11px] font-semibold text-aheers-green-dark">
                    <Truck className="h-3.5 w-3.5" /> Delivery & pickup
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setSaved((s) => !s)}
                  className="rounded-xl p-2 text-gray-500 transition hover:bg-aheers-mist hover:text-aheers-green"
                  aria-label="Save for later"
                >
                  <Heart className={`h-5 w-5 ${saved ? "fill-aheers-green text-aheers-green" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={share}
                  className="rounded-xl p-2 text-gray-500 transition hover:bg-aheers-mist hover:text-aheers-green"
                  aria-label="Share"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-aheers-green-dark md:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 font-display text-4xl font-semibold tracking-tight text-aheers-green-dark">
              R{rands}
              <sup className="ml-0.5 text-xl font-semibold">{cents}</sup>
              <span className="ml-2 text-base font-normal text-gray-400">{product.unit}</span>
            </p>
            {product.memberPrice && (
              <p className="mt-1 text-sm text-aheers-green">
                Infinity Rewards member price · was R {product.price.toFixed(2)}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stockClass}`}>
                {stockLabel}
                {product.inStock > 0 ? ` · ${product.inStock}` : ""}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-aheers-mist px-2.5 py-1 text-xs font-medium text-aheers-green-dark">
                <StoreIcon className="h-3.5 w-3.5" /> {store.shortName}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex h-12 items-center rounded-2xl bg-[#eef2ef] text-aheers-green-dark">
                <button
                  type="button"
                  onClick={() => bump(-1)}
                  disabled={qty === 0}
                  className="flex h-12 w-11 items-center justify-center rounded-l-2xl hover:bg-black/5 disabled:opacity-40"
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" strokeWidth={2.5} />
                </button>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-aheers-green text-sm font-bold text-white tabular-nums">
                  {Math.max(qty, 1)}
                </span>
                <button
                  type="button"
                  onClick={() => bump(1)}
                  disabled={product.inStock <= 0}
                  className="flex h-12 w-11 items-center justify-center rounded-r-2xl hover:bg-black/5 disabled:opacity-40"
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
              <button
                type="button"
                disabled={product.inStock <= 0}
                onClick={() => (qty === 0 ? bump(1) : bump(1))}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-aheers-gold px-5 py-3.5 text-sm font-bold text-aheers-green-dark shadow-soft transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:min-w-[12rem]"
              >
                <ShoppingBag className="h-4 w-4" />
                {qty === 0 ? "Add to basket" : "Add another"}
              </button>
            </div>

            {qty > 0 && (
              <Link
                href={`/store/${slug}/cart`}
                className="mt-3 text-sm font-semibold text-aheers-green hover:underline"
              >
                View cart ({qty}) →
              </Link>
            )}
          </div>
        </div>

        <section className="mt-12 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-semibold text-aheers-green-dark">
              Product information
            </h2>
            <div className={`mt-3 text-sm leading-relaxed text-gray-600 ${infoOpen ? "" : "line-clamp-3"}`}>
              <p>{product.description}</p>
              <p className="mt-3">
                Sourced for Aheers {store.shortName} in Greytown. Part of our{" "}
                {product.department ?? product.category} range — quality everyday essentials with
                Infinity Rewards member pricing where available.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setInfoOpen((o) => !o)}
              className="mt-3 text-sm font-semibold text-aheers-green hover:underline"
            >
              {infoOpen ? "Show less" : "Read more"}
            </button>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-aheers-green-dark">Specification</h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-aheers-green/10 bg-[#f7f9f8]">
              <button
                type="button"
                onClick={() => setSpecsOpen((o) => !o)}
                className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-aheers-charcoal"
              >
                Benefits & features
                <ChevronDown
                  className={`h-4 w-4 text-aheers-gold transition ${specsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {specsOpen && (
                <dl className="border-t border-aheers-green/10">
                  {specs.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-4 border-b border-aheers-green/5 px-4 py-3 text-sm last:border-b-0"
                    >
                      <dt className="font-medium text-aheers-charcoal">{row.label}</dt>
                      <dd className="text-right text-gray-600">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </section>

        {similar.length > 0 && (
          <section className="mt-12 md:mt-16">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="section-label">More to explore</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-aheers-green-dark">
                  Related products
                </h2>
              </div>
              <Link
                href={categoryPath(slug, product.category)}
                className="shrink-0 text-sm font-semibold text-aheers-green hover:underline"
              >
                See {product.category} →
              </Link>
            </div>
            <ProductGrid products={similar} />
            <div className="mt-8 text-center">
              <Link href={cataloguePath(slug)} className="btn-secondary inline-flex">
                Browse full catalogue
              </Link>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
