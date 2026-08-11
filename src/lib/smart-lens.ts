import { CUSTOMERS, ORDERS } from "@/lib/data";
import { LEADS } from "@/lib/crm-data";
import { CRM_TASKS, CRM_MEETINGS } from "@/lib/crm-activity";
import { INITIAL_THREADS, TEAM_COLLEAGUES } from "@/lib/team-chat";
import {
  PRIORITY_RANK,
  type AppNotification,
  type NotificationPriority,
} from "@/lib/notifications-context";
import { DEFAULT_DISPLAY, SETTINGS_STORAGE_KEY, type DisplaySettings } from "@/lib/settings-data";

export type BriefingBucket = "Now" | "Today" | "Upcoming" | "Recent";

export type BriefingItem = {
  id: string;
  title: string;
  body: string;
  href?: string;
  bucket: BriefingBucket;
  priority: NotificationPriority;
};

export type SearchHit = {
  group: "Orders" | "Customers" | "Tasks" | "Intake" | "Team";
  label: string;
  hint: string;
  href: string;
};

const IDLE_LINES = ["At your side", "Watching the floor", "Ready when you are"];

export function readLensDisplay(): DisplaySettings {
  if (typeof window === "undefined") return DEFAULT_DISPLAY;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_DISPLAY;
    const data = JSON.parse(raw) as { display?: Partial<DisplaySettings> };
    return { ...DEFAULT_DISPLAY, ...data.display };
  } catch {
    return DEFAULT_DISPLAY;
  }
}

export function defaultLensPos() {
  if (typeof window === "undefined") return { x: 16, y: 16 };
  const w = Math.min(window.innerWidth < 768 ? 220 : 380, window.innerWidth - 24);
  return {
    x: Math.max(8, window.innerWidth - w - 16),
    y: window.innerWidth < 1024 ? 64 : 16,
  };
}

export function roomName(pathname: string): string | null {
  if (pathname.startsWith("/admin/orders")) return "Orders room";
  if (pathname.startsWith("/admin/customers")) return "Customers room";
  if (pathname.startsWith("/admin/inventory")) return "Inventory room";
  if (pathname.startsWith("/admin/tickets") || pathname.startsWith("/admin/service-desk")) return "Service room";
  if (pathname.startsWith("/admin/fleet")) return "Fleet room";
  if (pathname.startsWith("/admin/leads")) return "Intake room";
  if (pathname.startsWith("/admin/tasks")) return "Tasks room";
  if (pathname.startsWith("/admin/calendar") || pathname.startsWith("/admin/meetings")) return "Diary room";
  if (pathname.startsWith("/admin/chat")) return "Team room";
  if (pathname.startsWith("/admin/promotions")) return "Promotions room";
  if (pathname === "/admin" || pathname === "/admin/") return "Dashboard room";
  if (pathname.startsWith("/admin")) return "Aheers App";
  return null;
}

export function panelTitle(panel: string | null): string | null {
  if (panel === "lens") return "AI Briefing";
  if (panel === "notify") return "Notifications";
  if (panel === "chat") return "Team chat";
  if (panel === "live") return "Live assist";
  if (panel === "calls") return "Calls";
  if (panel === "search") return "Search";
  if (panel === "more") return "More";
  return null;
}

export function idleStatusLine() {
  const i = Math.floor(Date.now() / 120_000) % IDLE_LINES.length;
  return IDLE_LINES[i];
}

