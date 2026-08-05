export type StoreSlug =
  | "supermarket"
  | "powertrade"
  | "buildsave"
  | "foodworks"
  | "grabngo";

export interface Store {
  slug: StoreSlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  accent: string;
  accentBg: string;
  accentText: string;
  icon: string;
  type: "retail" | "wholesale" | "hardware" | "food" | "takeaway";
  delivery: boolean;
  pickup: boolean;
  status: "open" | "closed";
  promotion?: string;
}

export interface Product {
  id: string;
  storeSlug: StoreSlug;
  name: string;
  category: string;
  price: number;
  memberPrice?: number;
  unit: string;
  bulkPrice?: number;
  minQty?: number;
  image: string;
  badge?: string;
  inStock: number;
  description: string;
  barcode?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "retail" | "trade" | "vip";
  loyaltyPoints: number;
  cashbackBalance: number;
  walletBalance: number;
  rewardsTier: "bronze" | "silver" | "gold" | "platinum" | "vip";
  infinityCardId: string;
  totalSpent: number;
  lastOrder: string;
  address: string;
  status: "active" | "inactive";
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  storeSlug: StoreSlug;
  items: { productId: string; name: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "processing" | "dispatched" | "delivered" | "cancelled";
  type: "delivery" | "collection" | "in-store";
  createdAt: string;
  deliveryAddress?: string;
  fleetId?: string;
}

export interface FleetVehicle {
  id: string;
  name: string;
  driver: string;
  phone: string;
  status: "idle" | "en-route" | "delivering" | "returning";
  lat: number;
  lng: number;
  destination?: string;
  orderId?: string;
  eta?: string;
  capacity: string;
}

export interface Competition {
  id: string;
  title: string;
  prize: string;
  endsAt: string;
  entries: number;
  status: "active" | "ended";
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface RewardsTier {
  name: string;
  minSpend: number;
  benefits: string[];
}
