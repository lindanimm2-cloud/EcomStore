/** CRM event engine — events are created by writers, never by route/render effects. */

export type OpsPriority = "info" | "low" | "normal" | "important" | "high" | "urgent" | "critical";

export type OpsCategory =
  | "urgent"
  | "today"
  | "orders"
  | "stock"
  | "delivery"
  | "customers"
  | "finance"
  | "system";

export type OpsEventType =
  | "ORDER_CREATED"
  | "ORDER_DELAYED"
  | "PRODUCT_LOW_STOCK"
  | "PRODUCT_OUT_OF_STOCK"
  | "STOCK_LOW"
  | "STOCK_OUT"
  | "CUSTOMER_COMPLAINT"
  | "DELIVERY_DELAYED"
  | "DELIVERY_ASSIGNED"
  | "TASK_OVERDUE"
  | "TICKET_OPEN"
  | "LIVE_WAITING"
  | "LIVE_CLAIMED"
  | "LIVE_ENDED"
  | "PAYMENT_RECEIVED"
  | "REFUND_CREATED";

export type OpsEvent = {
  eventId: string;
  type: OpsEventType;
  title: string;
  body: string;
  priority: OpsPriority;
  category: OpsCategory;
  kind: "order" | "delivery" | "rewards" | "promo" | "ticket" | "fleet" | "system" | "inventory";
  audience: "customer" | "staff" | "all";
  href?: string;
  entityType?: string;
  entityId?: string;
  storeId?: string;
  createdAt: string;
};

const PROCESSED_KEY = "aheers-ops-events-v1";
const LOG_KEY = "aheers-ops-event-log-v1";
export const OPS_EVENT = "aheers-ops-event";

type Sink = (event: OpsEvent) => void;
let sink: Sink | null = null;

export function registerOpsNotificationSink(fn: Sink | null) {
  sink = fn;
}

function readProcessed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROCESSED_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeProcessed(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROCESSED_KEY, JSON.stringify(ids.slice(-400)));
}

function readLog(): OpsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOG_KEY);
    const parsed = raw ? (JSON.parse(raw) as OpsEvent[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLog(events: OpsEvent[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOG_KEY, JSON.stringify(events.slice(0, 80)));
}

export function hasProcessedEvent(eventId: string): boolean {
  return readProcessed().includes(eventId);
}

export function listOpsEventLog(): OpsEvent[] {
  return readLog();
}

/** Create once. Returns false if this eventId was already processed. */
export function emitOpsEvent(partial: Omit<OpsEvent, "createdAt"> & { createdAt?: string }): boolean {
  if (typeof window === "undefined") return false;
  if (hasProcessedEvent(partial.eventId)) return false;
  const event: OpsEvent = {
    ...partial,
    createdAt: partial.createdAt ?? new Date().toISOString(),
  };
  writeProcessed([...readProcessed(), event.eventId]);
  writeLog([event, ...readLog()]);
  try {
    window.dispatchEvent(new CustomEvent(OPS_EVENT, { detail: event }));
  } catch {
    /* ignore */
  }
  sink?.(event);
  return true;
}

export function markEventProcessed(eventId: string) {
  if (hasProcessedEvent(eventId)) return;
  writeProcessed([...readProcessed(), eventId]);
}
