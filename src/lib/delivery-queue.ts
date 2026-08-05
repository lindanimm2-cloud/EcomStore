/** Shared delivery queue — driver + customer request (demo · localStorage) */

export type QueueJobStatus = "new" | "next" | "active" | "delivered";

export interface DeliveryJob {
  id: string;
  orderId: string;
  customerName: string;
  customerId?: string;
  address: string;
  storeSlug: string;
  units: number;
  total: number;
  status: QueueJobStatus;
  requestedBy: "customer" | "dispatch" | "system";
  note?: string;
  deliveredNote?: string;
  createdAt: string;
  phone?: string;
}

const STORAGE_KEY = "aheers-delivery-queue-v1";

export const SEED_QUEUE: DeliveryJob[] = [
  {
    id: "DQ-01",
    orderId: "ORD-1043",
    customerName: "Greytown Spaza Shop",
    customerId: "c4",
    address: "22 Durban St, Greytown",
    storeSlug: "powertrade",
    units: 32,
    total: 3740,
    status: "active",
    requestedBy: "dispatch",
    note: "Trade bulk · call on arrival",
    createdAt: "2026-08-05T07:30:00",
    phone: "033 123 4567",
  },
  {
    id: "DQ-02",
    orderId: "ORD-1046",
    customerName: "Ananth Mahabeer",
    customerId: "c3",
    address: "78 Voortrekker St, Greytown",
    storeSlug: "supermarket",
    units: 4,
    total: 108.96,
    status: "next",
    requestedBy: "system",
    note: "Leave at gate if no answer",
    createdAt: "2026-08-05T08:00:00",
    phone: "084 567 8901",
  },
  {
    id: "DQ-03",
    orderId: "ORD-1045",
    customerName: "Kranskop Trading",
    customerId: "c5",
    address: "5 Market Sq, Kranskop",
    storeSlug: "powertrade",
    units: 6,
    total: 2190,
    status: "new",
    requestedBy: "dispatch",
    note: "Long haul · confirm before leaving Greytown",
    createdAt: "2026-08-05T09:15:00",
    phone: "033 987 6543",
  },
  {
    id: "DQ-04",
    orderId: "REQ-2201",
    customerName: "Lucrisha Polton",
    customerId: "c2",
    address: "45 Church St, Greytown",
    storeSlug: "supermarket",
    units: 8,
    total: 420,
    status: "new",
    requestedBy: "customer",
    note: "Customer requested same-day delivery",
    createdAt: "2026-08-05T10:05:00",
    phone: "083 456 7890",
  },
  {
    id: "DQ-05",
    orderId: "ORD-1042",
    customerName: "Hayley Holst",
    customerId: "c1",
    address: "12 Main Rd, Greytown",
    storeSlug: "supermarket",
    units: 3,
    total: 82.97,
    status: "delivered",
    requestedBy: "system",
    deliveredNote: "Handed to customer · POD taken",
    createdAt: "2026-08-05T06:40:00",
    phone: "082 345 6789",
  },
];

export function loadQueue(): DeliveryJob[] {
  if (typeof window === "undefined") return SEED_QUEUE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_QUEUE));
      return SEED_QUEUE;
    }
    return JSON.parse(raw) as DeliveryJob[];
  } catch {
    return SEED_QUEUE;
  }
}

export function saveQueue(jobs: DeliveryJob[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  window.dispatchEvent(new Event("aheers:delivery-queue"));
}

export function queueByStatus(jobs: DeliveryJob[], status: QueueJobStatus) {
  return jobs.filter((j) => j.status === status);
}

export function requestCustomerDelivery(input: {
  customerName: string;
  customerId?: string;
  address: string;
  phone?: string;
  note?: string;
  storeSlug?: string;
}): DeliveryJob {
  const jobs = loadQueue();
  const neu: DeliveryJob = {
    id: `DQ-${Date.now().toString().slice(-4)}`,
    orderId: `REQ-${Date.now().toString().slice(-4)}`,
    customerName: input.customerName,
    customerId: input.customerId,
    address: input.address,
    storeSlug: input.storeSlug ?? "supermarket",
    units: 1,
    total: 0,
    status: "new",
    requestedBy: "customer",
    note: input.note || "Customer requested delivery",
    createdAt: new Date().toISOString(),
    phone: input.phone,
  };
  saveQueue([neu, ...jobs]);
  return neu;
}
