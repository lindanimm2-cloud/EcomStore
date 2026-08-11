/** Once-per-tab session flags for greeting, farewell, and Lens transcript. */

export type LensChatMsg = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
};

type SessionState = {
  userId: string;
  greetedAt?: string;
  farewellAt?: string;
  lastSeenAt?: string;
  bootstrappedAt?: string;
  transcript?: LensChatMsg[];
};

const KEY = "aheers-ops-session";
const FAREWELL_MSG = "aheers-ops-farewell-msg";
const CATCH_UP_MS = 2 * 60 * 60 * 1000;

function read(): SessionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SessionState) : null;
  } catch {
    return null;
  }
}

function write(state: SessionState) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(state));
}

export function loadOpsSession(userId: string): SessionState {
  const existing = read();
  if (existing?.userId === userId) return existing;
  const fresh: SessionState = {
    userId,
    lastSeenAt: new Date().toISOString(),
  };
  write(fresh);
  return fresh;
}

/** True only the first time this tab greets this user. */
export function takeSessionGreeting(userId: string): boolean {
  const state = loadOpsSession(userId);
  if (state.greetedAt) return false;
  write({ ...state, greetedAt: new Date().toISOString() });
  return true;
}

export function hasGreeted(userId: string): boolean {
  return loadOpsSession(userId).greetedAt != null;
}

export function markBootstrapped(userId: string) {
  const state = loadOpsSession(userId);
  if (state.bootstrappedAt) return;
  write({ ...state, bootstrappedAt: new Date().toISOString() });
}

export function hasBootstrapped(userId: string): boolean {
  return loadOpsSession(userId).bootstrappedAt != null;
}

export function saveLensTranscript(userId: string, transcript: LensChatMsg[]) {
  const state = loadOpsSession(userId);
  write({ ...state, transcript: transcript.slice(-40) });
}

export function getLensTranscript(userId: string): LensChatMsg[] {
  return loadOpsSession(userId).transcript ?? [];
}

export function shouldCatchUp(userId: string): boolean {
  const state = read();
  if (!state || state.userId !== userId || !state.lastSeenAt) return false;
  return Date.now() - new Date(state.lastSeenAt).getTime() > CATCH_UP_MS;
}

export function takeLogoutFarewell(userId: string, message: string): boolean {
  const state = read();
  if (!state || state.userId !== userId || !state.greetedAt || state.farewellAt) return false;
  write({ ...state, farewellAt: new Date().toISOString() });
  try {
    sessionStorage.setItem(FAREWELL_MSG, message);
  } catch {
    /* ignore */
  }
  return true;
}

export function consumeFarewellBanner(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const msg = sessionStorage.getItem(FAREWELL_MSG);
    if (!msg) return null;
    sessionStorage.removeItem(FAREWELL_MSG);
    return msg;
  } catch {
    return null;
  }
}
