import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CataloguePageClient } from "@/components/catalogue-page";
import { getStore, STORES } from "@/lib/stores";
import { getDepartments } from "@/lib/products";
import { resolveDepartment, toPathSlug } from "@/lib/store-paths";
import { SUPERMARKET_DEPARTMENTS } from "@/lib/supermarket-taxonomy";

export function generateStaticParams() {
  const params: { slug: string; deptSlug: string }[] = [];
  for (const store of STORES) {
    if (store.slug === "supermarket") {
      for (const d of SUPERMARKET_DEPARTMENTS) {
        params.push({ slug: store.slug, deptSlug: toPathSlug(d.name) });
      }
    } else {
      for (const name of getDepartments(store.slug)) {
        params.push({ slug: store.slug, deptSlug: toPathSlug(name) });
      }
    }
  }
  return params;
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ slug: string; deptSlug: string }>;
}) {
  const { slug, deptSlug } = await params;
  const store = getStore(slug);
  if (!store) notFound();
  const department = resolveDepartment(slug, deptSlug);
  if (!department) notFound();

  return (
    <Suspense fallback={<div className="page-shell py-16 text-center text-sm text-gray-400">Loading department…</div>}>
      <CataloguePageClient store={store} mode="department" department={department} />
    </Suspense>
  );
}
