"use client";

import { FormEvent, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { useFleetOps } from "@/lib/fleet-ops-context";
import { JOB_ROLE_LABELS, JobRole } from "@/lib/rbac-data";
import { Plus, Pencil } from "lucide-react";
import { PrettySelect } from "@/components/pretty-select";

const BRANCHES = ["All stores", "Supermarket", "PowerTrade", "Hardware", "Grab n Go", "Fleet Hub", "Warehouse", "Head Office", "Aheers Greytown"];
const BRANCH_OPTS = BRANCHES.map((b) => ({ value: b, label: b }));

export default function SettingsUsersPage() {
  const { staff, addUser, assignUserBranch, assignUserRole, getVehicleName } = useFleetOps();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const input = "field mt-1";
  const roles = Object.keys(JOB_ROLE_LABELS) as JobRole[];
  const roleOpts = roles.map((r) => ({ value: r, label: JOB_ROLE_LABELS[r] }));
  const editing = staff.find((s) => s.id === editId);

  function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addUser({
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      role: String(fd.get("role")),
      branch: String(fd.get("branch")),
      phone: String(fd.get("phone") || ""),
    });
    setShowAdd(false);
  }

  function onEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editId) return;
    const fd = new FormData(e.currentTarget);
    assignUserRole(editId, String(fd.get("role")));
    assignUserBranch(editId, String(fd.get("branch")));
    setEditId(null);
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main bg-[#f4f5f7]">
        <div className="border-b border-gray-200/80 bg-white px-8 py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Settings</p>
              <h1 className="mt-1 font-display text-3xl font-semibold text-gray-900">Users</h1>
              <p className="mt-1 text-sm text-gray-500">Directory — assign role, branch, and vehicle links</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-aheers-green-dark px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" /> Add user
            </button>
          </div>
        </div>

        <div className="admin-page">
          <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Branch</th>
                  <th className="px-5 py-3.5">Vehicle</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {staff.map((s) => {
                  const initials = s.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  const roleLabel = JOB_ROLE_LABELS[s.role as JobRole] ?? s.role;
                  return (
                    <tr key={s.id} className="hover:bg-gray-50/80">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                            {initials}
                          </span>
                          <span className="font-semibold text-gray-900">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{s.email}</td>
                      <td className="px-5 py-4 text-gray-800">{roleLabel}</td>
                      <td className="px-5 py-4 text-gray-600">{s.branch}</td>
                      <td className="px-5 py-4 text-gray-500">{getVehicleName(s.vehicleId)}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setEditId(s.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium hover:bg-gray-50"
                        >
                          <Pencil className="h-3 w-3" /> Assign
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

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <form onSubmit={onAdd} className="menu-panel w-full max-w-md space-y-3 p-6">
            <h3 className="font-display text-lg font-semibold">Add user</h3>
            <input name="name" required placeholder="Full name" className={input} />
            <input name="email" type="email" required placeholder="Email" className={input} />
            <input name="phone" placeholder="Phone" className={input} />
            <PrettySelect name="role" defaultValue="driver" options={roleOpts} label="Role" />
            <PrettySelect name="branch" defaultValue={BRANCHES[0]} options={BRANCH_OPTS} label="Branch" />
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Invite
              </button>
            </div>
          </form>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <form onSubmit={onEdit} className="menu-panel w-full max-w-md space-y-3 p-6">
            <h3 className="font-display text-lg font-semibold">Assign · {editing.name}</h3>
            <PrettySelect name="role" defaultValue={String(editing.role)} options={roleOpts} label="Role" />
            <PrettySelect name="branch" defaultValue={editing.branch} options={BRANCH_OPTS} label="Branch" />
            <p className="text-xs text-gray-400">
              Vehicle links are managed under Drivers / Vehicles. Current: {getVehicleName(editing.vehicleId)}
            </p>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditId(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Save assignment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
