"use client";

import { FormEvent, useMemo, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatusBadge } from "@/components/admin-ui";
import {
  STAFF_USERS,
  JOB_ROLE_LABELS,
  JobRole,
  StaffUser,
} from "@/lib/rbac-data";
import { PrettySelect } from "@/components/pretty-select";
import { Search, UserPlus } from "lucide-react";

const ROLE_OPTIONS = Object.keys(JOB_ROLE_LABELS) as JobRole[];
const ROLE_OPTS = [
  { value: "all", label: "All roles" },
  ...ROLE_OPTIONS.map((r) => ({ value: r, label: JOB_ROLE_LABELS[r] })),
];
const STORE_OPTS = ["All stores", "Supermarket", "PowerTrade", "Hardware", "Grab n Go", "Fleet Hub", "Warehouse", "Head Office"].map(
  (s) => ({ value: s, label: s })
);
const INVITE_STORE_OPTS = ["Supermarket", "PowerTrade", "Hardware", "Grab n Go", "Head Office", "Fleet Hub"].map((s) => ({
  value: s,
  label: s,
}));
const STATUS_OPTS = [
  { value: "active", label: "Active" },
  { value: "invited", label: "Invited" },
  { value: "disabled", label: "Disabled" },
];

export default function UsersPage() {
  const [users, setUsers] = useState(STAFF_USERS);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(STAFF_USERS[0].id);
  const [showInvite, setShowInvite] = useState(false);
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "all" && u.jobRole !== roleFilter) return false;
      const hay = `${u.name} ${u.email} ${u.employeeNo} ${u.title}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [users, q, roleFilter]);

  const selected = users.find((u) => u.id === selectedId) ?? filtered[0];

  function updateSelected(patch: Partial<StaffUser>) {
    if (!selected) return;
    setUsers((prev) => prev.map((u) => (u.id === selected.id ? { ...u, ...patch } : u)));
    setToast("User updated (demo — local only)");
    setTimeout(() => setToast(""), 2500);
  }

  function invite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const jobRole = String(fd.get("role")) as JobRole;
    const neu: StaffUser = {
      id: `s-${Date.now()}`,
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone") || ""),
      employeeNo: `EMP-${Math.floor(Math.random() * 9000 + 1000)}`,
      jobRole,
      title: JOB_ROLE_LABELS[jobRole],
      store: String(fd.get("store") || "Supermarket"),
      status: "invited",
      lastLogin: "—",
    };
    setUsers((prev) => [neu, ...prev]);
    setSelectedId(neu.id);
    setShowInvite(false);
    setToast(`Invite sent to ${neu.email} (demo)`);
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Users & access" subtitle="Staff directory · Invite · Assign roles · Disable accounts" />
        {toast && (
          <div className="mx-8 mt-4 rounded-xl border border-aheers-green/20 bg-aheers-green/10 px-4 py-2 text-sm text-aheers-green">
            {toast}
          </div>
        )}
        <div className="grid gap-6 p-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-3 flex flex-wrap gap-2">
              <div className="relative min-w-[180px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search staff…"
                  className="field w-full py-2 pl-9 pr-3"
                />
              </div>
              <button type="button" onClick={() => setShowInvite(true)} className="btn-primary text-sm">
                <UserPlus className="h-4 w-4" /> Invite
              </button>
            </div>
            <PrettySelect
              value={roleFilter}
              onChange={setRoleFilter}
              className="mb-3"
              options={ROLE_OPTS}
            />
            <ul className="card max-h-[70vh] divide-y overflow-auto">
              {filtered.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(u.id)}
                    className={`flex w-full items-start justify-between gap-2 px-4 py-3 text-left transition hover:bg-aheers-mist ${
                      selected?.id === u.id ? "bg-aheers-mist" : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-500">
                        {u.employeeNo} · {JOB_ROLE_LABELS[u.jobRole]}
                      </p>
                    </div>
                    <StatusBadge status={u.status} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            {selected && (
              <div className="card space-y-5 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-aheers-green-dark">{selected.name}</h2>
                    <p className="text-sm text-gray-500">
                      {selected.email} · {selected.phone}
                    </p>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <PrettySelect
                    label="Job role"
                    value={selected.jobRole}
                    onChange={(v) =>
                      updateSelected({
                        jobRole: v as JobRole,
                        title: JOB_ROLE_LABELS[v as JobRole],
                      })
                    }
                    options={ROLE_OPTIONS.map((r) => ({ value: r, label: JOB_ROLE_LABELS[r] }))}
                  />
                  <PrettySelect
                    label="Store scope"
                    value={selected.store}
                    onChange={(v) => updateSelected({ store: v })}
                    options={STORE_OPTS}
                  />
                  <PrettySelect
                    label="Status"
                    value={selected.status}
                    onChange={(v) => updateSelected({ status: v as StaffUser["status"] })}
                    options={STATUS_OPTS}
                  />
                  <div className="text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Employee #</p>
                    <p className="mt-2 font-mono text-gray-800">{selected.employeeNo}</p>
                    <p className="mt-1 text-xs text-gray-400">Last login {selected.lastLogin}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-aheers-mist p-4 text-sm text-gray-600">
                  Role grants follow the matrix on{" "}
                  <a href="/admin/roles" className="font-semibold text-aheers-green hover:underline">
                    Roles & permissions
                  </a>
                  . Demo changes stay in this browser session.
                </div>
              </div>
            )}
          </div>
        </div>

        {showInvite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <form onSubmit={invite} className="menu-panel w-full max-w-md space-y-3 p-6">
              <h3 className="font-display text-lg font-semibold">Invite staff user</h3>
              <input name="name" required placeholder="Full name" className="field" />
              <input name="email" required type="email" placeholder="Email" className="field" />
              <input name="phone" placeholder="Phone" className="field" />
              <PrettySelect
                name="role"
                label="Role"
                defaultValue={ROLE_OPTIONS[0]}
                options={ROLE_OPTIONS.map((r) => ({ value: r, label: JOB_ROLE_LABELS[r] }))}
              />
              <PrettySelect name="store" label="Store" defaultValue={INVITE_STORE_OPTS[0].value} options={INVITE_STORE_OPTS} />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  Send invite
                </button>
                <button type="button" onClick={() => setShowInvite(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
