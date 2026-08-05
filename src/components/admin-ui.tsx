"use client";

import {
  Users,
  Package,
  ShoppingBag,
  Truck,
  MapPin,
  Clock,
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

export function AdminHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 bg-white px-6 py-5 md:px-8 md:py-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      <NotificationsBell audience="staff" variant="admin" fullPageHref="/admin/notifications" />
    </div>
  );
}

export function StatCard({
  label,
  value,
  change,
  icon,
  color = "blue",
}: {
  label: string;
  value: string;
  change?: string;
  icon: StatIconName;
  color?: "blue" | "green" | "amber" | "purple";
}) {
  const Icon: LucideIcon = STAT_ICONS[icon];
  const colors = {
    blue: "bg-aheers-cream text-aheers-green",
    green: "bg-green-50 text-aheers-green",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {change && <p className="mt-1 text-xs text-green-600">{change}</p>}
        </div>
        <div className={`rounded-lg p-2.5 ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-gray-100 text-gray-700",
    processing: "bg-blue-100 text-blue-700",
    dispatched: "bg-amber-100 text-amber-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
    idle: "bg-gray-100 text-gray-600",
    "en-route": "bg-blue-100 text-blue-700",
    delivering: "bg-amber-100 text-amber-700",
    returning: "bg-green-100 text-green-700",
    retail: "bg-blue-100 text-blue-700",
    trade: "bg-orange-100 text-orange-700",
    vip: "bg-purple-100 text-purple-700",
    invited: "bg-amber-100 text-amber-800",
    disabled: "bg-red-50 text-red-600",
    scheduled: "bg-blue-100 text-blue-700",
    ended: "bg-gray-100 text-gray-500",
    open: "bg-amber-100 text-amber-800",
    resolved: "bg-green-100 text-green-700",
    maintenance: "bg-orange-100 text-orange-800",
    low: "bg-slate-100 text-slate-600",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-amber-100 text-amber-800",
    blocker: "bg-red-100 text-red-700",
    in_progress: "bg-violet-100 text-violet-700",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status.replace(/[-_]/g, " ")}
    </span>
  );
}

export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-gray-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
