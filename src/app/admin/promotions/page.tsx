"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatusBadge } from "@/components/admin-ui";
import { PROMOTIONS } from "@/lib/settings-data";

export default function PromotionsPage() {
  const [promos, setPromos] = useState(PROMOTIONS);

  function setStatus(id: string, status: string) {
    setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50">
        <AdminHeader title="Promotions" subtitle="SKU deals · Bundles · Trade pricing · Store scope" />
        <div className="p-6">
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              className="btn-primary"
              onClick={() =>
                setPromos((prev) => [
                  {
                    id: `PR-${String(prev.length + 1).padStart(2, "0")}`,
                    name: "New promo draft",
                    type: "SKU discount",
                    status: "scheduled",
                    stores: "Supermarket",
                    ends: "2026-08-01",
                  },
                  ...prev,
                ])
              }
            >
              New promotion
            </button>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-aheers-mist text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Promo</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Stores</th>
                  <th className="px-4 py-3">Ends</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {promos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.id}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.type}</td>
                    <td className="px-4 py-3">{p.stores}</td>
                    <td className="px-4 py-3">{p.ends}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {["active", "scheduled", "ended"].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(p.id, s)}
                            className="rounded-lg bg-gray-100 px-2 py-1 text-xs capitalize hover:bg-aheers-mist"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
