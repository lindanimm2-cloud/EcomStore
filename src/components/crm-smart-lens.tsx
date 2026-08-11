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
  Phone,
  Search,
  Settings,
  Eye,
  Send,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  groupNotifications,
  highestUnreadPriority,
  useNotifications,
} from "@/lib/notifications-context";
import { INITIAL_THREADS, initials } from "@/lib/team-chat";
import {
  appendAgentMessage,
  claimSession,
  endSession,
  subscribeLiveSupport,
  type LiveSession,
} from "@/lib/live-support";
import {
  bootstrapOpsFromSnapshot,
  getOpsSnapshot,
} from "@/lib/ops-snapshot";
import {
  getLensTranscript,
  hasBootstrapped,
  markBootstrapped,
  saveLensTranscript,
  takeSessionGreeting,
  type LensChatMsg,
} from "@/lib/ops-session";
import {
  buildBriefingReply,
  getOpsReply,
  opsChipPrompts,
  pageContextLine,
} from "@/lib/ops-assistant";
import {
  buildBriefingItems,
  defaultLensPos,
  idleStatusLine,
  panelTitle,
  pickTalkNotice,
  readLensDisplay,
  roomName,
  searchCrm,
  speakNotice,
  talkTone,
  type BriefingBucket,
} from "@/lib/smart-lens";
import { DEFAULT_DISPLAY, type DisplaySettings } from "@/lib/settings-data";

type Panel = "lens" | "chat" | "live" | "notify" | "search" | "calls" | null;

const STORAGE_POS = "bh-smart-lens-pos";
const STORAGE_POS_LEGACY = "aheers-smart-lens-pos";
const BUCKETS: BriefingBucket[] = ["Now", "Today", "Upcoming", "Recent"];

