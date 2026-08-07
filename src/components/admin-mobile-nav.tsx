"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  CheckSquare,
  Menu,
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
    label: "CRM",
    icon: Users,
    match: (p: string) => p.startsWith("/admin/customers") || p.startsWith("/admin/leads") || p.startsWith("/admin/tickets"),
  },
  {
    href: "/admin/tasks",
    label: "Tasks",
    icon: CheckSquare,
    match: (p: string) =>
      p.startsWith("/admin/tasks") || p.startsWith("/admin/meetings") || p.startsWith("/admin/calendar"),
  },
] as const;

/** Professional bottom nav for CRM mobile (ADOL-style · Aheers brand) */
export function AdminMobileNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin/chat")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_rgba(13,61,38,0.07)] lg:hidden"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2 pt-1">
        {TABS.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex min-h-[3.4rem] flex-col items-center justify-center gap-0.5 rounded-2xl px-1 transition ${
                  active ? "text-aheers-green" : "text-gray-400"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-2xl transition ${
                    active ? "bg-aheers-green text-white shadow-soft" : "bg-transparent"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.85} />
                </span>
                <span className={`text-[10px] font-semibold ${active ? "text-aheers-green-dark" : ""}`}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
        <li className="flex-1">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex min-h-[3.4rem] w-full flex-col items-center justify-center gap-0.5 rounded-2xl px-1 text-gray-400"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl">
              <Menu className="h-5 w-5" strokeWidth={1.85} />
            </span>
            <span className="text-[10px] font-semibold">More</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
