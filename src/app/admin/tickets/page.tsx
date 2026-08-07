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
      <div className="admin-main">
        <AdminHeader title="CRM — Support tickets" subtitle="Update status · Assign · Resolve" />
        <div className="admin-page">
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {["all", "open", "pending", "resolved"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`shrink-0 capitalize ${filter === f ? "chip-active" : "chip-idle"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {list.map((t) => (
              <div key={t.id} className="mobile-stat !p-4 sm:card sm:!rounded-2xl sm:!p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-gray-400">{t.id}</p>
                    <h3 className="font-semibold text-gray-900">{t.subject}</h3>
                    <p className="text-sm text-gray-500">
                      {t.customerName} · {t.category} · {formatDate(t.createdAt)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Assignee: {t.assignee}</p>
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-44 sm:items-stretch">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={t.status} />
                      <StatusBadge status={t.priority} />
                    </div>
                    <PrettySelect
                      className="w-full"
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
