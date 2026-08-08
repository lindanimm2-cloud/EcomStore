"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DepartmentDrawer } from "@/components/department-drawer";
import { useCart } from "@/lib/cart-context";
import { getCategories } from "@/lib/products";
import { STORES, getStore } from "@/lib/stores";
import { StoreSlug } from "@/lib/types";
import {
  cataloguePath,
  categoryPath,
  departmentPath,
  storeHomePath,
} from "@/lib/store-paths";

export const OPEN_DEPARTMENTS_EVENT = "aheers:open-departments";

/** Open the shared department side menu from anywhere */
export function openDepartmentDrawer() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_DEPARTMENTS_EVENT));
}

function resolveSlug(pathname: string, activeStore: StoreSlug | null): StoreSlug {
  if (pathname === "/" || pathname.startsWith("/store/supermarket")) return "supermarket";
  const m = pathname.match(/^\/store\/([^/]+)/);
  if (m && STORES.some((s) => s.slug === m[1])) return m[1] as StoreSlug;
  return activeStore ?? "supermarket";
}

/** Global side menu — same drawer as storefront “Shop by department” */
export function GlobalDepartmentDrawer() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeStore, setActiveStore } = useCart();
  const [open, setOpen] = useState(false);

  const slug = resolveSlug(pathname, activeStore);
  const store = getStore(slug)!;
  const categories = useMemo(() => getCategories(slug), [slug]);
  const isSupermarket = slug === "supermarket";

  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener(OPEN_DEPARTMENTS_EVENT, onOpen);
    try {
      if (sessionStorage.getItem("aheers-open-dept") === "1") {
        sessionStorage.removeItem("aheers-open-dept");
        setOpen(true);
      }
    } catch {
      /* ignore */
    }
    return () => window.removeEventListener(OPEN_DEPARTMENTS_EVENT, onOpen);
  }, []);

  // Hide on staff surfaces
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/driver") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/trade")
  ) {
    return null;
  }

  return (
    <DepartmentDrawer
      open={open}
      onClose={() => setOpen(false)}
      categories={categories}
      storeName={store.shortName}
      mode={isSupermarket ? "taxonomy" : "flat"}
      onSelectDepartment={(dept) => {
        setOpen(false);
        setActiveStore(slug);
        router.push(departmentPath(slug, dept));
      }}
      onSelect={(cat) => {
        setOpen(false);
        setActiveStore(slug);
        if (!cat) router.push(cataloguePath(slug));
        else router.push(categoryPath(slug, cat));
      }}
    />
  );
}

/** Optional: ensure we’re on a store context before opening (unused if global drawer handles all pages) */
export function openDepartmentsForStore(slug: StoreSlug) {
  try {
    sessionStorage.setItem("aheers-open-dept", "1");
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    const onStore =
      (slug === "supermarket" && (path === "/" || path.startsWith("/store/supermarket"))) ||
      path.startsWith(`/store/${slug}`);
    if (!onStore) {
      window.location.href = storeHomePath(slug);
      return;
    }
  }
  openDepartmentDrawer();
}
