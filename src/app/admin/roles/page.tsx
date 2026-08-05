"use client";

import { useMemo, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-ui";
import {
  PERMISSION_MATRIX,
  JOB_ROLE_LABELS,
  JobRole,
  levelClass,
  levelLabel,
} from "@/lib/rbac-data";

const COMPARE_ROLES: JobRole[] = [
  "super_admin",
  "store_manager",
  "crm_manager",
  "support_agent",
  "service_counter",
  "inventory_manager",
  "dispatcher",
  "driver",
  "finance_manager",
  "marketing_manager",
];

export default function RolesPage() {
  const [moduleFilter, setModuleFilter] = useState("all");
  const modules = useMemo(
    () => ["all", ...Array.from(new Set(PERMISSION_MATRIX.map((r) => r.module)))],
    []
  );
  const rows = PERMISSION_MATRIX.filter((r) => moduleFilter === "all" || r.module === moduleFilter);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50">
        <AdminHeader
          title="Roles & permissions"
          subtitle="RBAC matrix · Scope by store · Approval thresholds (demo)"
        />
        <div className="p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {modules.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModuleFilter(m)}
                className={`capitalize ${moduleFilter === m ? "chip-active" : "chip-idle"}`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="rounded-full bg-aheers-green/10 px-2 py-1 text-aheers-green">Full</span>
            <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">Edit</span>
            <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-800">Approve</span>
            <span className="rounded-full bg-slate-100 px-2 py-1">Read</span>
            <span className="rounded-full bg-gray-50 px-2 py-1 text-gray-400">None</span>
          </div>

          <div className="card overflow-auto">
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead className="bg-aheers-mist text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="sticky left-0 bg-aheers-mist px-4 py-3">Resource</th>
                  {COMPARE_ROLES.map((r) => (
                    <th key={r} className="px-2 py-3 font-medium">
                      {JOB_ROLE_LABELS[r].split(" ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((row) => (
                  <tr key={row.resource} className="hover:bg-gray-50/80">
                    <td className="sticky left-0 bg-white px-4 py-3">
                      <p className="font-medium text-gray-900">{row.resource}</p>
                      <p className="text-xs text-gray-400">{row.module}</p>
                    </td>
                    {COMPARE_ROLES.map((role) => {
                      const level = row.levels[role];
                      return (
                        <td key={role} className="px-2 py-3">
                          <span className={`inline-block rounded-lg px-2 py-1 text-xs ${levelClass(level)}`}>
                            {levelLabel(level)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { title: "Approval thresholds", body: "Cashier refund ≤ R500 · Store manager ≤ R2,000 · Finance unlimited (demo)." },
              { title: "Scope dimensions", body: "Permissions evaluate org → store → warehouse → department." },
              { title: "Audit", body: "Every role change and sensitive action is logged under Audit log." },
            ].map((c) => (
              <div key={c.title} className="card p-5">
                <h3 className="font-semibold text-aheers-green-dark">{c.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
