"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import {
  INITIAL_THREADS,
  TEAM_COLLEAGUES,
  ChatThread,
  initials,
  senderLabel,
} from "@/lib/team-chat";
import { PrettySelect } from "@/components/pretty-select";
import { useAuth } from "@/lib/auth-context";
import {
  CalendarDays,
  CheckSquare,
  Video,
  Smile,
  Phone,
  PhoneCall,
  Search,
  ArrowLeft,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function TeamChatPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-[#0b0f0d]" />}>
      <TeamChatInner />
    </Suspense>
  );
}

function PreviewLine({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const long = text.length > 52;
  return (
    <div className="mt-0.5">
      <p className={`text-xs leading-snug text-white/50 ${expanded ? "whitespace-normal" : "line-clamp-1"}`}>
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="mt-1 inline-flex items-center gap-0.5 text-[11px] font-semibold text-aheers-gold"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              Show more <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

function TeamChatInner() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeId, setActiveId] = useState(INITIAL_THREADS[0].id);
  const [draft, setDraft] = useState("");
  const [q, setQ] = useState("");
  const [newPeer, setNewPeer] = useState(TEAM_COLLEAGUES[0].id);
  const [toast, setToast] = useState("");
  /** Mobile: list vs open conversation (desktop always shows both) */
  const [mobilePane, setMobilePane] = useState<"list" | "thread">("list");
  const [newChatOpen, setNewChatOpen] = useState(false);

  useEffect(() => {
    const thread = searchParams.get("thread");
    if (thread && INITIAL_THREADS.some((t) => t.id === thread)) {
      setActiveId(thread);
      setMobilePane("thread");
      setThreads((prev) => prev.map((t) => (t.id === thread ? { ...t, unread: 0 } : t)));
    }
  }, [searchParams]);

  const active = threads.find((t) => t.id === activeId) ?? threads[0];
  const peer = TEAM_COLLEAGUES.find((c) => c.id === active?.peerId);
  const meName = user?.name?.split(" ")[0] ?? "You";

  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    return threads.filter(
      (t) =>
        !needle ||
        t.name.toLowerCase().includes(needle) ||
        t.preview.toLowerCase().includes(needle)
    );
  }, [threads, q]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  function openThread(id: string) {
    setActiveId(id);
    setMobilePane("thread");
    setNewChatOpen(false);
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
  }

  function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !active) return;
    const msg = {
      id: `m-${Date.now()}`,
      senderId: "me",
      text,
      at: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }),
      mine: true,
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === active.id
          ? { ...t, messages: [...t.messages, msg], preview: text, lastAt: "Now" }
          : t
      )
    );
    setDraft("");
  }

  function startChat() {
    const col = TEAM_COLLEAGUES.find((c) => c.id === newPeer);
    if (!col) return;
    const existing = threads.find((t) => t.peerId === col.id && t.kind === "dm");
    if (existing) {
      openThread(existing.id);
      flash(`Opened chat with ${col.name}`);
      return;
    }
    const neu: ChatThread = {
      id: `ch-${col.id}-${Date.now()}`,
      kind: "dm",
      name: col.name,
      subtitle: `${col.title} · ${col.branch}`,
      peerId: col.id,
      unread: 0,
      lastAt: "Now",
      preview: "New conversation",
      messages: [
        {
          id: "m0",
          senderId: "me",
          text: `Hi ${col.name.split(" ")[0]} — starting a thread from Aheers App.`,
          at: "Now",
          mine: true,
        },
      ],
    };
    setThreads((prev) => [neu, ...prev]);
    setActiveId(neu.id);
    setMobilePane("thread");
    setNewChatOpen(false);
    flash(`Started chat with ${col.name}`);
  }

  const unreadTotal = threads.reduce((s, t) => s + t.unread, 0);
  const showList = mobilePane === "list";
  const showThread = mobilePane === "thread";

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] max-w-[100vw] overflow-hidden bg-[#0b0f0d] lg:h-dvh">
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden text-white">
        {/* Page chrome — list only on mobile */}
        <div
          className={`shrink-0 px-3 pb-2 pt-2 md:px-6 md:pt-3 ${
            showThread ? "hidden lg:block" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h1 className="font-display text-xl font-semibold tracking-tight text-white md:text-3xl">
                Team chat
              </h1>
              <p className="mt-0.5 truncate text-xs text-white/45 md:text-sm">
                Hi {meName} · {unreadTotal} unread
              </p>
            </div>
            <div className="flex shrink-0 gap-1.5 overflow-x-auto">
              <Link
                href="/admin/meetings"
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#141a17] px-2.5 py-1.5 text-[11px] font-medium text-white/80 md:px-3 md:text-xs"
              >
                <Video className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Meetings</span>
              </Link>
              <Link
                href="/admin/tasks"
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#141a17] px-2.5 py-1.5 text-[11px] font-medium text-white/80 md:px-3 md:text-xs"
              >
                <CheckSquare className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tasks</span>
              </Link>
              <Link
                href="/admin/calendar"
                className="inline-flex items-center gap-1 rounded-full border border-aheers-gold/30 bg-aheers-gold/15 px-2.5 py-1.5 text-[11px] font-semibold text-aheers-gold md:px-3 md:text-xs"
              >
                <CalendarDays className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Calendar</span>
              </Link>
            </div>
          </div>
        </div>

        <div
          className={`grid min-h-0 min-w-0 flex-1 overflow-hidden bg-[#101612] lg:mx-6 lg:mb-6 lg:grid-cols-[minmax(260px,300px)_1fr] lg:rounded-3xl lg:border lg:border-white/10 ${
            showThread
              ? "mx-0 mb-0 rounded-none border-0"
              : "mx-2 mb-2 rounded-2xl border border-white/10 sm:mx-4 sm:mb-4"
          }`}
        >
          {/* Chat list */}
          <aside
            className={`min-h-0 min-w-0 flex-col border-white/10 lg:flex lg:border-r ${
              showList ? "flex" : "hidden"
            }`}
          >
            <div className="flex shrink-0 items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
              <h2 className="text-sm font-semibold text-white/90">Chats</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => flash("Internal call (demo)")}
                  className="text-xs font-semibold text-aheers-gold hover:underline"
                >
                  Call
                </button>
                <button
                  type="button"
                  onClick={() => setNewChatOpen((v) => !v)}
                  className="inline-flex min-h-9 items-center gap-1 rounded-full bg-aheers-gold px-3 py-1.5 text-[11px] font-bold text-aheers-green-dark lg:hidden"
                >
                  <Plus className="h-3.5 w-3.5" /> New
                </button>
              </div>
            </div>

            <div className="shrink-0 px-3 pb-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search chats…"
                  style={{ backgroundColor: "#0b0f0d", color: "#fff" }}
                  className="w-full rounded-xl border border-white/10 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 outline-none [color-scheme:dark] focus:border-aheers-gold/40"
                />
              </div>
            </div>

            <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-2 pb-3">
              {filtered.map((t) => (
                <li key={t.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openThread(t.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") openThread(t.id);
                    }}
                    className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl px-3 py-3 text-left transition active:scale-[0.99] ${
                      t.id === active?.id
                        ? "bg-aheers-gold/15 ring-1 ring-aheers-gold/30"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-aheers-gold text-xs font-bold text-aheers-green-dark">
                      {initials(t.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-white">{t.name}</span>
                        <span className="shrink-0 text-[10px] text-white/35">{t.lastAt}</span>
                      </span>
                      <PreviewLine text={t.preview} />
                    </span>
                    {t.unread > 0 && (
                      <span className="mt-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-aheers-gold px-1 text-[10px] font-bold text-aheers-green-dark">
                        {t.unread}
                      </span>
                    )}
                  </div>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-4 py-10 text-center text-sm text-white/40">No chats match your search</li>
              )}
            </ul>

            <div
              className={`shrink-0 border-t border-white/10 p-3 ${
                newChatOpen ? "block" : "hidden lg:block"
              }`}
            >
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">New chat</p>
              <div className="space-y-2">
                <PrettySelect
                  dark
                  value={newPeer}
                  onChange={setNewPeer}
                  options={TEAM_COLLEAGUES.map((c) => ({
                    value: c.id,
                    label: c.name,
                    hint: `${c.title} · ${c.branch}`,
                  }))}
                />
                <button
                  type="button"
                  onClick={startChat}
                  className="w-full rounded-full bg-aheers-gold py-2.5 text-sm font-bold text-aheers-green-dark transition hover:bg-[#d4b03a]"
                >
                  Start chat
                </button>
              </div>
            </div>
          </aside>

          {/* Conversation */}
          <section
            className={`min-h-0 min-w-0 flex-col lg:flex ${showThread ? "flex" : "hidden"}`}
          >
            {active && (
              <>
                <div className="flex shrink-0 items-center gap-1 border-b border-white/10 bg-[#0d1210] px-1 py-2 sm:gap-3 sm:px-4 sm:py-3">
                  <button
                    type="button"
                    onClick={() => setMobilePane("list")}
                    className="inline-flex min-h-11 min-w-[4.5rem] shrink-0 items-center gap-1 rounded-xl px-2 text-sm font-semibold text-aheers-gold hover:bg-white/5 active:bg-white/10 lg:hidden"
                    aria-label="Back to chats"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Chats
                  </button>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-aheers-gold text-sm font-bold text-aheers-green-dark">
                    {initials(active.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{active.name}</p>
                    <p className="truncate text-[11px] text-white/45 sm:text-xs">
                      {active.subtitle ?? active.kind}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => flash("Video call started (demo)")}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-aheers-gold text-aheers-green-dark sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-2"
                      aria-label="Video call"
                      title="Video call"
                    >
                      <Video className="h-4 w-4" />
                      <span className="hidden text-xs font-bold sm:inline">Video</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => flash("Audio call ringing (demo)")}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/85 hover:border-aheers-gold/40 sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-2"
                      aria-label="Audio call"
                    >
                      <PhoneCall className="h-4 w-4" />
                      <span className="hidden text-xs font-semibold sm:inline">Audio</span>
                    </button>
                    {peer?.phone && (
                      <a
                        href={`tel:${peer.phone.replace(/\s/g, "")}`}
                        className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/85 sm:inline-flex"
                        aria-label="Phone"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4 md:px-6">
                  <p className="text-center text-[11px] font-medium text-white/30">Thu, Jul 30</p>
                  {active.messages.map((m) => (
                    <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`w-fit max-w-[min(88%,20rem)] rounded-2xl px-3.5 py-2.5 sm:max-w-[min(70%,26rem)] ${
                          m.mine
                            ? "rounded-br-md bg-aheers-green text-white"
                            : "rounded-bl-md bg-[#1a221e] text-white/90 ring-1 ring-white/5"
                        }`}
                      >
                        {!m.mine && active.kind === "group" && (
                          <p className="mb-0.5 text-[10px] font-semibold text-aheers-gold">
                            {senderLabel(m.senderId)}
                          </p>
                        )}
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{m.text}</p>
                        <p
                          className={`mt-1 text-[10px] ${
                            m.mine ? "text-right text-white/60" : "text-right text-white/35"
                          }`}
                        >
                          {m.at}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={send}
                  className="flex min-w-0 shrink-0 items-center gap-1.5 border-t border-white/10 bg-[#0d1210] px-2 py-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] sm:gap-2 sm:px-4"
                >
                  <button
                    type="button"
                    onClick={() => flash("Emoji picker (demo)")}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/50 hover:bg-white/5 hover:text-aheers-gold"
                    aria-label="Emoji"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message…"
                    enterKeyHint="send"
                    style={{ backgroundColor: "#0b0f0d", color: "#fff" }}
                    className="min-h-11 min-w-0 flex-1 rounded-full border border-white/15 px-4 py-2.5 text-base text-white placeholder:text-white/35 outline-none [color-scheme:dark] focus:border-aheers-gold/40 sm:text-sm"
                  />
                  <button
                    type="submit"
                    className="flex min-h-11 shrink-0 items-center justify-center rounded-full bg-aheers-gold px-5 text-sm font-bold text-aheers-green-dark transition hover:bg-[#d4b03a]"
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </section>
        </div>

        {toast && (
          <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-aheers-gold px-4 py-2 text-sm font-semibold text-aheers-green-dark shadow-lift lg:bottom-6">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
