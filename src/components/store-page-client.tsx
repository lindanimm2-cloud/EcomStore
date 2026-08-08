"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { StorefrontExperience } from "@/components/storefront-experience";
import { getStore } from "@/lib/stores";
import { useCart } from "@/lib/cart-context";

export function StorePageClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const store = getStore(slug);
  const { setActiveStore } = useCart();
  const initialCategory = searchParams.get("category") ?? undefined;
  const initialDepartment = searchParams.get("department") ?? undefined;
  const initialShowAll =
    searchParams.get("view") === "all" || Boolean(initialCategory) || Boolean(initialDepartment);

  useEffect(() => {
    if (store) setActiveStore(store.slug);
  }, [store, setActiveStore]);

  if (!store) return null;

  return (
    <>
      <StoreSwitcher />
      <main>
        <StorefrontExperience
          key={`${slug}-${initialCategory ?? ""}-${initialDepartment ?? ""}-${initialShowAll ? "all" : ""}`}
          store={store}
          initialCategory={initialCategory}
          initialDepartment={initialDepartment}
          initialShowAll={initialShowAll}
        />
      </main>
      <SiteFooter />
    </>
  );
}
