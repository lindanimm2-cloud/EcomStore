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
import {
  type OpsCategory,
  type OpsEvent,
  type OpsPriority,
  markEventProcessed,
  registerOpsNotificationSink,
} from "@/lib/ops-events";

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

export type NotificationPriority = OpsPriority;
export type NotificationCategory = OpsCategory;

export interface AppNotification {
  id: string;
  eventId: string;
  title: string;
  body: string;
  kind: NotificationKind;
  audience: NotificationAudience;
  href?: string;
  createdAt: string;
  read: boolean;
  priority: NotificationPriority;
  category: NotificationCategory;
  entityType?: string;
  entityId?: string;
  storeId?: string;
  dismissedAt?: string;
  seenAt?: string;
}

export type NotificationInput = {
  eventId: string;
  title: string;
  body: string;
  kind: NotificationKind;
  audience: NotificationAudience;
  href?: string;
  read?: boolean;
  priority?: NotificationPriority;
  category?: NotificationCategory;
  entityType?: string;
  entityId?: string;
  storeId?: string;
};

const STORAGE_KEY = "aheers-notifications-v1";

function kindToCategory(kind: NotificationKind): NotificationCategory {
  if (kind === "order") return "orders";
  if (kind === "inventory") return "stock";
  if (kind === "delivery" || kind === "fleet") return "delivery";
  if (kind === "ticket") return "customers";
  if (kind === "rewards") return "finance";
  if (kind === "promo") return "today";
  return "system";
}

function kindToPriority(kind: NotificationKind): NotificationPriority {
  if (kind === "fleet" || kind === "ticket") return "high";
  if (kind === "inventory") return "important";
  if (kind === "order" || kind === "delivery") return "normal";
  return "low";
}

const SEED: AppNotification[] = [
  {
    id: "n1",
    eventId: "SEED-n1",
    title: "Order ORD-1043 is out for delivery",
    body: "Thabo is on the way · ETA 12 min",
    kind: "delivery",
    audience: "customer",
    href: "/order/ORD-1043/track",
    createdAt: new Date(Date.now() - 12 * 60_000).toISOString(),
    read: false,
    priority: "normal",
    category: "delivery",
    entityType: "order",
    entityId: "ORD-1043",
  },
  {
    id: "n2",
    eventId: "SEED-n2",
    title: "Infinity Rewards cashback posted",
    body: "R 12.40 added to your cashback balance",
    kind: "rewards",
    audience: "customer",
    href: "/portal",
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    read: false,
    priority: "low",
    category: "finance",
  },
  {
    id: "n3",
    eventId: "SEED-n3",
    title: "Weekend braai specials are live",
    body: "Member pricing on selected supermarket items",
    kind: "promo",
    audience: "customer",
    href: "/specials",
    createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
    read: false,
    priority: "info",
    category: "today",
  },
  {
    id: "n4",
    eventId: "TICKET_OPEN:TKT-201",
    title: "Ticket TKT-201 needs a reply",
    body: "Missing scone from Grab n Go · assigned to Priya",
    kind: "ticket",
    audience: "staff",
    href: "/admin/tickets",
    createdAt: new Date(Date.now() - 25 * 60_000).toISOString(),
    read: false,
    priority: "important",
    category: "customers",
    entityType: "ticket",
    entityId: "TKT-201",
  },
  {
    id: "n5",
    eventId: "SEED-n5",
    title: "Low stock alert — Fresh Milk 2L",
    body: "Supermarket on-hand below reorder point",
    kind: "inventory",
    audience: "staff",
    href: "/admin/inventory",
    createdAt: new Date(Date.now() - 90 * 60_000).toISOString(),
    read: false,
    priority: "important",
    category: "stock",
    storeId: "supermarket",
  },
  {
    id: "n6",
    eventId: "DELIVERY_DELAYED:ORD-1046",
    title: "Delivery late risk · ORD-1046",
    body: "ETA slipped 18 minutes · dispatcher notified",
    kind: "fleet",
    audience: "staff",
    href: "/admin/fleet",
    createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    read: true,
    priority: "high",
    category: "delivery",
    entityType: "order",
    entityId: "ORD-1046",
  },
  {
    id: "n7",
    eventId: "SEED-n7",
    title: "New trade lead in pipeline",
    body: "Khan Spaza Chain · R 120,000 opportunity",
    kind: "system",
    audience: "staff",
    href: "/admin/leads",
    createdAt: new Date(Date.now() - 8 * 3600_000).toISOString(),
    read: true,
    priority: "low",
    category: "today",
  },
  {
    id: "n8",
    eventId: "SEED-n8",
    title: "Competition reminder",
    body: "Win a R2,000 voucher closes 15 Jul",
    kind: "promo",
    audience: "all",
    href: "/competitions",
    createdAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
    read: true,
    priority: "info",
    category: "system",
  },
];

function normalizeNotification(raw: Partial<AppNotification> & Pick<AppNotification, "id" | "title" | "body" | "kind" | "audience" | "createdAt" | "read">): AppNotification {
  return {
    ...raw,
    eventId: raw.eventId || raw.id,
    priority: raw.priority ?? kindToPriority(raw.kind),
    category: raw.category ?? kindToCategory(raw.kind),
  };
}

export type GroupedNotification = {
  key: string;
  title: string;
  body: string;
  href?: string;
  ids: string[];
  unread: boolean;
  category: NotificationCategory;
  priority: NotificationPriority;
  createdAt: string;
};

