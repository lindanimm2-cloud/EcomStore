"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatusBadge } from "@/components/admin-ui";
import { PrettySelect } from "@/components/pretty-select";
import { PROMOTIONS } from "@/lib/settings-data";
import { STORES } from "@/lib/stores";
import { Megaphone, Pencil, Plus, Trash2 } from "lucide-react";

const STORAGE_KEY = "aheers-promotions-v1";

type Promo = (typeof PROMOTIONS)[number];

const TYPE_OPTS = [
  { value: "SKU discount", label: "SKU discount" },
  { value: "Bulk pricing", label: "Bulk pricing" },
  { value: "Bundle", label: "Bundle" },
  { value: "% off category", label: "% off category" },
  { value: "BOGO", label: "Buy one get one" },
];

const STATUS_OPTS = [
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "ended", label: "Ended" },
];

const STORE_OPTS = [
  { value: "All stores", label: "All stores" },
  ...STORES.map((s) => ({ value: s.shortName, label: s.shortName })),
];

function loadPromos(): Promo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Promo[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    /* ignore */
  }
  return PROMOTIONS.map((p) => ({ ...p }));
}

function nextId(list: Promo[]) {
  const nums = list
    .map((p) => Number(String(p.id).replace(/\D/g, "")))
    .filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `PR-${String(max + 1).padStart(2, "0")}`;
}

export default function PromotionsPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setPromos(loadPromos());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(promos));
  }, [promos, hydrated]);

  const editing = promos.find((p) => p.id === editId);

  const list = useMemo(() => {
    if (filter === "all") return promos;
    return promos.filter((p) => p.status === filter);
  }, [promos, filter]);

  function openNew() {
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(id: string) {
    setEditId(id);
    setShowForm(true);
  }

  function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name")).trim();
    if (!name) return;
    const payload: Promo = {
      id: editId ?? nextId(promos),
      name,
      type: String(fd.get("type")),
      status: String(fd.get("status")),
      stores: String(fd.get("stores")),
      ends: String(fd.get("ends")),
    };
    setPromos((prev) => {
      if (editId) return prev.map((p) => (p.id === editId ? payload : p));
      return [payload, ...prev];
    });
    setShowForm(false);
    setEditId(null);
  }

  function onRemove(id: string, name: string) {
    if (!window.confirm(`Remove promotion “${name}”?`)) return;
    setPromos((prev) => prev.filter((p) => p.id !== id));
  }

  function setStatus(id: string, status: string) {
    setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Promotions" subtitle="SKU deals · Bundles · Trade pricing · Store scope" />
        <div className="admin-page space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {["all", "active", "scheduled", "ended"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`shrink-0 capitalize ${filter === f ? "chip-active" : "chip-idle"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button type="button" onClick={openNew} className="btn-primary shrink-0">
              <Plus className="h-4 w-4" /> New promotion
            </button>
          </div>

          <p className="text-xs text-gray-500">
            {list.length} promotion{list.length === 1 ? "" : "s"}
          </p>

          {/* Mobile cards */}
          <ul className="space-y-2.5 lg:hidden">
            {list.map((p) => (
              <li key={p.id} className="mobile-stat !p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-aheers-gold/15 text-aheers-green-dark">
                    <Megaphone className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900">{p.name}</p>
                        <p className="font-mono text-[11px] text-gray-400">{p.id}</p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      {p.type} · {p.stores}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Ends {p.ends}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(p.id)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(p.id, p.name)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {["active", "scheduled", "ended"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStatus(p.id, s)}
                          className={`rounded-lg px-2 py-1 text-[10px] font-semibold capitalize ${
                            p.status === s ? "bg-aheers-green text-white" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {list.length === 0 && (
              <li className="mobile-stat py-10 text-center text-sm text-gray-500">No promotions in this filter.</li>
            )}
          </ul>

          {/* Desktop table */}
          <div className="card hidden overflow-hidden lg:block">
            <table className="w-full text-sm">
              <thead className="bg-aheers-mist text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Promo</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Stores</th>
                  <th className="px-4 py-3">Ends</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {list.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.id}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.type}</td>
                    <td className="px-4 py-3">{p.stores}</td>
                    <td className="px-4 py-3">{p.ends}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(p.id)}
                          className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium hover:bg-aheers-mist"
                        >
                          Edit
                        </button>
                        {["active", "scheduled", "ended"].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(p.id, s)}
                            className="rounded-lg bg-gray-100 px-2 py-1 text-xs capitalize hover:bg-aheers-mist"
                          >
                            {s}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => onRemove(p.id, p.name)}
                          className="rounded-lg bg-red-50 px-2 py-1 text-xs text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <form
            onSubmit={onSave}
            className="menu-panel max-h-[90dvh] w-full max-w-md space-y-3 overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl sm:p-6"
          >
            <h3 className="font-display text-lg font-semibold text-aheers-green-dark">
              {editing ? `Edit · ${editing.name}` : "New promotion"}
            </h3>
            <input
              name="name"
              required
              defaultValue={editing?.name ?? ""}
              placeholder="Promotion name"
              className="field"
              autoFocus
            />
            <PrettySelect
              name="type"
              label="Type"
              defaultValue={editing?.type ?? TYPE_OPTS[0].value}
              options={TYPE_OPTS}
            />
            <PrettySelect
              name="stores"
              label="Stores"
              defaultValue={editing?.stores ?? "Supermarket"}
              options={STORE_OPTS}
            />
            <PrettySelect
              name="status"
              label="Status"
              defaultValue={editing?.status ?? "scheduled"}
              options={STATUS_OPTS}
            />
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                End date
              </label>
              <input
                name="ends"
                type="date"
                required
                defaultValue={editing?.ends ?? "2026-08-31"}
                className="field"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                {editing ? "Save changes" : "Create promotion"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
