"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatCard, StatusBadge } from "@/components/admin-ui";
import { CUSTOMERS, ORDERS, formatCurrency } from "@/lib/data";
import { PRODUCTS } from "@/lib/products";
import { FLEET_VEHICLES, getStatusLabel } from "@/lib/fleet";
import {
  CRM_MEETINGS,
  CRM_TASKS,
  meetingsOnDate,
  tasksDueOnDate,
} from "@/lib/crm-activity";
import {
  CalendarDays,
  CheckSquare,
  Video,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  ArrowRight,
  Truck,
} from "lucide-react";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const TODAY = "2026-08-05";

function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function monthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function AdminDashboard() {
  const [cursor, setCursor] = useState(() => new Date(2026, 7, 1));
  const [selected, setSelected] = useState(TODAY);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => monthMatrix(year, month), [year, month]);
  const monthLabel = cursor.toLocaleDateString("en-ZA", { month: "long", year: "numeric" });

  const dayMeetings = meetingsOnDate(selected, CRM_MEETINGS);
  const dayTasks = tasksDueOnDate(selected, CRM_TASKS);
  const upcomingMeetings = CRM_MEETINGS.filter((m) => m.status === "scheduled").slice(0, 4);
  const openTasks = CRM_TASKS.filter((t) => t.status !== "done").slice(0, 5);
  const activeOrders = ORDERS.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const activeFleet = FLEET_VEHICLES.filter((v) => v.status !== "idle");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-aheers-mist">
        <AdminHeader
          title="Operations Dashboard"
          subtitle="Aheers Group · Real-time overview across all stores"
        />

        <div className="space-y-6 p-5 md:p-8">
          {/* KPI row */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Active Customers" value={String(CUSTOMERS.length)} change="+2 this week" icon="users" color="blue" />
            <StatCard
              label="Orders Today"
              value={String(ORDERS.length)}
              change={`${activeOrders.length} open`}
              icon="shoppingBag"
              color="green"
            />
            <StatCard label="Products Listed" value={String(PRODUCTS.length)} icon="package" color="purple" />
            <StatCard
              label="Fleet Active"
              value={`${activeFleet.length}/${FLEET_VEHICLES.length}`}
              change="Live tracking"
              icon="truck"
              color="amber"
            />
          </div>

          {/* Calendar + agenda + tasks */}
          <div className="grid gap-5 xl:grid-cols-12">
            {/* Mini calendar */}
            <section className="surface overflow-hidden xl:col-span-4">
              <div className="flex items-center justify-between border-b border-aheers-green/10 bg-gradient-to-br from-aheers-green-dark to-aheers-green px-5 py-4 text-white">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-aheers-gold">Calendar</p>
                  <h2 className="font-display text-xl font-semibold">{monthLabel}</h2>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="rounded-lg bg-white/10 p-1.5 hover:bg-white/20"
                    onClick={() => setCursor(new Date(year, month - 1, 1))}
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-white/10 p-1.5 hover:bg-white/20"
                    onClick={() => setCursor(new Date(year, month + 1, 1))}
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((day, i) => {
                    if (day === null) return <div key={`e-${i}`} className="aspect-square" />;
                    const key = toKey(year, month, day);
                    const hasMeet = meetingsOnDate(key).length > 0;
                    const hasTask = tasksDueOnDate(key).length > 0;
                    const isSelected = key === selected;
                    const isToday = key === TODAY;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelected(key)}
                        className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-medium transition ${
                          isSelected
                            ? "bg-aheers-green text-white shadow-soft"
                            : isToday
                              ? "bg-aheers-gold/15 text-aheers-green-dark ring-1 ring-aheers-gold/40"
                              : "text-gray-700 hover:bg-aheers-mist"
                        }`}
                      >
                        {day}
                        {(hasMeet || hasTask) && (
                          <span className="absolute bottom-1 flex gap-0.5">
                            {hasMeet && (
                              <span className={`h-1 w-1 rounded-full ${isSelected ? "bg-aheers-gold" : "bg-aheers-green"}`} />
                            )}
                            {hasTask && (
                              <span className={`h-1 w-1 rounded-full ${isSelected ? "bg-white/80" : "bg-amber-500"}`} />
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <Link
                  href="/admin/calendar"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-aheers-green hover:underline"
                >
                  Full calendar <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </section>

            {/* Selected day agenda */}
            <section className="surface p-5 xl:col-span-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-aheers-gold">Agenda</p>
                  <h2 className="font-display text-lg font-semibold text-aheers-green-dark">
                    {new Date(selected + "T12:00:00").toLocaleDateString("en-ZA", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                    })}
                  </h2>
                </div>
                <Link href="/admin/meetings" className="text-xs font-semibold text-aheers-green hover:underline">
                  All meetings
                </Link>
              </div>

              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <Video className="h-3.5 w-3.5" /> Meetings
              </p>
              {dayMeetings.length === 0 ? (
                <p className="mb-4 text-sm text-gray-400">No meetings</p>
              ) : (
                <ul className="mb-5 space-y-2">
                  {dayMeetings.map((m) => (
                    <li key={m.id} className="rounded-xl border border-aheers-green/10 bg-aheers-mist/60 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">{m.title}</p>
                        <StatusBadge status={m.type} />
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {m.startTime}–{m.endTime}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        {m.location}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <CheckSquare className="h-3.5 w-3.5" /> Tasks due
              </p>
              {dayTasks.length === 0 ? (
                <p className="text-sm text-gray-400">No tasks due</p>
              ) : (
                <ul className="space-y-2">
                  {dayTasks.map((t) => (
                    <li key={t.id} className="flex items-start justify-between gap-2 rounded-xl border border-gray-100 px-3 py-2.5">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{t.title}</p>
                        <p className="text-xs text-gray-400">{t.owner}</p>
                      </div>
                      <StatusBadge status={t.priority} />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Open tasks + upcoming */}
            <section className="surface flex flex-col p-5 xl:col-span-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-aheers-gold">CRM</p>
                  <h2 className="font-display text-lg font-semibold text-aheers-green-dark">Open tasks</h2>
                </div>
                <Link href="/admin/tasks" className="text-xs font-semibold text-aheers-green hover:underline">
                  Board
                </Link>
              </div>
              <ul className="flex-1 space-y-2">
                {openTasks.map((t) => (
                  <li key={t.id} className="rounded-xl bg-aheers-mist/70 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">{t.title}</p>
                      <StatusBadge status={t.status} />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      Due {t.dueDate} · {t.relatedTo}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-aheers-green/10 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Next meetings</p>
                <ul className="space-y-1.5">
                  {upcomingMeetings.map((m) => (
                    <li key={m.id} className="flex justify-between gap-2 text-xs">
                      <span className="truncate text-gray-700">{m.title}</span>
                      <span className="shrink-0 text-gray-400">
                        {m.date.slice(5)} · {m.startTime}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Orders + fleet */}
          <div className="grid gap-5 lg:grid-cols-5">
            <section className="surface overflow-hidden lg:col-span-3">
              <div className="flex items-center justify-between border-b border-aheers-green/10 px-5 py-4">
                <h3 className="font-display text-lg font-semibold text-aheers-green-dark">Recent orders</h3>
                <Link href="/admin/orders" className="text-xs font-semibold text-aheers-green hover:underline">
                  View all
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      <th className="px-5 py-3">Order</th>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Store</th>
                      <th className="px-5 py-3">Total</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {ORDERS.slice(0, 6).map((o) => (
                      <tr key={o.id} className="hover:bg-aheers-mist/50">
                        <td className="px-5 py-3 font-mono text-xs text-gray-500">{o.id}</td>
                        <td className="px-5 py-3 font-medium text-gray-900">{o.customerName}</td>
                        <td className="px-5 py-3 capitalize text-gray-500">{o.storeSlug}</td>
                        <td className="px-5 py-3 font-semibold text-aheers-green-dark">{formatCurrency(o.total)}</td>
                        <td className="px-5 py-3">
                          <StatusBadge status={o.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="surface p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-aheers-green-dark">
                  <Truck className="h-4 w-4 text-aheers-green" /> Active deliveries
                </h3>
                <Link href="/admin/fleet" className="text-xs font-semibold text-aheers-green hover:underline">
                  Fleet
                </Link>
              </div>
              <div className="space-y-3">
                {activeFleet.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-2xl border border-aheers-green/10 bg-gradient-to-r from-white to-aheers-mist/80 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{v.name}</p>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {v.driver} → {v.destination}
                        </p>
                      </div>
                      <StatusBadge status={v.status} />
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      {getStatusLabel(v.status)}
                      {v.eta ? ` · ETA ${v.eta}` : ""}
                      {v.orderId ? ` · ${v.orderId}` : ""}
                    </p>
                  </div>
                ))}
                {activeFleet.length === 0 && <p className="text-sm text-gray-500">All vehicles idle.</p>}
              </div>
            </section>
          </div>

          {/* Quick launch */}
          <section className="surface p-5">
            <h3 className="mb-4 font-display text-lg font-semibold text-aheers-green-dark">Quick launch</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Team chat", href: "/admin/chat", hint: "Internal messaging", icon: MessageCircle },
                { name: "Calendar", href: "/admin/calendar", hint: "Month view", icon: CalendarDays },
                { name: "Meetings", href: "/admin/meetings", hint: "Calls · site visits", icon: Video },
                { name: "Tasks", href: "/admin/tasks", hint: "Follow-ups & quotes", icon: CheckSquare },
              ].map(({ name, href, hint, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  className="group flex items-center gap-3 rounded-2xl border border-aheers-green/10 bg-aheers-mist/50 p-4 transition hover:-translate-y-0.5 hover:border-aheers-gold/40 hover:bg-white hover:shadow-soft"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-aheers-green text-aheers-gold transition group-hover:bg-aheers-green-dark">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-aheers-green-dark">{name}</span>
                    <span className="text-xs text-gray-500">{hint}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
