"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StoreSwitcher, StoreHeader, SiteFooter } from "@/components/layout";
import { CartLineItem, EmptyState } from "@/components/products";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/data";
import { StoreSlug } from "@/lib/types";
import { CheckCircle } from "lucide-react";

export default function CartPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { items, total, updateQty, removeItem, setActiveStore } = useCart();
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    if (slug) setActiveStore(slug as StoreSlug);
  }, [slug, setActiveStore]);

  if (ordered) {
    return (
      <>
        <StoreSwitcher />
        <StoreHeader storeSlug={slug as StoreSlug} />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold">Order Placed!</h2>
          <p className="mt-2 text-gray-500">Your order has been placed. Track it in your account portal.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/portal" className="btn-primary">
              View in Portal
            </Link>
            <Link href={`/store/${slug}`} className="btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <StoreSwitcher />
      <StoreHeader storeSlug={slug as StoreSlug} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">Your Cart</h2>
        {items.length === 0 ? (
          <EmptyState
            message="Your cart is empty."
            action={
              <Link href={`/store/${slug}`} className="btn-primary">
                Start Shopping
              </Link>
            }
          />
        ) : (
          <>
            <div className="card p-6">
              {items.map((item) => {
                const price =
                  item.product.bulkPrice && item.qty >= (item.product.minQty ?? 0)
                    ? item.product.bulkPrice
                    : item.product.price;
                return (
                  <CartLineItem
                    key={item.product.id}
                    name={item.product.name}
                    price={price}
                    qty={item.qty}
                    onUpdate={(q) => updateQty(item.product.id, q)}
                    onRemove={() => removeItem(item.product.id)}
                  />
                );
              })}
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-aheers-green">{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => router.push(`/store/${slug}/checkout`)} className="btn-primary flex-1">
                Proceed to checkout
              </button>
              <Link href={`/store/${slug}`} className="btn-secondary">
                Continue Shopping
              </Link>
            </div>
            <p className="mt-4 text-center text-xs text-gray-400">
              Orders sync across all Aheers stores · Inventory updates in real-time · Fleet dispatch for deliveries
            </p>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
