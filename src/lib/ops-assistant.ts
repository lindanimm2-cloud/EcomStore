import { formatCurrency } from "@/lib/data";
import { listOpsEventLog } from "@/lib/ops-events";
import {
  getOpsSnapshot,
  greetingHour,
  storeShortName,
  type OpsModule,
  type OpsSnapshot,
} from "@/lib/ops-snapshot";
import type { StoreSlug } from "@/lib/types";

export type OpsReply = {
  text: string;
  links?: { label: string; href: string }[];
};

const MISSING = "I don't have enough information in the CRM to determine that.";

function firstName(name: string) {
  return name.split(" ")[0] || name;
}

function can(snap: OpsSnapshot, module: OpsModule) {
  return snap.actor.modules.has(module);
}

function refuse(snap: OpsSnapshot, module: string): OpsReply {
  return {
    text: `I can't share ${module} for your role (${snap.actor.jobRole.replace(/_/g, " ")}). Ask a store manager or super admin if you need that view.`,
  };
}

export function pageContextLine(pathname: string, snap: OpsSnapshot): string {
  if (pathname.startsWith("/admin/orders")) {
    if (!can(snap, "orders")) return "You're on Orders.";
    const parts = Object.entries(snap.orderCounts).map(([k, v]) => `${v} ${k}`);
    return `You're on Orders. ${snap.orders.length} on file${parts.length ? ` · ${parts.join(", ")}` : ""}.`;
  }
  if (pathname.startsWith("/admin/inventory")) {
    if (!can(snap, "inventory")) return "You're on Inventory.";
    return `You're on Inventory. ${snap.lowStock.length} below on-hand of 30 · ${snap.outOfStock.length} out.`;
  }
  if (pathname.startsWith("/admin/customers")) {
    return `You're on Customers. ${snap.customers.length} profiles in scope.`;
  }
  if (pathname.startsWith("/admin/tickets") || pathname.startsWith("/admin/service-desk")) {
    return `You're on service. ${snap.openTickets.length} unresolved ticket${snap.openTickets.length === 1 ? "" : "s"}.`;
  }
  if (pathname.startsWith("/admin/fleet")) {
    return `You're on Fleet. ${snap.openDeliveries.length} open queue job${snap.openDeliveries.length === 1 ? "" : "s"}.`;
  }
  if (pathname.startsWith("/admin/tasks")) {
    return `You're on Tasks. ${snap.overdueTasks.length} overdue.`;
  }
  if (pathname.startsWith("/admin/calendar") || pathname.startsWith("/admin/meetings")) {
    const today = snap.meetings.filter((m) => m.date === snap.todayIso);
    return `You're on Calendar. ${today.length} meeting${today.length === 1 ? "" : "s"} dated ${snap.todayIso}.`;
  }
  if (pathname === "/admin" || pathname === "/admin/") {
    return `You're on the dashboard.`;
  }
  return "You're in the Aheers CRM.";
}

