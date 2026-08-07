"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatusBadge } from "@/components/admin-ui";
import { CUSTOMERS, ORDERS, formatCurrency, formatDate } from "@/lib/data";
import { STAFF_NOTES } from "@/lib/crm-data";
import { useAuth } from "@/lib/auth-context";
import { Search, Phone, Mail, MapPin } from "lucide-react";
import { PrettySelect } from "@/components/pretty-select";

function CustomersCrmInner() {
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(CUSTOMERS[1]?.id ?? CUSTOMERS[0].id);
  const [notes, setNotes] = useState(STAFF_NOTES);
  const [noteText, setNoteText] = useState("");

  const filtered = useMemo(() => {
    return CUSTOMERS.filter((c) => {
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      const hay = `${c.name} ${c.email} ${c.phone} ${c.infinityCardId}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [q, typeFilter]);

  const selected = CUSTOMERS.find((c) => c.id === selectedId) ?? filtered[0];
  const customerOrders = ORDERS.filter((o) => o.customerId === selected?.id);
  const customerNotes = notes.filter((n) => n.customerId === selected?.id);

  function addNote(e: FormEvent) {
    e.preventDefault();
    if (!selected || !noteText.trim()) return;
    setNotes((prev) => [
      {
        id: `n-${Date.now()}`,
        customerId: selected.id,
        author: user?.name ?? "Staff",
        text: noteText.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setNoteText("");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader
          title="CRM — Customers"
          subtitle={`Signed in as ${user?.name} (${user?.title})`}
        />
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 text-xs text-gray-500 md:px-8">
          <span className="truncate">Live CRM workspace · search, 360 view, notes</span>
          <button
            type="button"
            onClick={() => {
              logout();
              window.location.href = "/login/staff";
            }}
            className="shrink-0 text-aheers-green hover:underline"
          >
            Sign out
          </button>
        </div>
        <div className="admin-page grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name, phone, card…"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm"
                />
              </div>
              <PrettySelect
                value={typeFilter}
                onChange={setTypeFilter}
                className="w-full sm:w-36"
                options={[
                  { value: "all", label: "All types" },
                  { value: "retail", label: "Retail" },
                  { value: "vip", label: "VIP" },
                  { value: "trade", label: "Trade" },
                ]}
              />
            </div>
            <div className="card max-h-[50vh] divide-y divide-gray-100 overflow-y-auto lg:max-h-[70vh]">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={`flex w-full items-start justify-between px-4 py-3 text-left hover:bg-gray-50 ${
                    selected?.id === c.id ? "bg-aheers-cream" : ""
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.phone}</p>
                  </div>
                  <StatusBadge status={c.type} />
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <div className="space-y-4 lg:col-span-3">
              <div className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{selected.name}</h2>
                    <p className="text-sm capitalize text-gray-500">
                      {selected.rewardsTier} · {selected.infinityCardId}
                    </p>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-aheers-green" />{selected.phone}</p>
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-aheers-green" />{selected.email}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-aheers-green" />{selected.address}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-lg font-bold">{formatCurrency(selected.totalSpent)}</p>
                    <p className="text-xs text-gray-500">Lifetime</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-lg font-bold">{formatCurrency(selected.cashbackBalance)}</p>
                    <p className="text-xs text-gray-500">Cashback</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-lg font-bold">{selected.loyaltyPoints}</p>
                    <p className="text-xs text-gray-500">Points</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-lg font-bold">{formatCurrency(selected.walletBalance)}</p>
                    <p className="text-xs text-gray-500">Wallet</p>
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="mb-3 font-semibold">Orders</h3>
                {customerOrders.length === 0 ? (
                  <p className="text-sm text-gray-500">No orders</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {customerOrders.map((o) => (
                      <li key={o.id} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                        <span>{o.id} · {o.storeSlug}</span>
                        <span className="capitalize">{o.status} · {formatCurrency(o.total)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/admin/orders" className="mt-3 inline-block text-xs text-aheers-green hover:underline">
                  All orders →
                </Link>
              </div>

              <div className="card p-5">
                <h3 className="mb-3 font-semibold">Staff notes</h3>
                <form onSubmit={addNote} className="mb-3 flex gap-2">
                  <input
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add CRM note…"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                  <button type="submit" className="btn-primary text-sm">
                    Save
                  </button>
                </form>
                <ul className="space-y-2">
                  {customerNotes.map((n) => (
                    <li key={n.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm">
                      <p>{n.text}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {n.author} · {formatDate(n.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  return <CustomersCrmInner />;
}
