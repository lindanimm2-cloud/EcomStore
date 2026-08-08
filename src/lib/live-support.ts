/** Shared customer ↔ agent live chat (demo · localStorage + events). */

export type LiveRole = "customer" | "agent" | "system" | "assistant";

export type LiveMsg = {
  id: string;
  role: LiveRole;
  text: string;
  at: string;
};

export type LiveSessionStatus = "waiting" | "active" | "ended";

export type LiveSession = {
  id: string;
  status: LiveSessionStatus;
  customerName: string;
  storeHint?: string;
  topic?: string;
  messages: LiveMsg[];
  requestedAt: string;
  claimedBy?: string;
  updatedAt: number;
};

const STORAGE_KEY = "aheers-live-support-v1";
const EVENT = "aheers-live-support";

function nowLabel() {
  return new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function readAll(): LiveSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LiveSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(sessions: LiveSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: sessions }));
}

export function listLiveSessions(): LiveSession[] {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getLiveSession(id: string): LiveSession | undefined {
  return readAll().find((s) => s.id === id);
}

export function getOpenCustomerSession(): LiveSession | undefined {
  return readAll().find((s) => s.status === "waiting" || s.status === "active");
}

export function waitingCount(): number {
  return readAll().filter((s) => s.status === "waiting").length;
}

export function openCount(): number {
  return readAll().filter((s) => s.status === "waiting" || s.status === "active").length;
}

export function subscribeLiveSupport(onChange: (sessions: LiveSession[]) => void) {
  function emit() {
    onChange(listLiveSessions());
  }
  function onStorage(e: StorageEvent) {
    if (e.key === STORAGE_KEY) emit();
  }
  function onCustom() {
    emit();
  }
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVENT, onCustom as EventListener);
  emit();
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVENT, onCustom as EventListener);
  };
}

export function requestHuman(opts: {
  customerName?: string;
  storeHint?: string;
  topic?: string;
  priorMessages?: { role: "user" | "assistant"; text: string }[];
}): LiveSession {
  const existing = getOpenCustomerSession();
  const prior: LiveMsg[] = (opts.priorMessages ?? []).slice(-10).map((m) => ({
    id: uid("hist"),
    role: m.role === "user" ? "customer" : "assistant",
    text: m.text,
    at: nowLabel(),
  }));

  if (existing) {
    const updated: LiveSession = {
      ...existing,
      status: existing.status === "ended" ? "waiting" : existing.status,
      storeHint: opts.storeHint ?? existing.storeHint,
      topic: opts.topic ?? existing.topic,
      messages: [
        ...existing.messages,
        ...prior.filter((p) => !existing.messages.some((m) => m.text === p.text)),
        {
          id: uid("sys"),
          role: "system",
          text: "Customer asked to talk to a human again.",
          at: nowLabel(),
        },
      ],
      updatedAt: Date.now(),
    };
    if (updated.status === "ended") updated.status = "waiting";
    writeAll(readAll().map((s) => (s.id === updated.id ? updated : s)));
    return updated;
  }

  const session: LiveSession = {
    id: uid("live"),
    status: "waiting",
    customerName: opts.customerName ?? "App customer",
    storeHint: opts.storeHint,
    topic: opts.topic ?? "General help",
    messages: [
      ...prior,
      {
        id: uid("sys"),
        role: "system",
        text: "Customer requested a human agent via the Aheers assistant.",
        at: nowLabel(),
      },
    ],
    requestedAt: new Date().toISOString(),
    updatedAt: Date.now(),
  };
  writeAll([session, ...readAll().filter((s) => s.status === "ended").slice(0, 8)]);
  return session;
}

export function appendCustomerMessage(sessionId: string, text: string): LiveSession | undefined {
  const all = readAll();
  const idx = all.findIndex((s) => s.id === sessionId);
  if (idx < 0) return undefined;
  const session = all[idx];
  if (session.status === "ended") return session;
  const next: LiveSession = {
    ...session,
    messages: [
      ...session.messages,
      { id: uid("c"), role: "customer", text, at: nowLabel() },
    ],
    updatedAt: Date.now(),
  };
  all[idx] = next;
  writeAll(all);
  return next;
}

export function claimSession(sessionId: string, agentName: string): LiveSession | undefined {
  const all = readAll();
  const idx = all.findIndex((s) => s.id === sessionId);
  if (idx < 0) return undefined;
  const session = all[idx];
  const next: LiveSession = {
    ...session,
    status: "active",
    claimedBy: agentName,
    messages: [
      ...session.messages,
      {
        id: uid("sys"),
        role: "system",
        text: `${agentName} joined the chat.`,
        at: nowLabel(),
      },
    ],
    updatedAt: Date.now(),
  };
  all[idx] = next;
  writeAll(all);
  return next;
}

export function appendAgentMessage(
  sessionId: string,
  text: string,
  agentName: string
): LiveSession | undefined {
  const all = readAll();
  const idx = all.findIndex((s) => s.id === sessionId);
  if (idx < 0) return undefined;
  const session = all[idx];
  if (session.status === "ended") return session;
  const next: LiveSession = {
    ...session,
    status: "active",
    claimedBy: session.claimedBy ?? agentName,
    messages: [
      ...session.messages,
      { id: uid("a"), role: "agent", text, at: nowLabel() },
    ],
    updatedAt: Date.now(),
  };
  all[idx] = next;
  writeAll(all);
  return next;
}

export function endSession(sessionId: string, by: "customer" | "agent" = "agent"): LiveSession | undefined {
  const all = readAll();
  const idx = all.findIndex((s) => s.id === sessionId);
  if (idx < 0) return undefined;
  const session = all[idx];
  const next: LiveSession = {
    ...session,
    status: "ended",
    messages: [
      ...session.messages,
      {
        id: uid("sys"),
        role: "system",
        text: by === "customer" ? "Customer ended the chat." : "Agent ended the chat.",
        at: nowLabel(),
      },
    ],
    updatedAt: Date.now(),
  };
  all[idx] = next;
  writeAll(all);
  return next;
}
