import { CUSTOMERS, ORDERS } from "@/lib/data";
import { PRODUCTS } from "@/lib/products";
import { STORES } from "@/lib/stores";
import { LEADS } from "@/lib/crm-data";
import { listTickets } from "@/lib/ticket-store";
import { CRM_TASKS, CRM_MEETINGS } from "@/lib/crm-activity";
import { PROMOTIONS } from "@/lib/settings-data";
import { FLEET_VEHICLES } from "@/lib/fleet";
import { loadQueue, type DeliveryJob } from "@/lib/delivery-queue";
import { listLiveSessions } from "@/lib/live-support";
import { STAFF_USERS, type JobRole } from "@/lib/rbac-data";
import { emitOpsEvent, markEventProcessed } from "@/lib/ops-events";
import type { Customer, Order, Product, StoreSlug } from "@/lib/types";
import type { Ticket } from "@/lib/crm-data";
import type { CrmTask, CrmMeeting } from "@/lib/crm-activity";

export type OpsModule =
  | "orders"
  | "inventory"
  | "customers"
  | "tickets"
  | "tasks"
  | "calendar"
  | "fleet"
  | "deliveries"
  | "finance"
  | "promotions"
  | "leads"
  | "live";

export const LOW_STOCK_THRESHOLD = 30;

const INVENTORY_KEY = "aheers-inventory-v1";

export type OpsActor = {
  name: string;
  email: string;
  jobRole: JobRole;
  storeLabel: string;
  storeScope: StoreSlug | "all";
  modules: Set<OpsModule>;
};

export type OpsSnapshot = {
  actor: OpsActor;
  todayIso: string;
  orders: Order[];
  customers: Customer[];
  products: Product[];
  tickets: Ticket[];
  tasks: CrmTask[];
  meetings: CrmMeeting[];
  deliveries: DeliveryJob[];
  promotions: typeof PROMOTIONS;
  leads: typeof LEADS;
  fleet: typeof FLEET_VEHICLES;
  liveWaiting: number;
  liveActive: number;
  orderCounts: Record<string, number>;
  lowStock: Product[];
  outOfStock: Product[];
  openTickets: Ticket[];
  overdueTasks: CrmTask[];
  openDeliveries: DeliveryJob[];
  delayedDeliveries: DeliveryJob[];
};

const STORE_NAME_TO_SLUG: Record<string, StoreSlug | "all"> = {
  supermarket: "supermarket",
  powertrade: "powertrade",
  hardware: "buildsave",
  buildsave: "buildsave",
  foodworks: "foodworks",
  grabngo: "grabngo",
};

export function staffStoreScope(store: string): StoreSlug | "all" {
  const s = store.toLowerCase();
  if (s.includes("all") || s.includes("head") || s.includes("fleet") || s.includes("warehouse")) {
    return "all";
  }
  if (s.includes("super")) return "supermarket";
  if (s.includes("power")) return "powertrade";
  if (s.includes("hard") || s.includes("build")) return "buildsave";
  if (s.includes("food")) return "foodworks";
  if (s.includes("grab")) return "grabngo";
  return "all";
}

export function modulesForRole(role: JobRole): Set<OpsModule> {
  const all: OpsModule[] = [
    "orders",
    "inventory",
    "customers",
    "tickets",
    "tasks",
    "calendar",
    "fleet",
    "deliveries",
    "finance",
    "promotions",
    "leads",
    "live",
  ];
  if (role === "super_admin" || role === "exec" || role === "crm_manager") return new Set(all);
  if (role === "store_manager") {
    return new Set([
      "orders",
      "inventory",
      "customers",
      "tickets",
      "tasks",
      "calendar",
      "promotions",
      "deliveries",
      "live",
    ]);
  }
  if (role === "service_counter" || role === "support_agent") {
    return new Set(["tickets", "customers", "orders", "live"]);
  }
  if (role === "dispatcher" || role === "fleet_manager") {
    return new Set(["fleet", "deliveries", "orders"]);
  }
  if (role === "inventory_manager") return new Set(["inventory", "orders", "promotions"]);
  if (role === "driver") return new Set(["deliveries", "fleet"]);
  if (role === "cashier") return new Set(["orders", "customers"]);
  if (role === "finance_manager") return new Set(["finance", "orders"]);
  if (role === "marketing_manager") return new Set(["promotions", "customers", "leads"]);
  if (role === "wholesale_manager") return new Set(["orders", "customers", "leads", "inventory"]);
  return new Set(["orders"]);
}

