"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Pencil,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { CUSTOMERS, ORDERS } from "@/lib/data";
import { CRM_MEETINGS, type CrmTask, type TaskStatus } from "@/lib/crm-activity";
import { LEADS } from "@/lib/crm-data";
import { subscribeTickets } from "@/lib/ticket-store";
import type { Ticket } from "@/lib/crm-data";
import { listTasks, setTaskStatus, subscribeTasks } from "@/lib/task-store";
import {
  addWorkNote,
  addWorkReply,
  addWorkUpdate,
  getWorkbench,
  markHandled,
  setContinueWork,
  subscribeWorkbench,
  type ContinueWork,
} from "@/lib/workbench-store";
import { INITIAL_THREADS } from "@/lib/team-chat";
import { QuickSheet } from "@/components/quick-sheet";

const TODAY = "2026-08-11";
type Filter = "all" | "urgent" | "tasks" | "messages" | "deadlines";

function timeAgo(iso: string) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function replySuggestions(name: string) {
  const first = name.split(" ")[0];
  return {
    professional: `Good afternoon ${first}. We are currently finalising this and will send you an update shortly.`,
    short: `Hi ${first}, we're on this and will update you shortly.`,
    detailed: `Good afternoon ${first}. We have completed the next stage and are waiting on the remaining details. I'll update you as soon as we have them.`,
  };
}

