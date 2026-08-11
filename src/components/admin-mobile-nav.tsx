"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  CheckSquare,
  MoreHorizontal,
  MessageCircle,
  Phone,
  Video,
  CalendarDays,
  Inbox,
  Ticket,
  Truck,
  Boxes,
  Megaphone,
  Settings,
  Headphones,
  Shield,
  X,
} from "lucide-react";

const TABS = [
  { href: "/admin", label: "Home", icon: LayoutDashboard, match: (p: string) => p === "/admin" },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingBag,
    match: (p: string) => p.startsWith("/admin/orders"),
  },
  {
    href: "/admin/customers",
    label: "Clients",
    icon: Users,
    match: (p: string) =>
      p.startsWith("/admin/customers") || p.startsWith("/admin/leads") || p.startsWith("/admin/tickets"),
  },
  {
    href: "/admin/calendar",
    label: "Diary",
    icon: CalendarDays,
    match: (p: string) =>
      p.startsWith("/admin/tasks") || p.startsWith("/admin/meetings") || p.startsWith("/admin/calendar"),
  },
] as const;

const MORE_GROUPS: { title: string; items: { href: string; label: string; icon: typeof MessageCircle }[] }[] = [
  {
    title: "Work",
    items: [
      { href: "/admin/chat", label: "Team chat", icon: MessageCircle },
      { href: "/admin/meetings", label: "Meetings", icon: Video },
      { href: "/admin/tasks", label: "Tasks", icon: CheckSquare },
      { href: "/admin/tickets", label: "Tickets", icon: Ticket },
      { href: "/admin/leads", label: "Intake / leads", icon: Inbox },
      { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
      { href: "/admin/service-desk", label: "Service desk", icon: Headphones },
      { href: "tel:0334131156", label: "Internal call", icon: Phone },
    ],
  },
  {
    title: "Commerce",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/inventory", label: "Inventory", icon: Boxes },
      { href: "/admin/fleet", label: "Fleet", icon: Truck },
      { href: "/admin/promotions", label: "Promotions", icon: Megaphone },
    ],
  },
  {
    title: "Management",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/roles", label: "Roles", icon: Shield },
    ],
  },
];

export function AdminMobileNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const [more, setMore] = useState(false);

  if (pathname.startsWith("/admin/chat")) return null;

  return (
    <>
      {more && (
        <div className="fixed inset-0 z-[48] lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/45" aria-label="Close more" onClick={() => setMore(false)} />
          <div className="absolute inset-x-2 bottom-[calc(4.85rem+env(safe-area-inset-bottom))] top-[calc(4.75rem+env(safe-area-inset-top))] overflow-y-auto rounded-[1.75rem] border border-aheers-gold/25 bg-aheers-green-dark px-4 py-4 text-white shadow-[0_20px_50px_rgba(13,61,38,0.45)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-aheers-gold">More</p>
              <button
                type="button"
                onClick={() => setMore(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {MORE_GROUPS.map((g) => (
              <div key={g.title} className="mb-5">
                <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-aheers-gold/70">
                  {g.title}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {g.items.map(({ href, label, icon: Icon }) => {
                    const active = href.startsWith("/admin") && pathname.startsWith(href);
                    return (
                      <Link
                        key={href + label}
                        href={href}
                        onClick={() => setMore(false)}
                        className={`flex min-h-[4.25rem] flex-col justify-center gap-1.5 rounded-2xl px-3 py-3 ${
                          active ? "bg-aheers-gold/15 ring-1 ring-aheers-gold/50" : "bg-white/8"
                        }`}
                      >
                        <Icon className="h-4 w-4 text-aheers-gold" />
                        <span className="text-[13px] font-semibold leading-tight">{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setMore(false);
                onOpenMenu();
              }}
              className="mb-1 w-full rounded-2xl bg-white/8 py-3 text-sm font-semibold text-white/80"
            >
              Full menu
            </button>
          </div>
        </div>
      )}

      <nav
        className="fixed bottom-[max(0.65rem,env(safe-area-inset-bottom))] left-3 right-3 z-40 rounded-full border border-aheers-gold/30 bg-aheers-green-dark/95 px-1.5 py-1 shadow-[0_12px_40px_rgba(13,61,38,0.35)] backdrop-blur-xl lg:hidden"
        aria-label="Primary"
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-between">
          {TABS.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={`flex min-h-[3.15rem] flex-col items-center justify-center gap-0.5 px-1 transition ${
                    active ? "text-aheers-gold" : "text-white/45"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.35 : 1.75} />
                  <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{label}</span>
                </Link>
              </li>
            );
          })}
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setMore(true)}
              className={`flex min-h-[3.15rem] w-full flex-col items-center justify-center gap-0.5 px-1 ${
                more ? "text-aheers-gold" : "text-white/45"
              }`}
            >
              <MoreHorizontal className="h-[18px] w-[18px]" strokeWidth={more ? 2.35 : 1.75} />
              <span className={`text-[10px] ${more ? "font-bold" : "font-medium"}`}>More</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
