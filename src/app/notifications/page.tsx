"use client";

import Link from "next/link";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { useNotifications, timeAgo } from "@/lib/notifications-context";
import { CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const { listFor, markRead, markAllRead, unreadCount } = useNotifications();
  const items = listFor("customer");
  const unread = unreadCount("customer");

  return (
    <>
      <StoreSwitcher />
      <main>
        <PageHero
          eyebrow="Inbox"
          title="Notifications"
          subtitle="Orders, delivery ETAs, rewards and specials — all in one place."
          actions={
            <button type="button" onClick={() => markAllRead("customer")} className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-aheers-green-dark">
              Mark all read ({unread})
            </button>
          }
        />
        <div className="page-shell max-w-3xl py-10">
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => markAllRead("customer")}
              className="inline-flex items-center gap-1 text-sm font-semibold text-aheers-green"
            >
              <CheckCheck className="h-4 w-4" /> Mark all read
            </button>
          </div>
          <div className="space-y-3">
            {items.map((n) => (
              <div
                key={n.id}
                className={`card-hover p-5 ${n.read ? "" : "ring-1 ring-aheers-green/20"}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-aheers-green-dark">{n.title}</p>
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
      </main>
      <SiteFooter />
    </>
  );
}
