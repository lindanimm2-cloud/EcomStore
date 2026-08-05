"use client";

import { STORES } from "@/lib/stores";
import { useStoreNavigation } from "@/components/store-switch";
import { ArrowRight, Gift } from "lucide-react";

export function StoreSelectorGrid() {
  const { goToStore } = useStoreNavigation();

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {STORES.map((store, i) => (
        <button
          key={store.slug}
          onClick={() => goToStore(store.slug)}
          className="card-hover group overflow-hidden text-left"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className={`${store.accentBg} relative overflow-hidden p-5 text-white`}>
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
            <div className="relative flex items-start justify-between">
              <span className="text-4xl drop-shadow">{store.icon}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  store.status === "open" ? "bg-white/25" : "bg-black/20"
                }`}
              >
                {store.status}
              </span>
            </div>
            <h3 className="relative mt-4 font-display text-xl font-semibold">{store.name}</h3>
            <p className="relative text-sm text-white/85">{store.tagline}</p>
          </div>
          <div className="p-5">
            <p className="line-clamp-2 text-sm text-gray-600">{store.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
              {store.delivery && (
                <span className="rounded-full bg-aheers-mist px-2.5 py-1 font-medium text-aheers-green">Delivery</span>
              )}
              {store.pickup && (
                <span className="rounded-full bg-aheers-mist px-2.5 py-1 font-medium text-aheers-green">Pickup</span>
              )}
            </div>
            {store.promotion && (
              <p className="mt-2 text-xs font-semibold text-aheers-green">{store.promotion}</p>
            )}
            <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-aheers-green">
              Enter store <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

export function RewardsSummaryBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/20 bg-gradient-to-r from-aheers-green-dark via-aheers-green to-aheers-green-light p-5 text-white shadow-lift md:p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aheers-gold/20 text-aheers-gold">
          <Gift className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-white/80">Infinity Rewards · Demo account</p>
          <p className="font-display text-xl font-semibold md:text-2xl">R 224.00 cashback · Platinum</p>
        </div>
      </div>
      <div className="flex gap-2">
        <a href="/portal" className="rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/25">
          Digital card
        </a>
        <a href="/portal" className="rounded-xl bg-aheers-gold px-4 py-2.5 text-sm font-bold text-aheers-green-dark transition hover:opacity-90">
          My rewards
        </a>
      </div>
    </div>
  );
}