export function buildBriefingReply(snap: OpsSnapshot): OpsReply {
  const name = firstName(snap.actor.name);
  const hour = greetingHour();
  const lines: string[] = [`Good ${hour}, ${name}. Here's your Aheers operations briefing.`];

  if (snap.actor.storeScope !== "all") {
    lines.push(`Context: ${snap.actor.storeLabel} only.`);
  }

  if (can(snap, "orders")) {
    const todayOrders = snap.orders.filter((o) => o.createdAt.slice(0, 10) === snap.todayIso);
    if (todayOrders.length) {
      lines.push(`Orders dated today (${snap.todayIso}): ${todayOrders.length}.`);
    } else {
      lines.push(
        `Orders on file: ${snap.orders.length} (${Object.entries(snap.orderCounts)
          .map(([k, v]) => `${v} ${k}`)
          .join(", ") || "none"}). None are dated ${snap.todayIso}.`
      );
    }
  }

  if (can(snap, "deliveries")) {
    lines.push(
      `Deliveries: ${snap.openDeliveries.length} open in the queue` +
        (snap.delayedDeliveries.length ? `, ${snap.delayedDeliveries.length} flagged for delay (ORD-1045 / ORD-1046).` : ".")
    );
  }

  if (can(snap, "inventory")) {
    lines.push(
      `Stock: ${snap.lowStock.length} below on-hand of 30` +
        (snap.outOfStock.length ? `, ${snap.outOfStock.length} out of stock.` : ".")
    );
  }

  if (can(snap, "tickets")) {
    lines.push(`Customers: ${snap.openTickets.length} unresolved ticket${snap.openTickets.length === 1 ? "" : "s"}.`);
  }

  if (can(snap, "tasks") && snap.overdueTasks.length) {
    lines.push(`Tasks: ${snap.overdueTasks.length} overdue.`);
  }

  if (can(snap, "live") && snap.liveWaiting) {
    lines.push(`Live chat: ${snap.liveWaiting} waiting.`);
  }

  const attention = attentionItems(snap);
  if (!attention.length && !snap.liveWaiting) {
    lines.push(`Everything looks good, ${name}.`);
  }

  return {
    text: lines.join("\n\n"),
    links: [
      { label: "Orders", href: "/admin/orders" },
      { label: "Inventory", href: "/admin/inventory" },
      { label: "Tickets", href: "/admin/tickets" },
    ],
  };
}

function attentionItems(snap: OpsSnapshot): string[] {
  const items: string[] = [];
  if (can(snap, "deliveries")) {
    for (const d of snap.delayedDeliveries) {
      const vehicle = snap.fleet.find((v) => v.orderId === d.orderId);
      items.push(
        `${d.orderId} is flagged for delay (${d.customerName}, queue ${d.status}` +
          (vehicle?.eta ? `, fleet ETA on file: ${vehicle.eta}` : "") +
          `).`
      );
    }
  }
  if (can(snap, "inventory") && snap.outOfStock.length) {
    items.push(
      `${snap.outOfStock.length} product${snap.outOfStock.length === 1 ? "" : "s"} out of stock` +
        (snap.outOfStock[0] ? ` including ${snap.outOfStock[0].name}.` : ".")
    );
  } else if (can(snap, "inventory") && snap.lowStock.length) {
    items.push(`${snap.lowStock.length} products have on-hand below 30.`);
  }
  if (can(snap, "tickets")) {
    for (const t of snap.openTickets.filter((x) => x.priority === "high")) {
      items.push(`${t.id} (${t.customerName}): ${t.subject}.`);
    }
  }
  if (can(snap, "tasks")) {
    for (const t of snap.overdueTasks) {
      items.push(`Overdue task ${t.id}: ${t.title}.`);
    }
  }
  if (can(snap, "live") && snap.liveWaiting) {
    items.push(`${snap.liveWaiting} customer${snap.liveWaiting === 1 ? "" : "s"} waiting for a live agent.`);
  }
  return items;
}

export function buildCatchUpReply(snap: OpsSnapshot, sinceIso?: string): OpsReply {
  const since = sinceIso ? new Date(sinceIso).getTime() : Date.now() - 2 * 3600_000;
  const events = listOpsEventLog().filter((e) => new Date(e.createdAt).getTime() >= since);
  const name = firstName(snap.actor.name);
  if (!events.length) {
    return { text: `Welcome back, ${name}. No new CRM events are on file since your last session.` };
  }
  const lines = [`Welcome back, ${name}. Here's what changed while you were away.`, ...events.slice(0, 8).map((e) => `• ${e.title}`)];
  return { text: lines.join("\n") };
}

export function buildFarewellReply(snap: OpsSnapshot): string {
  return `Signing you out, ${firstName(snap.actor.name)}.`;
}

