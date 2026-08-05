"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Truck,
  BarChart3,
  Settings,
  Boxes,
  UserCircle,
  Zap,
  Headphones,
  Ticket,
  Target,
  LogOut,
  Shield,
  UserCog,
  Megaphone,
  ScrollText,
  Filter,
  Car,
  IdCard,
  Bug,
  Bell,
  MessageCircle,
  CalendarDays,
  Video,
  CheckSquare,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    title: "CRM",
    items: [
      { href: "/admin/customers", label: "Customers 360", icon: Users },
      { href: "/admin/chat", label: "Team chat", icon: MessageCircle },
      { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
      { href: "/admin/meetings", label: "Meetings", icon: Video },
      { href: "/admin/tasks", label: "Tasks", icon: CheckSquare },
      { href: "/admin/tickets", label: "Tickets", icon: Ticket },
      { href: "/admin/leads", label: "Leads", icon: Target },
      { href: "/admin/segments", label: "Segments", icon: Filter },
      { href: "/admin/service-desk", label: "Service Counter", icon: Headphones },
    ],
  },
  {
    title: "Commerce",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/inventory", label: "Inventory", icon: Boxes },
      { href: "/admin/promotions", label: "Promotions", icon: Megaphone },
      { href: "/admin/fleet", label: "Fleet Tracker", icon: Truck },
    ],
  },
  {
    title: "Settings",
    items: [
      { href: "/admin/settings", label: "Settings hub", icon: Settings },
      { href: "/admin/settings/vehicles", label: "Vehicles", icon: Car },
      { href: "/admin/settings/drivers", label: "Drivers", icon: IdCard },
      { href: "/admin/settings/users", label: "Users", icon: UserCog },
      { href: "/admin/roles", label: "Roles & permissions", icon: Shield },
      { href: "/admin/audit", label: "Audit log", icon: ScrollText },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/dev-issues", label: "Dev issues", icon: Bug },
      { href: "/admin/reports", label: "Reports", icon: BarChart3 },
      { href: "/admin/portal", label: "Client Portal cfg", icon: UserCircle },
      { href: "/admin/automation", label: "Automation", icon: Zap },
    ],
  },
];

function SidebarBody({
  compact,
  onNavigate,
}: {
  compact: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <>
      <div className={`border-b border-white/10 ${compact ? "p-3" : "p-5"}`}>
        <Link href="/admin" className="block" onClick={onNavigate}>
          <p className="text-xs font-medium uppercase tracking-wider text-aheers-gold">Aheers Group</p>
          <h2 className="font-display text-lg font-semibold">Operations Hub</h2>
          <p className="text-xs text-white/50">Greytown · KZN</p>
        </Link>
        {user && (
          <p className="mt-3 truncate text-xs text-white/70">
            {user.name}
            <span className="block text-white/40">{user.title ?? user.role}</span>
          </p>
        )}
      </div>
      <nav className={`flex-1 overflow-y-auto p-3 ${compact ? "space-y-2" : "space-y-4"}`}>
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/35">
              {group.title}
            </p>
            <div className={compact ? "space-y-0" : "space-y-0.5"}>
              {group.items.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/admin"
                    ? pathname === "/admin"
                    : href === "/admin/settings"
                      ? pathname === "/admin/settings"
                      : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onNavigate}
                    className={`admin-sidebar-link ${compact ? "!py-1.5" : ""} ${active ? "admin-sidebar-link-active" : ""}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/login/staff");
            onNavigate?.();
          }}
          className="mb-3 flex w-full items-center gap-2 text-xs text-white/70 hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
        <Link href="/" onClick={onNavigate} className="mb-2 block text-xs text-white/50 hover:text-white">
          ← Back to Super App
        </Link>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Shield className="h-3.5 w-3.5" />
          CRM · ERP · Demo
        </div>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const [compact, setCompact] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("aheers-settings-v1");
      if (!raw) return;
      const data = JSON.parse(raw);
      setCompact(Boolean(data?.display?.compactSidebar));
    } catch {
      /* ignore */
    }
    function onStorage() {
      try {
        const raw = localStorage.getItem("aheers-settings-v1");
        if (!raw) return;
        const data = JSON.parse(raw);
        setCompact(Boolean(data?.display?.compactSidebar));
      } catch {
        /* ignore */
      }
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("aheers:settings", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("aheers:settings", onStorage);
    };
  }, []);

  const mobileChrome = (
    <>
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-aheers-green/20 bg-aheers-green-dark px-4 py-3 text-white lg:hidden">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-aheers-gold">Aheers Ops</p>
          <p className="font-display text-sm font-semibold">Operations Hub</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-xl bg-white/10 p-2.5 hover:bg-white/15"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(88vw,18rem)] flex-col bg-aheers-green-dark text-white shadow-lift">
            <div className="flex items-center justify-end p-2">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarBody compact onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );

  return (
    <>
      {mounted && createPortal(mobileChrome, document.body)}
      <aside
        className={`hidden shrink-0 flex-col bg-aheers-green-dark text-white transition-all lg:flex ${
          compact ? "w-52" : "w-64"
        }`}
      >
        <SidebarBody compact={compact} />
      </aside>
    </>
  );
}