export function resolveOpsActor(email?: string, name?: string): OpsActor {
  const staff = STAFF_USERS.find((s) => s.email.toLowerCase() === (email ?? "").toLowerCase());
  const jobRole: JobRole = staff?.jobRole ?? "support_agent";
  const storeLabel = staff?.store ?? "All stores";
  return {
    name: name || staff?.name || "Staff",
    email: email || staff?.email || "",
    jobRole,
    storeLabel,
    storeScope: staffStoreScope(storeLabel),
    modules: modulesForRole(jobRole),
  };
}

function loadInventory(): Product[] {
  if (typeof window === "undefined") return PRODUCTS;
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (!raw) return PRODUCTS;
    const parsed = JSON.parse(raw) as Product[];
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    /* ignore */
  }
  return PRODUCTS;
}

function inStoreScope<T extends { storeSlug?: string }>(items: T[], scope: StoreSlug | "all"): T[] {
  if (scope === "all") return items;
  return items.filter((i) => !i.storeSlug || i.storeSlug === scope);
}

export function getOpsSnapshot(input?: { email?: string; name?: string }): OpsSnapshot {
  const actor = resolveOpsActor(input?.email, input?.name);
  const scope = actor.storeScope;
  const todayIso = new Date().toISOString().slice(0, 10);
  const products = inStoreScope(loadInventory(), scope);
  const orders = inStoreScope(ORDERS, scope);
  const deliveries =
    typeof window === "undefined"
      ? []
      : inStoreScope(loadQueue(), scope);
  const live = typeof window === "undefined" ? [] : listLiveSessions();

  const customerIds = new Set(orders.map((o) => o.customerId));
  const customers =
    scope === "all" ? CUSTOMERS : CUSTOMERS.filter((c) => customerIds.has(c.id));

  const allTickets = typeof window === "undefined" ? [] : listTickets();
  const scopedTickets = scope === "all" ? allTickets : allTickets.filter((t) => customerIds.has(t.customerId));
  const visibleTickets = actor.modules.has("tickets") ? scopedTickets : [];

  const orderCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const lowStock = products.filter((p) => p.inStock > 0 && p.inStock < LOW_STOCK_THRESHOLD);
  const outOfStock = products.filter((p) => p.inStock <= 0);
  const openTickets = visibleTickets.filter((t) => t.status !== "resolved");
  const overdueTasks = actor.modules.has("tasks")
    ? CRM_TASKS.filter((t) => t.status === "overdue")
    : [];
  const openDeliveries = actor.modules.has("deliveries")
    ? deliveries.filter((d) => d.status !== "delivered")
    : [];
  const delayedDeliveries = openDeliveries.filter((d) => d.orderId === "ORD-1046" || d.orderId === "ORD-1045");

  return {
    actor,
    todayIso,
    orders,
    customers,
    products,
    tickets: visibleTickets,
    tasks: actor.modules.has("tasks") ? CRM_TASKS : [],
    meetings: actor.modules.has("calendar") ? CRM_MEETINGS : [],
    deliveries: actor.modules.has("deliveries") ? deliveries : [],
    promotions: actor.modules.has("promotions") ? PROMOTIONS : [],
    leads: actor.modules.has("leads") ? LEADS : [],
    fleet: actor.modules.has("fleet") ? FLEET_VEHICLES : [],
    liveWaiting: actor.modules.has("live") ? live.filter((s) => s.status === "waiting").length : 0,
    liveActive: actor.modules.has("live") ? live.filter((s) => s.status === "active").length : 0,
    orderCounts,
    lowStock,
    outOfStock,
    openTickets,
    overdueTasks,
    openDeliveries,
    delayedDeliveries,
  };
}

