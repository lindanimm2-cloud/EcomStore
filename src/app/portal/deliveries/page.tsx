"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { ORDERS, CUSTOMERS, formatDate, formatCurrency } from "@/lib/data";
import { FLEET_VEHICLES } from "@/lib/fleet";
import { getStore } from "@/lib/stores";
import { useAuth } from "@/lib/auth-context";
import {
  loadQueue,
  requestCustomerDelivery,
  DeliveryJob,
} from "@/lib/delivery-queue";
import { STORES } from "@/lib/stores";
import { PrettySelect } from "@/components/pretty-select";
import { ArrowLeft, Truck, MapPin, Clock, Phone, Plus, CheckCircle, ChevronRight } from "lucide-react";
import { orderHref, orderTrackHref } from "@/lib/order-helpers";

export default function DeliveriesPage() {
  const { user } = useAuth();
  const profile =
    CUSTOMERS.find((c) => c.id === user?.customerId) ??
    CUSTOMERS.find((c) => c.email.toLowerCase() === (user?.email ?? "").toLowerCase()) ??
    null;

  const [queue, setQueue] = useState<DeliveryJob[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState("Greytown");
  const [note, setNote] = useState("");
  const [storeSlug, setStoreSlug] = useState("supermarket");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (profile?.address) setAddress(profile.address);
  }, [profile?.address]);

  useEffect(() => {
    setQueue(loadQueue());
    const refresh = () => setQueue(loadQueue());
    window.addEventListener("aheers:delivery-queue", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("aheers:delivery-queue", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const myJobs = profile
    ? queue.filter((j) => j.customerId === profile.id || j.customerName === profile.name)
    : queue.filter((j) => j.customerName === user?.name || j.customerId === user?.customerId);
  const openJobs = myJobs.filter((j) => j.status !== "delivered");
  const doneJobs = myJobs.filter((j) => j.status === "delivered");

  const activeDeliveries = profile
    ? ORDERS.filter(
        (o) => o.customerId === profile.id && ["processing", "dispatched"].includes(o.status)
      )
    : [];
  const pastDeliveries = profile
    ? ORDERS.filter(
        (o) =>
          o.customerId === profile.id &&
          o.type === "delivery" &&
          ["delivered", "cancelled"].includes(o.status)
      )
    : [];

  function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    requestCustomerDelivery({
      customerName: profile?.name ?? user?.name ?? "Guest",
      customerId: profile?.id ?? user?.customerId ?? user?.id ?? "guest",
      address: address.trim(),
      phone: profile?.phone ?? "",
      note: note.trim() || "Customer requested delivery",
      storeSlug,
    });
    setQueue(loadQueue());
    setNote("");
    setShowForm(false);
    setToast("Delivery requested · drivers see it in New queue");
    setTimeout(() => setToast(""), 2800);
  }

  return (
    <>
      <StoreSwitcher />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-aheers-green py-8 text-white">
          <div className="mx-auto max-w-4xl px-4">
            <Link href="/portal" className="mb-4 inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100">
              <ArrowLeft className="h-4 w-4" /> Back to account
            </Link>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">My Deliveries</h1>
                <p className="mt-1 opacity-80">
                  Live tracking · Request delivery · Driver notes ·{" "}
                  {profile?.name ?? user?.name ?? "Your account"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl bg-aheers-gold px-4 py-2.5 text-sm font-bold text-aheers-green-dark"
              >
                <Plus className="h-4 w-4" /> Request delivery
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
          {showForm && (
            <form onSubmit={submitRequest} className="card space-y-3 p-5">
              <h2 className="font-semibold text-aheers-green-dark">Request a delivery</h2>
              <p className="text-sm text-gray-500">
                Sends a job to the driver delivery queue as <strong>New</strong> (customer request). Drivers can accept it from the app.
              </p>
              <div>
                <PrettySelect
                  label="Store"
                  value={storeSlug}
                  onChange={setStoreSlug}
                  options={STORES.map((s) => ({ value: s.slug, label: s.name }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Delivery address</label>
                <input className="field" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Note for driver</label>
                <textarea
                  className="field"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Same-day please · call on arrival"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit request
                </button>
              </div>
            </form>
          )}

          {openJobs.length > 0 && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Truck className="h-5 w-5 text-aheers-green" /> Your delivery requests
              </h2>
              <div className="space-y-3">
                {openJobs.map((j) => (
                  <div key={j.id} className="card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{j.orderId}</p>
                        <p className="text-sm text-gray-500">{j.address}</p>
                        {j.note && <p className="mt-1 text-xs italic text-gray-400">{j.note}</p>}
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                          j.status === "active"
                            ? "bg-amber-100 text-amber-800"
                            : j.status === "next"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-violet-100 text-violet-800"
                        }`}
                      >
                        {j.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      {j.requestedBy === "customer" ? "You requested this" : "Dispatched by Aheers"} ·{" "}
                      {getStore(j.storeSlug)?.name}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeDeliveries.length > 0 && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Truck className="h-5 w-5" /> Active orders
              </h2>
              <div className="space-y-4">
                {activeDeliveries.map((order) => {
                  const fleet = order.fleetId ? FLEET_VEHICLES.find((f) => f.id === order.fleetId) : null;
                  return (
                    <Link
                      key={order.id}
                      href={orderTrackHref(order.id)}
                      className="card block p-5 transition hover:border-aheers-green/25 hover:shadow-lift"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-aheers-green-dark">{order.id}</p>
                          <p className="text-sm text-gray-500">
                            {getStore(order.storeSlug)?.name} · {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium capitalize text-amber-800">
                          {order.status} · Live
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                      {fleet && (
                        <div className="mt-4 space-y-3">
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-4 w-4" /> {fleet.destination}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-4 w-4" /> ETA {fleet.eta}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-4 w-4" /> {fleet.phone}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-aheers-green">Open live tracking →</p>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {doneJobs.length > 0 && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <CheckCircle className="h-5 w-5 text-aheers-green" /> Delivered · driver notes
              </h2>
              <div className="space-y-3">
                {doneJobs.map((j) => (
                  <div key={j.id} className="card p-4">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-medium">{j.orderId}</p>
                        <p className="text-sm text-gray-500">{j.address}</p>
                      </div>
                      {j.total > 0 && (
                        <p className="text-sm font-semibold text-aheers-green">{formatCurrency(j.total)}</p>
                      )}
                    </div>
                    {j.deliveredNote && (
                      <p className="mt-2 rounded-lg bg-aheers-mist px-3 py-2 text-sm text-aheers-green-dark">
                        Driver note: {j.deliveredNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-4 text-lg font-semibold">Past order history</h2>
            <div className="space-y-3">
              {pastDeliveries.length === 0 && (
                <p className="text-sm text-gray-500">No past deliveries for this account.</p>
              )}
              {pastDeliveries.map((order) => (
                <Link
                  key={order.id}
                  href={orderHref(order.id)}
                  className="card flex justify-between p-4 text-sm transition hover:border-aheers-green/20"
                >
                  <div>
                    <p className="font-medium text-aheers-charcoal">{order.id}</p>
                    <p className="text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 capitalize text-gray-500">
                    {order.status}
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-aheers-green-dark px-4 py-2 text-sm font-medium text-white shadow-lift">
          {toast}
        </div>
      )}
    </>
  );
}
