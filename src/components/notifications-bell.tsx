"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Package, Truck, Gift, Megaphone, Ticket, Boxes, Info, CheckCheck } from "lucide-react";
import {
  useNotifications,
  timeAgo,
  NotificationAudience,
  NotificationKind,
} from "@/lib/notifications-context";

const KIND_ICON: Record<NotificationKind, typeof Bell> = {
  order: Package,
  delivery: Truck,
  rewards: Gift,
  promo: Megaphone,
  ticket: Ticket,
  fleet: Truck,
  inventory: Boxes,
  system: Info,
};

export function NotificationsBell({
  audience = "customer",
  variant = "light",
  fullPageHref,
}: {
  audience?: NotificationAudience | "any";
  variant?: "light" | "dark" | "admin";
  fullPageHref?: string;
}) {
  const { listFor, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const items = listFor(audience);
  const unread = unreadCount(audience);

  const btn =
    variant === "dark"
      ? "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
      : variant === "admin"
        ? "inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        : "inline-flex items-center gap-2 rounded-full border border-aheers-green/15 bg-white px-3 py-1.5 text-sm font-medium text-aheers-charcoal shadow-soft transition hover:border-aheers-green/30";

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} className={btn} aria-label="Notifications">
        <Bell className="h-4 w-4" />
        <span className="hidden sm:inline">{unread > 0 ? `${unread} unread` : "Alerts"}</span>
        {unread > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-aheers-gold px-1 text-[10px] font-bold text-aheers-green-dark sm:hidden">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="menu-panel absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,22rem)] animate-fade-up overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div>
                <p className="font-semibold text-gray-900">Notifications</p>
                <p className="text-xs text-gray-400">{unread} unread</p>
              </div>
              <button
                type="button"
                onClick={() => markAllRead(audience)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-aheers-green hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {items.length === 0 && (
                <li className="px-4 py-10 text-center text-sm text-gray-400">You&apos;re all caught up</li>
              )}
              {items.map((n) => {
                const Icon = KIND_ICON[n.kind];
                return (
                  <li key={n.id} className={`border-b border-gray-50 last:border-0 ${n.read ? "bg-white" : "bg-aheers-mist/60"}`}>
                    {n.href ? (
                      <Link
                        href={n.href}
                        onClick={() => {
                          markRead(n.id);
                          setOpen(false);
                        }}
                        className="flex gap-3 px-4 py-3 transition hover:bg-gray-50"
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-aheers-green/10 text-aheers-green">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-gray-900">{n.title}</span>
                          <span className="mt-0.5 block text-xs text-gray-500">{n.body}</span>
                          <span className="mt-1 block text-[10px] text-gray-400">{timeAgo(n.createdAt)}</span>
                        </span>
                        {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-aheers-green" />}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markRead(n.id)}
                        className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-aheers-green/10 text-aheers-green">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-gray-900">{n.title}</span>
                          <span className="mt-0.5 block text-xs text-gray-500">{n.body}</span>
                          <span className="mt-1 block text-[10px] text-gray-400">{timeAgo(n.createdAt)}</span>
                        </span>
                        {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-aheers-green" />}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
            {fullPageHref && (
              <div className="border-t border-gray-100 px-4 py-2.5 text-center">
                <Link
                  href={fullPageHref}
                  onClick={() => setOpen(false)}
                  className="text-xs font-semibold text-aheers-green hover:underline"
                >
                  View all notifications →
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