export function OpsCockpit() {
  const router = useRouter();
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const actor = user?.name ?? "Staff";

  const [tasks, setTasks] = useState<CrmTask[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [bench, setBench] = useState(getWorkbench);
  const [filter, setFilter] = useState<Filter>("all");
  const [toast, setToast] = useState<{ id: string; title: string } | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const undoRef = useRef<{ id: string; prev: TaskStatus } | null>(null);

  const [sheet, setSheet] = useState<
    | null
    | { kind: "reply"; id: string; name: string; preview: string }
    | { kind: "update"; id: string; name: string }
    | { kind: "note"; id: string; name: string }
    | { kind: "call"; name: string; phone?: string }
    | { kind: "matter"; id: string; name: string }
  >(null);
  const [draft, setDraft] = useState("");
  const [updateStatus, setUpdateStatus] = useState<"active" | "waiting" | "urgent" | "completed">("active");
  const [notePrivate, setNotePrivate] = useState(false);
  const [justDone, setJustDone] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => subscribeTasks(setTasks), []);
  useEffect(() => subscribeTickets(setTickets), []);
  useEffect(() => subscribeWorkbench(setBench), []);

  const openTasks = tasks.filter((t) => t.status !== "done");
  const overdue = openTasks.filter((t) => t.status === "overdue" || t.dueDate < TODAY);
  const urgent = overdue.filter((t) => t.priority === "high" || t.status === "overdue");
  const doneToday = tasks.filter((t) => t.status === "done");
  const openTickets = tickets.filter((t) => t.status !== "resolved");
  const waitingLeads = LEADS.filter((l) => l.stage === "new" || l.stage === "contacted");
  const attentionOrders = ORDERS.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const deadlines = [
    ...CRM_MEETINGS.filter((m) => m.status === "scheduled" && m.date >= TODAY).map((m) => ({
      id: m.id,
      when: m.date === TODAY ? `Today · ${m.startTime}` : m.date === "2026-08-12" ? `Tomorrow · ${m.startTime}` : `${m.date} · ${m.startTime}`,
      title: m.title,
      sub: m.withName,
      tone: m.date === TODAY ? "urgent" : "soon",
      href: "/admin/calendar",
    })),
    ...openTasks
      .filter((t) => t.dueDate >= TODAY)
      .slice(0, 3)
      .map((t) => ({
        id: t.id,
        when: t.dueDate === TODAY ? "Today" : t.dueDate,
        title: t.title,
        sub: t.relatedTo,
        tone: t.dueDate === TODAY ? "urgent" : "soon",
        href: "/admin/tasks",
      })),
  ].slice(0, 4);

  const needsYou = [
    ...openTickets.slice(0, 2).map((t) => ({
      id: `tkt-${t.id}`,
      icon: "💬",
      name: t.customerName,
      detail: t.subject,
      href: "/admin/tickets",
    })),
    ...INITIAL_THREADS.filter((t) => t.unread > 0).map((t) => ({
      id: `chat-${t.id}`,
      icon: "👤",
      name: t.name,
      detail: t.preview,
      href: `/admin/chat?thread=${t.id}`,
    })),
    {
      id: "doc-quote",
      icon: "📄",
      name: "Botha quote pack",
      detail: "Awaiting your review",
      href: "/admin/tasks",
    },
  ].filter((n) => !bench.handled.includes(n.id));

  const clientMessage = needsYou.find((n) => n.id.startsWith("tkt-") || n.id.startsWith("chat-"));

  const attentionCount = urgent.length + openTickets.length + waitingLeads.length;
  const priorityTotal = Math.max(1, urgent.length + openTickets.length + overdue.length);
  const priorityDone = doneToday.length;
  const progress = Math.min(100, Math.round((priorityDone / (priorityDone + openTasks.length || 1)) * 100));

  const queuedTasks = useMemo(() => {
    const rank = (t: CrmTask) => (t.status === "overdue" ? 0 : t.priority === "high" ? 1 : t.dueDate <= TODAY ? 2 : 3);
    return [...openTasks].sort((a, b) => rank(a) - rank(b) || a.dueDate.localeCompare(b.dueDate));
  }, [openTasks]);

  const focusTask = justDone
    ? queuedTasks.find((t) => t.id !== justDone.id) ?? queuedTasks[0]
    : queuedTasks[0];

  function completeTask(task: CrmTask) {
    undoRef.current = { id: task.id, prev: task.status };
    setTaskStatus(task.id, "done");
    setJustDone({ id: task.id, title: task.title });
    setToast({ id: task.id, title: task.title });
    setContinueWork({
      entityId: task.id,
      title: task.relatedTo,
      lastActivity: `Completed: ${task.title}`,
      href: "/admin/tasks",
    });
    window.setTimeout(() => setJustDone(null), 1800);
    window.setTimeout(() => {
      setToast((cur) => (cur?.id === task.id ? null : cur));
      undoRef.current = null;
    }, 5000);
  }

  function undoComplete() {
    const u = undoRef.current;
    if (!u) return;
    setTaskStatus(u.id, u.prev);
    setToast(null);
    setJustDone(null);
    undoRef.current = null;
  }

  function startTask(task: CrmTask) {
    setTaskStatus(task.id, "in_progress");
    setContinueWork({
      entityId: task.id,
      title: task.title,
      lastActivity: "In progress",
      href: "/admin/tasks",
    });
  }

  const show = {
    today: filter === "all" || filter === "urgent",
    tasks: filter === "all" || filter === "tasks" || filter === "urgent",
    messages: filter === "all" || filter === "messages",
    deadlines: filter === "all" || filter === "deadlines",
    rest: filter === "all",
  };

  const caughtUp =
    openTasks.length === 0 && openTickets.length === 0 && needsYou.length === 0;

  return (
    <div className="space-y-4 xl:hidden">
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-aheers-green">
          Tuesday · 11 August 2026
        </p>
        <h1 className="mt-1 font-display text-[1.85rem] font-semibold leading-none text-aheers-green-dark">
          My day
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {caughtUp
            ? `Good ${new Date().getHours() < 12 ? "morning" : "afternoon"}, ${firstName}. You're clear.`
            : `${attentionCount} ${attentionCount === 1 ? "item needs" : "things need"} your attention.`}
        </p>
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-[#e6ebe8]">
            <div
              className="h-full rounded-full bg-aheers-green transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-gray-400">
            {doneToday.length} of {doneToday.length + openTasks.length} priorities completed
          </p>
        </div>
      </header>

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
        {(
          [
            ["all", "Everything"],
            ["urgent", "Urgent"],
            ["tasks", "Tasks"],
            ["messages", "Messages"],
            ["deadlines", "Deadlines"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
              filter === id
                ? "bg-aheers-green-dark text-aheers-gold"
                : "bg-white text-gray-500 ring-1 ring-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {caughtUp && (
        <section className="rounded-[1.25rem] border border-aheers-gold/25 bg-aheers-green-dark px-4 py-6 text-center text-white">
          <p className="font-display text-lg font-semibold text-aheers-gold">You&apos;re all caught up.</p>
          <p className="mt-2 text-sm text-white/65">
            No urgent matters. No overdue tasks. No client messages waiting.
          </p>
          <p className="mt-2 text-xs text-white/40">Nice work.</p>
        </section>
      )}

      {show.today && !caughtUp && (
        <section className="rounded-[1.25rem] border border-aheers-gold/20 bg-aheers-green-dark p-4 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-aheers-gold">Today</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span>🔴 {urgent.length} urgent</span>
              <button type="button" className="text-aheers-gold" onClick={() => setFilter("urgent")}>
                Open
              </button>
            </li>
            <li className="flex items-center justify-between">
              <span>🟠 {openTickets.length + waitingLeads.length} need attention</span>
              <button type="button" className="text-aheers-gold" onClick={() => setFilter("messages")}>
                Open
              </button>
            </li>
            <li className="flex items-center justify-between text-white/70">
              <span>✓ {doneToday.length} completed</span>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => setFilter("urgent")}
            className="mt-4 w-full rounded-full bg-aheers-gold py-2.5 text-sm font-bold text-aheers-green-dark"
          >
            Review priorities
          </button>
        </section>
      )}

      <section>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-aheers-green">Quick work</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            {
              label: "Complete",
              icon: Check,
              on: () => (focusTask ? completeTask(focusTask) : router.push("/admin/tasks")),
            },
            {
              label: "Reply",
              icon: MessageCircle,
              on: () =>
                clientMessage
                  ? setSheet({
                      kind: "reply",
                      id: clientMessage.id,
                      name: clientMessage.name,
                      preview: clientMessage.detail,
                    })
                  : router.push("/admin/chat"),
            },
            {
              label: "Update",
              icon: Pencil,
              on: () =>
                setSheet({
                  kind: "update",
                  id: attentionOrders[0]?.id ?? "ORD-1043",
                  name: attentionOrders[0]?.customerName ?? "Greytown Spaza Shop",
                }),
            },
            {
              label: "Call",
              icon: Phone,
              on: () =>
                setSheet({
                  kind: "call",
                  name: CUSTOMERS[1]?.name ?? "Lucrisha Polton",
                  phone: CUSTOMERS[1]?.phone,
                }),
            },
          ].map(({ label, icon: Icon, on }) => (
            <button
              key={label}
              type="button"
              onClick={on}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-gray-100 bg-white px-1 py-3 shadow-[0_6px_18px_rgba(13,61,38,0.05)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-aheers-green-dark text-aheers-gold">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-semibold text-aheers-charcoal">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {bench.continueWork && show.rest && (
        <ContinueCard item={bench.continueWork} />
      )}

      {show.tasks && focusTask && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-aheers-green">Your tasks</p>
            <span className="text-[11px] font-semibold text-gray-400">{openTasks.length} outstanding</span>
          </div>
          {justDone && (
            <div className="mb-2 animate-fade-up rounded-2xl bg-aheers-green/10 px-4 py-3 text-sm text-aheers-green-dark">
              <p className="font-semibold">✓ Completed</p>
              <p className="text-xs text-gray-500">{justDone.title}</p>
              {queuedTasks[0] && queuedTasks[0].id !== justDone.id && (
                <p className="mt-2 text-xs">
                  Next priority · <span className="font-semibold">{queuedTasks[0].title}</span>
                </p>
              )}
            </div>
          )}
          <TaskWorkCard
            task={focusTask}
            onComplete={() => completeTask(focusTask)}
            onStart={() => startTask(focusTask)}
            onMenu={() => setMenuFor(focusTask.id)}
            onOpen={() => router.push("/admin/tasks")}
          />
        </section>
      )}

      {show.messages && clientMessage && (
        <section className="rounded-[1.25rem] border border-gray-100 bg-white p-4 shadow-[0_6px_18px_rgba(13,61,38,0.05)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-aheers-green">Needs response</p>
          <p className="mt-2 font-display text-lg font-semibold text-aheers-green-dark">{clientMessage.name}</p>
          <p className="mt-1 text-sm leading-snug text-gray-500">&ldquo;{clientMessage.detail}&rdquo;</p>
          <p className="mt-2 text-[11px] text-gray-400">Waiting · {timeAgo(new Date(Date.now() - 8 * 60_000).toISOString())}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() =>
                setSheet({
                  kind: "reply",
                  id: clientMessage.id,
                  name: clientMessage.name,
                  preview: clientMessage.detail,
                })
              }
              className="flex-1 rounded-full bg-aheers-green-dark py-2.5 text-sm font-bold text-aheers-gold"
            >
              Reply
            </button>
            <button
              type="button"
              onClick={() => markHandled(clientMessage.id, actor, `Marked handled · ${clientMessage.name}`)}
              className="rounded-full bg-[#eef1ef] px-4 py-2.5 text-sm font-semibold text-aheers-green-dark"
            >
              Mark handled
            </button>
          </div>
        </section>
      )}

      {show.messages && needsYou.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-aheers-green">Needs you</p>
            <span className="text-[11px] font-semibold text-gray-400">{needsYou.length} items</span>
          </div>
          <ul className="space-y-2">
            {needsYou.slice(0, 3).map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => router.push(n.href)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-gray-100 bg-white px-3 py-3 text-left"
                >
                  <span className="text-base">{n.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-aheers-charcoal">{n.name}</span>
                    <span className="block truncate text-xs text-gray-400">{n.detail}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {show.deadlines && deadlines.length > 0 && (
        <section>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-aheers-green">
            Upcoming deadlines
          </p>
          <ul className="space-y-2">
            {deadlines.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => router.push(d.href)}
                  className="flex w-full items-start justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-3 py-3 text-left"
                >
                  <span>
                    <span className={`block text-[11px] font-bold ${d.tone === "urgent" ? "text-red-600" : "text-amber-600"}`}>
                      {d.tone === "urgent" ? "🔴" : "🟠"} {d.when}
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold text-aheers-charcoal">{d.title}</span>
                    <span className="block text-xs text-gray-400">{d.sub}</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      markHandled(`dl-${d.id}`, actor, `Acknowledged deadline · ${d.title}`);
                    }}
                    className="shrink-0 rounded-full bg-[#eef1ef] px-2.5 py-1 text-[10px] font-bold text-aheers-green-dark"
                  >
                    Ack
                  </button>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {show.rest && (
        <>
          <section>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-aheers-green">Active orders</p>
              <span className="text-[11px] text-gray-400">{attentionOrders.length} open</span>
            </div>
            {attentionOrders[0] && (
              <div className="rounded-[1.25rem] border border-gray-100 bg-white p-4">
                <p className="font-display text-lg font-semibold text-aheers-green-dark">
                  {attentionOrders[0].customerName}
                </p>
                <p className="mt-1 text-xs text-red-600">Deadline watch · {attentionOrders[0].id}</p>
                <p className="text-xs text-gray-400">{attentionOrders[0].status} · 2 tasks outstanding</p>
                <p className="mt-2 text-sm text-gray-600">Next: {openTasks[0]?.title ?? "Review order"}</p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href="/admin/orders"
                    className="flex-1 rounded-full bg-aheers-green-dark py-2 text-center text-sm font-bold text-aheers-gold"
                  >
                    Open
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      setSheet({
                        kind: "matter",
                        id: attentionOrders[0].id,
                        name: attentionOrders[0].customerName,
                      })
                    }
                    className="rounded-full bg-[#eef1ef] px-4 py-2 text-sm font-semibold"
                  >
                    •••
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSheet({
                        kind: "note",
                        id: attentionOrders[0].id,
                        name: attentionOrders[0].customerName,
                      })
                    }
                    className="rounded-full bg-[#eef1ef] px-4 py-2 text-sm font-semibold"
                  >
                    + Note
                  </button>
                </div>
              </div>
            )}
          </section>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Orders", value: String(attentionOrders.length), hint: `${overdue.length} ⚠`, href: "/admin/orders" },
              { label: "Clients", value: String(CUSTOMERS.length), hint: `${openTickets.length} waiting`, href: "/admin/customers" },
              { label: "Leads", value: String(waitingLeads.length), hint: "Waiting", href: "/admin/leads" },
            ].map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="rounded-2xl border border-gray-100 bg-white px-2.5 py-3 text-center"
              >
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{s.label}</p>
                <p className="mt-1 font-display text-2xl font-semibold text-aheers-green-dark">{s.value}</p>
                <p className="text-[10px] text-amber-700">{s.hint}</p>
              </Link>
            ))}
          </div>

          <section>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-aheers-green">
              Recent activity
            </p>
            <ul className="space-y-2">
              {bench.activity.slice(0, 4).map((a) => (
                <li key={a.id} className="rounded-2xl bg-white px-3 py-2.5 ring-1 ring-gray-100">
                  <p className="text-[10px] text-gray-400">{timeAgo(a.at)}</p>
                  <p className="text-sm text-aheers-charcoal">
                    <span className="font-semibold">{a.actor}</span> {a.text}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {toast && (
        <div className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] left-3 right-3 z-[60] flex items-center justify-between rounded-2xl bg-aheers-green-dark px-4 py-3 text-white shadow-lift">
          <p className="text-sm">
            ✓ Task completed · <span className="text-white/70">{toast.title}</span>
          </p>
          <button type="button" onClick={undoComplete} className="text-sm font-bold text-aheers-gold">
            Undo
          </button>
        </div>
      )}

      {menuFor && (
        <QuickSheet open title="Task" subtitle={tasks.find((t) => t.id === menuFor)?.title} onClose={() => setMenuFor(null)}>
          <div className="space-y-1 pb-2">
            {[
              ["Mark complete", () => {
                const t = tasks.find((x) => x.id === menuFor);
                if (t) completeTask(t);
                setMenuFor(null);
              }],
              ["Start task", () => {
                const t = tasks.find((x) => x.id === menuFor);
                if (t) startTask(t);
                setMenuFor(null);
              }],
              ["Snooze", () => {
                const t = tasks.find((x) => x.id === menuFor);
                if (t) setTaskStatus(t.id, "waiting");
                setMenuFor(null);
              }],
              ["Change priority", () => setMenuFor(null)],
              ["Open task", () => {
                setMenuFor(null);
                router.push("/admin/tasks");
              }],
            ].map(([label, fn]) => (
              <button
                key={String(label)}
                type="button"
                onClick={fn as () => void}
                className="w-full rounded-xl px-3 py-3 text-left text-sm text-white hover:bg-white/10"
              >
                {label as string}
              </button>
            ))}
          </div>
        </QuickSheet>
      )}

      <ReplySheet
        sheet={sheet}
        draft={draft}
        setDraft={setDraft}
        onClose={() => {
          setSheet(null);
          setDraft("");
        }}
        onSend={() => {
          if (sheet?.kind === "reply" && draft.trim()) {
            addWorkReply({ entityId: sheet.id, toName: sheet.name, text: draft.trim() }, actor);
            setSheet(null);
            setDraft("");
          }
        }}
      />

      <QuickSheet
        open={sheet?.kind === "update"}
        title="Update"
        subtitle={sheet?.kind === "update" ? sheet.name : undefined}
        onClose={() => setSheet(null)}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What's changed?"
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/35 outline-none"
        />
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(["active", "waiting", "urgent", "completed"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setUpdateStatus(s)}
              className={`rounded-xl py-2 text-xs font-semibold capitalize ${
                updateStatus === s ? "bg-aheers-gold text-aheers-green-dark" : "bg-white/10 text-white/80"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            if (sheet?.kind === "update" && draft.trim()) {
              addWorkUpdate(
                { entityId: sheet.id, entityLabel: sheet.name, text: draft.trim(), status: updateStatus },
                actor
              );
              setDraft("");
              setSheet(null);
            }
          }}
          className="mt-4 w-full rounded-full bg-aheers-gold py-3 text-sm font-bold text-aheers-green-dark"
        >
          Save update
        </button>
      </QuickSheet>

      <QuickSheet
        open={sheet?.kind === "note"}
        title="Add note"
        subtitle={sheet?.kind === "note" ? sheet.name : undefined}
        onClose={() => setSheet(null)}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write note…"
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/35 outline-none"
        />
        <label className="mt-3 flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" checked={notePrivate} onChange={(e) => setNotePrivate(e.target.checked)} />
          Private note
        </label>
        <button
          type="button"
          onClick={() => {
            if (sheet?.kind === "note" && draft.trim()) {
              addWorkNote(
                { entityId: sheet.id, entityLabel: sheet.name, text: draft.trim(), private: notePrivate },
                actor
              );
              setDraft("");
              setSheet(null);
            }
          }}
          className="mt-4 w-full rounded-full bg-aheers-gold py-3 text-sm font-bold text-aheers-green-dark"
        >
          Save
        </button>
      </QuickSheet>

      <QuickSheet
        open={sheet?.kind === "call"}
        title="Call"
        subtitle={sheet?.kind === "call" ? sheet.name : undefined}
        onClose={() => setSheet(null)}
      >
        {sheet?.kind === "call" && (
          <div className="space-y-2">
            <a
              href={sheet.phone ? `tel:${sheet.phone.replace(/\s/g, "")}` : "tel:0334131156"}
              className="block rounded-2xl bg-aheers-gold py-3 text-center text-sm font-bold text-aheers-green-dark"
            >
              Call {sheet.phone ?? "033 413 1156"}
            </a>
            <button
              type="button"
              onClick={() => router.push("/admin/chat")}
              className="w-full rounded-2xl bg-white/10 py-3 text-sm font-semibold"
            >
              Message instead
            </button>
          </div>
        )}
      </QuickSheet>

      <QuickSheet
        open={sheet?.kind === "matter"}
        title="Quick actions"
        subtitle={sheet?.kind === "matter" ? sheet.name : undefined}
        onClose={() => setSheet(null)}
      >
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Call client", () => setSheet({ kind: "call", name: sheet?.kind === "matter" ? sheet.name : "", phone: CUSTOMERS.find((c) => c.name === (sheet?.kind === "matter" ? sheet.name : ""))?.phone })],
            ["Message client", () => router.push("/admin/chat")],
            ["Add note", () => sheet?.kind === "matter" && setSheet({ kind: "note", id: sheet.id, name: sheet.name })],
            ["Add task", () => router.push("/admin/tasks")],
            ["View order", () => router.push("/admin/orders")],
            ["Add deadline", () => router.push("/admin/calendar")],
          ].map(([label, fn]) => (
            <button
              key={String(label)}
              type="button"
              onClick={fn as () => void}
              className="rounded-2xl bg-white/10 px-3 py-3 text-left text-sm font-semibold"
            >
              {label as string}
            </button>
          ))}
        </div>
      </QuickSheet>
    </div>
  );
}

function ContinueCard({ item }: { item: ContinueWork }) {
  return (
    <section className="rounded-[1.25rem] border border-aheers-gold/20 bg-gradient-to-br from-aheers-green-dark to-[#145232] p-4 text-white">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-aheers-gold">Continue working</p>
      <p className="mt-2 font-display text-lg font-semibold">{item.title}</p>
      <p className="mt-1 text-xs text-white/55">Last activity: {item.lastActivity}</p>
      <Link
        href={item.href}
        className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-aheers-gold"
      >
        Continue <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}

function TaskWorkCard({
  task,
  onComplete,
  onStart,
  onMenu,
  onOpen,
}: {
  task: CrmTask;
  onComplete: () => void;
  onStart: () => void;
  onMenu: () => void;
  onOpen: () => void;
}) {
  const startX = useRef(0);
  const [dx, setDx] = useState(0);
  const overdue = task.status === "overdue" || task.dueDate < TODAY;

  return (
    <div className="relative overflow-hidden rounded-[1.25rem]">
      <div className="absolute inset-y-0 left-0 flex w-24 items-center justify-center bg-aheers-green text-xs font-bold text-white">
        → Complete
      </div>
      <div
        className="relative rounded-[1.25rem] border border-gray-100 bg-white p-4 shadow-[0_6px_18px_rgba(13,61,38,0.05)] transition-transform"
        style={{ transform: `translateX(${dx}px)` }}
        onTouchStart={(e) => {
          startX.current = e.touches[0].clientX;
        }}
        onTouchMove={(e) => {
          const next = Math.max(0, Math.min(120, e.touches[0].clientX - startX.current));
          setDx(next);
        }}
        onTouchEnd={() => {
          if (dx > 72) onComplete();
          setDx(0);
        }}
      >
        <p className={`text-[10px] font-bold uppercase tracking-wider ${overdue ? "text-red-600" : "text-amber-600"}`}>
          {overdue ? "🔴 Overdue" : task.status === "in_progress" ? "● In progress" : "To do"}
        </p>
        <p className="mt-1 font-display text-lg font-semibold leading-snug text-aheers-green-dark">{task.title}</p>
        <p className="mt-0.5 text-xs text-gray-400">{task.relatedTo}</p>
        <p className="mt-2 text-xs text-gray-500">
          Due {task.dueDate === TODAY ? "today" : task.dueDate}
          {task.dueDate < TODAY ? " · yesterday+" : ""}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={onComplete}
            className="rounded-full bg-aheers-green-dark px-3.5 py-2 text-[12px] font-bold text-aheers-gold"
          >
            ✓ Complete
          </button>
          {task.status === "todo" && (
            <button
              type="button"
              onClick={onStart}
              className="rounded-full bg-[#eef1ef] px-3.5 py-2 text-[12px] font-semibold text-aheers-green-dark"
            >
              Start
            </button>
          )}
          <button type="button" onClick={onOpen} className="text-[12px] font-semibold text-gray-400">
            Open
          </button>
          <button type="button" onClick={onMenu} className="ml-auto rounded-full p-2 text-gray-400" aria-label="More">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReplySheet({
  sheet,
  draft,
  setDraft,
  onClose,
  onSend,
}: {
  sheet: { kind: string; name?: string; preview?: string } | null;
  draft: string;
  setDraft: (v: string) => void;
  onClose: () => void;
  onSend: () => void;
}) {
  if (sheet?.kind !== "reply" || !sheet.name) return null;
  const tips = replySuggestions(sheet.name);
  return (
    <QuickSheet open title="Reply" subtitle={sheet.name} onClose={onClose}>
      {sheet.preview && <p className="mb-3 text-xs text-white/45">&ldquo;{sheet.preview}&rdquo;</p>}
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Type your reply…"
        rows={4}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/35 outline-none"
      />
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-aheers-gold/70">Suggested</p>
      <div className="mt-2 space-y-2">
        {(
          [
            ["Professional", tips.professional],
            ["Short", tips.short],
            ["More detailed", tips.detailed],
          ] as const
        ).map(([label, text]) => (
          <div key={label} className="rounded-2xl bg-white/5 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">{label}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/80">{text}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setDraft(text)}
                className="rounded-full bg-aheers-gold px-3 py-1 text-[11px] font-bold text-aheers-green-dark"
              >
                Use
              </button>
              <button type="button" onClick={() => setDraft(text)} className="text-[11px] font-semibold text-white/60">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        disabled={!draft.trim()}
        onClick={onSend}
        className="mt-4 w-full rounded-full bg-aheers-gold py-3 text-sm font-bold text-aheers-green-dark disabled:opacity-40"
      >
        Send
      </button>
    </QuickSheet>
  );
}
