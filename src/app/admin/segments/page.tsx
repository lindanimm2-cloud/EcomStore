"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-ui";
import { SEGMENTS } from "@/lib/settings-data";
import { Users } from "lucide-react";

export default function SegmentsPage() {
  const [segments, setSegments] = useState(SEGMENTS);
  const [name, setName] = useState("");
  const [rule, setRule] = useState("");

  function addSegment() {
    if (!name.trim() || !rule.trim()) return;
    setSegments((prev) => [
      {
        id: `SEG-${String(prev.length + 1).padStart(2, "0")}`,
        name: name.trim(),
        count: 0,
        rule: rule.trim(),
        channel: "Email",
      },
      ...prev,
    ]);
    setName("");
    setRule("");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="CRM — Segments" subtitle="Audience lists for campaigns, WhatsApp and specials" />
        <div className="p-6">
          <div className="card mb-6 grid gap-3 p-5 sm:grid-cols-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Segment name"
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
            <input
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              placeholder="Rule e.g. tier = gold"
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
            <button type="button" onClick={addSegment} className="btn-primary">
              Create segment
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {segments.map((s) => (
              <div key={s.id} className="card-hover p-5">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aheers-green/10 text-aheers-green">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-gray-400">{s.id}</p>
                      <h3 className="font-semibold text-aheers-green-dark">{s.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{s.rule}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-aheers-mist px-2.5 py-1 text-xs font-semibold text-aheers-green">
                    {s.count} customers
                  </span>
                </div>
                <p className="mt-4 text-xs text-gray-400">Preferred channel · {s.channel}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