export function CrmSmartLens() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { unreadCount, listFor, markAllRead, markRead, markSeen } = useNotifications();
  const staffUnread = unreadCount("staff");
  const staffNotes = listFor("staff");
  const groupedNotes = groupNotifications(staffNotes).slice(0, 10);
  const peakPriority = highestUnreadPriority(staffNotes);
  const chatUnread = INITIAL_THREADS.reduce((s, t) => s + t.unread, 0);

  const [enabled, setEnabled] = useState(true);
  const [display, setDisplay] = useState<DisplaySettings>(DEFAULT_DISPLAY);
  const [expanded, setExpanded] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [pos, setPos] = useState({ x: 16, y: 64 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragMoved = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [searchQ, setSearchQ] = useState("");
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [liveActiveId, setLiveActiveId] = useState<string | null>(null);
  const [liveDraft, setLiveDraft] = useState("");
  const prevWaiting = useRef(0);
  const liveHydrated = useRef(false);
  const [lensMessages, setLensMessages] = useState<LensChatMsg[]>([]);
  const [lensDraft, setLensDraft] = useState("");
  const [lensThinking, setLensThinking] = useState(false);

  useEffect(() => {
    return subscribeLiveSupport((sessions) => {
      setLiveSessions(sessions.filter((s) => s.status !== "ended" || Date.now() - s.updatedAt < 1000 * 60 * 30));
      setLiveActiveId((prev) => {
        if (prev && sessions.some((s) => s.id === prev && s.status !== "ended")) return prev;
        const open = sessions.find((s) => s.status === "waiting" || s.status === "active");
        return open?.id ?? null;
      });
      const waiting = sessions.filter((s) => s.status === "waiting").length;
      if (!liveHydrated.current) {
        liveHydrated.current = true;
        prevWaiting.current = waiting;
        return;
      }
      if (waiting > prevWaiting.current) {
        setPanel((p) => (p == null ? "live" : p));
      }
      prevWaiting.current = waiting;
    });
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const saved = getLensTranscript(user.id);
    if (saved.length) setLensMessages(saved);

    const snap = getOpsSnapshot({ email: user.email, name: user.name });
    if (!hasBootstrapped(user.id)) {
      bootstrapOpsFromSnapshot(snap);
      markBootstrapped(user.id);
    }

    if (takeSessionGreeting(user.id)) {
      const briefing = buildBriefingReply(snap);
      const next: LensChatMsg[] = [
        ...saved,
        { id: `brief-${Date.now()}`, role: "assistant", text: briefing.text },
      ];
      setLensMessages(next);
      saveLensTranscript(user.id, next);
    }
    // pathname only used for first-open; do not re-greet on navigate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.email, user?.name]);

  useEffect(() => {
    if (!user?.id || !lensMessages.length) return;
    saveLensTranscript(user.id, lensMessages);
  }, [lensMessages, user?.id]);

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
      const raw = localStorage.getItem(STORAGE_POS) ?? localStorage.getItem(STORAGE_POS_LEGACY);
      if (raw) {
        setPos(clampPos(JSON.parse(raw)));
      } else {
        setPos(clampPos(defaultLensPos()));
      }
      const d = readLensDisplay();
      setDisplay(d);
      setEnabled(d.smartLensOnLaunch !== false);
    } catch {
      /* ignore */
    }
    function onResize() {
      setPos((p) => clampPos(p));
    }
    function onSettings() {
      const d = readLensDisplay();
      setDisplay(d);
      setEnabled(d.smartLensOnLaunch !== false);
    }
    window.addEventListener("resize", onResize);
    window.addEventListener("aheers:settings", onSettings);
    window.addEventListener("storage", onSettings);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("aheers:settings", onSettings);
      window.removeEventListener("storage", onSettings);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (dragging || dragMoved.current) return;
      if (!rootRef.current?.contains(e.target as Node)) setPanel(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [dragging]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPanel(null);
        setSearchQ("");
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setExpanded(true);
        setPanel((p) => (p === "search" ? null : "search"));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
      setPos((prev) => {
        if (Math.abs(next.x - prev.x) > 3 || Math.abs(next.y - prev.y) > 3) dragMoved.current = true;
        return next;
      });
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
      window.setTimeout(() => {
        dragMoved.current = false;
      }, 80);
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

  function askLens(prompt: string) {
    const text = prompt.trim();
    if (!text || lensThinking) return;
    setLensMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text }]);
    setLensDraft("");
    setLensThinking(true);
    window.setTimeout(() => {
      const reply = getOpsReply(text, { pathname, email: user?.email, name: user?.name });
      setLensMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: reply.text },
      ]);
      setLensThinking(false);
    }, 280);
  }

  const talkCandidate = pickTalkNotice(staffNotes, display);
  const talkId = talkCandidate?.id ?? "";
  const noteSig = staffNotes.map((n) => n.eventId).join("|");

  useEffect(() => {
    if (!talkId || panel) return;
    const t = window.setTimeout(() => markSeen([talkId]), 8000);
    return () => window.clearTimeout(t);
  }, [talkId, panel, markSeen]);

  useEffect(() => {
    for (const n of staffNotes) {
      speakNotice(n, display);
    }
    // noteSig tracks arrivals without depending on a new array each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteSig, display]);

  if (!pathname.startsWith("/admin") || !enabled) return null;

  const firstName = user?.name?.split(" ")[0] ?? "Staff";
  const talkNotice = panel ? null : pickTalkNotice(staffNotes, display);
  const briefing = buildBriefingItems(staffNotes);
  const briefingEmpty = BUCKETS.every((b) => briefing[b].length === 0);
  const searchGroups = searchCrm(searchQ);
  const status =
    panelTitle(panel) ?? talkNotice?.title ?? roomName(pathname) ?? idleStatusLine();
  const bubbleTone = talkNotice ? talkTone(talkNotice.priority) : "default";
  const narrow = typeof window !== "undefined" && window.innerWidth < 768;
  const bubbleSide = !narrow && typeof window !== "undefined" && pos.x > window.innerWidth * 0.45 ? "left" : "right";

  function toggle(next: Panel) {
    setPanel((p) => (p === next ? null : next));
  }

  function beginDrag(clientX: number, clientY: number) {
    dragMoved.current = false;
    dragOffset.current = { x: clientX - pos.x, y: clientY - pos.y };
    setDragging(true);
  }

  function resetPos() {
    const next = clampPos(defaultLensPos());
    setPos(next);
    try {
      localStorage.setItem(STORAGE_POS, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function openBriefing() {
    setPanel((p) => {
      const next = p === "lens" ? null : "lens";
      if (next === "lens") {
        markSeen(staffNotes.filter((n) => !n.seenAt).map((n) => n.id));
      }
      return next;
    });
  }

  function collapseAll() {
    setExpanded(false);
    setPanel(null);
    setSearchQ("");
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
      {talkNotice && (
        <button
          type="button"
          onClick={() => {
            markRead(talkNotice.id);
            markSeen([talkNotice.id]);
            if (talkNotice.href) {
              setPanel(null);
              router.push(talkNotice.href);
            } else {
              openBriefing();
            }
          }}
          className={`absolute z-20 rounded-2xl border px-3 py-2 text-left shadow-[0_12px_32px_rgba(13,61,38,0.45)] ${
            narrow
              ? "left-0 top-[calc(100%+8px)] w-full max-w-[min(20rem,calc(100vw-16px))]"
              : `top-1/2 w-[min(16rem,calc(100vw-5rem))] -translate-y-1/2 ${
                  bubbleSide === "left" ? "right-[calc(100%+10px)]" : "left-[calc(100%+10px)]"
                }`
          } ${
            bubbleTone === "warn"
              ? "border-aheers-red/50 bg-aheers-green-dark text-white"
              : bubbleTone === "accent"
                ? "border-aheers-gold/55 bg-aheers-green-dark text-white"
                : "border-white/15 bg-aheers-green-dark text-white"
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-aheers-gold/80">Lens</p>
          <p className="text-sm font-semibold leading-snug">{talkNotice.title}</p>
          <p className="mt-0.5 line-clamp-2 text-[11px] text-white/60">{talkNotice.body}</p>
        </button>
      )}

      <div
        className={`flex max-w-[calc(100vw-16px)] items-center gap-1 rounded-full border bg-aheers-green-dark/95 px-1.5 py-1.5 backdrop-blur-xl sm:gap-1.5 sm:px-2 ${
          dragging ? "cursor-grabbing" : ""
        } ${
          peakPriority === "urgent" || peakPriority === "critical"
            ? "animate-pulse border-aheers-gold/70 shadow-[0_0_28px_rgba(201,162,39,0.55)]"
            : peakPriority === "high" || peakPriority === "important"
              ? "border-aheers-gold/50 shadow-[0_0_22px_rgba(201,162,39,0.4)]"
              : "border-aheers-gold/25 shadow-[0_12px_40px_rgba(13,61,38,0.4)]"
        }`}
      >
        <button
          type="button"
          aria-label="Drag Smart Lens"
          className="flex h-8 w-6 shrink-0 cursor-grab items-center justify-center rounded-full text-aheers-gold/40 hover:bg-white/5 hover:text-aheers-gold/80 active:cursor-grabbing sm:h-9 sm:w-7"
          onMouseDown={(e) => {
            e.preventDefault();
            beginDrag(e.clientX, e.clientY);
          }}
          onTouchStart={(e) => {
            const t = e.touches[0];
            if (!t) return;
            beginDrag(t.clientX, t.clientY);
          }}
          onDoubleClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            resetPos();
          }}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 items-center gap-2 pr-0.5">
          <button
            type="button"
            title="AI Briefing"
            onClick={openBriefing}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-aheers-gold text-aheers-green-dark shadow-[0_0_18px_rgba(201,162,39,0.55)] sm:h-9 sm:w-9 ${
              panel === "lens" ? "ring-2 ring-white/70" : ""
            } ${lensThinking || talkNotice ? "animate-pulse" : ""}`}
          >
            <Eye className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className="min-w-0 cursor-grab text-left leading-tight active:cursor-grabbing"
            onMouseDown={(e) => {
              if (e.button !== 0) return;
              beginDrag(e.clientX, e.clientY);
            }}
            onTouchStart={(e) => {
              const t = e.touches[0];
              if (!t) return;
              beginDrag(t.clientX, t.clientY);
            }}
            onClick={() => {
              if (dragMoved.current) return;
              setExpanded((v) => !v);
            }}
          >
            <p className="truncate font-display text-sm font-semibold text-white">{firstName}</p>
            <p className="max-w-[9.5rem] truncate text-[11px] text-aheers-gold/75 sm:max-w-[14rem]">{status}</p>
          </button>
        </div>

        {expanded && (
          <>
            <span className="mx-0.5 h-7 w-px shrink-0 bg-aheers-gold/20" />
            <div className="flex max-w-[min(calc(100vw-11rem),22rem)] items-center gap-0 overflow-x-auto">
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
              <button
                type="button"
                className={`${iconBtn} ${panel === "calls" ? iconActive : ""}`}
                title="Calls"
                onClick={() => toggle("calls")}
              >
                <Phone className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={`${iconBtn} ${panel === "search" ? iconActive : ""}`}
                title="Search (Ctrl/Cmd+K)"
                onClick={() => toggle("search")}
              >
                <Search className="h-4 w-4" />
              </button>
              <Link
                href="/admin/leads"
                className={iconBtn}
                title="Intake"
                onClick={() => setPanel(null)}
              >
                <Inbox className="h-4 w-4" />
              </Link>
              <Link
                href="/admin/calendar"
                className={iconBtn}
                title="Calendar"
                onClick={() => setPanel(null)}
              >
                <CalendarDays className="h-4 w-4" />
              </Link>
              <Link
                href="/admin/settings"
                className={iconBtn}
                title="Settings"
                onClick={() => setPanel(null)}
              >
                <Settings className="h-4 w-4" />
              </Link>
            </div>
            <button
              type="button"
              onClick={collapseAll}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aheers-red/90 text-white transition hover:bg-aheers-red sm:h-9 sm:w-9"
              title="Collapse"
              aria-label="Collapse"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </>
        )}
      </div>

      {panel === "lens" && (
        <div className={`${panelShell} flex w-[min(calc(100vw-16px),24rem)] flex-col`}>
          <div className="border-b border-aheers-gold/15 px-4 py-3">
            <h3 className="font-display text-base font-semibold text-white">
              {roomName(pathname) ?? "AI Briefing"}
            </h3>
            <p className="text-[11px] text-aheers-gold/75">
              {pageContextLine(
                pathname,
                getOpsSnapshot({ email: user?.email, name: user?.name })
              )}
            </p>
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto px-3 py-3">
            {briefingEmpty ? (
              <p className="px-1 py-6 text-center text-sm text-white/55">
                No further updates. I&apos;ll speak only if something changes.
              </p>
            ) : (
              BUCKETS.map((bucket) =>
                briefing[bucket].length ? (
                  <div key={bucket}>
                    <p className="mb-1 px-1 text-[10px] font-bold uppercase tracking-wider text-aheers-gold/65">
                      {bucket}
                    </p>
                    <ul className="space-y-0.5">
                      {briefing[bucket].map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => {
                              markRead(item.id);
                              markSeen([item.id]);
                              setPanel(null);
                              if (item.href) router.push(item.href);
                            }}
                            className="w-full rounded-xl px-2.5 py-2 text-left hover:bg-aheers-green/45"
                          >
                            <span className="block text-sm font-semibold text-white">{item.title}</span>
                            <span className="mt-0.5 block line-clamp-2 text-[11px] text-white/50">{item.body}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )
            )}
            {lensMessages.slice(-3).map((m) => (
              <div
                key={m.id}
                className={`whitespace-pre-wrap rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${
                  m.role === "user"
                    ? "ml-8 bg-aheers-gold/20 text-white"
                    : "mr-4 bg-aheers-green/50 text-white/80"
                }`}
              >
                {m.text}
              </div>
            ))}
            {lensThinking && (
              <p className="text-[11px] text-aheers-gold/80">Looking at the CRM…</p>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 border-t border-aheers-gold/10 px-3 py-2">
            {opsChipPrompts().map((c) => (
              <button
                key={c.label}
                type="button"
                disabled={lensThinking}
                onClick={() => askLens(c.prompt)}
                className="rounded-full bg-aheers-green/60 px-2.5 py-1 text-[10px] font-semibold text-aheers-gold hover:bg-aheers-gold/20 disabled:opacity-50"
              >
                {c.label}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2 border-t border-aheers-gold/15 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              askLens(lensDraft);
            }}
          >
            <input
              value={lensDraft}
              onChange={(e) => setLensDraft(e.target.value)}
              placeholder="Ask about orders, stock, deliveries…"
              className="min-w-0 flex-1 rounded-xl border border-aheers-gold/20 bg-aheers-green-dark px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-aheers-gold/50"
            />
            <button
              type="submit"
              disabled={lensThinking || !lensDraft.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-aheers-gold text-aheers-green-dark disabled:opacity-40"
              aria-label="Ask Lens"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

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
            {groupedNotes.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-white/40">No notifications</li>
            ) : (
              groupedNotes.map((n) => (
                <li key={n.key}>
                  <button
                    type="button"
                    onClick={() => {
                      n.ids.forEach((id) => markRead(id));
                      setPanel(null);
                      if (n.href) router.push(n.href);
                      else router.push("/admin/notifications");
                    }}
                    className={`flex w-full flex-col gap-0.5 px-4 py-2.5 text-left transition hover:bg-aheers-green/40 ${
                      n.unread ? "" : "opacity-60"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-aheers-gold/60">
                      {n.category}
                    </span>
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

      {panel === "search" && (
        <div className={`${panelShell} w-[min(calc(100vw-16px),22rem)] p-4`}>
          <h3 className="mb-2 font-display text-base font-semibold text-white">Firm search</h3>
          <input
            autoFocus
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Type at least 2 characters…"
            className="w-full rounded-xl border border-aheers-gold/20 bg-aheers-green-dark px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-aheers-gold/50 focus:ring-2 focus:ring-aheers-gold/20"
          />
          <div className="mt-3 max-h-64 space-y-3 overflow-y-auto">
            {searchQ.trim().length < 2 ? (
              <p className="text-center text-xs text-white/40">Search Matters, Clients, Tasks, Intake, Team.</p>
            ) : searchGroups.length === 0 ? (
              <p className="text-center text-xs text-white/40">No matches.</p>
            ) : (
              searchGroups.map((g) => (
                <div key={g.group}>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-aheers-gold/65">
                    {g.group === "Orders"
                      ? "Matters"
                      : g.group === "Customers"
                        ? "Clients"
                        : g.group}
                  </p>
                  <ul>
                    {g.hits.map((hit) => (
                      <li key={`${hit.group}-${hit.href}-${hit.label}`}>
                        <button
                          type="button"
                          onClick={() => {
                            setPanel(null);
                            setSearchQ("");
                            router.push(hit.href);
                          }}
                          className="flex w-full flex-col rounded-xl px-2 py-1.5 text-left hover:bg-aheers-green/45"
                        >
                          <span className="text-sm font-semibold text-white">{hit.label}</span>
                          <span className="truncate text-[11px] text-white/45">{hit.hint}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
