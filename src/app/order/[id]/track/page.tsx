"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { OrderLiveMap } from "@/components/order-live-map";
import { getStore } from "@/lib/stores";
import {
  formatDate,
  isLiveOrder,
  orderFleet,
  orderHref,
  orderSummaryLine,
  orderTimeline,
  resolveOrder,
} from "@/lib/order-helpers";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
  Truck,
  CheckCircle2,
  Circle,
} from "lucide-react";

export default function OrderLiveTrackPage() {
  const params = useParams();
  const router = useRouter();
  const id = decodeURIComponent(String(params.id ?? ""));
  const order = resolveOrder(id);
  const [tick, setTick] = useState(0);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    if (order && !isLiveOrder(order)) {
      router.replace(orderHref(order.id));
    }
  }, [order, router]);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 8000);
    const p = setTimeout(() => setPulse(false), 4000);
    return () => {
      clearInterval(t);
      clearTimeout(p);
    };
  }, []);

  if (!order) {
    return (
      <>
        <StoreSwitcher />
        <main className="page-shell py-20 text-center">
          <p className="text-gray-500">Order not found.</p>
          <Link href="/track-order" className="mt-4 inline-block font-semibold text-aheers-green">
            Back to track order
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (!isLiveOrder(order)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-400">
        Opening order details…
      </div>
    );
  }

  const store = getStore(order.storeSlug);
  const fleet = orderFleet(order);
  const timeline = orderTimeline(order);
  const etaLabel = fleet?.eta ?? (order.type === "collection" ? "~10 min" : "Updating…");

  return (
    <>
      <StoreSwitcher />
      <main className="min-h-screen bg-aheers-mist/50 pb-28 md:pb-12">
        <div className="bg-aheers-green text-white">
          <div className="page-shell py-5 sm:py-7">
            <div className="flex items-center justify-between gap-3">
              <Link
                href={orderHref(order.id)}
                className="inline-flex items-center gap-1 text-sm text-white/75 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Order details
              </Link>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
                <span className={`h-1.5 w-1.5 rounded-full bg-emerald-300 ${pulse ? "animate-ping" : ""}`} />
                Live
              </span>
            </div>
            <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {order.id}
            </h1>
            <p className="mt-1 text-sm text-white/65">{orderSummaryLine(order)}</p>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 px-3 py-3 backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Status</p>
                <p className="mt-0.5 text-sm font-bold capitalize">{order.status}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-3 backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">ETA</p>
                <p className="mt-0.5 flex items-center gap-1 text-sm font-bold">
                  <Clock className="h-3.5 w-3.5 text-aheers-gold" /> {etaLabel}
                </p>
              </div>
              <div className="col-span-2 rounded-2xl bg-white/10 px-3 py-3 backdrop-blur-sm sm:col-span-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">
                  {order.type === "collection" ? "Collect at" : "Delivering to"}
                </p>
                <p className="mt-0.5 truncate text-sm font-bold">
                  {order.type === "collection"
                    ? store?.shortName ?? "Store"
                    : order.deliveryAddress ?? fleet?.destination ?? "Greytown"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="page-shell space-y-5 py-5 sm:py-8">
          {order.type === "delivery" ? (
            <OrderLiveMap
              vehicle={fleet}
              destinationLabel={order.deliveryAddress ?? fleet?.destination}
            />
          ) : (
            <div className="rounded-2xl border border-aheers-green/10 bg-white p-6 text-center shadow-soft">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-aheers-mist text-3xl">
                🥪
              </div>
              <p className="mt-3 font-display text-lg font-semibold text-aheers-green-dark">
                Collection order
              </p>
              <p className="mt-1 text-sm text-gray-500">
                We’re preparing your order at {store?.name}. You’ll get a ready alert in the demo flow.
              </p>
            </div>
          )}

          {fleet && (
            <section className="rounded-2xl border border-aheers-green/10 bg-white p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aheers-mist text-aheers-green">
                  <Truck className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-aheers-charcoal">{fleet.driver}</p>
                  <p className="text-xs text-gray-400">
                    {fleet.name} · {fleet.capacity}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`tel:${fleet.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-aheers-green px-3 py-1.5 text-xs font-bold text-white"
                    >
                      <Phone className="h-3.5 w-3.5" /> Call driver
                    </a>
                    {fleet.destination && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-aheers-mist px-3 py-1.5 text-xs font-medium text-aheers-green-dark">
                        <Navigation className="h-3.5 w-3.5" /> {fleet.destination}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-aheers-green/10 bg-white p-5 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-aheers-green-dark">Tracking timeline</h2>
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                <RefreshCw className={`h-3 w-3 ${tick % 2 === 0 ? "animate-spin" : ""}`} />
                Updated just now
              </span>
            </div>
            <ol className="relative ml-2.5 space-y-0 border-l border-aheers-green/15">
              {timeline.map((step) => (
                <li key={step.key} className="relative pb-5 pl-5 last:pb-0">
                  <span className="absolute -left-[9px] top-0.5 bg-white">
                    {step.done || step.current ? (
                      <CheckCircle2
                        className={`h-4 w-4 ${step.current ? "text-aheers-gold" : "text-aheers-green"}`}
                      />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-200" />
                    )}
                  </span>
                  <p
                    className={`text-sm font-medium ${
                      step.current ? "text-aheers-green-dark" : step.done ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                    {step.current && (
                      <span className="ml-2 rounded-full bg-aheers-gold/20 px-2 py-0.5 text-[10px] font-bold text-aheers-green-dark">
                        Now
                      </span>
                    )}
                  </p>
                  {step.at && <p className="text-xs text-gray-400">{step.at}</p>}
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-aheers-green/10 bg-white p-5 shadow-soft">
            <h2 className="text-sm font-semibold text-aheers-green-dark">This delivery</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
              {order.items.map((item, i) => (
                <li key={`${item.productId}-${i}`}>
                  {item.qty}× {item.name}
                </li>
              ))}
            </ul>
            {order.deliveryAddress && (
              <p className="mt-3 flex items-start gap-1.5 text-xs text-gray-400">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {order.deliveryAddress} · placed {formatDate(order.createdAt)}
              </p>
            )}
            <Link
              href={orderHref(order.id)}
              className="mt-4 inline-flex text-sm font-semibold text-aheers-green hover:underline"
            >
              Full order details →
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
