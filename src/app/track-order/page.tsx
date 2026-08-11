"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { ORDERS } from "@/lib/data";
import { getStore } from "@/lib/stores";
import {
  isLiveOrder,
  orderHref,
  orderTrackHref,
  resolveOrder,
} from "@/lib/order-helpers";
import { PackageSearch, ChevronRight, Radio } from "lucide-react";
import { OrderComplaintForm } from "@/components/order-complaint-form";

function TrackOrderInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initial = searchParams.get("ref") ?? "";
  const [id, setId] = useState(initial);
  const [queried, setQueried] = useState(initial);

  useEffect(() => {
    const ref = searchParams.get("ref") ?? "";
    setId(ref);
    setQueried(ref);
  }, [searchParams]);

  const order = queried ? resolveOrder(queried) : null;
  const recent = ORDERS.filter((o) => isLiveOrder(o)).slice(0, 3);
  const past = ORDERS.filter((o) => !isLiveOrder(o)).slice(0, 3);

  function goTrack(e: React.FormEvent) {
    e.preventDefault();
    const ref = id.trim();
    if (!ref) return;
    setQueried(ref);
    router.replace(`/track-order?ref=${encodeURIComponent(ref)}`);
  }

  function openOrder(orderId: string, live: boolean) {
    router.push(live ? orderTrackHref(orderId) : orderHref(orderId));
  }

  return (
    <>
      <PageHero
        eyebrow="Live status"
        title="Track order"
        subtitle="Enter your order number — try ORD-1043 or ORD-1046. Tap a result for live tracking or full order details."
      />
      <div className="page-shell flex justify-center py-10 sm:py-12">
        <div className="w-full max-w-lg space-y-6">
          <form className="surface flex gap-2 p-3" onSubmit={goTrack}>
            <input
              name="orderId"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="flex-1 rounded-xl border-0 bg-transparent px-3 py-2 text-sm outline-none"
              placeholder="ORD-XXXX"
            />
            <button type="submit" className="btn-primary">
              Track
            </button>
          </form>

          {queried && order && (
            <button
              type="button"
              onClick={() => openOrder(order.id, isLiveOrder(order))}
              className="card-hover group w-full p-5 text-left transition hover:border-aheers-green/25"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-aheers-green/10 text-aheers-green">
                  {isLiveOrder(order) ? <Radio className="h-5 w-5" /> : <PackageSearch className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-lg font-semibold text-aheers-green-dark">{order.id}</p>
                    <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-gray-300 transition group-hover:text-aheers-green" />
                  </div>
                  <p className="text-sm text-gray-500">
                    {getStore(order.storeSlug)?.name ?? "Aheers"} · {order.customerName}
                  </p>
                  <p className="mt-3 inline-flex rounded-full bg-aheers-mist px-3 py-1 text-xs font-semibold capitalize text-aheers-green">
                    {order.status}
                    {isLiveOrder(order) ? " · Live track" : " · View order"}
                  </p>
                  <ul className="mt-4 space-y-1 text-sm text-gray-600">
                    {order.items.slice(0, 4).map((item, i) => (
                      <li key={i}>
                        {item.qty}× {item.name}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs font-semibold text-aheers-green">
                    {isLiveOrder(order) ? "Tap for live tracking →" : "Tap for order details →"}
                  </p>
                </div>
              </div>
            </button>
          )}

          {queried && !order && (
            <p className="text-center text-sm text-gray-500">No order found for that reference.</p>
          )}

          {queried && order && <OrderComplaintForm order={order} compact />}

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Active orders
            </h2>
            <div className="space-y-2">
              {recent.map((o) => (
                <Link
                  key={o.id}
                  href={orderTrackHref(o.id)}
                  className="flex items-center justify-between rounded-2xl border border-aheers-green/10 bg-white px-4 py-3 shadow-soft transition hover:border-aheers-green/25"
                >
                  <div>
                    <p className="text-sm font-semibold text-aheers-charcoal">{o.id}</p>
                    <p className="text-xs text-gray-400">
                      {getStore(o.storeSlug)?.shortName} · {o.status}
                    </p>
                  </div>
                  <span className="rounded-full bg-aheers-mist px-2.5 py-1 text-[10px] font-bold text-aheers-green">
                    Live
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Recent / past orders
            </h2>
            <div className="space-y-2">
              {past.map((o) => (
                <Link
                  key={o.id}
                  href={orderHref(o.id)}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-soft transition hover:border-aheers-green/20"
                >
                  <div>
                    <p className="text-sm font-semibold text-aheers-charcoal">{o.id}</p>
                    <p className="text-xs text-gray-400">
                      {getStore(o.storeSlug)?.shortName} · {o.status}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </Link>
              ))}
            </div>
          </section>

          <p className="text-center text-sm">
            <Link href="/portal/deliveries" className="font-semibold text-aheers-green hover:underline">
              Signed in? Open my deliveries →
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default function TrackOrderPage() {
  return (
    <>
      <StoreSwitcher />
      <main className="pb-24 md:pb-0">
        <Suspense fallback={<div className="page-shell py-16 text-center text-sm text-gray-400">Loading…</div>}>
          <TrackOrderInner />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
