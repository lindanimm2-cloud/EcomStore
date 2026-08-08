import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./product-detail-client";
import { getProduct, PRODUCTS } from "@/lib/products";
import { getStore } from "@/lib/stores";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.storeSlug, id: p.id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  if (!getStore(slug)) notFound();
  const product = getProduct(id);
  if (!product || product.storeSlug !== slug) notFound();

  return (
    <Suspense fallback={<div className="page-shell py-16 text-center text-sm text-gray-400">Loading product…</div>}>
      <ProductDetailClient slug={slug} product={product} />
    </Suspense>
  );
}
