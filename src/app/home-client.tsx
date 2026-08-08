"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { StorefrontExperience } from "@/components/storefront-experience";
import { getStore } from "@/lib/stores";
import { useCart } from "@/lib/cart-context";

/** Primary landing = Aheers Supermarket storefront */
export default function HomeClient() {
  const store = getStore("supermarket")!;
  const { setActiveStore } = useCart();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? undefined;
  const initialDepartment = searchParams.get("department") ?? undefined;
  const initialShowAll =
    searchParams.get("view") === "all" || Boolean(initialCategory) || Boolean(initialDepartment);

  useEffect(() => {
    setActiveStore("supermarket");
  }, [setActiveStore]);

  return (
    <>
      <StoreSwitcher />
      <main>
        <StorefrontExperience
          key={`${initialCategory ?? ""}-${initialDepartment ?? ""}-${initialShowAll ? "all" : ""}`}
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
