import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, DataTable, StatusBadge } from "@/components/admin-ui";
import { ORDERS, formatCurrency, formatDate } from "@/lib/data";
import { getStore } from "@/lib/stores";
import { ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader
          title="Orders"
          subtitle="All stores · Delivery, collection & in-store · Synced from e-commerce & POS"
        />
        <div className="admin-page">
          {/* Mobile card list */}
          <ul className="space-y-2.5 lg:hidden">
            {ORDERS.map((o) => (
              <li key={o.id} className="mobile-stat !p-3.5">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-aheers-green/10 text-aheers-green">
                    <ShoppingBag className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{o.customerName}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-gray-400">{o.id}</p>
                      </div>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span className="font-semibold text-aheers-charcoal">{formatCurrency(o.total)}</span>
                      <span>{o.type}</span>
                      <span>{getStore(o.storeSlug)?.shortName ?? o.storeSlug}</span>
                      <span>{formatDate(o.createdAt)}</span>
                    </div>
                    {o.fleetId && (
                      <p className="mt-1.5 text-[11px] font-medium text-aheers-green">Fleet {o.fleetId}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop table */}
          <div className="hidden lg:block">
            <DataTable
              headers={["Order ID", "Customer", "Store", "Type", "Items", "Total", "Date", "Status", "Fleet"]}
              rows={ORDERS.map((o) => [
                <span key={o.id} className="font-mono font-medium">
                  {o.id}
                </span>,
                o.customerName,
                getStore(o.storeSlug)?.shortName ?? o.storeSlug,
                o.type,
                o.items.length,
                formatCurrency(o.total),
                formatDate(o.createdAt),
                <StatusBadge key={`s-${o.id}`} status={o.status} />,
                o.fleetId ?? "—",
              ])}
            />
          </div>

          <p className="mt-4 text-center text-xs text-gray-400 lg:hidden">
            <Link href="/admin/fleet" className="font-semibold text-aheers-green">
              Open fleet tracker
            </Link>{" "}
            for live dispatch
          </p>
        </div>
      </div>
    </div>
  );
}