export function groupNotifications(items: AppNotification[]): GroupedNotification[] {
  const visible = items.filter((n) => !n.dismissedAt);
  const buckets = new Map<string, AppNotification[]>();
  for (const n of visible) {
    const key = n.read ? `id:${n.id}` : `${n.category}:${n.kind}:${n.storeId ?? ""}`;
    const list = buckets.get(key) ?? [];
    list.push(n);
    buckets.set(key, list);
  }
  const groups: GroupedNotification[] = [];
  for (const [key, list] of buckets) {
    const newest = [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    if (list.length === 1 || newest.read) {
      groups.push({
        key: newest.id,
        title: newest.title,
        body: newest.body,
        href: newest.href,
        ids: list.map((n) => n.id),
        unread: !newest.read,
        category: newest.category,
        priority: newest.priority,
        createdAt: newest.createdAt,
      });
      continue;
    }
    const label =
      newest.kind === "inventory"
        ? `${list.length} products are below reorder level`
        : newest.kind === "order"
          ? `${list.length} new orders`
          : newest.kind === "delivery" || newest.kind === "fleet"
            ? `${list.length} delivery alerts`
            : newest.kind === "ticket"
              ? `${list.length} customer tickets need attention`
              : newest.kind === "system" && newest.eventId.startsWith("LIVE_WAITING")
                ? `${list.length} live chats waiting`
                : `${list.length} ${newest.category} updates`;
    groups.push({
      key,
      title: label,
      body: list
        .slice(0, 3)
        .map((n) => n.title)
        .join(" · "),
      href: newest.href,
      ids: list.map((n) => n.id),
      unread: true,
      category: newest.category,
      priority: list.reduce<NotificationPriority>((max, n) => {
        const rank = PRIORITY_RANK[n.priority];
        return rank > PRIORITY_RANK[max] ? n.priority : max;
      }, "info"),
      createdAt: newest.createdAt,
    });
  }
  return groups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const PRIORITY_RANK: Record<NotificationPriority, number> = {
  info: 0,
  low: 1,
  normal: 2,
  important: 3,
  high: 4,
  urgent: 5,
  critical: 6,
};

export function highestUnreadPriority(items: AppNotification[]): NotificationPriority | null {
  const unread = items.filter((n) => !n.read && !n.dismissedAt);
  if (!unread.length) return null;
  return unread.reduce<NotificationPriority>((max, n) => {
    return PRIORITY_RANK[n.priority] > PRIORITY_RANK[max] ? n.priority : max;
  }, "info");
}

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: (audience?: NotificationAudience | "any") => number;
  listFor: (audience: NotificationAudience | "any") => AppNotification[];
  markRead: (id: string) => void;
  markSeen: (ids: string[]) => void;
  markAllRead: (audience?: NotificationAudience | "any") => void;
  createNotificationIfNew: (n: NotificationInput) => boolean;
  addNotification: (n: NotificationInput) => boolean;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppNotification>[];
        if (Array.isArray(parsed) && parsed.length) {
          setNotifications(
            parsed.map((n) =>
              normalizeNotification(
                n as Partial<AppNotification> &
                  Pick<AppNotification, "id" | "title" | "body" | "kind" | "audience" | "createdAt" | "read">
              )
            )
          );
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    for (const n of notifications) markEventProcessed(n.eventId);
  }, [hydrated, notifications]);

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
      return [...filtered]
        .filter((n) => !n.dismissedAt)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    [notifications]
  );

  const unreadCount = useCallback(
    (audience: NotificationAudience | "any" = "any") =>
      listFor(audience).filter((n) => !n.read).length,
    [listFor]
  );

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id || n.eventId === id ? { ...n, read: true, seenAt: n.seenAt ?? new Date().toISOString() } : n))
    );
  }, []);

  const markSeen = useCallback((ids: string[]) => {
    if (!ids.length) return;
    const set = new Set(ids);
    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((n) => (set.has(n.id) || set.has(n.eventId) ? { ...n, seenAt: n.seenAt ?? now } : n))
    );
  }, []);

  const markAllRead = useCallback((audience: NotificationAudience | "any" = "any") => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (audience === "any") return { ...n, read: true };
        if (n.audience === audience || n.audience === "all") return { ...n, read: true };
        return n;
      })
    );
  }, []);

  const createNotificationIfNew = useCallback((n: NotificationInput) => {
    let created = false;
    setNotifications((prev) => {
      if (prev.some((x) => x.eventId === n.eventId && !x.dismissedAt)) return prev;
      created = true;
      return [
        {
          ...n,
          id: `n-${n.eventId}`.replace(/[^a-zA-Z0-9:_-]/g, "-").slice(0, 80),
          createdAt: new Date().toISOString(),
          read: n.read ?? false,
          priority: n.priority ?? kindToPriority(n.kind),
          category: n.category ?? kindToCategory(n.kind),
        },
        ...prev,
      ];
    });
    return created;
  }, []);

  useEffect(() => {
    function sink(event: OpsEvent) {
      createNotificationIfNew({
        eventId: event.eventId,
        title: event.title,
        body: event.body,
        kind: event.kind,
        audience: event.audience,
        href: event.href,
        priority: event.priority,
        category: event.category,
        entityType: event.entityType,
        entityId: event.entityId,
        storeId: event.storeId,
      });
    }
    registerOpsNotificationSink(sink);
    return () => registerOpsNotificationSink(null);
  }, [createNotificationIfNew]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      listFor,
      markRead,
      markSeen,
      markAllRead,
      createNotificationIfNew,
      addNotification: createNotificationIfNew,
    }),
    [notifications, unreadCount, listFor, markRead, markSeen, markAllRead, createNotificationIfNew]
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
