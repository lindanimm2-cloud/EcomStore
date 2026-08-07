import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-ui";
import { ORDERS, CUSTOMERS, formatCurrency } from "@/lib/data";
import { PRODUCTS } from "@/lib/products";

export default function ReportsPage() {
  const revenueByStore = {
    supermarket: ORDERS.filter((o) => o.storeSlug === "supermarket").reduce((s, o) => s + o.total, 0),
    powertrade: ORDERS.filter((o) => o.storeSlug === "powertrade").reduce((s, o) => s + o.total, 0),
    grabngo: ORDERS.filter((o) => o.storeSlug === "grabngo").reduce((s, o) => s + o.total, 0),
  };
  const totalRevenue = Object.values(revenueByStore).reduce((a, b) => a + b, 0);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Reports & Analytics" subtitle="Real-time business intelligence · Aheers Group Core" />
        <div className="admin-page">
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="card p-6">
              <p className="text-sm text-gray-500">Total Demo Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-gray-500">Orders Processed</p>
              <p className="text-3xl font-bold text-gray-900">{ORDERS.length}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-gray-500">Avg Customer Value</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0) / CUSTOMERS.length)}
              </p>
            </div>
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h3 className="mb-4 font-semibold">Revenue by Store</h3>
              {Object.entries(revenueByStore).map(([store, rev]) => (
                <div key={store} className="mb-3">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="capitalize font-medium">{store}</span>
                    <span>{formatCurrency(rev)}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-aheers-green"
                      style={{ width: `${totalRevenue ? (rev / totalRevenue) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="card p-6">
              <h3 className="mb-4 font-semibold">Top Products by Stock Turnover</h3>
              <ul className="space-y-2">
                {PRODUCTS.filter((p) => p.badge).slice(0, 6).map((p) => (
                  <li key={p.id} className="flex justify-between text-sm">
                    <span>{p.image} {p.name}</span>
                    <span className="text-gray-500">{p.inStock} in stock</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
