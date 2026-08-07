"use client";

import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-ui";
import { useNotifications, timeAgo } from "@/lib/notifications-context";
import { CheckCheck } from "lucide-react";

export default function AdminNotificationsPage() {
  const { listFor, markRead, markAllRead, unreadCount } = useNotifications();
  const items = listFor("staff");
  const unread = unreadCount("staff");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main bg-[#f4f5f7]">
        <AdminHeader title="Notifications" subtitle="Tickets, stock, fleet delays and CRM alerts" />
        <div className="admin-page">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">{unread} unread · {items.length} total</p>
            <button
              type="button"
              onClick={() => markAllRead("staff")}
              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-aheers-green ring-1 ring-gray-200"
            >
              <CheckCheck className="h-4 w-4" /> Mark all read
            </button>
          </div>
          <div className="space-y-3">
            {items.map((n) => (
              <div key={n.id} className={`rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5 ${n.read ? "" : "ring-aheers-green/25"}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{n.kind}</p>
                    <h2 className="mt-1 font-semibold text-gray-900">{n.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">{n.body}</p>
                    <p className="mt-2 text-xs text-gray-400">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <button type="button" onClick={() => markRead(n.id)} className="text-xs font-semibold text-aheers-green">
                      Mark read
                    </button>
                  )}
                </div>
                {n.href && (
                  <Link href={n.href} onClick={() => markRead(n.id)} className="mt-3 inline-block text-sm font-semibold text-aheers-green hover:underline">
                    Open →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
