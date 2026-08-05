import { Suspense } from "react";
import { StorePageClient } from "@/components/store-page-client";
import { getStore, STORES } from "@/lib/stores";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return STORES.map((s) => ({ slug: s.slug }));
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getStore(slug)) notFound();
  return (
    <Suspense fallback={<div className="page-shell py-16 text-center text-sm text-gray-400">Loading store…</div>}>
      <StorePageClient slug={slug} />
    </Suspense>
  );
}
