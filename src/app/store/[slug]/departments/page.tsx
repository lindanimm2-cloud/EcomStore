import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DepartmentsPageClient } from "@/components/departments-page";
import { getStore, STORES } from "@/lib/stores";

export function generateStaticParams() {
  return STORES.map((s) => ({ slug: s.slug }));
}

export default async function DepartmentsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = getStore(slug);
  if (!store) notFound();

  return (
    <Suspense fallback={<div className="page-shell py-16 text-center text-sm text-gray-400">Loading departments…</div>}>
      <DepartmentsPageClient store={store} />
    </Suspense>
  );
}
