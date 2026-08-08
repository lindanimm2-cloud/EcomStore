"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { StoreSwitcher, StoreHeader, SiteFooter } from "@/components/layout";
import { CartLineItem, EmptyState } from "@/components/products";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/data";
import { getStore } from "@/lib/stores";
import { storeHomePath } from "@/lib/store-paths";
import { StoreSlug } from "@/lib/types";

export default function CartPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const store = getStore(slug);
  const { items, total, updateQty, removeItem, setActiveStore } = useCart();

  useEffect(() => {
    if (slug) setActiveStore(slug as StoreSlug);
  }, [slug, setActiveStore]);

  return (
    <>
      <StoreSwitcher />
      <StoreHeader storeSlug={slug as StoreSlug} />
      <main className="page-shell max-w-3xl pb-16 pt-6 md:pt-8">
        <Link
          href={storeHomePath(slug)}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-aheers-green hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {store?.shortName ?? "store"}
        </Link>

        <p className="section-label">Checkout</p>
        <h2 className="mt-1 font-display text-3xl font-semibold text-aheers-green-dark">Your cart</h2>
        {store && (
          <p className="mt-1 text-sm text-gray-500">Items from {store.name}</p>
        )}

        {items.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              message="Your cart is empty."
              action={
                <Link href={storeHomePath(slug)} className="btn-primary">
                  Start shopping
                </Link>
              }
            />
          </div>
        ) : (
          <>
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-aheers-green/10 bg-white p-4 shadow-soft sm:p-6">
              {items.map((item) => {
                const price =
                  item.product.bulkPrice && item.qty >= (item.product.minQty ?? 0)
                    ? item.product.bulkPrice
                    : item.product.memberPrice ?? item.product.price;
                return (
                  <CartLineItem
                    key={item.product.id}
                    product={item.product}
                    price={price}
                    qty={item.qty}
                    onUpdate={(q) => updateQty(item.product.id, q)}
                    onRemove={() => removeItem(item.product.id)}
                  />
                );
              })}
              <div className="mt-2 flex items-center justify-between border-t border-aheers-green/10 pt-5">
                <span className="text-base font-semibold text-aheers-charcoal">Total</span>
                <span className="text-2xl font-bold text-aheers-green-dark">{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push(`/store/${slug}/checkout`)}
                className="btn-primary flex-1 py-3.5"
              >
                Proceed to checkout
              </button>
              <Link href={storeHomePath(slug)} className="btn-secondary justify-center py-3.5">
                Continue shopping
              </Link>
            </div>
            <p className="mt-5 text-center text-xs text-gray-400">
              Orders sync across Aheers stores · Live inventory · Fleet dispatch for deliveries
            </p>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
