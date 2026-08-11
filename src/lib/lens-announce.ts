/** Once-per-event memory so Lens does not repeat the same announcement. */

export type LensAnnounce = {
  eventId: string;
  userId: string;
  type: string;
  entityId?: string;
  createdAt: string;
  lastShownAt?: string;
  acknowledgedAt?: string;
  dismissedAt?: string;
};

const KEY = "aheers-lens-announce-v1";

function read(): LensAnnounce[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LensAnnounce[]) : [];
  } catch {
    return [];
  }
}

function write(items: LensAnnounce[]) {
  sessionStorage.setItem(KEY, JSON.stringify(items.slice(-120)));
}

export function wasAnnounced(eventId: string) {
  return read().some((a) => a.eventId === eventId && Boolean(a.acknowledgedAt || a.dismissedAt || a.lastShownAt));
}

export function wasSpokenOrShown(eventId: string) {
  return read().some((a) => a.eventId === eventId && Boolean(a.lastShownAt || a.acknowledgedAt));
}

export function markAnnounced(entry: Omit<LensAnnounce, "createdAt" | "lastShownAt">) {
  const items = read();
  const now = new Date().toISOString();
  const existing = items.find((a) => a.eventId === entry.eventId);
  if (existing) {
    existing.lastShownAt = now;
    write(items);
    return;
  }
  write([
    ...items,
    {
      ...entry,
      createdAt: now,
      lastShownAt: now,
    },
  ]);
}

export function acknowledgeAnnounce(eventId: string) {
  const items = read();
  const hit = items.find((a) => a.eventId === eventId);
  if (hit) {
    hit.acknowledgedAt = new Date().toISOString();
    write(items);
  }
}
