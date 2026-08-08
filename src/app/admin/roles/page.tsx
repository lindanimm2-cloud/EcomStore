"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-ui";
import { PrettySelect } from "@/components/pretty-select";
import {
  PERMISSION_MATRIX,
  JOB_ROLE_LABELS,
  JobRole,
  PermissionLevel,
  PermissionRow,
  levelClass,
  levelLabel,
} from "@/lib/rbac-data";
import { Pencil, Plus, Shield } from "lucide-react";

const STORAGE_KEY = "aheers-rbac-matrix-v1";

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

const LEVELS: PermissionLevel[] = ["full", "edit", "approve", "read", "none"];

const LEVEL_OPTS = LEVELS.map((l) => ({
  value: l,
  label: l === "none" ? "None" : levelLabel(l),
}));

function shortRole(role: JobRole) {
  const label = JOB_ROLE_LABELS[role];
  if (role === "super_admin") return "CEO";
  if (role === "store_manager") return "Store";
  if (role === "crm_manager") return "App";
  if (role === "service_counter") return "Counter";
  return label.split(" ")[0];
}

export default function RolesPage() {
  const [matrix, setMatrix] = useState<PermissionRow[]>(PERMISSION_MATRIX);
  const [hydrated, setHydrated] = useState(false);
  const [moduleFilter, setModuleFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState<PermissionLevel | "all">("all");
  const [focusRole, setFocusRole] = useState<JobRole>("super_admin");
  const [editCell, setEditCell] = useState<{ resource: string; role: JobRole } | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PermissionRow[];
        if (Array.isArray(parsed) && parsed.length) setMatrix(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matrix));
  }, [matrix, hydrated]);

  const modules = useMemo(
    () => ["all", ...Array.from(new Set(matrix.map((r) => r.module)))],
    [matrix]
  );

  const rows = useMemo(() => {
    return matrix.filter((r) => {
      if (moduleFilter !== "all" && r.module !== moduleFilter) return false;
      if (levelFilter === "all") return true;
      return Object.values(r.levels).some((l) => (l ?? "none") === levelFilter);
    });
  }, [matrix, moduleFilter, levelFilter]);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2200);
  }

  function setLevel(resource: string, role: JobRole, level: PermissionLevel) {
    setMatrix((prev) =>
      prev.map((row) =>
        row.resource === resource
          ? { ...row, levels: { ...row.levels, [role]: level === "none" ? undefined : level } }
          : row
      )
    );
    setEditCell(null);
    flash(`${shortRole(role)} → ${levelLabel(level)} on ${resource}`);
  }

  function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const resource = String(fd.get("resource")).trim();
    const moduleName = String(fd.get("module")).trim() || "Custom";
    if (!resource) return;
    if (matrix.some((r) => r.resource.toLowerCase() === resource.toLowerCase())) {
      flash("Resource already exists");
      return;
    }
    const level = String(fd.get("level")) as PermissionLevel;
    setMatrix((prev) => [
      {
        resource,
        module: moduleName,
        levels: { super_admin: "full", [focusRole]: level === "none" ? undefined : level },
      },
      ...prev,
    ]);
    setShowAdd(false);
    flash("Resource added");
  }

  const editingRow = editCell ? matrix.find((r) => r.resource === editCell.resource) : null;
  const editingLevel = (editingRow?.levels[editCell?.role ?? "super_admin"] ?? "none") as PermissionLevel;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Roles" subtitle="RBAC matrix · tap a badge to change access (demo)" />
        <div className="admin-page space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              {rows.length} resource{rows.length === 1 ? "" : "s"}
            </p>
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-aheers-green px-4 py-2.5 text-sm font-semibold text-white shadow-soft"
            >
              <Plus className="h-4 w-4" /> Add resource
            </button>
          </div>

          {/* Module filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {modules.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModuleFilter(m)}
                className={`shrink-0 capitalize ${moduleFilter === m ? "chip-active" : "chip-idle"}`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Level legend = also filters */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLevelFilter("all")}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                levelFilter === "all" ? "bg-aheers-green text-white" : "bg-white text-gray-500 ring-1 ring-gray-200"
              }`}
            >
              All levels
            </button>
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevelFilter(l)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${levelClass(l)} ${
                  levelFilter === l ? "ring-2 ring-aheers-green/40" : ""
                }`}
              >
                {l === "none" ? "None" : levelLabel(l)}
              </button>
            ))}
          </div>

          {/* Mobile: pick a role to compare */}
          <div className="lg:hidden">
            <PrettySelect
              label="Compare role"
              value={focusRole}
              onChange={(v) => setFocusRole(v as JobRole)}
              options={COMPARE_ROLES.map((r) => ({ value: r, label: JOB_ROLE_LABELS[r] }))}
            />
          </div>

          {/* Mobile cards */}
          <ul className="space-y-2.5 lg:hidden">
            {rows.map((row) => {
              const level = row.levels[focusRole];
              return (
                <li key={row.resource} className="mobile-stat !p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-aheers-green/10 text-aheers-green">
                      <Shield className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">{row.resource}</p>
                      <p className="text-xs text-gray-400">{row.module}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">{shortRole(focusRole)}</span>
                        <button
                          type="button"
                          onClick={() => setEditCell({ resource: row.resource, role: focusRole })}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${levelClass(level)}`}
                        >
                          {levelLabel(level)}
                          <Pencil className="h-3 w-3 opacity-60" />
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {COMPARE_ROLES.filter((r) => r !== focusRole)
                          .slice(0, 4)
                          .map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => setEditCell({ resource: row.resource, role })}
                              className={`rounded-md px-2 py-1 text-[10px] font-semibold ${levelClass(row.levels[role])}`}
                              title={JOB_ROLE_LABELS[role]}
                            >
                              {shortRole(role)} · {levelLabel(row.levels[role])}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
            {rows.length === 0 && (
              <li className="mobile-stat py-10 text-center text-sm text-gray-500">No resources match these filters.</li>
            )}
          </ul>

          {/* Desktop table — editable cells */}
          <div className="card hidden overflow-auto lg:block">
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead className="bg-aheers-mist text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="sticky left-0 bg-aheers-mist px-4 py-3">Resource</th>
                  {COMPARE_ROLES.map((r) => (
                    <th key={r} className="px-2 py-3 font-medium">
                      {shortRole(r)}
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
                          <button
                            type="button"
                            onClick={() => setEditCell({ resource: row.resource, role })}
                            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition hover:ring-2 hover:ring-aheers-green/25 ${levelClass(level)}`}
                          >
                            {levelLabel(level)}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                title: "Approval thresholds",
                body: "Cashier refund ≤ R500 · Store manager ≤ R2,000 · Finance unlimited (demo).",
              },
              {
                title: "Scope dimensions",
                body: "Permissions evaluate org → store → warehouse → department.",
              },
              {
                title: "Audit",
                body: "Every role change and sensitive action is logged under Audit log.",
              },
            ].map((c) => (
              <div key={c.title} className="mobile-stat !p-4">
                <h3 className="font-semibold text-aheers-green-dark">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editCell && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="menu-panel w-full max-w-md space-y-4 rounded-t-3xl p-5 sm:rounded-3xl sm:p-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-aheers-green">Edit access</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-aheers-green-dark">{editCell.resource}</h3>
              <p className="text-sm text-gray-500">{JOB_ROLE_LABELS[editCell.role]}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(editCell.resource, editCell.role, l)}
                  className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${levelClass(l)} ${
                    editingLevel === l ? "ring-2 ring-aheers-green" : "ring-1 ring-black/5"
                  }`}
                >
                  {l === "none" ? "None" : levelLabel(l)}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setEditCell(null)} className="btn-secondary w-full">
              Cancel
            </button>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <form
            onSubmit={onAdd}
            className="menu-panel max-h-[90dvh] w-full max-w-md space-y-3 overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl sm:p-6"
          >
            <h3 className="font-display text-lg font-semibold text-aheers-green-dark">Add resource</h3>
            <input name="resource" required placeholder="Resource name" className="field" />
            <input name="module" placeholder="Module (e.g. Commerce)" defaultValue="Custom" className="field" />
            <PrettySelect
              name="level"
              label={`Default for ${JOB_ROLE_LABELS[focusRole]}`}
              defaultValue="read"
              options={LEVEL_OPTS}
            />
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-aheers-green-dark px-4 py-2 text-sm font-medium text-white shadow-lift lg:bottom-6">
          {toast}
        </div>
      )}
    </div>
  );
}
