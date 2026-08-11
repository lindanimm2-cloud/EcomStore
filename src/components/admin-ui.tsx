"use client";

import type { ReactNode } from "react";
import {
  Users,
  Package,
  ShoppingBag,
  Truck,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { NotificationsBell } from "@/components/notifications-bell";

const STAT_ICONS = {
  users: Users,
  package: Package,
  shoppingBag: ShoppingBag,
  truck: Truck,
  mapPin: MapPin,
  clock: Clock,
} as const;

export type StatIconName = keyof typeof STAT_ICONS;

export function AdminHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <>
      {/* Desktop / tablet page header */}
      <div className="hidden border-b border-gray-100/80 bg-white px-8 py-5 lg:block">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-aheers-green-dark">
              {title}
            </h1>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {actions}
            <NotificationsBell audience="staff" variant="admin" fullPageHref="/admin/notifications" />
          </div>
        </div>
      </div>
      {/* Mobile: actions only (title lives in top ops bar) */}
      {actions && (
        <div className="flex flex-wrap gap-2 border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
          {actions}
        </div>
      )}
    </>
  );
}

export function StatCard({
  label,
  value,
  change,
  changeUp,
  icon,
  color = "green",
}: {
  label: string;
  value: string;
  change?: string;
  /** When set with change, shows trend arrow (ADOL-style) */
  changeUp?: boolean;
  icon: StatIconName;
  color?: "blue" | "green" | "amber" | "gold";
}) {
  const Icon: LucideIcon = STAT_ICONS[icon];
  const colors = {
    blue: "bg-[#e8f2ec] text-aheers-green",
    green: "bg-aheers-green/10 text-aheers-green",
    amber: "bg-amber-50 text-amber-700",
    gold: "bg-aheers-gold/20 text-aheers-green-dark",
  };

  return (
    <div className="mobile-stat">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}>
          <Icon className="h-4.5 w-4.5 h-[1.125rem] w-[1.125rem]" />
        </span>
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
              changeUp === false ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {changeUp === false ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <TrendingUp className="h-3 w-3" />
            )}
            {change}
          </span>
        )}
      </div>
      <p className="text-[1.75rem] font-bold leading-none tracking-tight text-aheers-charcoal">{value}</p>
      <p className="mt-2 text-xs font-medium text-gray-500">{label}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    vip: "bg-aheers-gold/20 text-aheers-green-dark",
    invited: "bg-amber-100 text-amber-800",
    disabled: "bg-red-50 text-red-600",
    scheduled: "bg-aheers-mist text-aheers-green-dark",
    ended: "bg-gray-100 text-gray-500",
    open: "bg-amber-100 text-amber-800",
    resolved: "bg-green-100 text-green-700",
    maintenance: "bg-orange-100 text-orange-800",
    low: "bg-slate-100 text-slate-600",
    medium: "bg-aheers-mist text-aheers-green-dark",
    high: "bg-amber-100 text-amber-800",
    blocker: "bg-red-100 text-red-700",
    in_progress: "bg-aheers-green/10 text-aheers-green-dark",
    processing: "bg-aheers-mist text-aheers-green-dark",
    pending: "bg-gray-100 text-gray-700",
    dispatched: "bg-amber-100 text-amber-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
    idle: "bg-gray-100 text-gray-600",
    "en-route": "bg-aheers-mist text-aheers-green-dark",
    delivering: "bg-amber-100 text-amber-700",
    returning: "bg-green-100 text-green-700",
    retail: "bg-aheers-mist text-aheers-green-dark",
    trade: "bg-orange-100 text-orange-700",
    todo: "bg-gray-100 text-gray-700",
    waiting: "bg-amber-50 text-amber-800",
    contacted: "bg-aheers-mist text-aheers-green-dark",
    overdue: "bg-red-50 text-red-700",
    done: "bg-green-100 text-green-700",
    call: "bg-aheers-mist text-aheers-green-dark",
    video: "bg-aheers-green/10 text-aheers-green-dark",
    "in-person": "bg-aheers-gold/15 text-aheers-green-dark",
    "site-visit": "bg-amber-50 text-amber-800",
    "follow-up": "bg-aheers-mist text-aheers-green-dark",
    quote: "bg-aheers-gold/15 text-aheers-green-dark",
    delivery: "bg-amber-50 text-amber-800",
    support: "bg-aheers-green/10 text-aheers-green-dark",
    internal: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status.replace(/[-_]/g, " ")}
    </span>
  );
}

export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | ReactNode)[][];
}) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="border-b border-gray-100 bg-[#f7f8f9]">
            <tr>
              {headers.map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80">
                {row.map((cell, j) => (
                  <td key={j} className="whitespace-nowrap px-4 py-3.5 text-gray-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
