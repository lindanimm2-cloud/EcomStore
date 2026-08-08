"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  ExternalLink,
  GripVertical,
  Headphones,
  Inbox,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Search,
  Settings,
  Eye,
  Send,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useNotifications } from "@/lib/notifications-context";
import { INITIAL_THREADS, initials } from "@/lib/team-chat";
import {
  appendAgentMessage,
  claimSession,
  endSession,
  subscribeLiveSupport,
  type LiveSession,
} from "@/lib/live-support";

type Panel = "chat" | "live" | "notify" | "search" | "calls" | "more" | null;

const STORAGE_POS = "aheers-smart-lens-pos";
const STORAGE_HIDDEN = "aheers-smart-lens-hidden";

export function CrmSmartLens() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { unreadCount, listFor, markAllRead, markRead, addNotification } = useNotifications();
  const staffUnread = unreadCount("staff");
  const staffNotes = listFor("staff").slice(0, 6);
  const chatUnread = INITIAL_THREADS.reduce((s, t) => s + t.unread, 0);

  const [hidden, setHidden] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [pos, setPos] = useState({ x: 16, y: 64 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const [searchQ, setSearchQ] = useState("");
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [liveActiveId, setLiveActiveId] = useState<string | null>(null);
  const [liveDraft, setLiveDraft] = useState("");
  const prevWaiting = useRef(0);

  useEffect(() => {
    return subscribeLiveSupport((sessions) => {
      setLiveSessions(sessions.filter((s) => s.status !== "ended" || Date.now() - s.updatedAt < 1000 * 60 * 30));
      setLiveActiveId((prev) => {
        if (prev && sessions.some((s) => s.id === prev && s.status !== "ended")) return prev;
        const open = sessions.find((s) => s.status === "waiting" || s.status === "active");
        return open?.id ?? null;
      });
      const waiting = sessions.filter((s) => s.status === "waiting").length;
      if (waiting > prevWaiting.current) {
        const newest = sessions.find((s) => s.status === "waiting");
        if (newest) {
          addNotification({
            audience: "staff",
            kind: "system",
            title: "Live chat · Talk to human",
            body: `${newest.customerName} wants an agent${newest.storeHint ? ` · ${newest.storeHint}` : ""}`,
            href: `/admin/chat?thread=${newest.id}`,
          });
        }
        setPanel((p) => (p == null ? "live" : p));
      }
      prevWaiting.current = waiting;
    });
  }, [addNotification]);

  const liveWaiting = liveSessions.filter((s) => s.status === "waiting").length;
  const liveOpen = liveSessions.filter((s) => s.status === "waiting" || s.status === "active").length;
  const liveActive = liveSessions.find((s) => s.id === liveActiveId) ?? liveSessions.find((s) => s.status !== "ended");
  const agentName = user?.name?.split(" ")[0] ?? "Agent";

  function clampPos(p: { x: number; y: number }) {
    if (typeof window === "undefined") return p;
    const el = rootRef.current;
    const w = Math.min(el?.offsetWidth ?? 280, window.innerWidth - 16);
    const h = el?.offsetHeight ?? 56;
    return {
      x: Math.max(8, Math.min(window.innerWidth - w - 8, p.x)),
      y: Math.max(8, Math.min(window.innerHeight - h - 8, p.y)),
    };
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_POS);
      if (raw) {
        setPos(clampPos(JSON.parse(raw)));
      } else {
        // Default: top-right, clear of sidebar + mobile ops header
        const w = Math.min(window.innerWidth < 768 ? 220 : 360, window.innerWidth - 24);
        setPos(
          clampPos({
            x: Math.max(8, window.innerWidth - w - 16),
            y: window.innerWidth < 1024 ? 64 : 16,
          })
        );
      }
      if (localStorage.getItem(STORAGE_HIDDEN) === "1") setHidden(true);
      else {
        const settings = localStorage.getItem("aheers-settings-v1");
        if (settings) {
          const data = JSON.parse(settings);
          if (data?.display && data.display.smartLensOnLaunch === false) setHidden(true);
        }
      }
    } catch {
      /* ignore */
    }
    function onResize() {
      setPos((p) => clampPos(p));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setPanel(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    function onMove(e: MouseEvent | TouchEvent) {
      const point = "touches" in e ? e.touches[0] : e;
      if (!point) return;
      const next = clampPos({
        x: point.clientX - dragOffset.current.x,
        y: point.clientY - dragOffset.current.y,
      });
      setPos(next);
    }
    function onUp() {
      setDragging(false);
      setPos((p) => {
        const clamped = clampPos(p);
        try {
          localStorage.setItem(STORAGE_POS, JSON.stringify(clamped));
        } catch {
          /* ignore */
        }
        return clamped;
      });
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging]);

  if (!pathname.startsWith("/admin")) return null;
  // Chat has its own full-screen mobile UI — Lens covers back / composer
  if (pathname.startsWith("/admin/chat")) return null;

  const firstName = user?.name?.split(" ")[0] ?? "Staff";
  const totalBadge = staffUnread + chatUnread + liveWaiting;

  function toggle(next: Panel) {
    setPanel((p) => (p === next ? null : next));
  }

  function hideBar() {
    setHidden(true);
    setPanel(null);
    try {
      localStorage.setItem(STORAGE_HIDDEN, "1");
    } catch {
      /* ignore */
    }
  }

  function showBar() {
    setHidden(false);
    try {
      localStorage.setItem(STORAGE_HIDDEN, "0");
    } catch {
      /* ignore */
    }
  }

  if (hidden) {
    return (
      <button
        type="button"
        onClick={showBar}
        className="fixed bottom-24 right-4 z-[55] flex h-12 w-12 items-center justify-center rounded-2xl bg-aheers-green-dark text-aheers-gold shadow-lift ring-1 ring-aheers-gold/30 transition hover:scale-105 hover:bg-aheers-green sm:right-6"
        aria-label="Open Aheers Lens"
        title="Open Aheers Lens"
      >
        <Eye className="h-5 w-5" />
        {totalBadge > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-aheers-gold px-1 text-[10px] font-bold text-aheers-green-dark">
            {totalBadge}
          </span>
        )}
      </button>
    );
  }

  const iconBtn =
    "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white/75 transition hover:bg-aheers-green-light/30 hover:text-aheers-gold sm:h-9 sm:w-9";
  const iconActive = "bg-aheers-gold/20 text-aheers-gold ring-1 ring-aheers-gold/45";

  const panelOpensUp = typeof window !== "undefined" && pos.y > window.innerHeight * 0.55;
  const panelShell = `absolute left-0 z-10 animate-fade-up overflow-hidden rounded-2xl border border-aheers-gold/20 bg-aheers-green-dark shadow-[0_20px_50px_rgba(13,61,38,0.45)] ${
    panelOpensUp ? "bottom-[calc(100%+10px)] top-auto" : "top-[calc(100%+10px)]"
  }`;

  return (
    <div
      ref={rootRef}
      className="fixed z-[55] max-w-[calc(100vw-16px)]"
      style={{ left: pos.x, top: pos.y }}
    >
      <div
        className={`flex max-w-[calc(100vw-16px)] items-center gap-1 rounded-full border border-aheers-gold/25 bg-aheers-green-dark/95 px-1.5 py-1.5 shadow-[0_12px_40px_rgba(13,61,38,0.4)] backdrop-blur-xl sm:gap-2 sm:px-2 ${
          dragging ? "cursor-grabbing" : ""
        }`}
      >
        <button
          type="button"
          aria-label="Drag Aheers Lens"
          className="flex h-8 w-6 shrink-0 cursor-grab items-center justify-center rounded-full text-aheers-gold/40 hover:bg-white/5 hover:text-aheers-gold/80 active:cursor-grabbing sm:h-9 sm:w-7"
          onMouseDown={(e) => {
            e.preventDefault();
            dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
            setDragging(true);
            setPanel(null);
          }}
          onTouchStart={(e) => {
            const t = e.touches[0];
            if (!t) return;
            dragOffset.current = { x: t.clientX - pos.x, y: t.clientY - pos.y };
            setDragging(true);
            setPanel(null);
          }}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 items-center gap-2 pr-0.5 sm:pr-1">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-aheers-gold text-aheers-green-dark shadow-[0_0_18px_rgba(201,162,39,0.55)] sm:h-9 sm:w-9">
            <Eye className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.25} />
          </span>
          <div className="hidden min-w-0 leading-tight md:block">
            <p className="truncate font-display text-sm font-semibold text-white">{firstName}</p>
            <p className="truncate text-[11px] text-aheers-gold/75">
              Aheers Lens · {liveWaiting > 0 ? `${liveWaiting} live queue` : `${totalBadge} notification${totalBadge === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        <span className="mx-0.5 hidden h-7 w-px bg-aheers-gold/20 md:block" />

        {/* Core actions — always visible */}
        <div className="flex items-center gap-0">
          <button
            type="button"
            className={`${iconBtn} ${panel === "notify" ? iconActive : ""}`}
            title="Notifications"
            onClick={() => toggle("notify")}
          >
            <Bell className="h-4 w-4" />
            {staffUnread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-aheers-gold px-1 text-[9px] font-bold text-aheers-green-dark">
                {staffUnread}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`${iconBtn} ${panel === "chat" || pathname.startsWith("/admin/chat") ? iconActive : ""}`}
            title="Team chat"
            onClick={() => toggle("chat")}
          >
            <MessageCircle className="h-4 w-4" />
            {chatUnread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-aheers-gold px-1 text-[9px] font-bold text-aheers-green-dark">
                {chatUnread}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`${iconBtn} ${panel === "live" ? iconActive : ""}`}
            title="Customer live chats"
            onClick={() => toggle("live")}
          >
            <Headphones className="h-4 w-4" />
            {liveOpen > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-aheers-gold px-1 text-[9px] font-bold text-aheers-green-dark">
                {liveOpen}
              </span>
            )}
          </button>

          {/* Desktop-only extras */}
          <button
            type="button"
            className={`${iconBtn} hidden sm:flex ${panel === "calls" ? iconActive : ""}`}
            title="Calls"
            onClick={() => toggle("calls")}
          >
            <Phone className="h-4 w-4" />
          </button>

          <button
            type="button"
            className={`${iconBtn} hidden sm:flex ${panel === "search" ? iconActive : ""}`}
            title="Search"
            onClick={() => toggle("search")}
          >
            <Search className="h-4 w-4" />
          </button>

          <Link
            href="/admin/tasks"
            className={`${iconBtn} hidden sm:flex`}
            title="Tasks"
            onClick={() => setPanel(null)}
          >
            <Inbox className="h-4 w-4" />
          </Link>

          <Link
            href="/admin/calendar"
            className={`${iconBtn} hidden sm:flex`}
            title="Calendar"
            onClick={() => setPanel(null)}
          >
            <CalendarDays className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile: overflow More */}
        <button
          type="button"
          className={`${iconBtn} sm:hidden ${panel === "more" ? iconActive : ""}`}
          title="More"
          aria-label="More actions"
          onClick={() => toggle("more")}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        <Link
          href="/admin/settings"
          className="ml-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aheers-green/80 text-aheers-gold transition hover:bg-aheers-green-light hover:text-white sm:flex"
          title="Settings"
          onClick={() => setPanel(null)}
        >
          <Settings className="h-4 w-4" />
        </Link>

        <button
          type="button"
          onClick={hideBar}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aheers-red/90 text-white transition hover:bg-aheers-red sm:h-9 sm:w-9"
          title="Hide Aheers Lens"
          aria-label="Hide"
        >
          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>

      {/* Live assist — respond as human when customer taps Talk to human */}
      {panel === "live" && (
        <div className={`${panelShell} flex w-[min(calc(100vw-16px),24rem)] flex-col`}>
          <div className="flex items-center justify-between gap-3 border-b border-aheers-gold/15 px-4 py-3">
            <div>
              <h3 className="font-display text-base font-semibold text-white">Customer live</h3>
              <p className="text-[10px] text-aheers-gold/70">
                Reply as agent · also in Team chat
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Headphones className={`h-4 w-4 text-aheers-gold ${liveWaiting > 0 ? "animate-pulse" : ""}`} />
              {liveWaiting > 0 && (
                <span className="rounded-full bg-aheers-gold px-2 py-0.5 text-[10px] font-bold text-aheers-green-dark">
                  {liveWaiting} waiting
                </span>
              )}
            </div>
          </div>

          {liveSessions.filter((s) => s.status !== "ended").length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-white/40">
              No open handoffs. When a shopper taps Talk to human, they appear here and in Team chat.
            </p>
          ) : (
            <>
              <ul className="flex gap-1.5 overflow-x-auto border-b border-aheers-gold/10 px-3 py-2">
                {liveSessions
                  .filter((s) => s.status !== "ended")
                  .map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setLiveActiveId(s.id)}
                        className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                          liveActive?.id === s.id
                            ? "bg-aheers-gold text-aheers-green-dark"
                            : "bg-aheers-green/50 text-white/80 hover:bg-aheers-green"
                        }`}
                      >
                        {s.customerName.split(" ")[0]}
                        {s.status === "waiting" ? " · queue" : ""}
                      </button>
                    </li>
                  ))}
              </ul>

              {liveActive && (
                <>
                  <div className="border-b border-aheers-gold/10 px-4 py-2">
                    <p className="text-sm font-semibold text-white">{liveActive.customerName}</p>
                    <p className="text-[11px] text-white/45">
                      {liveActive.storeHint ? `${liveActive.storeHint} · ` : ""}
                      {liveActive.topic ?? "Help"} · {liveActive.status}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {liveActive.status === "waiting" && (
                        <button
                          type="button"
                          onClick={() => claimSession(liveActive.id, agentName)}
                          className="rounded-full bg-aheers-gold px-3 py-1 text-[11px] font-bold text-aheers-green-dark"
                        >
                          Claim & join
                        </button>
                      )}
                      <Link
                        href={`/admin/chat?thread=${liveActive.id}`}
                        onClick={() => setPanel(null)}
                        className="rounded-full border border-aheers-gold/40 px-3 py-1 text-[11px] font-semibold text-aheers-gold hover:bg-aheers-gold/10"
                      >
                        Open in Team chat
                      </Link>
                      {liveActive.status !== "ended" && (
                        <button
                          type="button"
                          onClick={() => endSession(liveActive.id, "agent")}
                          className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/70 hover:border-aheers-gold/40"
                        >
                          End chat
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-64 space-y-2 overflow-y-auto px-3 py-3">
                    {liveActive.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`text-xs leading-relaxed ${
                          m.role === "system"
                            ? "text-center text-white/35"
                            : m.role === "agent"
                              ? "ml-6 rounded-2xl rounded-br-md bg-aheers-gold/20 px-3 py-2 text-aheers-gold"
                              : m.role === "assistant"
                                ? "mr-6 rounded-2xl rounded-bl-md border border-white/10 bg-white/5 px-3 py-2 text-white/55"
                                : "mr-6 rounded-2xl rounded-bl-md bg-white/10 px-3 py-2 text-white/90"
                        }`}
                      >
                        {m.role !== "system" && (
                          <span className="mb-0.5 block text-[9px] font-semibold uppercase tracking-wide text-white/40">
                            {m.role === "agent"
                              ? "You"
                              : m.role === "assistant"
                                ? "AI assistant"
                                : "Customer"}{" "}
                            · {m.at}
                          </span>
                        )}
                        {m.text}
                      </div>
                    ))}
                  </div>

                  {liveActive.status !== "ended" && (
                    <>
                      <div className="flex flex-wrap gap-1.5 border-t border-aheers-gold/10 px-3 pt-2">
                        {[
                          "Hi — I’m with Aheers, how can I help?",
                          "Thanks for waiting — looking into this now.",
                          "I’ll check stock / delivery and reply shortly.",
                        ].map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => {
                              if (liveActive.status === "waiting") claimSession(liveActive.id, agentName);
                              appendAgentMessage(liveActive.id, q, agentName);
                            }}
                            className="rounded-full bg-aheers-green/60 px-2.5 py-1 text-[10px] font-medium text-white/80 hover:bg-aheers-gold/25 hover:text-aheers-gold"
                          >
                            {q.length > 36 ? `${q.slice(0, 34)}…` : q}
                          </button>
                        ))}
                      </div>
                      <form
                        className="flex gap-2 border-t border-aheers-gold/15 p-3"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const text = liveDraft.trim();
                          if (!text) return;
                          if (liveActive.status === "waiting") claimSession(liveActive.id, agentName);
                          appendAgentMessage(liveActive.id, text, agentName);
                          setLiveDraft("");
                        }}
                      >
                        <input
                          value={liveDraft}
                          onChange={(e) => setLiveDraft(e.target.value)}
                          placeholder="Reply as human…"
                          className="min-w-0 flex-1 rounded-xl border border-aheers-gold/20 bg-aheers-green-dark px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-aheers-gold/50"
                        />
                        <button
                          type="submit"
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-aheers-gold text-aheers-green-dark"
                          aria-label="Send"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Chat dropdown */}
      {panel === "chat" && (
        <div className={`${panelShell} w-[min(calc(100vw-16px),22rem)]`}>
          <div className="flex items-center justify-between border-b border-aheers-gold/15 px-4 py-3">
            <h3 className="font-display text-base font-semibold text-white">Team chat</h3>
            <Link
              href="/admin/chat"
              onClick={() => setPanel(null)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-aheers-gold hover:underline"
            >
              Full chat <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <ul className="max-h-72 overflow-y-auto py-1">
            {INITIAL_THREADS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => {
                    setPanel(null);
                    router.push(`/admin/chat?thread=${t.id}`);
                  }}
                  className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition hover:bg-aheers-green/40"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aheers-gold text-[10px] font-bold text-aheers-green-dark">
                    {initials(t.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-white">{t.name}</span>
                      <span className="shrink-0 text-[10px] text-white/40">{t.lastAt}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-white/50">{t.preview}</span>
                  </span>
                  {t.unread > 0 && (
                    <span className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-aheers-gold px-1 text-[10px] font-bold text-aheers-green-dark">
                      {t.unread}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notifications dropdown */}
      {panel === "notify" && (
        <div className={`${panelShell} w-[min(calc(100vw-16px),22rem)]`}>
          <div className="flex items-center justify-between border-b border-aheers-gold/15 px-4 py-3">
            <h3 className="font-display text-base font-semibold text-white">Notifications</h3>
            <button
              type="button"
              onClick={() => markAllRead("staff")}
              className="text-xs font-semibold text-aheers-gold hover:underline"
            >
              Mark all read
            </button>
          </div>
          <ul className="max-h-72 overflow-y-auto py-1">
            {staffNotes.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-white/40">No notifications</li>
            ) : (
              staffNotes.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      markRead(n.id);
                      setPanel(null);
                      if (n.href) router.push(n.href);
                      else router.push("/admin/notifications");
                    }}
                    className={`flex w-full flex-col gap-0.5 px-4 py-2.5 text-left transition hover:bg-aheers-green/40 ${
                      n.read ? "opacity-60" : ""
                    }`}
                  >
                    <span className="text-sm font-semibold text-white">{n.title}</span>
                    <span className="line-clamp-2 text-xs text-white/50">{n.body}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className="border-t border-aheers-gold/15 px-4 py-2.5">
            <Link
              href="/admin/notifications"
              onClick={() => setPanel(null)}
              className="text-xs font-semibold text-aheers-gold hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}

      {/* Calls panel */}
      {panel === "calls" && (
        <div className={`${panelShell} w-[min(calc(100vw-16px),18rem)] p-4`}>
          <h3 className="font-display text-base font-semibold text-white">Calls</h3>
          <p className="mt-1 text-xs text-white/50">Internal dialler · Greytown ops</p>
          <div className="mt-3 space-y-2">
            {[
              { label: "Internal call", hint: "Team extension" },
              { label: "Video meeting", hint: "Open calendar slot" },
              { label: "Customer line", hint: "033 413 1156" },
            ].map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => {
                  setPanel(null);
                  if (c.label === "Video meeting") router.push("/admin/meetings");
                }}
                className="flex w-full items-center justify-between rounded-xl border border-aheers-gold/15 bg-aheers-green/50 px-3 py-2.5 text-left transition hover:border-aheers-gold/40 hover:bg-aheers-green"
              >
                <span>
                  <span className="block text-sm font-medium text-white">{c.label}</span>
                  <span className="text-[11px] text-white/45">{c.hint}</span>
                </span>
                <Phone className="h-4 w-4 text-aheers-gold" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search panel */}
      {panel === "search" && (
        <div className={`${panelShell} w-[min(calc(100vw-16px),20rem)] p-4`}>
          <h3 className="mb-2 font-display text-base font-semibold text-white">Search Aheers App</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPanel(null);
              const q = searchQ.trim().toLowerCase();
              if (q.includes("ticket")) router.push("/admin/tickets");
              else if (q.includes("lead")) router.push("/admin/leads");
              else if (q.includes("task")) router.push("/admin/tasks");
              else if (q.includes("meet")) router.push("/admin/meetings");
              else if (q.includes("chat")) router.push("/admin/chat");
              else router.push(`/admin/customers`);
            }}
          >
            <input
              autoFocus
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Customers, tickets, leads…"
              className="w-full rounded-xl border border-aheers-gold/20 bg-aheers-green-dark px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-aheers-gold/50 focus:ring-2 focus:ring-aheers-gold/20"
            />
            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-aheers-gold py-2 text-sm font-bold text-aheers-green-dark transition hover:bg-[#d4b03a]"
            >
              Search
            </button>
          </form>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              { href: "/admin/customers", label: "Customers" },
              { href: "/admin/leads", label: "Leads" },
              { href: "/admin/tickets", label: "Tickets" },
              { href: "/admin/meetings", label: "Meetings" },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => setPanel(null)}
                className="rounded-full bg-aheers-green/60 px-2.5 py-1 text-[11px] text-white/80 hover:bg-aheers-gold/20 hover:text-aheers-gold"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile more menu */}
      {panel === "more" && (
        <div className={`${panelShell} w-[min(calc(100vw-16px),16rem)] p-2 sm:hidden`}>
          <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-aheers-gold/70">
            More
          </p>
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => toggle("live")}
              className="flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-white/80 hover:bg-aheers-green/50 hover:text-aheers-gold"
            >
              <Headphones className="h-4 w-4" />
              <span className="text-[10px] font-medium">Live</span>
            </button>
            <button
              type="button"
              onClick={() => toggle("calls")}
              className="flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-white/80 hover:bg-aheers-green/50 hover:text-aheers-gold"
            >
              <Phone className="h-4 w-4" />
              <span className="text-[10px] font-medium">Calls</span>
            </button>
            <button
              type="button"
              onClick={() => toggle("search")}
              className="flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-white/80 hover:bg-aheers-green/50 hover:text-aheers-gold"
            >
              <Search className="h-4 w-4" />
              <span className="text-[10px] font-medium">Search</span>
            </button>
            <Link
              href="/admin/tasks"
              onClick={() => setPanel(null)}
              className="flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-white/80 hover:bg-aheers-green/50 hover:text-aheers-gold"
            >
              <Inbox className="h-4 w-4" />
              <span className="text-[10px] font-medium">Tasks</span>
            </Link>
            <Link
              href="/admin/calendar"
              onClick={() => setPanel(null)}
              className="flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-white/80 hover:bg-aheers-green/50 hover:text-aheers-gold"
            >
              <CalendarDays className="h-4 w-4" />
              <span className="text-[10px] font-medium">Calendar</span>
            </Link>
            <Link
              href="/admin/settings"
              onClick={() => setPanel(null)}
              className="flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-white/80 hover:bg-aheers-green/50 hover:text-aheers-gold"
            >
              <Settings className="h-4 w-4" />
              <span className="text-[10px] font-medium">Settings</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
