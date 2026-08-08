import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CataloguePageClient } from "@/components/catalogue-page";
import { getStore, STORES } from "@/lib/stores";
import { getCategories, getProductsByStore } from "@/lib/products";
import { findDepartmentByCategory } from "@/lib/supermarket-taxonomy";
import { resolveCategory, toPathSlug } from "@/lib/store-paths";

export function generateStaticParams() {
  const params: { slug: string; catSlug: string }[] = [];
  for (const store of STORES) {
    for (const name of getCategories(store.slug)) {
      params.push({ slug: store.slug, catSlug: toPathSlug(name) });
    }
  }
  return params;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; catSlug: string }>;
}) {
  const { slug, catSlug } = await params;
  const store = getStore(slug);
  if (!store) notFound();
  const category = resolveCategory(slug, catSlug);
  if (!category) notFound();

  const department =
    slug === "supermarket"
      ? findDepartmentByCategory(category)?.name
      : getProductsByStore(slug).find((p) => p.category === category)?.department;

  return (
    <Suspense fallback={<div className="page-shell py-16 text-center text-sm text-gray-400">Loading category…</div>}>
      <CataloguePageClient
        store={store}
        mode="category"
        category={category}
        department={department}
      />
    </Suspense>
  );
}