export function storeShortName(slug: string) {
  return STORES.find((s) => s.slug === slug)?.shortName ?? slug;
}

/** Emit threshold events once per state key. Safe to call on every admin mount. */
export function bootstrapOpsFromSnapshot(snap: OpsSnapshot) {
  if (typeof window === "undefined") return;

  for (const t of snap.openTickets.filter((x) => x.priority === "high")) {
    emitOpsEvent({
      eventId: `TICKET_OPEN:${t.id}`,
      type: "TICKET_OPEN",
      title: `Ticket ${t.id} is ${t.status}`,
      body: `${t.customerName} · ${t.subject}`,
      priority: "high",
      category: "customers",
      kind: "ticket",
      audience: "staff",
      href: "/admin/tickets",
      entityType: "ticket",
      entityId: t.id,
    });
  }

  for (const task of snap.overdueTasks) {
    emitOpsEvent({
      eventId: `TASK_OVERDUE:${task.id}`,
      type: "TASK_OVERDUE",
      title: `Overdue task · ${task.id}`,
      body: task.title,
      priority: "important",
      category: "today",
      kind: "system",
      audience: "staff",
      href: "/admin/tasks",
      entityType: "task",
      entityId: task.id,
    });
  }

  const byStore = new Map<string, Product[]>();
  for (const p of snap.lowStock) {
    markEventProcessed(`STOCK_LOW:${p.id}`);
    const list = byStore.get(p.storeSlug) ?? [];
    list.push(p);
    byStore.set(p.storeSlug, list);
  }
  for (const [storeId, list] of byStore) {
    if (!list.length) continue;
    emitOpsEvent({
      eventId: `STOCK_LOW_GROUP:${storeId}`,
      type: "STOCK_LOW",
      title: `${list.length} product${list.length === 1 ? "" : "s"} below on-hand of ${LOW_STOCK_THRESHOLD}`,
      body: `${storeShortName(storeId)}: ${list
        .slice(0, 4)
        .map((p) => `${p.name} (${p.inStock})`)
        .join(", ")}`,
      priority: list.some((p) => p.inStock < 10) ? "high" : "important",
      category: "stock",
      kind: "inventory",
      audience: "staff",
      href: "/admin/inventory",
      storeId,
    });
  }

  const outByStore = new Map<string, Product[]>();
  for (const p of snap.outOfStock) {
    markEventProcessed(`STOCK_OUT:${p.id}`);
    const list = outByStore.get(p.storeSlug) ?? [];
    list.push(p);
    outByStore.set(p.storeSlug, list);
  }
  for (const [storeId, list] of outByStore) {
    emitOpsEvent({
      eventId: `STOCK_OUT_GROUP:${storeId}`,
      type: "STOCK_OUT",
      title: `${list.length} product${list.length === 1 ? "" : "s"} out of stock`,
      body: `${storeShortName(storeId)}: ${list
        .slice(0, 4)
        .map((p) => p.name)
        .join(", ")}`,
      priority: "urgent",
      category: "urgent",
      kind: "inventory",
      audience: "staff",
      href: "/admin/inventory",
      storeId,
    });
  }

  for (const d of snap.delayedDeliveries) {
    emitOpsEvent({
      eventId: `DELIVERY_DELAYED:${d.orderId}`,
      type: "DELIVERY_DELAYED",
      title: `Delivery needs attention · ${d.orderId}`,
      body: `${d.customerName} · queue status ${d.status}`,
      priority: "high",
      category: "delivery",
      kind: "fleet",
      audience: "staff",
      href: "/admin/fleet",
      entityType: "order",
      entityId: d.orderId,
      storeId: d.storeSlug,
    });
  }
}

export function greetingHour(): "morning" | "afternoon" | "evening" {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
