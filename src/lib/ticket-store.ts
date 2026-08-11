/** Shared support tickets — seed + customer complaints (localStorage). */

import { TICKETS, type Ticket } from "@/lib/crm-data";
import { emitOpsEvent } from "@/lib/ops-events";

const STORAGE_KEY = "aheers-tickets-v1";
export const TICKETS_EVENT = "aheers-tickets";

export const COMPLAINT_REASONS = [
  { value: "missing", label: "Missing item" },
  { value: "wrong", label: "Wrong item" },
  { value: "damaged", label: "Damaged or poor quality" },
  { value: "late", label: "Late or not delivered" },
  { value: "charge", label: "Charged incorrectly" },
  { value: "other", label: "Something else" },
] as const;

export type ComplaintReason = (typeof COMPLAINT_REASONS)[number]["value"];

function readAll(): Ticket[] {
  if (typeof window === "undefined") return TICKETS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return TICKETS;
    const parsed = JSON.parse(raw) as Ticket[];
    if (!Array.isArray(parsed) || !parsed.length) return TICKETS;
    const ids = new Set(parsed.map((t) => t.id));
    return [...parsed, ...TICKETS.filter((t) => !ids.has(t.id))];
  } catch {
    return TICKETS;
  }
}

function writeAll(tickets: Ticket[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  window.dispatchEvent(new CustomEvent(TICKETS_EVENT, { detail: tickets }));
}

export function listTickets(): Ticket[] {
  return [...readAll()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function ticketsForOrder(orderId: string): Ticket[] {
  return listTickets().filter((t) => t.orderId?.toUpperCase() === orderId.toUpperCase());
}

export function ticketsForCustomer(customerId: string): Ticket[] {
  return listTickets().filter((t) => t.customerId === customerId);
}

export function subscribeTickets(onChange: (tickets: Ticket[]) => void) {
  function emit() {
    onChange(listTickets());
  }
  function onStorage(e: StorageEvent) {
    if (e.key === STORAGE_KEY) emit();
  }
  window.addEventListener(TICKETS_EVENT, emit as EventListener);
  window.addEventListener("storage", onStorage);
  emit();
  return () => {
    window.removeEventListener(TICKETS_EVENT, emit as EventListener);
    window.removeEventListener("storage", onStorage);
  };
}

export function updateTicketStatus(id: string, status: Ticket["status"]) {
  writeAll(readAll().map((t) => (t.id === id ? { ...t, status } : t)));
}

function nextTicketId() {
  const nums = listTickets()
    .map((t) => Number(t.id.replace(/\D/g, "")))
    .filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 200;
  return `TKT-${max + 1}`;
}

export function createOrderComplaint(input: {
  orderId: string;
  customerId: string;
  customerName: string;
  reason: ComplaintReason;
  details: string;
  itemName?: string;
}): Ticket {
  const reasonLabel = COMPLAINT_REASONS.find((r) => r.value === input.reason)?.label ?? "Order issue";
  const subject = input.itemName
    ? `${reasonLabel} · ${input.itemName} (${input.orderId})`
    : `${reasonLabel} · ${input.orderId}`;
  const ticket: Ticket = {
    id: nextTicketId(),
    customerId: input.customerId,
    customerName: input.customerName,
    subject,
    category: "Order",
    status: "open",
    priority: input.reason === "charge" || input.reason === "late" ? "high" : "medium",
    createdAt: new Date().toISOString(),
    assignee: "Priya Moodley",
    orderId: input.orderId.toUpperCase(),
    details: input.details.trim(),
    source: "customer-app",
  };
  writeAll([ticket, ...readAll()]);
  emitOpsEvent({
    eventId: `CUSTOMER_COMPLAINT:${ticket.id}`,
    type: "CUSTOMER_COMPLAINT",
    title: `Customer complaint · ${ticket.orderId}`,
    body: `${ticket.customerName}: ${ticket.subject}`,
    priority: ticket.priority === "high" ? "high" : "important",
    category: "customers",
    kind: "ticket",
    audience: "staff",
    href: "/admin/tickets",
    entityType: "ticket",
    entityId: ticket.id,
  });
  emitOpsEvent({
    eventId: `CUSTOMER_COMPLAINT_ACK:${ticket.id}`,
    type: "CUSTOMER_COMPLAINT",
    title: `We received your complaint · ${ticket.orderId}`,
    body: `${ticket.id} is with Service Counter. We’ll follow up shortly.`,
    priority: "normal",
    category: "customers",
    kind: "ticket",
    audience: "customer",
    href: `/order/${ticket.orderId}`,
    entityType: "ticket",
    entityId: ticket.id,
  });
  return ticket;
}
