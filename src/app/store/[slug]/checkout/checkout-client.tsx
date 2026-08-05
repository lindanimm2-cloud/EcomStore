"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { StoreSwitcher, StoreHeader, SiteFooter } from "@/components/layout";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/data";
import { StoreSlug } from "@/lib/types";
import { CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState<"fulfilment" | "payment" | "done">("fulfilment");
  const [fulfilment, setFulfilment] = useState("delivery");

  if (step === "done") {
    return (
      <>
        <StoreSwitcher />
        <StoreHeader storeSlug={slug as StoreSlug} />
        <main className="mx-auto max-w-lg px-4 py-16 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-aheers-green" />
          <h2 className="text-2xl font-bold">Order confirmed!</h2>
          <p className="mt-2 text-gray-500">Track delivery and rewards in your account.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/portal/deliveries" className="btn-primary">
              Track delivery
            </Link>
            <Link href={`/store/${slug}`} className="btn-secondary">
              Continue shopping
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (items.length === 0) {
    router.replace(`/store/${slug}/cart`);
    return null;
  }

  return (
    <>
      <StoreSwitcher />
      <StoreHeader storeSlug={slug as StoreSlug} />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">Checkout</h2>

        {step === "fulfilment" && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="mb-3 font-semibold">How would you like to receive your order?</h3>
              {[
                { id: "delivery", label: "Home delivery", desc: "Same-day or scheduled slot" },
                { id: "collection", label: "Store pickup", desc: "Collect in store" },
                { id: "curbside", label: "Curbside pickup", desc: "We bring it to your car" },
                { id: "express", label: "Express (Grab n Go)", desc: "Ready in ~10 minutes" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`mb-2 flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                    fulfilment === opt.id ? "border-aheers-green bg-aheers-cream" : "border-gray-200"
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
            <button onClick={() => setStep("payment")} className="btn-primary w-full">
              Continue to payment
            </button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="mb-3 font-semibold">Payment</h3>
              {["Card (PayFast)", "Ozow EFT", "Wallet balance", "Rewards cashback", "Pay in store"].map((m) => (
                <label key={m} className="mb-2 flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <input type="radio" name="pay" defaultChecked={m.startsWith("Card")} />
                  <span className="text-sm font-medium">{m}</span>
                </label>
              ))}
            </div>
            <div className="card p-5">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-aheers-green">{formatCurrency(total)}</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">Earn 1% cashback on qualifying items with Infinity Rewards</p>
            </div>
            <button
              onClick={() => {
                clearCart();
                setStep("done");
              }}
              className="btn-primary w-full"
            >
              Place order (demo)
            </button>
            <button onClick={() => setStep("fulfilment")} className="btn-secondary w-full">
              Back
            </button>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
