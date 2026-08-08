import { ORDERS, formatCurrency, formatDate } from "./data";
import { FLEET_VEHICLES } from "./fleet";
import { Order } from "./types";
import { getStore } from "./stores";

export const LIVE_STATUSES: Order["status"][] = ["pending", "processing", "dispatched"];

export function findOrder(id: string): Order | undefined {
  return ORDERS.find((o) => o.id.toLowerCase() === id.trim().toLowerCase());
}

/** Guest checkout refs that aren't in seed data */
export function resolveOrder(id: string): Order | null {
  const found = findOrder(id);
  if (found) return found;
  const ref = id.trim();
  if (!/^ORD-/i.test(ref)) return null;
  return {
    id: ref.toUpperCase(),
    customerId: "guest",
    customerName: "Your order",
    storeSlug: "supermarket",
    items: [{ productId: "demo", name: "Demo basket", qty: 1, price: 0 }],
    total: 0,
    status: "processing",
    type: "delivery",
    createdAt: new Date().toISOString(),
    deliveryAddress: "Greytown (demo)",
  };
}

export function isLiveOrder(order: Order) {
  return LIVE_STATUSES.includes(order.status);
}

export function orderFleet(order: Order) {
  if (order.fleetId) return FLEET_VEHICLES.find((f) => f.id === order.fleetId);
  return FLEET_VEHICLES.find((f) => f.orderId === order.id);
}

export function orderHref(id: string) {
  return `/order/${encodeURIComponent(id)}`;
}

export function orderTrackHref(id: string) {
  return `/order/${encodeURIComponent(id)}/track`;
}

export type TimelineStep = {
  key: string;
  label: string;
  done: boolean;
  current: boolean;
  at?: string;
};

export function orderTimeline(order: Order): TimelineStep[] {
  const status = order.status;
  if (status === "cancelled") {
    return [
      { key: "placed", label: "Order placed", done: true, current: false, at: formatDate(order.createdAt) },
      { key: "cancelled", label: "Cancelled", done: true, current: true },
    ];
  }

  if (order.type === "collection") {
    const steps = [
      { key: "placed", label: "Order received", rank: 0 },
      { key: "prep", label: "Preparing", rank: 1 },
      { key: "ready", label: "Ready for collection", rank: 2 },
      { key: "collected", label: "Collected", rank: 3 },
    ];
    const rank =
      status === "pending"
        ? 0
        : status === "processing"
          ? 1
          : status === "dispatched"
            ? 2
            : 3;
    return steps.map((s) => ({
      key: s.key,
      label: s.label,
      done: s.rank < rank || status === "delivered",
      current: s.rank === rank && status !== "delivered" ? true : status === "delivered" && s.rank === 3,
      at: s.rank === 0 ? formatDate(order.createdAt) : undefined,
    }));
  }

  const steps = [
    { key: "placed", label: "Order placed", rank: 0 },
    { key: "processing", label: "Being prepared", rank: 1 },
    { key: "dispatched", label: "Out for delivery", rank: 2 },
    { key: "delivered", label: "Delivered", rank: 3 },
  ];
  const rank =
    status === "pending"
      ? 0
      : status === "processing"
        ? 1
        : status === "dispatched"
          ? 2
          : 3;
  return steps.map((s) => ({
    key: s.key,
    label: s.label,
    done: s.rank < rank || (status === "delivered" && s.rank <= 3),
    current: status !== "delivered" ? s.rank === rank : s.rank === 3,
    at: s.rank === 0 ? formatDate(order.createdAt) : undefined,
  }));
}

export function orderSummaryLine(order: Order) {
  const store = getStore(order.storeSlug)?.shortName ?? order.storeSlug;
  return `${store} · ${order.customerName}`;
}

export function orderItemsTotal(order: Order) {
  return order.items.reduce((s, i) => s + i.price * i.qty, 0);
}

export { formatCurrency, formatDate };
