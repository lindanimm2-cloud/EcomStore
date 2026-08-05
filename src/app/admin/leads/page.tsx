"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatusBadge } from "@/components/admin-ui";
import { LEADS } from "@/lib/crm-data";
import { formatCurrency } from "@/lib/data";
import { PrettySelect } from "@/components/pretty-select";

function LeadsInner() {
  const [leads, setLeads] = useState(LEADS);

  function move(id: string, stage: (typeof LEADS)[0]["stage"]) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)));
  }

  const stages = ["new", "contacted", "qualified", "won", "lost"] as const;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50">
        <AdminHeader title="CRM — Sales pipeline" subtitle="Leads · Opportunities · Hardware & PowerTrade" />
        <div className="overflow-x-auto p-6">
          <div className="flex min-w-[900px] gap-4">
            {stages.map((stage) => (
              <div key={stage} className="w-56 shrink-0">
                <h3 className="mb-3 text-sm font-semibold capitalize text-gray-700">{stage}</h3>
                <div className="space-y-2">
                  {leads
                    .filter((l) => l.stage === stage)
                    .map((l) => (
                      <div key={l.id} className="card p-3">
                        <p className="font-medium text-sm">{l.name}</p>
                        <p className="text-xs text-gray-500">{l.company}</p>
                        <p className="mt-1 text-sm font-semibold text-aheers-green">{formatCurrency(l.value)}</p>
                        <p className="text-xs text-gray-400">{l.owner}</p>
                        <PrettySelect
                          value={l.stage}
                          onChange={(v) => move(l.id, v as (typeof stages)[number])}
                          className="mt-2"
                          options={stages.map((s) => ({ value: s, label: s }))}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  return <LeadsInner />;
}
