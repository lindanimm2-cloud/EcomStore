export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  category: string;
  status: "open" | "pending" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: string;
  assignee: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  source: string;
  stage: "new" | "contacted" | "qualified" | "won" | "lost";
  value: number;
  owner: string;
}

export interface StaffNote {
  id: string;
  customerId: string;
  author: string;
  text: string;
  createdAt: string;
}

export const TICKETS: Ticket[] = [
  { id: "TKT-201", customerId: "c2", customerName: "Lucrisha Polton", subject: "Missing scone from Grab n Go order", category: "Order", status: "open", priority: "medium", createdAt: "2026-06-21", assignee: "Priya Moodley" },
  { id: "TKT-202", customerId: "c4", customerName: "Greytown Spaza Shop", subject: "Credit limit increase request", category: "Trade", status: "pending", priority: "high", createdAt: "2026-06-20", assignee: "Thandi Nkosi" },
  { id: "TKT-203", customerId: "c1", customerName: "Hayley Holst", subject: "Rewards cashback not showing", category: "Rewards", status: "resolved", priority: "low", createdAt: "2026-06-18", assignee: "Priya Moodley" },
  { id: "TKT-204", customerId: "c5", customerName: "Kranskop Trading", subject: "Truck delivery delayed", category: "Delivery", status: "open", priority: "high", createdAt: "2026-06-21", assignee: "Sipho Mkhize" },
];

export const LEADS: Lead[] = [
  { id: "LD-01", name: "Johan Botha", company: "Botha Builders", phone: "082 111 0001", source: "Walk-in", stage: "qualified", value: 85000, owner: "Hardware Sales" },
  { id: "LD-02", name: "Fatima Khan", company: "Khan Spaza Chain", phone: "083 222 0002", source: "Referral", stage: "contacted", value: 120000, owner: "PowerTrade Sales" },
  { id: "LD-03", name: "Lindiwe Zulu", company: "Zulu Catering", phone: "084 333 0003", source: "WhatsApp", stage: "new", value: 45000, owner: "PowerTrade Sales" },
  { id: "LD-04", name: "Mark Stevens", company: "Stevens Renovations", phone: "072 444 0004", source: "Website", stage: "won", value: 62000, owner: "Hardware Sales" },
];

export const STAFF_NOTES: StaffNote[] = [
  { id: "n1", customerId: "c2", author: "Priya Moodley", text: "VIP — prefers morning Grab n Go pickup.", createdAt: "2026-06-15" },
  { id: "n2", customerId: "c4", author: "Thandi Nkosi", text: "Trade account on 30-day terms. Good payer.", createdAt: "2026-06-10" },
];
