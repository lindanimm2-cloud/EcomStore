"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-ui";
import { PRODUCTS } from "@/lib/products";
import { STORES, getStore } from "@/lib/stores";
import { Product } from "@/lib/types";
import { PrettySelect } from "@/components/pretty-select";
import { Pencil, Plus, Search, Trash2, Minus } from "lucide-react";

const STORAGE_KEY = "aheers-inventory-v1";
const LOW = 30;

const STORE_OPTS = STORES.map((s) => ({ value: s.slug, label: s.shortName }));
const UNIT_OPTS = ["each", "pack", "bag", "case", "box", "roll", "/kg"].map((u) => ({
  value: u,
  label: u,
}));

type StockItem = Product;

function loadItems(): StockItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StockItem[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    /* ignore */
  }
  return PRODUCTS.map((p) => ({ ...p }));
}

function statusOf(qty: number) {
  if (qty <= 0) return { label: "Out", className: "bg-red-50 text-red-700" };
  if (qty < LOW) return { label: "Low", className: "bg-amber-50 text-amber-800" };
  return { label: "OK", className: "bg-green-50 text-green-700" };
}

export default function InventoryPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [q, setQ] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    setItems(loadItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const editing = items.find((p) => p.id === editId);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((p) => {
      if (storeFilter !== "all" && p.storeSlug !== storeFilter) return false;
      if (!needle) return true;
      const store = getStore(p.storeSlug)?.shortName ?? p.storeSlug;
      return `${p.name} ${p.category} ${store}`.toLowerCase().includes(needle);
    });
  }, [items, q, storeFilter]);

  const lowStock = items.filter((p) => p.inStock < LOW);

  function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const neu: StockItem = {
      id: `inv-${Date.now()}`,
      name: String(fd.get("name")),
      storeSlug: String(fd.get("storeSlug")) as Product["storeSlug"],
      category: String(fd.get("category") || "General"),
      price: Number(fd.get("price") || 0),
      unit: String(fd.get("unit") || "each"),
      image: String(fd.get("image") || "📦"),
      inStock: Number(fd.get("inStock") || 0),
      description: String(fd.get("description") || ""),
    };
    setItems((prev) => [neu, ...prev]);
    setShowAdd(false);
  }

  function onEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editId) return;
    const fd = new FormData(e.currentTarget);
    setItems((prev) =>
      prev.map((p) =>
        p.id === editId
          ? {
              ...p,
              name: String(fd.get("name")),
              storeSlug: String(fd.get("storeSlug")) as Product["storeSlug"],
              category: String(fd.get("category") || p.category),
              price: Number(fd.get("price") || 0),
              unit: String(fd.get("unit") || p.unit),
              image: String(fd.get("image") || p.image),
              inStock: Number(fd.get("inStock") || 0),
              description: String(fd.get("description") || p.description || ""),
            }
          : p
      )
    );
    setEditId(null);
  }

  function onRemove(id: string, name: string) {
    if (!window.confirm(`Remove “${name}” from inventory?`)) return;
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function adjustStock(id: string, delta: number) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: Math.max(0, p.inStock + delta) } : p))
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Inventory" subtitle="Stock across all Aheers stores · add, edit, adjust" />
        <div className="admin-page space-y-4">
          {lowStock.length > 0 && (
            <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                Low stock — {lowStock.length} item{lowStock.length === 1 ? "" : "s"} below {LOW}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-amber-800">
                {lowStock
                  .slice(0, 6)
                  .map((p) => p.name)
                  .join(", ")}
                {lowStock.length > 6 ? "…" : ""}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search product, category, store…"
                className="mobile-search lg:rounded-xl lg:border lg:border-gray-200 lg:bg-white lg:py-2.5 lg:pl-9 lg:focus:bg-white"
              />
            </div>
            <PrettySelect
              className="w-full sm:w-44"
              value={storeFilter}
              onChange={setStoreFilter}
              options={[{ value: "all", label: "All stores" }, ...STORE_OPTS]}
            />
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-aheers-green px-4 py-2.5 text-sm font-semibold text-white shadow-soft"
            >
              <Plus className="h-4 w-4" /> Add item
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Showing {filtered.length} of {items.length}
          </p>

          <ul className="space-y-2.5">
            {filtered.map((p) => {
              const store = getStore(p.storeSlug)?.shortName ?? p.storeSlug;
              const st = statusOf(p.inStock);
              return (
                <li key={p.id} className="mobile-stat !p-3.5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3f5f4] text-2xl">
                      {p.image}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-gray-900">{p.name}</h3>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {store} · {p.category}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${st.className}`}>
                          {st.label}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-600">
                        <span className="font-semibold text-aheers-charcoal">
                          R {p.price.toFixed(2)}
                          <span className="font-normal text-gray-400"> / {p.unit}</span>
                        </span>
                        <div className="inline-flex items-center gap-1 rounded-full bg-[#f3f5f4] p-0.5">
                          <button
                            type="button"
                            aria-label="Decrease stock"
                            onClick={() => adjustStock(p.id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-aheers-green-dark hover:bg-white"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[2.5rem] text-center font-bold text-aheers-green-dark">{p.inStock}</span>
                          <button
                            type="button"
                            aria-label="Increase stock"
                            onClick={() => adjustStock(p.id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-aheers-green-dark hover:bg-white"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setEditId(p.id)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 sm:flex-none"
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
                    </div>
                  </div>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="mobile-stat py-10 text-center text-sm text-gray-500">No products match your filters.</li>
            )}
          </ul>
        </div>
      </div>

      {showAdd && (
        <InventoryForm
          title="Add inventory item"
          onClose={() => setShowAdd(false)}
          onSubmit={onAdd}
          defaults={{
            name: "",
            storeSlug: "supermarket",
            category: "General",
            price: "0",
            unit: "each",
            image: "📦",
            inStock: "50",
            description: "",
          }}
          submitLabel="Save item"
        />
      )}

      {editing && (
        <InventoryForm
          title={`Edit · ${editing.name}`}
          onClose={() => setEditId(null)}
          onSubmit={onEdit}
          defaults={{
            name: editing.name,
            storeSlug: editing.storeSlug,
            category: editing.category,
            price: String(editing.price),
            unit: editing.unit,
            image: editing.image,
            inStock: String(editing.inStock),
            description: editing.description ?? "",
          }}
          submitLabel="Save changes"
        />
      )}
    </div>
  );
}

function InventoryForm({
  title,
  onClose,
  onSubmit,
  defaults,
  submitLabel,
}: {
  title: string;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  defaults: {
    name: string;
    storeSlug: string;
    category: string;
    price: string;
    unit: string;
    image: string;
    inStock: string;
    description: string;
  };
  submitLabel: string;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <form
        onSubmit={onSubmit}
        className="menu-panel max-h-[90dvh] w-full max-w-md space-y-3 overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl sm:p-6"
      >
        <h3 className="font-display text-lg font-semibold text-aheers-green-dark">{title}</h3>
        <input name="name" required defaultValue={defaults.name} placeholder="Product name" className="field" />
        <PrettySelect name="storeSlug" label="Store" defaultValue={defaults.storeSlug} options={STORE_OPTS} />
        <input name="category" required defaultValue={defaults.category} placeholder="Category" className="field" />
        <div className="grid grid-cols-2 gap-2">
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={defaults.price}
            placeholder="Price"
            className="field"
          />
          <PrettySelect name="unit" label="Unit" defaultValue={defaults.unit} options={UNIT_OPTS} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input name="inStock" type="number" min="0" required defaultValue={defaults.inStock} placeholder="Stock" className="field" />
          <input name="image" defaultValue={defaults.image} placeholder="Emoji" className="field" maxLength={4} />
        </div>
        <textarea name="description" rows={2} defaultValue={defaults.description} placeholder="Description" className="field" />
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1">
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
