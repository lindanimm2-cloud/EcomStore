import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, DataTable, StatusBadge } from "@/components/admin-ui";
import { CUSTOMERS, ORDERS, formatCurrency } from "@/lib/data";
import { getStore } from "@/lib/stores";
import Link from "next/link";

export default function ServiceDeskPage() {
  const pendingOrders = ORDERS.filter((o) => o.status === "pending" || o.status === "processing");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader
          title="Service Counter Portal"
          subtitle="Phone & WhatsApp orders · Rewards lookup · EFT confirmation · Delivery scheduling"
        />
        <div className="admin-page">
          <div className="mb-6 rounded-[1.25rem] border border-aheers-green/15 bg-aheers-green/[0.06] p-4">
            <p className="font-semibold text-aheers-green-dark">Why this matters for Aheers</p>
            <p className="mt-1 text-sm text-gray-600">
              Many customers still phone or WhatsApp the store. Staff create orders on behalf of customers,
              apply Infinity Rewards cards, schedule deliveries, and track status — one screen.
            </p>
          </div>

          <div className="mb-8 grid gap-4 lg:grid-cols-3">
            <div className="card p-5 lg:col-span-1">
              <h3 className="mb-4 font-semibold">Customer lookup</h3>
              <input
                placeholder="Phone or rewards card #"
                className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                defaultValue="083 456 7890"
                readOnly
              />
              <div className="rounded-lg bg-aheers-cream p-3 text-sm">
                <p className="font-medium">{CUSTOMERS[1].name}</p>
                <p className="text-gray-600">Platinum · {CUSTOMERS[1].infinityCardId}</p>
                <p className="text-aheers-green">Cashback: {formatCurrency(CUSTOMERS[1].cashbackBalance)}</p>
              </div>
              <button className="btn-primary mt-3 w-full text-sm">Create order for customer</button>
            </div>

            <div className="card p-5 lg:col-span-2">
              <h3 className="mb-4 font-semibold">Quick actions</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "New phone order",
                  "Apply rewards card",
                  "Schedule delivery",
                  "Record EFT payment",
                  "Track existing order",
                  "Process return request",
                ].map((action) => (
                  <button key={action} className="rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-medium hover:bg-gray-50">
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <h3 className="mb-4 font-semibold">Orders needing attention</h3>
          <DataTable
            headers={["Order", "Customer", "Store", "Type", "Total", "Status", "Action"]}
            rows={pendingOrders.map((o) => [
              o.id,
              o.customerName,
              getStore(o.storeSlug)?.shortName ?? o.storeSlug,
              o.type,
              formatCurrency(o.total),
              <StatusBadge key={`s-${o.id}`} status={o.status} />,
              <Link key={`a-${o.id}`} href="/admin/orders" className="text-aheers-green-light hover:underline">View</Link>,
            ])}
          />
        </div>
      </div>
    </div>
  );
}
