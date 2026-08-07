import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, DataTable, StatusBadge } from "@/components/admin-ui";
import { ORDERS, formatCurrency, formatDate } from "@/lib/data";
import { getStore } from "@/lib/stores";

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Orders" subtitle="All stores · Delivery, collection & in-store · Synced from e-commerce & POS" />
        <div className="admin-page">
          <DataTable
            headers={["Order ID", "Customer", "Store", "Type", "Items", "Total", "Date", "Status", "Fleet"]}
            rows={ORDERS.map((o) => [
              <span key={o.id} className="font-mono font-medium">{o.id}</span>,
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
      </div>
    </div>
  );
}
