"use client";

import Link from "next/link";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { ORDERS, COMPETITIONS, CUSTOMERS, formatCurrency, formatDate } from "@/lib/data";
import { FLEET_VEHICLES } from "@/lib/fleet";
import { getStore } from "@/lib/stores";
import { useAuth } from "@/lib/auth-context";
import { Package, Gift, Star, Truck, User, ArrowLeft, LogOut } from "lucide-react";

export default function ClientPortalPage() {
  const { user, logout } = useAuth();
  const profile = (() => {
    const match =
      CUSTOMERS.find((c) => c.id === user?.customerId) ??
      CUSTOMERS.find((c) => c.email.toLowerCase() === (user?.email ?? "").toLowerCase());
    if (match) return match;
    return {
      ...CUSTOMERS[1],
      id: user?.customerId ?? `new-${user?.id}`,
      name: user?.name ?? "Customer",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      loyaltyPoints: 100,
      cashbackBalance: 0,
      walletBalance: 0,
      rewardsTier: "bronze" as const,
      infinityCardId: "INF-NEW",
      totalSpent: 0,
      type: "retail" as const,
      lastOrder: "",
      address: "",
      status: "active" as const,
    };
  })();

  const myOrders = ORDERS.filter((o) => o.customerId === profile.id);
  const activeCompetitions = COMPETITIONS.filter((c) => c.status === "active");

  return (
    <>
      <StoreSwitcher />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-aheers-green text-white">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="mb-4 flex items-center justify-between">
              <Link href="/" className="inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100">
                <ArrowLeft className="h-4 w-4" /> Back to stores
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  window.location.href = "/login/customer";
                }}
                className="inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl">
                <User className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm opacity-80">Welcome back</p>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-sm opacity-80 capitalize">
                  {profile.rewardsTier} · Infinity Rewards · {profile.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8 card overflow-hidden">
            <div className="bg-gradient-to-br from-aheers-green to-aheers-green-light p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider opacity-80">Aheers Rewards · Infinity</p>
                  <p className="text-lg font-bold">{profile.name}</p>
                  <p className="mt-1 font-mono text-sm opacity-90">{profile.infinityCardId}</p>
                </div>
                <span className="rounded-full bg-aheers-gold px-3 py-1 text-xs font-bold capitalize text-aheers-green-dark">
                  {profile.rewardsTier}
                </span>
              </div>
              <div className="mt-6 flex justify-center rounded-lg bg-white p-4">
                <div className="text-center text-aheers-green-dark">
                  <div className="mx-auto mb-2 flex h-24 w-48 items-center justify-center rounded border-2 border-dashed border-gray-300 bg-white font-mono text-xs">
                    ||||| QR CODE |||||
                  </div>
                  <p className="text-xs text-gray-500">Scan at checkout · 1% cashback on qualifying purchases</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-4">
            <div className="card p-5 text-center">
              <Star className="mx-auto mb-2 h-6 w-6 text-aheers-gold" />
              <p className="text-2xl font-bold text-aheers-green">{profile.loyaltyPoints.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Points</p>
            </div>
            <div className="card p-5 text-center">
              <p className="text-2xl font-bold text-aheers-green">{formatCurrency(profile.cashbackBalance)}</p>
              <p className="text-sm text-gray-500">Cashback</p>
            </div>
            <div className="card p-5 text-center">
              <p className="text-2xl font-bold">{formatCurrency(profile.walletBalance)}</p>
              <p className="text-sm text-gray-500">Wallet</p>
            </div>
            <div className="card p-5 text-center">
              <Package className="mx-auto mb-2 h-6 w-6 text-aheers-green-light" />
              <p className="text-2xl font-bold">{myOrders.length}</p>
              <p className="text-sm text-gray-500">Orders</p>
            </div>
          </div>

          {myOrders
            .filter((o) => o.status === "processing")
            .map((order) => {
              const fleet = order.fleetId ? FLEET_VEHICLES.find((f) => f.id === order.fleetId) : null;
              return (
                <div key={order.id} className="mb-8 card border-l-4 border-l-amber-400 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Order {order.id} — In Progress</p>
                      <p className="text-sm text-gray-500">
                        {getStore(order.storeSlug)?.name} · {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      Processing
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    {order.items.map((item) => (
                      <li key={item.productId}>
                        {item.qty}x {item.name} — R {(item.price * item.qty).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  {fleet && (
                    <div className="mt-4 flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                      <Truck className="h-5 w-5 text-aheers-green-light" />
                      <div>
                        <p className="text-sm font-medium">
                          {fleet.name} · {fleet.driver}
                        </p>
                        <p className="text-xs text-gray-500">
                          ETA {fleet.eta} · {fleet.destination}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Package className="h-5 w-5" /> Order History
            </h2>
            <div className="space-y-3">
              {myOrders.length === 0 && (
                <p className="text-sm text-gray-500">No orders yet — start shopping from the Super App home.</p>
              )}
              {myOrders.map((order) => (
                <div key={order.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {getStore(order.storeSlug)?.shortName} · {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(order.total)}</p>
                      <p className="text-xs capitalize text-gray-400">{order.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Gift className="h-5 w-5" /> Competitions
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {activeCompetitions.map((comp) => (
                <div key={comp.id} className="card p-5">
                  <span className="rounded-full bg-aheers-green/10 px-2 py-0.5 text-xs font-medium text-aheers-green">
                    Active
                  </span>
                  <h3 className="mt-2 font-semibold">{comp.title}</h3>
                  <p className="text-sm text-gray-500">Prize: {comp.prize}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Ends {formatDate(comp.endsAt)} · {comp.entries} entries
                  </p>
                  <button type="button" className="mt-3 w-full rounded-lg bg-aheers-green py-2 text-sm font-medium text-white hover:bg-aheers-green-light">
                    Enter Now (Demo)
                  </button>
                </div>
              ))}
            </div>
          </section>

          <p className="mt-8 text-center text-xs text-gray-400">
            <Link href="/portal/deliveries" className="text-aheers-green-light hover:underline">
              My deliveries
            </Link>
            {" · "}
            <Link href="/portal/settings" className="text-aheers-green-light hover:underline">
              Account settings
            </Link>
            {" · "}
            Signed in as {user?.email}
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