function happeningReply(snap: OpsSnapshot): OpsReply {
  const bits: string[] = [];
  if (can(snap, "orders")) bits.push(`${snap.orders.length} orders on file`);
  if (can(snap, "deliveries")) {
    bits.push(`${snap.openDeliveries.length} deliveries in the queue`);
    if (snap.delayedDeliveries.length) bits.push(`${snap.delayedDeliveries.length} flagged delay`);
  }
  if (can(snap, "inventory")) bits.push(`${snap.lowStock.length} low-stock products`);
  if (can(snap, "tickets")) bits.push(`${snap.openTickets.length} unresolved tickets`);
  if (can(snap, "live") && (snap.liveWaiting || snap.liveActive)) {
    bits.push(`${snap.liveWaiting} live waiting / ${snap.liveActive} active`);
  }
  if (!bits.length) return { text: `Nothing in your permitted modules looks unusual right now.` };
  return { text: `Aheers currently has ${bits.join(", ")}.` };
}

function storesReply(snap: OpsSnapshot): OpsReply {
  if (snap.actor.storeScope !== "all" && snap.actor.jobRole !== "super_admin" && snap.actor.jobRole !== "exec") {
    return {
      text: `${snap.actor.storeLabel}: ${snap.orders.length} orders, ${formatCurrency(
        snap.orders.reduce((s, o) => s + o.total, 0)
      )} recorded sales, ${snap.lowStock.length} stock alerts, ${snap.openDeliveries.length} open deliveries.`,
    };
  }
  const slugs = Array.from(new Set(snap.orders.map((o) => o.storeSlug))) as StoreSlug[];
  if (!slugs.length) {
    return { text: "I don't have store-level order rows to summarise." };
  }
  const lines = slugs.map((slug) => {
    const orders = snap.orders.filter((o) => o.storeSlug === slug);
    const sales = orders.reduce((s, o) => s + o.total, 0);
    const stock = snap.lowStock.filter((p) => p.storeSlug === slug).length;
    const dels = snap.deliveries.filter((d) => d.storeSlug === slug && d.status !== "delivered").length;
    return `${storeShortName(slug)}\nOrders: ${orders.length}\nSales on file: ${formatCurrency(sales)}\nStock alerts: ${stock}\nOpen deliveries: ${dels}`;
  });
  return { text: lines.join("\n\n") };
}

function orderDetail(snap: OpsSnapshot, id: string): OpsReply {
  if (!can(snap, "orders")) return refuse(snap, "orders");
  const order = snap.orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
  if (!order) return { text: `I don't have ${id} in the CRM order list.` };
  const vehicle = snap.fleet.find((v) => v.orderId === order.id);
  const delivery = snap.deliveries.find((d) => d.orderId === order.id);
  const lines = [
    `${order.id} · ${order.customerName} · ${storeShortName(order.storeSlug)}`,
    `Status: ${order.status} · ${order.type} · ${order.items.length} line${order.items.length === 1 ? "" : "s"} · ${formatCurrency(order.total)}`,
    `Created: ${order.createdAt}`,
  ];
  if (order.deliveryAddress) lines.push(`Address on file: ${order.deliveryAddress}`);
  if (delivery) lines.push(`Queue: ${delivery.status}${delivery.note ? ` · ${delivery.note}` : ""}`);
  if (vehicle) {
    lines.push(`Fleet: ${vehicle.name} · ${vehicle.driver} · ${vehicle.status}` + (vehicle.eta ? ` · ETA ${vehicle.eta}` : ""));
  }
  if (order.id === "ORD-1046" || order.id === "ORD-1045") {
    lines.push("This order is flagged in the CRM as a delay risk.");
  }
  return {
    text: lines.join("\n"),
    links: [
      { label: "Orders", href: "/admin/orders" },
      { label: "Customer", href: "/admin/customers" },
    ],
  };
}

