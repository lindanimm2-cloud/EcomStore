"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StoreSwitcher, StoreHeader, SiteFooter } from "@/components/layout";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/data";
import { getStore } from "@/lib/stores";
import { storeHomePath } from "@/lib/store-paths";
import { StoreSlug } from "@/lib/types";
import { CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const store = getStore(slug);
  const { items, total, clearCart, setActiveStore, getCartCount } = useCart();
  const [step, setStep] = useState<"fulfilment" | "payment" | "done">("fulfilment");
  const [fulfilment, setFulfilment] = useState("delivery");
  const [orderRef] = useState(() => `ORD-${1040 + Math.floor(Math.random() * 50)}`);

  useEffect(() => {
    if (slug) setActiveStore(slug as StoreSlug);
  }, [slug, setActiveStore]);

  useEffect(() => {
    if (step === "done") return;
    if (slug && getCartCount(slug as StoreSlug) === 0 && items.length === 0) {
      router.replace(`/store/${slug}/cart`);
    }
  }, [step, slug, items.length, getCartCount, router]);

  const fulfilmentOptions = useMemo(() => {
    const base = [
      { id: "delivery", label: "Home delivery", desc: "Same-day or scheduled slot" },
      { id: "collection", label: "Store pickup", desc: "Collect in store" },
    ];
    if (slug === "grabngo") {
      return [
        ...base,
        { id: "express", label: "Express (Grab n Go)", desc: "Ready in ~10 minutes" },
      ];
    }
    if (slug === "supermarket" || slug === "foodworks") {
      return [
        ...base,
        { id: "curbside", label: "Curbside pickup", desc: "We bring it to your car" },
      ];
    }
    return base;
  }, [slug]);

  if (step === "done") {
    return (
      <>
        <StoreSwitcher />
        <StoreHeader storeSlug={slug as StoreSlug} />
        <main className="page-shell mx-auto max-w-lg py-16 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-aheers-green" />
          <h2 className="font-display text-2xl font-semibold text-aheers-green-dark">Order confirmed</h2>
          <p className="mt-2 text-sm text-gray-500">
            Reference <span className="font-mono font-semibold text-aheers-charcoal">{orderRef}</span>
          </p>
          <p className="mt-2 text-gray-500">
            Track with your order number on Track order — no account required.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={`/order/${orderRef}/track`} className="btn-primary">
              Live track order
            </Link>
            <Link href={storeHomePath(slug)} className="btn-secondary">
              Continue shopping
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Have an account?{" "}
            <Link href="/portal/deliveries" className="font-semibold text-aheers-green hover:underline">
              Open deliveries
            </Link>
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (!store) return null;

  return (
    <>
      <StoreSwitcher />
      <StoreHeader storeSlug={slug as StoreSlug} />
      <main className="page-shell mx-auto max-w-2xl py-8">
        <h2 className="mb-6 font-display text-2xl font-semibold text-aheers-green-dark">Checkout</h2>

        {step === "fulfilment" && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="mb-3 font-semibold">How would you like to receive your order?</h3>
              {fulfilmentOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`mb-2 flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                    fulfilment === opt.id ? "border-aheers-green bg-aheers-mist" : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="fulfilment"
                    checked={fulfilment === opt.id}
                    onChange={() => setFulfilment(opt.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">{opt.label}</p>
                    <p className="text-sm text-gray-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-between rounded-xl bg-[#f7f9f8] px-4 py-3 text-sm">
              <span className="text-gray-500">Order total</span>
              <span className="font-bold text-aheers-green-dark">{formatCurrency(total)}</span>
            </div>
            <button type="button" onClick={() => setStep("payment")} className="btn-primary w-full">
              Continue to payment
            </button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <div className="card space-y-3 p-5">
              <h3 className="font-semibold">Payment (demo)</h3>
              <p className="text-sm text-gray-500">
                Card, Instant EFT and cash-on-delivery are simulated for this proposal demo.
              </p>
              <div className="rounded-xl bg-aheers-mist px-4 py-3 text-sm font-semibold text-aheers-green-dark">
                Pay {formatCurrency(total)} · {fulfilment}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                clearCart();
                setStep("done");
              }}
              className="btn-primary w-full"
            >
              Place order
            </button>
            <button type="button" onClick={() => setStep("fulfilment")} className="btn-secondary w-full">
              Back
            </button>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
