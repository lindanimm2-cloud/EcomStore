"use client";

import { FormEvent, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, MessageSquareWarning } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { CUSTOMERS } from "@/lib/data";
import type { Order } from "@/lib/types";
import {
  COMPLAINT_REASONS,
  createOrderComplaint,
  ticketsForOrder,
  type ComplaintReason,
} from "@/lib/ticket-store";

export function OrderComplaintForm({
  order,
  compact = false,
}: {
  order: Order;
  compact?: boolean;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ComplaintReason>("missing");
  const [itemName, setItemName] = useState("");
  const [details, setDetails] = useState("");
  const [doneId, setDoneId] = useState<string | null>(null);
  const [existing, setExisting] = useState(() =>
    typeof window === "undefined" ? [] : ticketsForOrder(order.id)
  );

  useEffect(() => {
    setExisting(ticketsForOrder(order.id));
  }, [order.id, doneId]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#complaint") {
      setOpen(true);
    }
  }, []);

  const profile =
    CUSTOMERS.find((c) => c.id === user?.customerId) ??
    CUSTOMERS.find((c) => c.email.toLowerCase() === (user?.email ?? "").toLowerCase());

  function submit(e: FormEvent) {
    e.preventDefault();
    if (details.trim().length < 8) return;
    const ticket = createOrderComplaint({
      orderId: order.id,
      customerId: profile?.id ?? user?.customerId ?? order.customerId ?? "guest",
      customerName: profile?.name ?? user?.name ?? order.customerName ?? "App customer",
      reason,
      details,
      itemName: itemName || undefined,
    });
    setDoneId(ticket.id);
    setDetails("");
    setOpen(false);
  }

  if (doneId) {
    return (
      <div className="rounded-2xl border border-aheers-green/15 bg-aheers-mist/70 p-4 sm:p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-aheers-green-dark">
          <CheckCircle2 className="h-4 w-4" /> Complaint sent · {doneId}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Service Counter has this on {order.id}. We’ll follow up from the number on your account.
        </p>
      </div>
    );
  }

  return (
    <div id="complaint" className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-aheers-charcoal">
            <MessageSquareWarning className="h-4 w-4 text-amber-700" />
            Something wrong with this order?
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            Report a missing, wrong, damaged, or late item. It opens a ticket for Aheers staff.
          </p>
        </div>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-xl bg-aheers-green px-3 py-2 text-xs font-bold text-white hover:bg-aheers-green-light"
          >
            Report a problem
          </button>
        )}
      </div>

      {existing.length > 0 && !open && (
        <ul className="mt-3 space-y-1.5">
          {existing.map((t) => (
            <li key={t.id} className="text-xs text-gray-500">
              {t.id} · {t.subject} · <span className="capitalize">{t.status}</span>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">What happened</span>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ComplaintReason)}
              className="mt-1 w-full rounded-xl border border-aheers-green/15 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-aheers-green/20"
            >
              {COMPLAINT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          {order.items.length > 0 && (
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Item (optional)
              </span>
              <select
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-aheers-green/15 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-aheers-green/20"
              >
                <option value="">Whole order</option>
                {order.items.map((item, i) => (
                  <option key={`${item.productId}-${i}`} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Details</span>
            <textarea
              required
              minLength={8}
              rows={compact ? 3 : 4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Tell us what went wrong so we can fix it…"
              className="mt-1 w-full rounded-xl border border-aheers-green/15 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-aheers-green/20"
            />
          </label>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1 py-2.5 text-sm">
              Submit complaint
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-500 hover:bg-white"
            >
              Cancel
            </button>
          </div>
          <p className="flex items-start gap-1.5 text-[11px] text-gray-400">
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
            This goes to Service Counter as a support ticket. Keep your order number {order.id}.
          </p>
        </form>
      )}
    </div>
  );
}
