"use client";

import { FormEvent, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatusBadge } from "@/components/admin-ui";
import { useFleetOps } from "@/lib/fleet-ops-context";
import { JOB_ROLE_LABELS, JobRole } from "@/lib/rbac-data";
import { Plus, Pencil, Trash2, Mail, Building2 } from "lucide-react";
import { PrettySelect } from "@/components/pretty-select";

const BRANCHES = [
  "All stores",
  "Supermarket",
  "PowerTrade",
  "Hardware",
  "Grab n Go",
  "Fleet Hub",
  "Warehouse",
  "Head Office",
  "Aheers Greytown",
];
const BRANCH_OPTS = BRANCHES.map((b) => ({ value: b, label: b }));
const STATUS_OPTS = [
  { value: "active", label: "Active" },
  { value: "invited", label: "Invited" },
  { value: "disabled", label: "Disabled" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function SettingsUsersPage() {
  const { staff, addUser, updateStaff, removeStaff, getVehicleName } = useFleetOps();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

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
      status: "invited",
    });
    setShowAdd(false);
  }

  function onEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editId) return;
    const fd = new FormData(e.currentTarget);
    updateStaff(editId, {
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone") || ""),
      role: String(fd.get("role")),
      branch: String(fd.get("branch")),
      status: String(fd.get("status")) as "active" | "invited" | "disabled",
    });
    setEditId(null);
  }

  function onRemove(id: string, name: string) {
    if (!window.confirm(`Remove user ${name}?`)) return;
    removeStaff(id);
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main bg-[#f7f8f9]">
        <AdminHeader title="Users" subtitle="Directory — roles, branches and access" />
        <div className="admin-page">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              {staff.length} user{staff.length === 1 ? "" : "s"}
            </p>
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-aheers-green px-4 py-2.5 text-sm font-semibold text-white shadow-soft"
            >
              <Plus className="h-4 w-4" /> Add user
            </button>
          </div>

          <ul className="space-y-3">
            {staff.map((s) => {
              const roleLabel = JOB_ROLE_LABELS[s.role as JobRole] ?? s.role;
              return (
                <li key={s.id} className="mobile-stat !p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-aheers-mist text-sm font-bold text-aheers-green-dark">
                      {initials(s.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold text-gray-900">{s.name}</h3>
                        <StatusBadge status={s.status} />
                      </div>
                      <p className="mt-1 text-xs font-semibold text-aheers-green">{roleLabel}</p>
                      <p className="mt-1.5 flex items-center gap-1.5 truncate text-sm text-gray-500">
                        <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                        <span className="truncate">{s.email}</span>
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                        <Building2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                        <span className="truncate">
                          {s.branch}
                          {s.vehicleId ? ` · ${getVehicleName(s.vehicleId)}` : ""}
                        </span>
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setEditId(s.id)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 sm:flex-none"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemove(s.id, s.name)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <form
            onSubmit={onAdd}
            className="menu-panel max-h-[90dvh] w-full max-w-md space-y-3 overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl sm:p-6"
          >
            <h3 className="font-display text-lg font-semibold text-aheers-green-dark">Add user</h3>
            <input name="name" required placeholder="Full name" className="field" />
            <input name="email" type="email" required placeholder="Email" className="field" />
            <input name="phone" placeholder="Phone" className="field" />
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
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <form
            onSubmit={onEdit}
            className="menu-panel max-h-[90dvh] w-full max-w-md space-y-3 overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl sm:p-6"
          >
            <h3 className="font-display text-lg font-semibold text-aheers-green-dark">Edit · {editing.name}</h3>
            <input name="name" required defaultValue={editing.name} className="field" />
            <input name="email" type="email" required defaultValue={editing.email} className="field" />
            <input name="phone" defaultValue={editing.phone} className="field" />
            <PrettySelect name="role" defaultValue={String(editing.role)} options={roleOpts} label="Role" />
            <PrettySelect name="branch" defaultValue={editing.branch} options={BRANCH_OPTS} label="Branch" />
            <PrettySelect name="status" defaultValue={editing.status} options={STATUS_OPTS} label="Status" />
            <p className="text-xs text-gray-400">
              Vehicle links are managed under Drivers / Vehicles. Current: {getVehicleName(editing.vehicleId)}
            </p>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditId(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
