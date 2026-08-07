export type ChatKind = "dm" | "group" | "customer";

export interface TeamColleague {
  id: string;
  name: string;
  title: string;
  branch: string;
  phone?: string;
  whatsapp?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  at: string; // ISO-ish display time
  mine?: boolean;
}

export interface ChatThread {
  id: string;
  kind: ChatKind;
  name: string;
  subtitle?: string;
  peerId?: string;
  unread: number;
  lastAt: string;
  preview: string;
  messages: ChatMessage[];
}

export const TEAM_COLLEAGUES: TeamColleague[] = [
  { id: "col-priya", name: "Priya Moodley", title: "Aheers App Lead", branch: "Head Office", phone: "082 100 2001", whatsapp: "27821002001" },
  { id: "col-lerato", name: "Lerato Dlamini", title: "Sales Manager", branch: "PowerTrade", phone: "082 100 2002", whatsapp: "27821002002" },
  { id: "col-thandi", name: "Thandi Nkosi", title: "Service Counter", branch: "Supermarket", phone: "082 100 2003", whatsapp: "27821002003" },
  { id: "col-jane", name: "Jane Doe", title: "Hardware Sales", branch: "Hardware", phone: "082 100 2004", whatsapp: "27821002004" },
  { id: "col-sipho", name: "Sipho Mthembu", title: "Dispatcher", branch: "Fleet Hub", phone: "082 100 2005", whatsapp: "27821002005" },
  { id: "col-sagren", name: "Sagren Aheer", title: "CEO", branch: "Head Office", phone: "033 413 1156", whatsapp: "27334131156" },
];

export const INITIAL_THREADS: ChatThread[] = [
  {
    id: "ch-priya",
    kind: "dm",
    name: "Priya Moodley",
    subtitle: "Aheers App Lead · Head Office",
    peerId: "col-priya",
    unread: 2,
    lastAt: "10:42",
    preview: "VIP call with Lucrisha is booked for tomorrow 10:00.",
    messages: [
      { id: "m1", senderId: "col-priya", text: "Morning — Lucrisha asked about her cashback balance again.", at: "09:12" },
      { id: "m2", senderId: "me", text: "She's on Infinity Gold. Wallet shows R186. Can you confirm in portal?", at: "09:18", mine: true },
      { id: "m3", senderId: "col-priya", text: "Confirmed. I'll send the rewards summary SMS.", at: "09:22" },
      { id: "m4", senderId: "col-priya", text: "VIP call with Lucrisha is booked for tomorrow 10:00.", at: "10:42" },
    ],
  },
  {
    id: "ch-jane",
    kind: "dm",
    name: "Jane Doe",
    subtitle: "Hardware Sales",
    peerId: "col-jane",
    unread: 0,
    lastAt: "Yesterday",
    preview: "Botha Builders wants a site visit quote pack.",
    messages: [
      { id: "m1", senderId: "col-jane", text: "Botha Builders wants a site visit quote pack.", at: "Yesterday 16:05" },
      { id: "m2", senderId: "me", text: "Schedule it on the calendar — Church St extension.", at: "Yesterday 16:20", mine: true },
      { id: "m3", senderId: "col-jane", text: "Done. Meeting MTG-02 is on for 11:30.", at: "Yesterday 16:28" },
    ],
  },
  {
    id: "ch-litigation",
    kind: "group",
    name: "Ops desk",
    subtitle: "Group · Dispatch + App + Counter",
    unread: 1,
    lastAt: "08:55",
    preview: "Sipho: Bakkie 2 delayed — rain on R33.",
    messages: [
      { id: "m1", senderId: "col-sipho", text: "Bakkie 2 delayed — rain on R33. ETA +25 min on ORD-1042.", at: "08:40" },
      { id: "m2", senderId: "col-thandi", text: "Customer already called the counter. I'll message them.", at: "08:48" },
      { id: "m3", senderId: "col-sipho", text: "Thanks — updating live track now.", at: "08:55" },
    ],
  },
  {
    id: "ch-lerato",
    kind: "dm",
    name: "Lerato Dlamini",
    subtitle: "Sales · PowerTrade",
    peerId: "col-lerato",
    unread: 0,
    lastAt: "Mon",
    preview: "Pipeline review Thursday still good?",
    messages: [
      { id: "m1", senderId: "col-lerato", text: "Pipeline review Thursday still good?", at: "Mon 14:10" },
      { id: "m2", senderId: "me", text: "Yes — keep the video slot 08:30. I'll bring lead values.", at: "Mon 14:22", mine: true },
    ],
  },
  {
    id: "ch-customer",
    kind: "customer",
    name: "Greytown Spaza Shop",
    subtitle: "Trade customer · Thandi owning",
    peerId: "col-thandi",
    unread: 0,
    lastAt: "Sun",
    preview: "Credit limit increase request noted.",
    messages: [
      { id: "m1", senderId: "col-thandi", text: "Owner asked for credit limit review at tomorrow's visit.", at: "Sun 11:02" },
      { id: "m2", senderId: "me", text: "Noted — pull last 90 days orders before the meeting.", at: "Sun 11:15", mine: true },
    ],
  },
];

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function senderLabel(senderId: string) {
  if (senderId === "me") return "You";
  return TEAM_COLLEAGUES.find((c) => c.id === senderId)?.name ?? "Team";
}
