"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreSwitcher, StoreHeader, SiteFooter } from "@/components/layout";
import { useCart } from "@/lib/cart-context";
import { getCategories, getDepartments, getProductsByStore } from "@/lib/products";
import { categoryEmoji } from "@/lib/category-emoji";
import { SUPERMARKET_DEPARTMENTS, departmentEmoji } from "@/lib/supermarket-taxonomy";
import {
  cataloguePath,
  categoryPath,
  departmentPath,
  storeHomePath,
} from "@/lib/store-paths";
import { Store, StoreSlug } from "@/lib/types";

export function DepartmentsPageClient({ store }: { store: Store }) {
  const { setActiveStore } = useCart();
  const products = useMemo(() => getProductsByStore(store.slug), [store.slug]);
  const categories = useMemo(() => getCategories(store.slug), [store.slug]);
  const departments = useMemo(() => getDepartments(store.slug), [store.slug]);
  const isSupermarket = store.slug === "supermarket";

  useEffect(() => {
    setActiveStore(store.slug);
  }, [store.slug, setActiveStore]);

  const rows = isSupermarket
    ? SUPERMARKET_DEPARTMENTS.filter((d) => departments.includes(d.name)).map((d) => ({
        key: d.id,
        name: d.name,
        icon: d.icon,
        href: departmentPath(store.slug, d.name),
        count: products.filter((p) => p.department === d.name).length,
      }))
    : categories.map((name) => ({
        key: name,
        name,
        icon: categoryEmoji(name),
        href: categoryPath(store.slug, name),
        count: products.filter((p) => p.category === name).length,
      }));

  return (
    <>
      <StoreSwitcher />
      <StoreHeader storeSlug={store.slug as StoreSlug} />
      <main className="page-shell pb-32 pt-6 md:pb-28 md:pt-8">
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
          <Link href={storeHomePath(store.slug)} className="hover:text-aheers-green">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-aheers-green-dark">Departments</span>
        </nav>

        <header className="mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
            {store.shortName}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-aheers-green-dark md:text-4xl">
            Shop by department
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Browse aisles across {store.shortName} — {products.length} products in stock.
          </p>
        </header>

        <div className="mt-6 overflow-hidden rounded-2xl border border-aheers-green/10 bg-white shadow-soft">
          <Link
            href={cataloguePath(store.slug)}
            className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3.5 text-left transition hover:bg-aheers-mist"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-aheers-mist text-lg">
              ✦
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-aheers-charcoal">All products</span>
              <span className="text-xs text-gray-400">{products.length} items</span>
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>

          {rows.map((row) => (
            <Link
              key={row.key}
              href={row.href}
              className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3.5 text-left transition last:border-b-0 hover:bg-aheers-mist"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f5f4] text-lg">
                {row.icon || departmentEmoji(row.name)}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-aheers-charcoal">{row.name}</span>
                <span className="text-xs text-gray-400">{row.count} items</span>
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
