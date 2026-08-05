"use client";

import { useState } from "react";
import Link from "next/link";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { ORDERS } from "@/lib/data";
import { getStore } from "@/lib/stores";
import { PackageSearch } from "lucide-react";

export default function TrackOrderPage() {
  const [id, setId] = useState("ORD-1043");
  const order = ORDERS.find((o) => o.id.toLowerCase() === id.trim().toLowerCase());

  return (
    <>
      <StoreSwitcher />
      <main>
        <PageHero
          eyebrow="Live status"
          title="Track order"
          subtitle="Enter your order number — try ORD-1043 or ORD-1046."
        />
        <div className="page-shell flex justify-center py-12">
          <div className="w-full max-w-lg">
            <form
              className="surface flex gap-2 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                setId(String(fd.get("orderId") || ""));
              }}
            >
              <input
                name="orderId"
                defaultValue={id}
                className="flex-1 rounded-xl border-0 bg-transparent px-3 py-2 text-sm outline-none"
                placeholder="ORD-XXXX"
              />
              <button type="submit" className="btn-primary">
                Track
              </button>
            </form>

            {order ? (
              <div className="card-hover mt-6 p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-aheers-green/10 text-aheers-green">
                    <PackageSearch className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-aheers-green-dark">{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {getStore(order.storeSlug)?.name} · {order.customerName}
                    </p>
                    <p className="mt-3 inline-flex rounded-full bg-aheers-mist px-3 py-1 text-xs font-semibold capitalize text-aheers-green">
                      {order.status}
                    </p>
                    <ul className="mt-4 space-y-1 text-sm text-gray-600">
                      {order.items.map((item) => (
                        <li key={item.productId}>
                          {item.qty}× {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-center text-sm text-gray-500">No order found for that number.</p>
            )}

            <p className="mt-8 text-center text-sm">
              <Link href="/portal/deliveries" className="font-semibold text-aheers-green hover:underline">
                View deliveries in portal →
              </Link>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
