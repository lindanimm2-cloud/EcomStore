"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatusBadge } from "@/components/admin-ui";
import { TICKETS } from "@/lib/crm-data";
import { formatDate } from "@/lib/data";
import { PrettySelect } from "@/components/pretty-select";

function TicketsInner() {
  const [tickets, setTickets] = useState(TICKETS);
  const [filter, setFilter] = useState("all");

  const list = tickets.filter((t) => filter === "all" || t.status === filter);

  function setStatus(id: string, status: "open" | "pending" | "resolved") {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50">
        <AdminHeader title="CRM — Support tickets" subtitle="Update status · Assign · Resolve" />
        <div className="p-8">
          <div className="mb-4 flex flex-wrap gap-2">
            {["all", "open", "pending", "resolved"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`capitalize ${filter === f ? "chip-active" : "chip-idle"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {list.map((t) => (
              <div key={t.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-gray-400">{t.id}</p>
                    <h3 className="font-semibold text-gray-900">{t.subject}</h3>
                    <p className="text-sm text-gray-500">
                      {t.customerName} · {t.category} · {formatDate(t.createdAt)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Assignee: {t.assignee}</p>
                  </div>
                  <div className="flex w-36 flex-col items-end gap-2">
                    <StatusBadge status={t.status} />
                    <StatusBadge status={t.priority} />
                    <PrettySelect
                      value={t.status}
                      onChange={(v) => setStatus(t.id, v as "open" | "pending" | "resolved")}
                      options={[
                        { value: "open", label: "Open" },
                        { value: "pending", label: "Pending" },
                        { value: "resolved", label: "Resolved" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TicketsPage() {
  return <TicketsInner />;
}
