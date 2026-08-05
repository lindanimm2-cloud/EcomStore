export interface OrgSettings {
  companyName: string;
  tradingAs: string;
  vatNumber: string;
  regNumber: string;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  currency: string;
}

export interface StoreSettings {
  id: string;
  name: string;
  open: string;
  close: string;
  minOrder: number;
  deliveryFee: number;
  deliveryRadiusKm: number;
  taxRate: number;
  enabled: boolean;
}

export interface RewardsSettings {
  cashbackPercent: number;
  pointsPerRand: number;
  platinumThreshold: number;
  goldThreshold: number;
  silverThreshold: number;
  expiryMonths: number;
  infinityApiLive: boolean;
}

export interface NotificationSettings {
  orderSms: boolean;
  orderEmail: boolean;
  orderWhatsapp: boolean;
  promoSms: boolean;
  lowStockAlert: boolean;
  lateDeliveryAlert: boolean;
  ticketSlaAlert: boolean;
}

export interface IntegrationSettings {
  payfast: boolean;
  ozow: boolean;
  yoco: boolean;
  whatsappBusiness: boolean;
  infinityRewards: boolean;
  googleMaps: boolean;
  smsGateway: boolean;
}

export const DEFAULT_ORG: OrgSettings = {
  companyName: "Aheers Group (Pty) Ltd",
  tradingAs: "Aheers",
  vatNumber: "4XXXXXXXXXX",
  regNumber: "20XX/XXXXXX/07",
  address: "93 Voortrekker St, Greytown, 3250",
  phone: "033 413 1156",
  email: "info@aheers.co.za",
  timezone: "Africa/Johannesburg",
  currency: "ZAR",
};

export const DEFAULT_STORES: StoreSettings[] = [
  { id: "supermarket", name: "Aheers Supermarket", open: "07:00", close: "19:00", minOrder: 150, deliveryFee: 35, deliveryRadiusKm: 12, taxRate: 15, enabled: true },
  { id: "powertrade", name: "Aheers PowerTrade", open: "06:30", close: "17:30", minOrder: 500, deliveryFee: 0, deliveryRadiusKm: 40, taxRate: 15, enabled: true },
  { id: "buildsave", name: "Aheers Hardware", open: "07:00", close: "17:00", minOrder: 200, deliveryFee: 80, deliveryRadiusKm: 25, taxRate: 15, enabled: true },
  { id: "grabngo", name: "Grab n Go", open: "06:00", close: "20:00", minOrder: 0, deliveryFee: 25, deliveryRadiusKm: 5, taxRate: 15, enabled: true },
  { id: "foodworks", name: "Foodworks", open: "08:00", close: "17:00", minOrder: 100, deliveryFee: 30, deliveryRadiusKm: 10, taxRate: 15, enabled: false },
];

export const DEFAULT_REWARDS: RewardsSettings = {
  cashbackPercent: 1,
  pointsPerRand: 1,
  platinumThreshold: 20000,
  goldThreshold: 10000,
  silverThreshold: 3000,
  expiryMonths: 24,
  infinityApiLive: false,
};

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  orderSms: true,
  orderEmail: true,
  orderWhatsapp: true,
  promoSms: false,
  lowStockAlert: true,
  lateDeliveryAlert: true,
  ticketSlaAlert: true,
};

export const DEFAULT_INTEGRATIONS: IntegrationSettings = {
  payfast: true,
  ozow: true,
  yoco: false,
  whatsappBusiness: true,
  infinityRewards: true,
  googleMaps: true,
  smsGateway: true,
};

export const SEGMENTS = [
  { id: "SEG-01", name: "VIP Platinum", count: 128, rule: "tier = platinum", channel: "WhatsApp" },
  { id: "SEG-02", name: "Trade accounts", count: 86, rule: "type = trade", channel: "Email" },
  { id: "SEG-03", name: "Lapsed 60 days", count: 412, rule: "last_order > 60d", channel: "SMS" },
  { id: "SEG-04", name: "Grab n Go regulars", count: 240, rule: "store = grabngo ≥ 3 orders/mo", channel: "Push" },
];

export const PROMOTIONS = [
  { id: "PR-01", name: "Milk Monday", type: "SKU discount", status: "active", stores: "Supermarket", ends: "2026-07-01" },
  { id: "PR-02", name: "Trade oil case deal", type: "Bulk pricing", status: "active", stores: "PowerTrade", ends: "2026-08-15" },
  { id: "PR-03", name: "Breakfast bundle", type: "Bundle", status: "scheduled", stores: "Grab n Go", ends: "2026-07-20" },
  { id: "PR-04", name: "Hardware paint 10%", type: "% off category", status: "ended", stores: "Hardware", ends: "2026-05-30" },
];

export interface ProfileSettings {
  fullName: string;
  title: string;
  phone: string;
  email: string;
  hourlyRate: number;
  initials: string;
}

export interface SecuritySettings {
  twoFactor: boolean;
  sessionTimeoutMin: number;
  requireStrongPassword: boolean;
  loginAlerts: boolean;
}

export interface DisplaySettings {
  calendarView: "month" | "week" | "day" | "agenda";
  compactSidebar: boolean;
  showMeetingPreviews: boolean;
  denserTables: boolean;
  smartLensOnLaunch: boolean;
}

export const DEFAULT_PROFILE: ProfileSettings = {
  fullName: "Lerato Dlamini",
  title: "CRM Lead",
  phone: "+27 82 100 2002",
  email: "crm@aheers.co.za",
  hourlyRate: 0,
  initials: "LD",
};

export const DEFAULT_SECURITY: SecuritySettings = {
  twoFactor: true,
  sessionTimeoutMin: 45,
  requireStrongPassword: true,
  loginAlerts: true,
};

export const DEFAULT_DISPLAY: DisplaySettings = {
  calendarView: "month",
  compactSidebar: false,
  showMeetingPreviews: true,
  denserTables: false,
  smartLensOnLaunch: true,
};

export const SETTINGS_STORAGE_KEY = "aheers-settings-v1";
