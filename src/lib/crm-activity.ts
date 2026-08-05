export type MeetingType = "call" | "in-person" | "video" | "site-visit";
export type MeetingStatus = "scheduled" | "completed" | "cancelled";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done" | "overdue";

export interface CrmMeeting {
  id: string;
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  /** ISO date YYYY-MM-DD */
  date: string;
  startTime: string;
  endTime: string;
  withName: string;
  company?: string;
  location: string;
  owner: string;
  relatedLeadId?: string;
  relatedCustomerId?: string;
  notes?: string;
}

export interface CrmTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  owner: string;
  relatedTo: string;
  category: "follow-up" | "quote" | "delivery" | "support" | "internal";
}

export const CRM_MEETINGS: CrmMeeting[] = [
  {
    id: "MTG-01",
    title: "Trade account review — Greytown Spaza",
    type: "in-person",
    status: "scheduled",
    date: "2026-08-05",
    startTime: "09:00",
    endTime: "09:45",
    withName: "Shop owner",
    company: "Greytown Spaza Shop",
    location: "22 Durban St, Greytown",
    owner: "Thandi Nkosi",
    relatedCustomerId: "c4",
    notes: "Discuss credit limit & PowerTrade promo packs",
  },
  {
    id: "MTG-02",
    title: "Hardware quote walkthrough",
    type: "site-visit",
    status: "scheduled",
    date: "2026-08-05",
    startTime: "11:30",
    endTime: "12:30",
    withName: "Johan Botha",
    company: "Botha Builders",
    location: "Site — Church St extension",
    owner: "Hardware Sales",
    relatedLeadId: "LD-01",
  },
  {
    id: "MTG-03",
    title: "VIP rewards check-in",
    type: "call",
    status: "scheduled",
    date: "2026-08-06",
    startTime: "10:00",
    endTime: "10:20",
    withName: "Lucrisha Polton",
    location: "Phone",
    owner: "Priya Moodley",
    relatedCustomerId: "c2",
  },
  {
    id: "MTG-04",
    title: "PowerTrade weekly pipeline",
    type: "video",
    status: "scheduled",
    date: "2026-08-07",
    startTime: "08:30",
    endTime: "09:15",
    withName: "Sales team",
    location: "Teams · Head Office",
    owner: "Lerato Dlamini",
  },
  {
    id: "MTG-05",
    title: "Fleet hub ops standup",
    type: "in-person",
    status: "scheduled",
    date: "2026-08-08",
    startTime: "07:45",
    endTime: "08:15",
    withName: "Dispatch + drivers",
    location: "Fleet Hub, Greytown",
    owner: "Sipho Mkhize",
  },
  {
    id: "MTG-06",
    title: "Khan Spaza Chain intro",
    type: "call",
    status: "completed",
    date: "2026-08-01",
    startTime: "14:00",
    endTime: "14:30",
    withName: "Fatima Khan",
    company: "Khan Spaza Chain",
    location: "Phone",
    owner: "PowerTrade Sales",
    relatedLeadId: "LD-02",
  },
  {
    id: "MTG-07",
    title: "Catering supply quote",
    type: "video",
    status: "scheduled",
    date: "2026-08-12",
    startTime: "15:00",
    endTime: "15:45",
    withName: "Lindiwe Zulu",
    company: "Zulu Catering",
    location: "Zoom",
    owner: "PowerTrade Sales",
    relatedLeadId: "LD-03",
  },
  {
    id: "MTG-08",
    title: "Contractor pricing workshop",
    type: "in-person",
    status: "cancelled",
    date: "2026-08-04",
    startTime: "13:00",
    endTime: "14:00",
    withName: "Mark Stevens",
    company: "Stevens Renovations",
    location: "Aheers Hardware counter",
    owner: "Hardware Sales",
    relatedLeadId: "LD-04",
  },
];

export const CRM_TASKS: CrmTask[] = [
  {
    id: "TSK-01",
    title: "Send revised quote to Botha Builders",
    description: "Include paint + electrical package from Hardware walkthrough",
    status: "todo",
    priority: "high",
    dueDate: "2026-08-05",
    owner: "Hardware Sales",
    relatedTo: "LD-01 · Botha Builders",
    category: "quote",
  },
  {
    id: "TSK-02",
    title: "Follow up ticket TKT-201",
    description: "Missing scone — confirm replacement credit on Infinity card",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-08-05",
    owner: "Priya Moodley",
    relatedTo: "TKT-201 · Lucrisha Polton",
    category: "support",
  },
  {
    id: "TSK-03",
    title: "Prepare PowerTrade promo packs sheet",
    description: "For Greytown Spaza meeting this morning",
    status: "done",
    priority: "high",
    dueDate: "2026-08-05",
    owner: "Thandi Nkosi",
    relatedTo: "c4 · Greytown Spaza",
    category: "follow-up",
  },
  {
    id: "TSK-04",
    title: "Chase delayed Kranskop delivery",
    description: "Coordinate with Fleet Hub on ORD-1045 ETA",
    status: "overdue",
    priority: "high",
    dueDate: "2026-08-04",
    owner: "Sipho Mkhize",
    relatedTo: "ORD-1045 · Kranskop Trading",
    category: "delivery",
  },
  {
    id: "TSK-05",
    title: "Update VIP segment after rewards check-in",
    description: "Confirm Lucrisha still platinum after cashback review",
    status: "todo",
    priority: "low",
    dueDate: "2026-08-06",
    owner: "Priya Moodley",
    relatedTo: "c2 · Lucrisha Polton",
    category: "follow-up",
  },
  {
    id: "TSK-06",
    title: "Draft weekly CRM pipeline report",
    description: "Leads + meetings + open tickets for Sagren",
    status: "todo",
    priority: "medium",
    dueDate: "2026-08-07",
    owner: "Lerato Dlamini",
    relatedTo: "Internal",
    category: "internal",
  },
  {
    id: "TSK-07",
    title: "Schedule Zulu Catering tasting samples",
    description: "Grab n Go + PowerTrade bulk dry goods",
    status: "todo",
    priority: "medium",
    dueDate: "2026-08-11",
    owner: "PowerTrade Sales",
    relatedTo: "LD-03 · Zulu Catering",
    category: "follow-up",
  },
  {
    id: "TSK-08",
    title: "Close won Stevens Renovations paperwork",
    description: "Invoice + Infinity trade card setup",
    status: "in_progress",
    priority: "low",
    dueDate: "2026-08-08",
    owner: "Hardware Sales",
    relatedTo: "LD-04 · Stevens Renovations",
    category: "quote",
  },
];

export function meetingsOnDate(date: string, meetings: CrmMeeting[] = CRM_MEETINGS) {
  return meetings.filter((m) => m.date === date);
}

export function tasksDueOnDate(date: string, tasks: CrmTask[] = CRM_TASKS) {
  return tasks.filter((t) => t.dueDate === date);
}