function productDetail(snap: OpsSnapshot, q: string): OpsReply {
  if (!can(snap, "inventory")) return refuse(snap, "inventory");
  const hit = snap.products.find((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase() === q);
  if (!hit) return { text: `No product in the CRM inventory matches “${q}”.` };
  const sold = snap.orders.reduce((n, o) => {
    const line = o.items.find((i) => i.productId === hit.id);
    return n + (line?.qty ?? 0);
  }, 0);
  const lines = [
    hit.name,
    `Stock on hand: ${hit.inStock}`,
    `Store: ${storeShortName(hit.storeSlug)} · ${formatCurrency(hit.price)}`,
    `Units on recorded orders: ${sold}`,
  ];
  if (hit.inStock < 30) lines.push(`On-hand is below the inventory page threshold of 30.`);
  lines.push(MISSING.replace("that.", "average daily sales, supplier lead time, or reorder level — those fields are not in the CRM."));
  return { text: lines.join("\n"), links: [{ label: "Inventory", href: "/admin/inventory" }] };
}

function extractOrderId(text: string, pathname: string): string | null {
  const fromText = text.match(/ORD-\d+/i);
  if (fromText) return fromText[0].toUpperCase();
  const fromPath = pathname.match(/ORD-\d+/i);
  if (fromPath && /this order|this one|what's wrong/i.test(text)) return fromPath[0].toUpperCase();
  return null;
}

export function getOpsReply(
  input: string,
  opts: { pathname: string; email?: string; name?: string }
): OpsReply {
  const snap = getOpsSnapshot({ email: opts.email, name: opts.name });
  const lower = input.trim().toLowerCase();
  const orderId = extractOrderId(input, opts.pathname);

  if (!lower) {
    return { text: `${pageContextLine(opts.pathname, snap)}\n\nWhat would you like to know?` };
  }

  if (/average daily|gps|km away|lead time|reorder level|supplier pricing|% higher|abandoned cart/.test(lower)) {
    return { text: MISSING };
  }

  if (/refund|process payment|create (a )?purchase order|assign picker/.test(lower)) {
    return {
      text: "I can't change orders or stock from this pass — ask in the relevant CRM page. Sensitive actions need confirmation and are not enabled yet.",
    };
  }

  if (/catch me up|while i was away|welcome back/.test(lower)) {
    return buildCatchUpReply(snap);
  }

  if (/what'?s happening|what is happening|status update|operations briefing|brief me/.test(lower)) {
    return happeningReply(snap);
  }

  if (/need(s)? my attention|priority|what should i (do|focus)/.test(lower)) {
    const items = attentionItems(snap);
    if (!items.length) {
      return { text: `Everything looks good, ${firstName(snap.actor.name)}. No priority items in your modules.` };
    }
    return {
      text: `There are ${items.length} priority item${items.length === 1 ? "" : "s"}.\n\n${items
        .map((t, i) => `${i + 1}. ${t}`)
        .join("\n")}`,
    };
  }

  if (/how are the stores|store(s)? doing|which store/.test(lower)) {
    if (!can(snap, "orders") && !can(snap, "inventory")) return refuse(snap, "store performance");
    return storesReply(snap);
  }

  if (/today'?s orders|show (me )?(today'?s )?orders|active orders/.test(lower)) {
    if (!can(snap, "orders")) return refuse(snap, "orders");
    if (!snap.orders.length) return { text: "No orders are in scope for your store." };
    const today = snap.orders.filter((o) => o.createdAt.slice(0, 10) === snap.todayIso);
    const list = (today.length ? today : snap.orders)
      .slice(0, 8)
      .map((o) => `${o.id} · ${o.status} · ${o.customerName} · ${formatCurrency(o.total)}`)
      .join("\n");
    const head = today.length
      ? `${today.length} order${today.length === 1 ? "" : "s"} dated ${snap.todayIso}.`
      : `None dated ${snap.todayIso}. ${snap.orders.length} orders on file:`;
    return { text: `${head}\n\n${list}`, links: [{ label: "Open orders", href: "/admin/orders" }] };
  }

  if (/stock|inventory|running low|below reorder/.test(lower)) {
    if (!can(snap, "inventory")) return refuse(snap, "inventory");
    if (/milk|bread|coke|charcoal/.test(lower)) {
      const q = lower.match(/milk|bread|coke|charcoal/)?.[0] ?? lower;
      return productDetail(snap, q);
    }
    if (!snap.lowStock.length && !snap.outOfStock.length) {
      return { text: "No products in scope are at or below the on-hand threshold of 30." };
    }
    const lines = [
      snap.outOfStock.length ? `${snap.outOfStock.length} out of stock.` : null,
      snap.lowStock.length ? `${snap.lowStock.length} below on-hand of 30.` : null,
      ...snap.lowStock.slice(0, 6).map((p) => `• ${p.name} · ${p.inStock} · ${storeShortName(p.storeSlug)}`),
    ].filter(Boolean);
    return { text: lines.join("\n"), links: [{ label: "Inventory", href: "/admin/inventory" }] };
  }

  if (/deliver|driver|late|fleet/.test(lower)) {
    if (!can(snap, "deliveries") && !can(snap, "fleet")) return refuse(snap, "deliveries");
    if (!snap.openDeliveries.length) return { text: "No open jobs in the delivery queue." };
    const lines = [
      `${snap.openDeliveries.length} open queue job${snap.openDeliveries.length === 1 ? "" : "s"}.`,
      ...snap.openDeliveries.map((d) => {
        const v = snap.fleet.find((f) => f.orderId === d.orderId);
        return `• ${d.orderId} · ${d.status} · ${d.customerName}${v ? ` · ${v.driver} · ${v.status}${v.eta ? ` · ETA ${v.eta}` : ""}` : ""}`;
      }),
    ];
    if (snap.delayedDeliveries.length) {
      lines.push(`Flagged delay: ${snap.delayedDeliveries.map((d) => d.orderId).join(", ")}.`);
    }
    return { text: lines.join("\n"), links: [{ label: "Fleet", href: "/admin/fleet" }] };
  }

  if (/ticket|complaint|service counter/.test(lower)) {
    if (!can(snap, "tickets")) return refuse(snap, "tickets");
    if (!snap.openTickets.length) return { text: "No unresolved tickets." };
    return {
      text: snap.openTickets.map((t) => `${t.id} · ${t.status} · ${t.priority} · ${t.customerName} · ${t.subject}`).join("\n"),
      links: [{ label: "Tickets", href: "/admin/tickets" }],
    };
  }

  if (/sales summary|how (are )?sales/.test(lower)) {
    if (!can(snap, "orders") && !can(snap, "finance")) return refuse(snap, "sales");
    const total = snap.orders.reduce((s, o) => s + o.total, 0);
    return {
      text: `Recorded order total in scope: ${formatCurrency(total)} across ${snap.orders.length} orders. I don't have same-weekday comparison figures in the CRM.`,
    };
  }

  if (orderId) return orderDetail(snap, orderId);

  if (/this order|what'?s wrong/.test(lower)) {
    return { text: "Which order? Give me an id like ORD-1046." };
  }

  const customer = snap.customers.find((c) => lower.includes(c.name.split(" ")[0].toLowerCase()) && c.name.length > 3);
  if (customer && can(snap, "customers")) {
    const theirs = snap.orders.filter((o) => o.customerId === customer.id);
    const tix = snap.tickets.filter((t) => t.customerId === customer.id);
    return {
      text: `${customer.name} · ${customer.type} · ${customer.rewardsTier}\nOrders on file: ${theirs.length}\nTickets: ${tix.length ? tix.map((t) => `${t.id} ${t.status}`).join(", ") : "none"}\nSpend on file: ${formatCurrency(customer.totalSpent)}`,
      links: [{ label: "Customers", href: "/admin/customers" }],
    };
  }

  return {
    text: `${pageContextLine(opts.pathname, snap)}\n\nI can answer from CRM data: what's happening, what needs attention, orders, stock on hand, deliveries, tickets, and store totals. I won't invent sales rates, GPS distance, or supplier lead times.`,
  };
}

export function opsChipPrompts() {
  return [
    { label: "What's happening?", prompt: "What's happening?" },
    { label: "What needs my attention?", prompt: "What needs my attention?" },
    { label: "Today's orders", prompt: "Show today's orders" },
    { label: "Stock alerts", prompt: "Stock alerts" },
    { label: "Delivery problems", prompt: "Delivery problems" },
    { label: "How are the stores doing?", prompt: "How are the stores doing?" },
  ];
}
