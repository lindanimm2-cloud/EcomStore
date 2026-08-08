"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Headphones, MessageCircle, Sparkles, X, Send, UserRound, Phone, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { STORES } from "@/lib/stores";
import { StoreSlug } from "@/lib/types";
import {
  ASSISTANT_QUICK_CHIPS,
  getAssistantReply,
  thinkingDelayMs,
  type AssistantLink,
} from "@/lib/assistant-knowledge";
import {
  appendCustomerMessage,
  endSession,
  requestHuman,
  subscribeLiveSupport,
  type LiveSession,
} from "@/lib/live-support";

const WHATSAPP_NUMBER = "27665290079";
const WHATSAPP_TEXT = encodeURIComponent("Hi Aheers — I need help with an order / store enquiry.");

type ChatMsg = {
  id: string;
  role: "user" | "assistant" | "agent" | "system";
  text: string;
  links?: AssistantLink[];
  streaming?: boolean;
};

function resolveStore(pathname: string, activeStore: StoreSlug | null): StoreSlug | null {
  if (pathname === "/" || pathname.startsWith("/store/supermarket")) return "supermarket";
  const m = pathname.match(/^\/store\/([^/]+)/);
  if (m && STORES.some((s) => s.slug === m[1])) return m[1] as StoreSlug;
  return activeStore;
}

function TypingDots() {
  return (
    <div className="flex items-end gap-2 animate-msg-in" aria-label="Assistant is typing">
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-aheers-green to-aheers-green-dark text-aheers-gold shadow-soft">
        <Sparkles className="h-3.5 w-3.5 animate-sparkle-spin" />
        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 animate-soft-breathe rounded-full bg-aheers-gold ring-2 ring-aheers-mist" />
      </span>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3.5 shadow-soft ring-1 ring-aheers-green/10">
        <span className="h-2 w-2 animate-typing-dot rounded-full bg-aheers-green [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-typing-dot rounded-full bg-aheers-green [animation-delay:160ms]" />
        <span className="h-2 w-2 animate-typing-dot rounded-full bg-aheers-green [animation-delay:320ms]" />
      </div>
    </div>
  );
}

function AliveWaves({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span className="ml-1 inline-flex h-3 items-end gap-0.5" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-0.5 origin-bottom rounded-full bg-aheers-gold animate-wave-bar"
          style={{ height: 10, animationDelay: `${i * 120}ms` }}
        />
      ))}
    </span>
  );
}

function isExternalHref(href: string) {
  return href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
}

function ChatLink({
  href,
  label,
  onNavigate,
  className,
  style,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
  className: string;
  style?: React.CSSProperties;
}) {
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        style={style}
        className={className}
      >
        {label}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onNavigate} style={style} className={className}>
      {label}
    </Link>
  );
}

function FabOrbit() {
  return (
    <span className="pointer-events-none absolute inset-0 animate-orbit-spin" aria-hidden>
      <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-aheers-gold shadow-[0_0_8px_rgba(201,162,39,0.8)]" />
      <span className="absolute bottom-1 left-1 h-1 w-1 rounded-full bg-white/70" />
    </span>
  );
}

