"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type NotificationAudience = "customer" | "staff" | "all";
export type NotificationKind =
  | "order"
  | "delivery"
  | "rewards"
  | "promo"
  | "ticket"
  | "fleet"
  | "system"
  | "inventory";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  kind: NotificationKind;
  audience: NotificationAudience;
  href?: string;
  createdAt: string;
  read: boolean;
}

const STORAGE_KEY = "aheers-notifications-v1";

const SEED: AppNotification[] = [
  {
    id: "n1",
    title: "Order ORD-1043 is out for delivery",
    body: "Thabo is on the way · ETA 12 min",
    kind: "delivery",
    audience: "customer",
    href: "/portal/deliveries",
    createdAt: new Date(Date.now() - 12 * 60_000).toISOString(),
    read: false,
  },
  {
    id: "n2",
    title: "Infinity Rewards cashback posted",
    body: "R 12.40 added to your cashback balance",
    kind: "rewards",
    audience: "customer",
    href: "/portal",
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    read: false,
  },
  {
    id: "n3",
    title: "Weekend braai specials are live",
    body: "Member pricing on selected supermarket items",
    kind: "promo",
    audience: "customer",
    href: "/specials",
    createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
    read: false,
  },
  {
    id: "n4",
    title: "Ticket TKT-201 needs a reply",
    body: "Missing scone from Grab n Go · assigned to Priya",
    kind: "ticket",
    audience: "staff",
    href: "/admin/tickets",
    createdAt: new Date(Date.now() - 25 * 60_000).toISOString(),
    read: false,
  },
  {
    id: "n5",
    title: "Low stock alert — Fresh Milk 2L",
    body: "Supermarket on-hand below reorder point",
    kind: "inventory",
    audience: "staff",
    href: "/admin/inventory",
    createdAt: new Date(Date.now() - 90 * 60_000).toISOString(),
    read: false,
  },
  {
    id: "n6",
    title: "Delivery late risk · ORD-1046",
    body: "ETA slipped 18 minutes · dispatcher notified",
    kind: "fleet",
    audience: "staff",
    href: "/admin/fleet",
    createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    read: true,
  },
  {
    id: "n7",
    title: "New trade lead in pipeline",
    body: "Khan Spaza Chain · R 120,000 opportunity",
    kind: "system",
    audience: "staff",
    href: "/admin/leads",
    createdAt: new Date(Date.now() - 8 * 3600_000).toISOString(),
    read: true,
  },
  {
    id: "n8",
    title: "Competition reminder",
    body: "Win a R2,000 voucher closes 15 Jul",
    kind: "promo",
    audience: "all",
    href: "/competitions",
    createdAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
    read: true,
  },
];

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: (audience?: NotificationAudience | "any") => number;
  listFor: (audience: NotificationAudience | "any") => AppNotification[];
  markRead: (id: string) => void;
  markAllRead: (audience?: NotificationAudience | "any") => void;
  addNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read"> & { read?: boolean }) => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppNotification[];
        if (parsed.length) setNotifications(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications, hydrated]);

  const listFor = useCallback(
    (audience: NotificationAudience | "any") => {
      const filtered =
        audience === "any"
          ? notifications
          : notifications.filter((n) => n.audience === audience || n.audience === "all");
      return [...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    [notifications]
  );

  const unreadCount = useCallback(
    (audience: NotificationAudience | "any" = "any") =>
      listFor(audience).filter((n) => !n.read).length,
    [listFor]
  );

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(
    (audience: NotificationAudience | "any" = "any") => {
      setNotifications((prev) =>
        prev.map((n) => {
          if (audience === "any") return { ...n, read: true };
          if (n.audience === audience || n.audience === "all") return { ...n, read: true };
          return n;
        })
      );
    },
    []
  );

  const addNotification = useCallback(
    (n: Omit<AppNotification, "id" | "createdAt" | "read"> & { read?: boolean }) => {
      setNotifications((prev) => [
        {
          ...n,
          id: `n-${Date.now()}`,
          createdAt: new Date().toISOString(),
          read: n.read ?? false,
        },
        ...prev,
      ]);
    },
    []
  );

  const value = useMemo(
    () => ({ notifications, unreadCount, listFor, markRead, markAllRead, addNotification }),
    [notifications, unreadCount, listFor, markRead, markAllRead, addNotification]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}

export function timeAgo(iso: string) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}
