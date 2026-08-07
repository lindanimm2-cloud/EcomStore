"use client";

import { FormEvent, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatusBadge } from "@/components/admin-ui";
import { useFleetOps } from "@/lib/fleet-ops-context";
import { PrettySelect } from "@/components/pretty-select";

export default function DriversSettingsPage() {
  const { drivers, vehicles, assignDriver, getVehicleName } = useFleetOps();
  const [assignFor, setAssignFor] = useState<string | null>(null);

  function onAssign(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!assignFor) return;
    const fd = new FormData(e.currentTarget);
    const vehicleId = String(fd.get("vehicleId"));
    if (vehicleId === "none") {
      const current = drivers.find((d) => d.id === assignFor)?.vehicleId;
      if (current) assignDriver(current, null);
    } else {
      assignDriver(vehicleId, assignFor);
    }
    setAssignFor(null);
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main bg-[#f4f5f7]">
        <AdminHeader title="Drivers" subtitle="Assign drivers to vehicles · Fleet Hub & PowerTrade" />
        <div className="admin-page">
          <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Phone</th>
                  <th className="px-5 py-3.5">Assigned vehicle</th>
                  <th className="px-5 py-3.5">Branch</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {drivers.map((d) => {
                  const initials = d.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <tr key={d.id} className="hover:bg-gray-50/80">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                            {initials}
                          </span>
                          <span className="font-semibold text-gray-900">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{d.email}</td>
                      <td className="px-5 py-4 text-gray-500">{d.phone}</td>
                      <td className="px-5 py-4 font-medium text-gray-800">{getVehicleName(d.vehicleId)}</td>
                      <td className="px-5 py-4 text-gray-600">{d.branch}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setAssignFor(d.id)}
                          className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium hover:bg-gray-50"
                        >
                          Assign vehicle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {assignFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <form onSubmit={onAssign} className="menu-panel w-full max-w-md space-y-3 p-6">
            <h3 className="font-display text-lg font-semibold">Assign vehicle</h3>
            <p className="text-sm text-gray-500">{drivers.find((d) => d.id === assignFor)?.name}</p>
            <PrettySelect
              name="vehicleId"
              label="Vehicle"
              defaultValue={drivers.find((d) => d.id === assignFor)?.vehicleId ?? "none"}
              options={[
                { value: "none", label: "Unassigned" },
                ...vehicles.map((v) => ({ value: v.id, label: v.name, hint: v.plate })),
              ]}
            />
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setAssignFor(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
