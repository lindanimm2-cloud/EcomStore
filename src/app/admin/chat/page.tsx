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
  Paperclip,
  Smile,
  Phone,
  PhoneCall,
  Search,
} from "lucide-react";

export default function TeamChatPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-[#0b0f0d]" />}>
      <TeamChatInner />
    </Suspense>
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

  useEffect(() => {
    const thread = searchParams.get("thread");
    if (thread && INITIAL_THREADS.some((t) => t.id === thread)) {
      setActiveId(thread);
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
          text: `Hi ${col.name.split(" ")[0]} — starting a thread from CRM.`,
          at: "Now",
          mine: true,
        },
      ],
    };
    setThreads((prev) => [neu, ...prev]);
    setActiveId(neu.id);
    flash(`Started chat with ${col.name}`);
  }

  const unreadTotal = threads.reduce((s, t) => s + t.unread, 0);

  return (
    <div className="flex min-h-screen bg-[#0b0f0d]">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col pt-16 text-white">
        <div className="flex flex-wrap items-end justify-between gap-3 px-4 pb-2 md:px-6">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">Team chat</h1>
            <p className="mt-1 text-sm text-white/45">
              Hi {meName} · Internal WhatsApp-style · {unreadTotal} unread
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/meetings"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#141a17] px-3 py-1.5 text-xs font-medium text-white/80 hover:border-aheers-gold/40 hover:text-aheers-gold"
            >
              <Video className="h-3.5 w-3.5" /> Meetings
            </Link>
            <Link
              href="/admin/tasks"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#141a17] px-3 py-1.5 text-xs font-medium text-white/80 hover:border-aheers-gold/40 hover:text-aheers-gold"
            >
              <CheckSquare className="h-3.5 w-3.5" /> Tasks
            </Link>
            <Link
              href="/admin/calendar"
              className="inline-flex items-center gap-1.5 rounded-full border border-aheers-gold/30 bg-aheers-gold/15 px-3 py-1.5 text-xs font-semibold text-aheers-gold"
            >
              <CalendarDays className="h-3.5 w-3.5" /> Calendar
            </Link>
          </div>
        </div>

        <div className="mx-4 mb-4 grid min-h-0 flex-1 gap-3 overflow-hidden rounded-3xl border border-white/10 bg-[#101612] md:mx-6 md:mb-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar chats */}
          <aside className="flex flex-col border-b border-white/10 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between px-4 py-3">
              <h2 className="text-sm font-semibold text-white/90">Chats</h2>
              <button
                type="button"
                onClick={() => flash("Internal call (demo)")}
                className="text-xs font-semibold text-aheers-gold hover:underline"
              >
                Internal call
              </button>
            </div>
            <div className="px-3 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search chats…"
                  className="w-full rounded-xl border border-white/10 bg-[#0b0f0d] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-aheers-gold/40"
                />
              </div>
            </div>
            <ul className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
              {filtered.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => openThread(t.id)}
                    className={`flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                      t.id === active?.id ? "bg-aheers-gold/15 ring-1 ring-aheers-gold/30" : "hover:bg-white/5"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-aheers-gold text-xs font-bold text-aheers-green-dark">
                      {initials(t.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-white">{t.name}</span>
                        <span className="shrink-0 text-[10px] text-white/35">{t.lastAt}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-white/45">{t.preview}</span>
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

            <div className="border-t border-white/10 p-3">
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
                  Start
                </button>
              </div>
            </div>
          </aside>

          {/* Conversation */}
          <section className="flex min-h-[420px] flex-col">
            {active && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-aheers-gold text-sm font-bold text-aheers-green-dark">
                      {initials(active.name)}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{active.name}</p>
                      <p className="text-xs text-white/45">{active.subtitle ?? active.kind}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => flash("Video call started (demo)")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-aheers-gold px-3.5 py-2 text-xs font-bold text-aheers-green-dark"
                    >
                      <Video className="h-3.5 w-3.5" /> Video call
                    </button>
                    <button
                      type="button"
                      onClick={() => flash("Audio call ringing (demo)")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-white/85 hover:border-aheers-gold/40"
                    >
                      <PhoneCall className="h-3.5 w-3.5" /> Audio call
                    </button>
                    {peer?.phone && (
                      <a
                        href={`tel:${peer.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-white/85 hover:border-aheers-gold/40"
                      >
                        <Phone className="h-3.5 w-3.5" /> Phone
                      </a>
                    )}
                    {peer?.whatsapp && (
                      <a
                        href={`https://wa.me/${peer.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-white/85 hover:border-aheers-gold/40"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5 md:px-6">
                  <p className="text-center text-[11px] font-medium text-white/30">Thu, Jul 30</p>
                  {active.messages.map((m) => (
                    <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 sm:max-w-[70%] ${
                          m.mine
                            ? "rounded-br-md bg-aheers-green text-white"
                            : "rounded-bl-md bg-[#1a221e] text-white/90 ring-1 ring-white/5"
                        }`}
                      >
                        {!m.mine && active.kind === "group" && (
                          <p className="mb-0.5 text-[10px] font-semibold text-aheers-gold">{senderLabel(m.senderId)}</p>
                        )}
                        <p className="text-sm leading-relaxed">{m.text}</p>
                        <p className={`mt-1 text-right text-[10px] ${m.mine ? "text-white/60" : "text-white/35"}`}>
                          {m.at}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={send}
                  className="flex items-center gap-2 border-t border-white/10 px-3 py-3 md:px-4"
                >
                  <button
                    type="button"
                    onClick={() => flash("Emoji picker (demo)")}
                    className="rounded-full p-2 text-white/50 hover:bg-white/5 hover:text-aheers-gold"
                    aria-label="Emoji"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => flash("Attach file (demo)")}
                    className="rounded-full p-2 text-white/50 hover:bg-white/5 hover:text-aheers-gold"
                    aria-label="Attach"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 rounded-full border border-white/10 bg-[#0b0f0d] px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-aheers-gold/40"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-aheers-gold px-5 py-2.5 text-sm font-bold text-aheers-green-dark transition hover:bg-[#d4b03a]"
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </section>
        </div>

        {toast && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-aheers-gold px-4 py-2 text-sm font-semibold text-aheers-green-dark shadow-lift">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