export function buildBriefingItems(notes: AppNotification[]): Record<BriefingBucket, BriefingItem[]> {
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const buckets: Record<BriefingBucket, BriefingItem[]> = {
    Now: [],
    Today: [],
    Upcoming: [],
    Recent: [],
  };

  for (const n of notes) {
    const age = now - new Date(n.createdAt).getTime();
    const rank = PRIORITY_RANK[n.priority] ?? 0;
    const item: BriefingItem = {
      id: n.id,
      title: n.title,
      body: n.body,
      href: n.href,
      bucket: "Recent",
      priority: n.priority,
    };
    if (!n.read && (rank >= PRIORITY_RANK.high || n.category === "urgent")) {
      item.bucket = "Now";
    } else if (!n.read && new Date(n.createdAt).getTime() >= startOfDay.getTime()) {
      item.bucket = "Today";
    } else if (n.read && age < 24 * 3600_000) {
      item.bucket = "Recent";
    } else if (!n.read) {
      item.bucket = "Today";
    } else {
      continue;
    }
    buckets[item.bucket].push(item);
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  for (const m of CRM_MEETINGS.filter((x) => x.status === "scheduled" && x.date >= todayIso).slice(0, 3)) {
    buckets.Upcoming.push({
      id: m.id,
      title: m.title,
      body: `${m.date} ${m.startTime} · ${m.withName}`,
      href: "/admin/calendar",
      bucket: "Upcoming",
      priority: "normal",
    });
  }
  for (const t of CRM_TASKS.filter((x) => x.status === "overdue" || x.dueDate >= todayIso).slice(0, 3)) {
    buckets.Upcoming.push({
      id: t.id,
      title: t.title,
      body: `Due ${t.dueDate} · ${t.owner}`,
      href: "/admin/tasks",
      bucket: "Upcoming",
      priority: t.status === "overdue" ? "high" : "normal",
    });
  }

  return buckets;
}

export function isDailyBriefing(n: AppNotification) {
  return n.category === "today" || /briefing/i.test(n.title) || n.eventId.toUpperCase().includes("BRIEF");
}

export function pickTalkNotice(notes: AppNotification[], settings: DisplaySettings): AppNotification | null {
  const unseen = notes.filter((n) => !n.seenAt && !n.dismissedAt && !n.read);
  const ranked = unseen
    .filter((n) => {
      const rank = PRIORITY_RANK[n.priority] ?? 0;
      if (rank < PRIORITY_RANK.important) return false;
      if (isDailyBriefing(n) && !settings.lensDailyBriefing) return false;
      return true;
    })
    .sort((a, b) => (PRIORITY_RANK[b.priority] ?? 0) - (PRIORITY_RANK[a.priority] ?? 0));
  return ranked[0] ?? null;
}

export function talkTone(priority: NotificationPriority): "warn" | "accent" | "default" {
  if ((PRIORITY_RANK[priority] ?? 0) >= PRIORITY_RANK.urgent) return "warn";
  if ((PRIORITY_RANK[priority] ?? 0) >= PRIORITY_RANK.important) return "accent";
  return "default";
}

export function searchCrm(query: string): { group: SearchHit["group"]; hits: SearchHit[] }[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const orders: SearchHit[] = ORDERS.filter(
    (o) => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
  ).slice(0, 5).map((o) => ({
    group: "Orders",
    label: o.id,
    hint: `${o.customerName} · ${o.status}`,
    href: "/admin/orders",
  }));
  const customers: SearchHit[] = CUSTOMERS.filter(
    (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
  ).slice(0, 5).map((c) => ({
    group: "Customers",
    label: c.name,
    hint: `${c.type} · ${c.phone}`,
    href: "/admin/customers",
  }));
  const tasks: SearchHit[] = CRM_TASKS.filter(
    (t) => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
  ).slice(0, 5).map((t) => ({
    group: "Tasks",
    label: t.title,
    hint: `${t.id} · ${t.status}`,
    href: "/admin/tasks",
  }));
  const intake: SearchHit[] = LEADS.filter(
    (l) => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.id.toLowerCase().includes(q)
  ).slice(0, 5).map((l) => ({
    group: "Intake",
    label: l.company,
    hint: `${l.name} · ${l.stage}`,
    href: "/admin/leads",
  }));
  const team: SearchHit[] = [
    ...TEAM_COLLEAGUES.filter((c) => c.name.toLowerCase().includes(q)).map((c) => ({
      group: "Team" as const,
      label: c.name,
      hint: c.title,
      href: "/admin/chat",
    })),
    ...INITIAL_THREADS.filter((t) => t.name.toLowerCase().includes(q)).map((t) => ({
      group: "Team" as const,
      label: t.name,
      hint: t.preview,
      href: `/admin/chat?thread=${t.id}`,
    })),
  ].slice(0, 5);

  return (
    [
      { group: "Orders" as const, hits: orders },
      { group: "Customers" as const, hits: customers },
      { group: "Tasks" as const, hits: tasks },
      { group: "Intake" as const, hits: intake },
      { group: "Team" as const, hits: team },
    ] as const
  ).filter((g) => g.hits.length);
}

const SPOKEN_KEY = "aheers-lens-spoken";

function spokenIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(SPOKEN_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function rememberSpoken(id: string) {
  const next = spokenIds();
  next.add(id);
  sessionStorage.setItem(SPOKEN_KEY, JSON.stringify([...next].slice(-80)));
}

export function speakNotice(n: AppNotification, settings: DisplaySettings) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (settings.lensQuietMode || !settings.lensVoice) return;
  if (isDailyBriefing(n) && !settings.lensDailyBriefing) return;
  const rank = PRIORITY_RANK[n.priority] ?? 0;
  const urgentPlus = rank >= PRIORITY_RANK.urgent;
  const highAuto = rank >= PRIORITY_RANK.high && settings.lensAutoSpeak;
  if (!urgentPlus && !highAuto) return;
  if (spokenIds().has(n.eventId)) return;
  rememberSpoken(n.eventId);
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(`${n.title}. ${n.body}`);
  utter.rate = 1.02;
  utter.pitch = 1;
  window.speechSynthesis.speak(utter);
}
