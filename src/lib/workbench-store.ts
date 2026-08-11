/** Dashboard work surface — notes, updates, replies, continue-working, activity. */

export type WorkNote = {
  id: string;
  entityId: string;
  entityLabel: string;
  text: string;
  private: boolean;
  createdAt: string;
};

export type WorkUpdate = {
  id: string;
  entityId: string;
  entityLabel: string;
  text: string;
  status: "active" | "waiting" | "urgent" | "completed";
  createdAt: string;
};

export type WorkReply = {
  id: string;
  entityId: string;
  toName: string;
  text: string;
  createdAt: string;
};

export type ActivityItem = {
  id: string;
  at: string;
  actor: string;
  text: string;
};

export type ContinueWork = {
  entityId: string;
  title: string;
  lastActivity: string;
  href: string;
};

export type HandledId = string;

type BenchState = {
  notes: WorkNote[];
  updates: WorkUpdate[];
  replies: WorkReply[];
  activity: ActivityItem[];
  handled: HandledId[];
  continueWork: ContinueWork | null;
};

const KEY = "aheers-workbench-v1";
export const BENCH_EVENT = "aheers-workbench";

const SEED_ACTIVITY: ActivityItem[] = [
  {
    id: "act-1",
    at: new Date(Date.now() - 12 * 60_000).toISOString(),
    actor: "Thandi Nkosi",
    text: "Updated ticket TKT-201 — missing scone credit",
  },
  {
    id: "act-2",
    at: new Date(Date.now() - 28 * 60_000).toISOString(),
    actor: "Sipho Mkhize",
    text: "Flagged delay on ORD-1045 · Kranskop",
  },
  {
    id: "act-3",
    at: new Date(Date.now() - 46 * 60_000).toISOString(),
    actor: "Priya Moodley",
    text: "Asked about Lucrisha VIP cashback",
  },
];

const DEFAULT: BenchState = {
  notes: [],
  updates: [],
  replies: [],
  activity: SEED_ACTIVITY,
  handled: [],
  continueWork: {
    entityId: "TSK-01",
    title: "Botha Builders quote",
    lastActivity: "Drafting revised Hardware package",
    href: "/admin/tasks",
  },
};

function read(): BenchState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...(JSON.parse(raw) as Partial<BenchState>) };
  } catch {
    return DEFAULT;
  }
}

function write(next: BenchState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(BENCH_EVENT, { detail: next }));
}

export function getWorkbench(): BenchState {
  return read();
}

export function subscribeWorkbench(onChange: (s: BenchState) => void) {
  const emit = () => onChange(read());
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) emit();
  };
  window.addEventListener(BENCH_EVENT, emit as EventListener);
  window.addEventListener("storage", onStorage);
  emit();
  return () => {
    window.removeEventListener(BENCH_EVENT, emit as EventListener);
    window.removeEventListener("storage", onStorage);
  };
}

function pushActivity(state: BenchState, actor: string, text: string): BenchState {
  return {
    ...state,
    activity: [
      { id: `act-${Date.now()}`, at: new Date().toISOString(), actor, text },
      ...state.activity,
    ].slice(0, 40),
  };
}

export function addWorkNote(note: Omit<WorkNote, "id" | "createdAt">, actor: string) {
  const state = read();
  const item: WorkNote = { ...note, id: `note-${Date.now()}`, createdAt: new Date().toISOString() };
  write(
    pushActivity(
      { ...state, notes: [item, ...state.notes] },
      actor,
      `Added note on ${note.entityLabel}`
    )
  );
}

export function addWorkUpdate(update: Omit<WorkUpdate, "id" | "createdAt">, actor: string) {
  const state = read();
  const item: WorkUpdate = { ...update, id: `upd-${Date.now()}`, createdAt: new Date().toISOString() };
  write(
    pushActivity(
      {
        ...state,
        updates: [item, ...state.updates],
        continueWork: {
          entityId: update.entityId,
          title: update.entityLabel,
          lastActivity: update.text,
          href: "/admin/customers",
        },
      },
      actor,
      `Updated ${update.entityLabel}`
    )
  );
}

export function addWorkReply(reply: Omit<WorkReply, "id" | "createdAt">, actor: string) {
  const state = read();
  const item: WorkReply = { ...reply, id: `rep-${Date.now()}`, createdAt: new Date().toISOString() };
  write(
    pushActivity(
      { ...state, replies: [item, ...state.replies], handled: [...state.handled, reply.entityId] },
      actor,
      `Replied to ${reply.toName}`
    )
  );
}

export function markHandled(id: string, actor: string, label: string) {
  const state = read();
  if (state.handled.includes(id)) return;
  write(pushActivity({ ...state, handled: [...state.handled, id] }, actor, label));
}

export function setContinueWork(item: ContinueWork) {
  write({ ...read(), continueWork: item });
}

export function isHandled(id: string) {
  return read().handled.includes(id);
}
