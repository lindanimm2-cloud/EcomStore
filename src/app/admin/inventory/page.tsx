import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, DataTable } from "@/components/admin-ui";
import { PRODUCTS } from "@/lib/products";
import { getStore } from "@/lib/stores";

export default function InventoryPage() {
  const lowStock = PRODUCTS.filter((p) => p.inStock < 30);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Inventory Management" subtitle="Real-time stock across Supermarket, PowerTrade & Grab n Go" />
        <div className="admin-page">
          {lowStock.length > 0 && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-800">⚠ Low Stock Alert — {lowStock.length} items below 30 units</p>
              <p className="mt-1 text-sm text-amber-700">
                {lowStock.map((p) => p.name).join(", ")}
              </p>
            </div>
          )}
          <DataTable
            headers={["Product", "Store", "Category", "Price", "Stock", "Status"]}
            rows={PRODUCTS.map((p) => [
              <span key={p.id}>{p.image} {p.name}</span>,
              getStore(p.storeSlug)?.shortName ?? p.storeSlug,
              p.category,
              `R ${p.price.toFixed(2)}`,
              p.inStock,
              p.inStock < 30
                ? <span key={`st-${p.id}`} className="text-amber-600 font-medium">Low</span>
                : <span key={`st-${p.id}`} className="text-green-600">OK</span>,
            ])}
          />
        </div>
      </div>
    </div>
  );
}
