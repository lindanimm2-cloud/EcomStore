"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { getStore } from "@/lib/stores";
import {
  formatCurrency,
  formatDate,
  isLiveOrder,
  orderFleet,
  orderItemsTotal,
  orderSummaryLine,
  orderTimeline,
  orderTrackHref,
  resolveOrder,
} from "@/lib/order-helpers";
import {
  ArrowLeft,
  MapPin,
  Package,
  Phone,
  Truck,
  CheckCircle2,
  Circle,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(String(params.id ?? ""));
  const order = resolveOrder(id);

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

  const store = getStore(order.storeSlug);
  const fleet = orderFleet(order);
  const live = isLiveOrder(order);
  const timeline = orderTimeline(order);
  const lineTotal = orderItemsTotal(order);
  const total = order.total || lineTotal;

  return (
    <>
      <StoreSwitcher />
      <main className="min-h-screen bg-aheers-mist/60 pb-28 md:pb-12">
        <div className="bg-aheers-green-dark text-white">
          <div className="page-shell py-6 sm:py-8">
            <Link
              href="/track-order"
              className="mb-4 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Track order
            </Link>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-aheers-gold">
                  Order details
                </p>
                <h1 className="font-display text-3xl font-semibold tracking-tight">{order.id}</h1>
                <p className="mt-1 text-sm text-white/55">{orderSummaryLine(order)}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                  order.status === "delivered"
                    ? "bg-emerald-400/20 text-emerald-200"
                    : order.status === "cancelled"
                      ? "bg-red-400/20 text-red-200"
                      : "bg-aheers-gold/20 text-aheers-gold"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div className="page-shell space-y-5 py-6 sm:py-8">
          {live && (
            <Link
              href={orderTrackHref(order.id)}
              className="flex items-center justify-between gap-3 rounded-2xl bg-aheers-green px-4 py-4 text-white shadow-lift transition hover:bg-aheers-green-light"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <Truck className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold">Open live tracking</span>
                  <span className="text-xs text-white/70">
                    {fleet?.eta ? `ETA ${fleet.eta}` : "Status, map & updates"}
                  </span>
                </span>
              </span>
              <span className="text-sm font-semibold text-aheers-gold">View →</span>
            </Link>
          )}

          <section className="rounded-2xl border border-aheers-green/10 bg-white p-5 shadow-soft sm:p-6">
            <h2 className="text-sm font-semibold text-aheers-green-dark">Progress</h2>
            <ol className="mt-4 space-y-3">
              {timeline.map((step) => (
                <li key={step.key} className="flex items-start gap-3">
                  {step.done || step.current ? (
                    <CheckCircle2
                      className={`mt-0.5 h-5 w-5 shrink-0 ${
                        step.current ? "text-aheers-gold" : "text-aheers-green"
                      }`}
                    />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-gray-200" />
                  )}
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        step.current ? "text-aheers-green-dark" : step.done ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.at && <p className="text-xs text-gray-400">{step.at}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-aheers-green/10 bg-white p-5 shadow-soft sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-aheers-green" />
              <h2 className="text-sm font-semibold text-aheers-green-dark">Items</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item, i) => (
                <li key={`${item.productId}-${i}`} className="flex justify-between gap-3 py-3 text-sm">
                  <span className="min-w-0 text-gray-700">
                    <span className="font-medium text-aheers-charcoal">
                      {item.qty}× {item.name}
                    </span>
                    {item.price > 0 && (
                      <span className="mt-0.5 block text-xs text-gray-400">
                        {formatCurrency(item.price)} each
                      </span>
                    )}
                  </span>
                  {item.price > 0 && (
                    <span className="shrink-0 font-semibold text-aheers-green-dark">
                      {formatCurrency(item.price * item.qty)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {total > 0 && (
              <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-sm font-bold text-aheers-green-dark">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-aheers-green/10 bg-white p-5 shadow-soft sm:p-6">
            <h2 className="text-sm font-semibold text-aheers-green-dark">Fulfilment</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-gray-400">Type</dt>
                <dd className="font-medium capitalize text-aheers-charcoal">{order.type}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-400">Store</dt>
                <dd className="font-medium text-aheers-charcoal">{store?.name}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-400">Placed</dt>
                <dd className="font-medium text-aheers-charcoal">{formatDate(order.createdAt)}</dd>
              </div>
              {order.deliveryAddress && (
                <div className="flex items-start justify-between gap-3">
                  <dt className="flex items-center gap-1 text-gray-400">
                    <MapPin className="h-3.5 w-3.5" /> Address
                  </dt>
                  <dd className="max-w-[60%] text-right font-medium text-aheers-charcoal">
                    {order.deliveryAddress}
                  </dd>
                </div>
              )}
              {store?.phone && (
                <div className="flex justify-between gap-3">
                  <dt className="flex items-center gap-1 text-gray-400">
                    <Phone className="h-3.5 w-3.5" /> Store phone
                  </dt>
                  <dd>
                    <a href={`tel:${store.phone.replace(/\s/g, "")}`} className="font-medium text-aheers-green">
                      {store.phone}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href="/track-order" className="btn-secondary">
              Track another
            </Link>
            <Link href="/portal/deliveries" className="btn-primary">
              My deliveries
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
