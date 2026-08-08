import { Customer, Order, Competition } from "./types";

export const CUSTOMERS: Customer[] = [
  { id: "c1", name: "Hayley Holst", email: "hayley.h@email.co.za", phone: "082 345 6789", type: "retail", loyaltyPoints: 1240, cashbackBalance: 84.50, walletBalance: 120.00, rewardsTier: "silver", infinityCardId: "INF-8821-4401", totalSpent: 8450, lastOrder: "2026-06-18", address: "12 Main Rd, Greytown", status: "active" },
  { id: "c2", name: "Lucrisha Polton", email: "lucrisha.p@gmail.com", phone: "083 456 7890", type: "vip", loyaltyPoints: 3200, cashbackBalance: 224.00, walletBalance: 50.00, rewardsTier: "platinum", infinityCardId: "INF-8821-9923", totalSpent: 22400, lastOrder: "2026-06-20", address: "45 Church St, Greytown", status: "active" },
  { id: "c3", name: "Ananth Mahabeer", email: "ananth.m@email.co.za", phone: "084 567 8901", type: "retail", loyaltyPoints: 890, cashbackBalance: 56.20, walletBalance: 0, rewardsTier: "bronze", infinityCardId: "INF-8821-3312", totalSpent: 5620, lastOrder: "2026-06-15", address: "78 Voortrekker St, Greytown", status: "active" },
  { id: "c4", name: "Greytown Spaza Shop", email: "orders@greytownspaza.co.za", phone: "033 123 4567", type: "trade", loyaltyPoints: 5600, cashbackBalance: 1560.00, walletBalance: 500.00, rewardsTier: "gold", infinityCardId: "INF-8821-7701", totalSpent: 156000, lastOrder: "2026-06-21", address: "22 Durban St, Greytown", status: "active" },
  { id: "c5", name: "Kranskop Trading", email: "kranskop@trade.co.za", phone: "033 987 6543", type: "trade", loyaltyPoints: 8900, cashbackBalance: 3420.00, walletBalance: 1200.00, rewardsTier: "vip", infinityCardId: "INF-8821-5509", totalSpent: 342000, lastOrder: "2026-06-19", address: "5 Market Sq, Kranskop", status: "active" },
  { id: "c6", name: "Agrippa Ndaba", email: "agrippa.n@email.co.za", phone: "072 234 5678", type: "retail", loyaltyPoints: 450, cashbackBalance: 28.90, walletBalance: 15.00, rewardsTier: "bronze", infinityCardId: "INF-8821-1188", totalSpent: 2890, lastOrder: "2026-06-10", address: "33 Farm Rd, Greytown", status: "active" },
];

export const ORDERS: Order[] = [
  { id: "ORD-1042", customerId: "c1", customerName: "Hayley Holst", storeSlug: "supermarket", items: [{ productId: "sm-1", name: "Royal Gala Apples 1kg", qty: 2, price: 24.99 }, { productId: "sm-3", name: "Bananas", qty: 1, price: 19.99 }], total: 69.97, status: "delivered", type: "delivery", createdAt: "2026-06-18T10:30:00", deliveryAddress: "12 Main Rd, Greytown", fleetId: "f1" },
  { id: "ORD-1043", customerId: "c4", customerName: "Greytown Spaza Shop", storeSlug: "powertrade", items: [{ productId: "pt-1", name: "Sunfoil Cooking Oil 5L", qty: 12, price: 175.00 }, { productId: "pt-3", name: "White Star Maize Meal 10kg", qty: 20, price: 82.00 }], total: 3740.00, status: "dispatched", type: "delivery", createdAt: "2026-06-21T08:15:00", deliveryAddress: "22 Durban St, Greytown", fleetId: "f2" },
  { id: "ORD-1044", customerId: "c2", customerName: "Lucrisha Polton", storeSlug: "grabngo", items: [{ productId: "gg-1", name: "Butter Scone (2 pack)", qty: 2, price: 18.99 }, { productId: "gg-4", name: "Cappuccino Large", qty: 2, price: 28.99 }], total: 95.96, status: "processing", type: "collection", createdAt: "2026-06-21T11:00:00" },
  { id: "ORD-1045", customerId: "c5", customerName: "Kranskop Trading", storeSlug: "powertrade", items: [{ productId: "pt-5", name: "Koo Baked Beans 410g (Case of 24)", qty: 6, price: 365.00 }], total: 2190.00, status: "pending", type: "delivery", createdAt: "2026-06-21T12:30:00", deliveryAddress: "5 Market Sq, Kranskop" },
  { id: "ORD-1046", customerId: "c3", customerName: "Ananth Mahabeer", storeSlug: "supermarket", items: [{ productId: "sm-11", name: "Baby Potatoes 1.5kg", qty: 1, price: 29.99 }, { productId: "sm-5", name: "Seedless Grapes 500g", qty: 2, price: 34.99 }], total: 99.97, status: "processing", type: "delivery", createdAt: "2026-06-21T13:00:00", deliveryAddress: "78 Voortrekker St, Greytown", fleetId: "f3" },
  { id: "ORD-1047", customerId: "c6", customerName: "Agrippa Ndaba", storeSlug: "grabngo", items: [{ productId: "gg-8", name: "Full English Breakfast", qty: 1, price: 69.99 }], total: 69.99, status: "delivered", type: "collection", createdAt: "2026-06-10T07:30:00" },
];

export const COMPETITIONS: Competition[] = [
  { id: "comp1", title: "Win a R2,000 Aheers Shopping Voucher", prize: "R2,000 Voucher", endsAt: "2026-07-15", entries: 342, status: "active" },
  { id: "comp2", title: "Summer Braai Bundle Giveaway", prize: "Braai Bundle worth R1,500", endsAt: "2026-08-01", entries: 128, status: "active" },
  { id: "comp3", title: "Easter Hamper Draw", prize: "Luxury Hamper", endsAt: "2026-04-20", entries: 567, status: "ended" },
];

export function formatCurrency(amount: number): string {
  return `R ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}
