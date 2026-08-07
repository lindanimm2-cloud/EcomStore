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
    label: "Aheers",
    icon: Users,
    match: (p: string) =>
      p.startsWith("/admin/customers") || p.startsWith("/admin/leads") || p.startsWith("/admin/tickets"),
  },
  {
    href: "/admin/tasks",
    label: "Tasks",
    icon: CheckSquare,
    match: (p: string) =>
      p.startsWith("/admin/tasks") || p.startsWith("/admin/meetings") || p.startsWith("/admin/calendar"),
  },
] as const;

/** Clean ADOL-style bottom nav — icon color only when active */
export function AdminMobileNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin/chat")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 pt-1">
        {TABS.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex min-h-[3.35rem] flex-col items-center justify-center gap-1 px-1 transition ${
                  active ? "text-aheers-green" : "text-gray-400"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.35 : 1.75} />
                <span className={`text-[10px] ${active ? "font-bold text-aheers-green-dark" : "font-medium"}`}>
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
            className="flex min-h-[3.35rem] w-full flex-col items-center justify-center gap-1 px-1 text-gray-400"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