export function FloatingHelpButtons() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { storesWithCart, activeStore } = useCart();
  const storeSlug = resolveStore(pathname, activeStore);
  const [aiOpen, setAiOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi — I’m the Aheers assistant. Ask about any store, product, delivery, rewards, or hours.",
      links: [
        { label: "Stores", href: "/" },
        { label: "Specials", href: "/specials" },
        { label: "Delivery", href: "/delivery" },
      ],
    },
  ]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [humanMode, setHumanMode] = useState(false);
  const [liveSession, setLiveSession] = useState<LiveSession | null>(null);
  const [pulse, setPulse] = useState(true);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const thinkRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const seenAgentIds = useRef<Set<string>>(new Set());

  const cartVisible =
    storesWithCart.length > 0 &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/driver") &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/register") &&
    !/\/store\/[^/]+\/(cart|checkout)(?:\/|$)/.test(pathname);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 10000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, thinking, aiOpen]);

  useEffect(() => {
    return subscribeLiveSupport((sessions) => {
      const mine =
        (sessionIdRef.current && sessions.find((s) => s.id === sessionIdRef.current)) ||
        sessions.find((s) => s.status === "waiting" || s.status === "active");
      setLiveSession(mine ?? null);
      if (!mine || mine.status === "ended") {
        if (mine?.status === "ended") sessionIdRef.current = null;
        if (!mine || mine.status === "ended") setHumanMode(false);
        return;
      }
      setHumanMode(true);
      sessionIdRef.current = mine.id;
      for (const m of mine.messages) {
        if (m.role !== "agent" && m.role !== "system") continue;
        if (seenAgentIds.current.has(m.id)) continue;
        seenAgentIds.current.add(m.id);
        setMessages((prev) => [
          ...prev,
          {
            id: m.id,
            role: m.role === "system" ? "system" : "agent",
            text: m.text,
          },
        ]);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (thinkRef.current) clearTimeout(thinkRef.current);
      if (streamRef.current) clearInterval(streamRef.current);
    };
  }, []);

  if (
    pathname.startsWith("/login/staff") ||
    pathname.startsWith("/login/driver") ||
    pathname.startsWith("/login/trade") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/driver") ||
    pathname.startsWith("/trade")
  ) {
    return null;
  }

  function clearStreams() {
    if (thinkRef.current) clearTimeout(thinkRef.current);
    if (streamRef.current) clearInterval(streamRef.current);
    thinkRef.current = null;
    streamRef.current = null;
  }

  /** Thinking dots → character typewriter → links appear when done */
  function pushAssistant(reply: ReturnType<typeof getAssistantReply>) {
    clearStreams();
    setBusy(true);
    setThinking(true);

    const full = reply.text;
    const msgId = `a-${Date.now()}`;

    thinkRef.current = setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        { id: msgId, role: "assistant", text: "", links: undefined, streaming: true },
      ]);

      let i = 0;
      const step = Math.max(1, Math.floor(full.length / 90));
      streamRef.current = setInterval(() => {
        i = Math.min(full.length, i + step);
        const done = i >= full.length;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId
              ? {
                  ...m,
                  text: full.slice(0, i),
                  streaming: !done,
                  links: done ? reply.links : undefined,
                }
              : m
          )
        );
        if (done) {
          if (streamRef.current) clearInterval(streamRef.current);
          streamRef.current = null;
          setBusy(false);
        }
      }, 18);
    }, thinkingDelayMs(full));
  }

  function startHuman(topic?: string) {
    const session = requestHuman({
      customerName: user?.name ?? "App customer",
      storeHint: storeSlug ? STORES.find((s) => s.slug === storeSlug)?.shortName : undefined,
      topic: topic ?? "Assistant handoff",
      priorMessages: messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role as "user" | "assistant", text: m.text })),
    });
    sessionIdRef.current = session.id;
    seenAgentIds.current = new Set(session.messages.map((m) => m.id));
    setLiveSession(session);
    setHumanMode(true);
    setConfirmEnd(false);
    setContactsOpen(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        role: "system",
        text: "You’re in the live queue. An agent will reply here — keep typing while you wait. Use Contacts below for phone, email, or WhatsApp.",
      },
    ]);
  }

  function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");

    const userMsg: ChatMsg = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    const wantsHuman =
      /talk to (a )?human|live (agent|chat|support)|speak to (someone|a person|agent)|real person/i.test(
        text
      );

    if (humanMode && liveSession && liveSession.status !== "ended") {
      appendCustomerMessage(liveSession.id, text);
      return;
    }

    if (wantsHuman) {
      pushAssistant(getAssistantReply(text, storeSlug));
      setTimeout(() => startHuman(text), thinkingDelayMs("Connecting…") + 400);
      return;
    }

    pushAssistant(getAssistantReply(text, storeSlug));
  }

  function onChip(prompt: string) {
    if (busy) return;
    if (prompt.toLowerCase() === "talk to human") {
      setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: "Talk to a human" }]);
      pushAssistant(getAssistantReply("talk to human", storeSlug));
      setTimeout(() => startHuman("Talk to human"), thinkingDelayMs("Connecting…") + 400);
      return;
    }
    setDraft("");
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: prompt }]);
    pushAssistant(getAssistantReply(prompt, storeSlug));
  }

  const statusLabel = humanMode
    ? liveSession?.status === "active"
      ? `Live · ${liveSession.claimedBy ?? "agent"}`
      : "Waiting for agent…"
    : thinking || busy
      ? "Thinking…"
      : "Online · ready to help";

  const hasDraft = draft.trim().length > 0;

  return (
    <>
      <div
        className={`fixed right-6 z-40 flex flex-col items-end gap-3 max-md:bottom-[calc(5.75rem+env(safe-area-inset-bottom))] ${
          cartVisible ? "md:bottom-24 bottom-[calc(10.5rem+env(safe-area-inset-bottom))]" : "md:bottom-6"
        }`}
      >
        <button
          type="button"
          onClick={() => setAiOpen(true)}
          className={`group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-aheers-green-light via-aheers-green to-aheers-green-dark text-white shadow-lift transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(13,61,38,0.35)] ${
            pulse || !aiOpen ? "animate-assistant-pulse" : ""
          }`}
          aria-label="AI assistant"
          title="AI assistant"
        >
          <FabOrbit />
          <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.25)_50%,transparent_80%)] bg-[length:200%_100%] animate-shimmer opacity-60" />
          <Sparkles className="relative z-[1] h-6 w-6 animate-sparkle-spin drop-shadow" />
          <span className="absolute -bottom-0.5 -right-0.5 z-[2] h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white animate-soft-breathe" />
          {humanMode && liveSession?.status === "waiting" && (
            <span className="absolute -right-0.5 -top-0.5 z-[2] h-3.5 w-3.5 rounded-full bg-aheers-gold ring-2 ring-white animate-ping" />
          )}
        </button>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:-translate-y-1 hover:brightness-110"
          aria-label="WhatsApp Aheers"
          title="WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>

      {aiOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-end bg-black/35 p-3 backdrop-blur-[2px] sm:p-4 animate-fade-in"
          onClick={() => setAiOpen(false)}
        >
          <div
            className="flex h-[min(38rem,88vh)] w-full max-w-md animate-panel-rise flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_80px_rgba(13,61,38,0.28)] ring-1 ring-aheers-green/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-aheers-green-dark via-[#0f4a2e] to-aheers-green px-4 py-3.5 text-white">
              <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-aheers-gold/15 blur-2xl animate-float" />
              <div className="pointer-events-none absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-aheers-gold/30 to-aheers-gold/10 text-aheers-gold ring-1 ring-aheers-gold/30 shadow-[0_0_20px_rgba(201,162,39,0.25)]">
                    {humanMode ? (
                      <Headphones className="h-5 w-5 animate-float" />
                    ) : (
                      <Sparkles className="h-5 w-5 animate-sparkle-spin" />
                    )}
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-aheers-green-dark ${
                        thinking || busy
                          ? "bg-aheers-gold animate-soft-breathe"
                          : humanMode
                            ? "bg-sky-400 animate-soft-breathe"
                            : "bg-emerald-400 animate-soft-breathe"
                      }`}
                    />
                  </span>
                  <div>
                    <p className="flex items-center text-sm font-semibold tracking-tight">
                      Aheers assistant
                      <AliveWaves active={thinking || busy} />
                    </p>
                    <p className="text-[10px] text-white/60 transition-all">{statusLabel}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAiOpen(false)}
                  className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={listRef}
              className="relative flex-1 space-y-3.5 overflow-y-auto px-4 py-4"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at top, rgba(27,94,59,0.06), transparent 55%), linear-gradient(180deg, #f3f6f4 0%, #eef3f0 100%)",
              }}
            >
              {messages.map((m, idx) => (
                <div
                  key={m.id}
                  className={`animate-msg-in ${m.role === "user" ? "ml-auto" : "flex items-end gap-2"}`}
                  style={{ animationDelay: `${Math.min(idx, 4) * 40}ms` }}
                >
                  {m.role === "system" ? (
                    <p className="mx-auto max-w-[90%] rounded-full bg-aheers-green/10 px-3 py-1.5 text-center text-[11px] font-medium text-aheers-green-dark ring-1 ring-aheers-green/10">
                      {m.text}
                    </p>
                  ) : (
                    <>
                      {(m.role === "assistant" || m.role === "agent") && (
                        <span
                          className={`mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            m.role === "agent"
                              ? "bg-aheers-green-dark text-aheers-gold"
                              : "bg-gradient-to-br from-aheers-green to-aheers-green-dark text-aheers-gold"
                          }`}
                        >
                          {m.role === "agent" ? (
                            <UserRound className="h-3.5 w-3.5" />
                          ) : (
                            <Sparkles className={`h-3.5 w-3.5 ${m.streaming ? "animate-sparkle-spin" : ""}`} />
                          )}
                        </span>
                      )}
                      <div
                        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          m.role === "user"
                            ? "ml-auto rounded-br-md bg-gradient-to-br from-aheers-green to-aheers-green-dark text-white shadow-[0_8px_24px_rgba(27,94,59,0.25)]"
                            : m.role === "agent"
                              ? "rounded-bl-md bg-aheers-green-dark text-white shadow-soft"
                              : "rounded-bl-md bg-white/95 text-gray-800 shadow-soft ring-1 ring-aheers-green/10 backdrop-blur-sm"
                        }`}
                      >
                        {m.role === "agent" && (
                          <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-aheers-gold">
                            <UserRound className="h-3 w-3" /> Agent
                          </p>
                        )}
                        <p className="whitespace-pre-wrap">
                          {m.text}
                          {m.streaming && (
                            <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-pulse bg-aheers-green align-middle" />
                          )}
                        </p>
                        {m.links && m.links.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {m.links.map((l, li) => (
                              <ChatLink
                                key={l.href + l.label}
                                href={l.href}
                                label={l.label}
                                onNavigate={() => setAiOpen(false)}
                                style={{ animationDelay: `${li * 60}ms` }}
                                className={`animate-chip-in rounded-full px-2.5 py-1 text-[11px] font-semibold transition hover:scale-[1.03] active:scale-95 ${
                                  m.role === "agent"
                                    ? "bg-white/15 text-aheers-gold hover:bg-white/25"
                                    : "bg-aheers-mist text-aheers-green hover:bg-aheers-green hover:text-white"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
              {thinking && <TypingDots />}
            </div>

            {!humanMode && (
              <div className="flex gap-1.5 overflow-x-auto border-t border-aheers-green/5 bg-white/90 px-3 py-2.5 backdrop-blur-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {ASSISTANT_QUICK_CHIPS.map((c, i) => (
                  <button
                    key={c.label}
                    type="button"
                    disabled={busy}
                    onClick={() => onChip(c.prompt)}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className="animate-chip-in shrink-0 rounded-full bg-aheers-mist px-3 py-1.5 text-[11px] font-semibold text-aheers-green-dark transition hover:-translate-y-0.5 hover:bg-aheers-green hover:text-white hover:shadow-soft active:scale-95 disabled:opacity-50"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={send} className="flex gap-2 border-t border-aheers-green/5 bg-white p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={humanMode ? "Message the agent…" : "Ask about products, stores, delivery…"}
                disabled={busy && !humanMode}
                className="flex-1 rounded-2xl border border-aheers-green/15 bg-aheers-mist/40 px-3.5 py-2.5 text-sm outline-none transition focus:border-aheers-green focus:bg-white focus:ring-2 focus:ring-aheers-green/15 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!hasDraft || (busy && !humanMode)}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white transition disabled:opacity-40 ${
                  hasDraft
                    ? "animate-send-pop bg-gradient-to-br from-aheers-green-light to-aheers-green-dark shadow-lift"
                    : "bg-aheers-green"
                }`}
                aria-label="Send"
              >
                <Send className={`h-4 w-4 ${hasDraft ? "translate-x-px -translate-y-px" : ""}`} />
              </button>
            </form>

            {humanMode && contactsOpen && (
              <div className="animate-fade-up border-t border-aheers-green/10 bg-aheers-mist/50 px-3 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-aheers-green-dark">
                    Contact Aheers
                  </p>
                  <button
                    type="button"
                    onClick={() => setContactsOpen(false)}
                    className="text-[10px] font-semibold text-gray-400 hover:text-aheers-green"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:0334131156"
                    className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-left shadow-soft ring-1 ring-aheers-green/10"
                  >
                    <Phone className="h-3.5 w-3.5 text-aheers-green" />
                    <span>
                      <span className="block text-[11px] font-bold text-aheers-charcoal">Switchboard</span>
                      <span className="text-[10px] text-gray-400">033 413 1156</span>
                    </span>
                  </a>
                  <a
                    href={`tel:${(STORES.find((s) => s.slug === storeSlug)?.phone ?? "0334131156").replace(/\s/g, "")}`}
                    className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-left shadow-soft ring-1 ring-aheers-green/10"
                  >
                    <Phone className="h-3.5 w-3.5 text-aheers-green" />
                    <span>
                      <span className="block text-[11px] font-bold text-aheers-charcoal">
                        {STORES.find((s) => s.slug === storeSlug)?.shortName ?? "Store"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {STORES.find((s) => s.slug === storeSlug)?.phone ?? "033 413 1156"}
                      </span>
                    </span>
                  </a>
                  <a
                    href="mailto:support@aheers.co.za?subject=Aheers%20help"
                    className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-left shadow-soft ring-1 ring-aheers-green/10"
                  >
                    <Mail className="h-3.5 w-3.5 text-aheers-green" />
                    <span>
                      <span className="block text-[11px] font-bold text-aheers-charcoal">Email</span>
                      <span className="truncate text-[10px] text-gray-400">support@aheers.co.za</span>
                    </span>
                  </a>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-left shadow-soft ring-1 ring-aheers-green/10"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                    <span>
                      <span className="block text-[11px] font-bold text-aheers-charcoal">WhatsApp</span>
                      <span className="text-[10px] text-gray-400">066 529 0079</span>
                    </span>
                  </a>
                </div>
                <Link
                  href="/contact"
                  onClick={() => setAiOpen(false)}
                  className="mt-2 block text-center text-[11px] font-semibold text-aheers-green hover:underline"
                >
                  Full contact page →
                </Link>
              </div>
            )}

            {confirmEnd && humanMode && (
              <div className="animate-fade-up border-t border-amber-200/60 bg-amber-50 px-4 py-3">
                <p className="text-center text-sm font-semibold text-aheers-charcoal">
                  {liveSession?.status === "waiting"
                    ? "End live chat while waiting for an agent?"
                    : "End live chat with the agent?"}
                </p>
                <p className="mt-1 text-center text-[11px] text-gray-500">
                  You’ll return to the assistant. You can still call, email, or WhatsApp.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmEnd(false)}
                    className="flex-1 rounded-xl border border-aheers-green/20 bg-white py-2.5 text-xs font-bold text-aheers-green-dark"
                  >
                    {liveSession?.status === "waiting" ? "Keep waiting" : "Keep chatting"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (liveSession) endSession(liveSession.id, "customer");
                      sessionIdRef.current = null;
                      setHumanMode(false);
                      setLiveSession(null);
                      setConfirmEnd(false);
                      setContactsOpen(false);
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: `sys-${Date.now()}`,
                          role: "system",
                          text: "Live chat ended. You’re back with the assistant.",
                        },
                      ]);
                    }}
                    className="flex-1 rounded-xl bg-aheers-red py-2.5 text-xs font-bold text-white"
                  >
                    Yes, end chat
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-white px-4 pb-3.5 text-[10px] text-gray-400">
              {!humanMode ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setMessages((prev) => [
                      ...prev,
                      { id: `u-${Date.now()}`, role: "user", text: "Talk to a human" },
                    ]);
                    pushAssistant(getAssistantReply("talk to human", storeSlug));
                    setTimeout(() => startHuman("Talk to human"), thinkingDelayMs("Connecting…") + 350);
                  }}
                  className="inline-flex items-center gap-1 font-semibold text-aheers-green transition hover:underline disabled:opacity-50"
                >
                  <Headphones className="h-3 w-3" /> Talk to human
                </button>
              ) : (
                !confirmEnd && (
                  <button
                    type="button"
                    onClick={() => {
                      setContactsOpen(false);
                      setConfirmEnd(true);
                    }}
                    className="font-semibold text-aheers-red hover:underline"
                  >
                    End live chat
                  </button>
                )
              )}
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setConfirmEnd(false);
                  if (humanMode) {
                    setContactsOpen((v) => !v);
                  } else {
                    setMessages((prev) => [
                      ...prev,
                      { id: `u-${Date.now()}`, role: "user", text: "What are the store phone numbers?" },
                    ]);
                    pushAssistant(getAssistantReply("What are the store phone numbers?", storeSlug));
                  }
                }}
                className="inline-flex items-center gap-1 font-semibold text-aheers-green hover:underline"
              >
                <Phone className="h-3 w-3" /> Contacts
              </button>
              <span>·</span>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#25D366] hover:underline"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
