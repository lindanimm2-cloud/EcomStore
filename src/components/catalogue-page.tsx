"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";
import { StoreSwitcher, StoreHeader, SiteFooter } from "@/components/layout";
import { ProductGrid } from "@/components/products";
import { useCart } from "@/lib/cart-context";
import { getCategories, getDepartments, getProductsByStore } from "@/lib/products";
import { categoryEmoji } from "@/lib/category-emoji";
import { departmentEmoji, findDepartmentByName } from "@/lib/supermarket-taxonomy";
import {
  cataloguePath,
  categoryPath,
  departmentPath,
  departmentsPath,
  storeHomePath,
} from "@/lib/store-paths";
import { Store, StoreSlug } from "@/lib/types";

type CatalogueMode = "all" | "department" | "category";

export function CataloguePageClient({
  store,
  mode,
  department,
  category,
}: {
  store: Store;
  mode: CatalogueMode;
  department?: string;
  category?: string;
}) {
  const { setActiveStore } = useCart();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setActiveStore(store.slug);
  }, [store.slug, setActiveStore]);

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);

  const products = useMemo(() => getProductsByStore(store.slug), [store.slug]);
  const categories = useMemo(() => getCategories(store.slug), [store.slug]);
  const departments = useMemo(() => getDepartments(store.slug), [store.slug]);
  const isSupermarket = store.slug === "supermarket";

  const filtered = useMemo(() => {
    let list = products;
    if (mode === "department" && department) {
      list = list.filter((p) => p.department === department);
    } else if (mode === "category" && category) {
      list = list.filter((p) => p.category === category);
    }
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter((p) =>
      `${p.name} ${p.category} ${p.department ?? ""} ${p.description}`
        .toLowerCase()
        .includes(term)
    );
  }, [products, mode, department, category, q]);

  const title =
    mode === "department" && department
      ? department
      : mode === "category" && category
        ? category
        : "Full catalogue";

  const subtitle =
    mode === "all"
      ? `All ${store.shortName} products · ${products.length} items`
      : `${filtered.length} product${filtered.length === 1 ? "" : "s"}`;

  const subcats =
    isSupermarket && department
      ? (findDepartmentByName(department)?.categories.map((c) => c.name) ?? []).filter((name) =>
          products.some((p) => p.department === department && p.category === name)
        )
      : [];

  type Chip = { label: string; href: string; active: boolean; icon: string };
  const chips: Chip[] = useMemo(() => {
    if (mode === "department" && department) {
      const list: Chip[] = [
        {
          label: "All",
          href: departmentPath(store.slug, department),
          active: !category,
          icon: departmentEmoji(department),
        },
      ];
      for (const name of subcats) {
        list.push({
          label: name,
          href: categoryPath(store.slug, name),
          active: category === name,
          icon: categoryEmoji(name),
        });
      }
      return list;
    }

    if (mode === "all" && isSupermarket) {
      return departments.map((name) => ({
        label: name,
        href: departmentPath(store.slug, name),
        active: false,
        icon: departmentEmoji(name),
      }));
    }

    return categories.map((name) => ({
      label: name,
      href: categoryPath(store.slug, name),
      active: category === name,
      icon: categoryEmoji(name),
    }));
  }, [mode, department, category, store.slug, subcats, categories, departments, isSupermarket]);

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
          <Link href={departmentsPath(store.slug)} className="hover:text-aheers-green">
            Departments
          </Link>
          {department && (
            <>
              <ChevronRight className="h-3 w-3" />
              {mode === "category" ? (
                <Link href={departmentPath(store.slug, department)} className="hover:text-aheers-green">
                  {department}
                </Link>
              ) : (
                <span className="text-aheers-green-dark">{department}</span>
              )}
            </>
          )}
          {category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-aheers-green-dark">{category}</span>
            </>
          )}
          {mode === "all" && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-aheers-green-dark">Catalogue</span>
            </>
          )}
        </nav>

        <header className="mb-6">
          <p className="section-label">{store.shortName}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-aheers-green-dark md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </header>

        {mode === "department" && department && subcats.length > 0 && !category && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-aheers-green/10 bg-white shadow-soft">
            <Link
              href={departmentsPath(store.slug)}
              className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 text-xs font-bold uppercase tracking-wide text-aheers-green hover:bg-aheers-mist"
            >
              ← Back to departments
            </Link>
            {subcats.map((name) => {
              const count = products.filter(
                (p) => p.department === department && p.category === name
              ).length;
              return (
                <Link
                  key={name}
                  href={categoryPath(store.slug, name)}
                  className="flex items-center gap-3 border-b border-gray-100 px-4 py-3.5 transition last:border-b-0 hover:bg-aheers-mist"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f5f4] text-lg">
                    {categoryEmoji(name)}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-aheers-charcoal">{name}</span>
                    <span className="text-xs text-gray-400">{count} items</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              );
            })}
          </div>
        )}

        {chips.length > 0 && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {mode === "all" && (
              <Link
                href={cataloguePath(store.slug)}
                className="shrink-0 rounded-full bg-aheers-green px-3.5 py-2 text-xs font-semibold text-white"
              >
                All products
              </Link>
            )}
            {chips.map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                  chip.active
                    ? "bg-aheers-green text-white"
                    : "bg-white text-aheers-charcoal ring-1 ring-aheers-green/15 hover:ring-aheers-green/30"
                }`}
              >
                <span>{chip.icon}</span>
                {chip.label}
              </Link>
            ))}
          </div>
        )}

        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}…`}
            className="mobile-search"
          />
        </div>

        {q && (
          <p className="mb-4 text-sm text-gray-500">
            {filtered.length} result{filtered.length === 1 ? "" : "s"} for “{q}”
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-aheers-green/20 bg-white px-6 py-16 text-center">
            <p className="font-display text-xl text-aheers-green-dark">No products found</p>
            <p className="mt-2 text-sm text-gray-500">Try another search or browse a different aisle.</p>
            <Link href={cataloguePath(store.slug)} className="btn-primary mt-5 inline-flex">
              View full catalogue
            </Link>
          </div>
        ) : (
          <ProductGrid products={filtered} />
        )}
      </main>
      <SiteFooter />
    </>
  );
}
