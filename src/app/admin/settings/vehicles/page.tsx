"use client";

import { FormEvent, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatusBadge } from "@/components/admin-ui";
import { useFleetOps } from "@/lib/fleet-ops-context";
import { PrettySelect } from "@/components/pretty-select";
import { Plus, Pencil } from "lucide-react";

const BRANCHES = ["Fleet Hub", "PowerTrade", "Supermarket", "Hardware", "Grab n Go"];
const BRANCH_OPTS = BRANCHES.map((b) => ({ value: b, label: b }));
const TYPE_OPTS = [
  { value: "bakkie", label: "Bakkie" },
  { value: "van", label: "Van" },
  { value: "truck", label: "Truck" },
  { value: "trailer", label: "Trailer" },
];
const STATUS_OPTS = [
  { value: "idle", label: "Idle" },
  { value: "en-route", label: "En-route" },
  { value: "delivering", label: "Delivering" },
  { value: "returning", label: "Returning" },
  { value: "maintenance", label: "Maintenance" },
];

export default function VehiclesSettingsPage() {
  const { vehicles, drivers, addVehicle, assignDriver, removeVehicle, getDriverName, updateVehicle } = useFleetOps();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addVehicle({
      name: String(fd.get("name")),
      plate: String(fd.get("plate")),
      capacity: String(fd.get("capacity")),
      type: String(fd.get("type")) as "bakkie" | "van" | "truck" | "trailer",
      branch: String(fd.get("branch")),
      phone: String(fd.get("phone") || ""),
    });
    setShowAdd(false);
  }

  function onAssign(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editId) return;
    const fd = new FormData(e.currentTarget);
    assignDriver(editId, String(fd.get("driverId")) === "none" ? null : String(fd.get("driverId")));
    updateVehicle(editId, {
      status: String(fd.get("status")) as "idle" | "en-route" | "delivering" | "returning" | "maintenance",
      branch: String(fd.get("branch")),
    });
    setEditId(null);
  }

  const editing = vehicles.find((v) => v.id === editId);
  const input = "field mt-1";

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-[#f4f5f7]">
        <AdminHeader title="Vehicles" subtitle="Add vehicles, set capacity, and assign drivers" />
        <div className="p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">{vehicles.length} vehicles in fleet</p>
            <button type="button" onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-xl bg-aheers-green-dark px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-aheers-green">
              <Plus className="h-4 w-4" /> Add vehicle
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3.5">Vehicle</th>
                  <th className="px-5 py-3.5">Plate</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Driver</th>
                  <th className="px-5 py-3.5">Branch</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/80">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{v.name}</p>
                      <p className="text-xs text-gray-400">{v.capacity}</p>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-gray-600">{v.plate}</td>
                    <td className="px-5 py-4 capitalize text-gray-600">{v.type}</td>
                    <td className="px-5 py-4">{getDriverName(v.driverId)}</td>
                    <td className="px-5 py-4 text-gray-600">{v.branch}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setEditId(v.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <form onSubmit={onAdd} className="menu-panel w-full max-w-md space-y-3 p-6">
            <h3 className="font-display text-lg font-semibold">Add vehicle</h3>
            <input name="name" required placeholder="Name" className={input} />
            <input name="plate" required placeholder="Plate" className={input} />
            <div className="grid grid-cols-2 gap-3">
              <PrettySelect name="type" defaultValue="bakkie" options={TYPE_OPTS} label="Type" />
              <label className="block text-xs font-semibold uppercase text-gray-500">
                Capacity
                <input name="capacity" required placeholder="Capacity" className={input} />
              </label>
            </div>
            <PrettySelect name="branch" defaultValue={BRANCHES[0]} options={BRANCH_OPTS} label="Branch" />
            <input name="phone" placeholder="Phone" className={input} />
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Save vehicle
              </button>
            </div>
          </form>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <form onSubmit={onAssign} className="menu-panel w-full max-w-md space-y-3 p-6">
            <h3 className="font-display text-lg font-semibold">Edit · {editing.name}</h3>
            <PrettySelect
              name="driverId"
              label="Assign driver"
              defaultValue={editing.driverId ?? "none"}
              options={[
                { value: "none", label: "Unassigned" },
                ...drivers.map((d) => ({ value: d.id, label: d.name })),
              ]}
            />
            <PrettySelect name="status" label="Status" defaultValue={editing.status} options={STATUS_OPTS} />
            <PrettySelect name="branch" label="Branch" defaultValue={editing.branch} options={BRANCH_OPTS} />
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  removeVehicle(editing.id);
                  setEditId(null);
                }}
                className="rounded-xl px-3 text-sm text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
              <button type="button" onClick={() => setEditId(null)} className="btn-secondary flex-1">
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
