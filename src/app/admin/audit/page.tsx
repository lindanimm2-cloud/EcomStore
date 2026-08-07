"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-ui";
import { AUDIT_LOG } from "@/lib/rbac-data";
import { Shield } from "lucide-react";

export default function AuditPage() {
  const [q, setQ] = useState("");
  const rows = AUDIT_LOG.filter((a) =>
    `${a.actor} ${a.action} ${a.target}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Audit log" subtitle="Immutable trail of sensitive CRM, inventory and settings actions" />
        <div className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Shield className="h-5 w-5 text-aheers-green" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search actor, action, target…"
              className="w-full max-w-md rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-aheers-mist text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{a.at}</td>
                    <td className="px-4 py-3 font-medium">{a.actor}</td>
                    <td className="px-4 py-3">{a.action}</td>
                    <td className="px-4 py-3 text-gray-600">{a.target}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{a.ip}</td>
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
