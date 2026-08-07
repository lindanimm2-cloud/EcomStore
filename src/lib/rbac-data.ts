/** Demo RBAC — aligned with docs/RBAC-PERMISSIONS.md */

export type JobRole =
  | "super_admin"
  | "exec"
  | "store_manager"
  | "crm_manager"
  | "support_agent"
  | "service_counter"
  | "inventory_manager"
  | "fleet_manager"
  | "dispatcher"
  | "driver"
  | "cashier"
  | "finance_manager"
  | "marketing_manager"
  | "wholesale_manager";

export type PermissionLevel = "full" | "read" | "edit" | "approve" | "none";

export interface PermissionRow {
  resource: string;
  module: string;
  levels: Partial<Record<JobRole, PermissionLevel>>;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  employeeNo: string;
  jobRole: JobRole;
  title: string;
  store: string;
  status: "active" | "invited" | "disabled";
  lastLogin: string;
}

export const JOB_ROLE_LABELS: Record<JobRole, string> = {
  super_admin: "CEO / Super Admin",
  exec: "Executive",
  store_manager: "Store Manager",
  crm_manager: "Aheers App Manager",
  support_agent: "Support Agent",
  service_counter: "Service Counter",
  inventory_manager: "Inventory Manager",
  fleet_manager: "Fleet Manager",
  dispatcher: "Dispatcher",
  driver: "Driver",
  cashier: "Cashier",
  finance_manager: "Finance Manager",
  marketing_manager: "Marketing Manager",
  wholesale_manager: "Wholesale Manager",
};

export const STAFF_USERS: StaffUser[] = [
  { id: "s1", name: "Sagren Aheer", email: "sagren@aheers.co.za", phone: "033 413 1156", employeeNo: "EMP-0001", jobRole: "super_admin", title: "CEO", store: "All stores", status: "active", lastLogin: "2026-06-21" },
  { id: "s2", name: "Thandi Nkosi", email: "thandi@aheers.co.za", phone: "033 413 1156", employeeNo: "EMP-1042", jobRole: "store_manager", title: "Store Manager", store: "Supermarket", status: "active", lastLogin: "2026-06-21" },
  { id: "s3", name: "Priya Moodley", email: "counter@aheers.co.za", phone: "033 413 1201", employeeNo: "EMP-1088", jobRole: "service_counter", title: "Service Counter", store: "Supermarket", status: "active", lastLogin: "2026-06-21" },
  { id: "s4", name: "Sipho Mkhize", email: "dispatch@aheers.co.za", phone: "033 413 1210", employeeNo: "EMP-1101", jobRole: "dispatcher", title: "Dispatcher", store: "Fleet Hub", status: "active", lastLogin: "2026-06-20" },
  { id: "s5", name: "Thabo Nkosi", email: "thabo.driver@aheers.co.za", phone: "083 222 3344", employeeNo: "DRV-02", jobRole: "driver", title: "Delivery Driver", store: "Fleet Hub", status: "active", lastLogin: "2026-06-21" },
  { id: "s6", name: "Lerato Dlamini", email: "crm@aheers.co.za", phone: "033 413 1220", employeeNo: "EMP-1205", jobRole: "crm_manager", title: "Aheers App Manager", store: "Head Office", status: "active", lastLogin: "2026-06-19" },
  { id: "s7", name: "Johan van Wyk", email: "stock@aheers.co.za", phone: "033 413 1230", employeeNo: "EMP-1310", jobRole: "inventory_manager", title: "Inventory Manager", store: "Warehouse", status: "active", lastLogin: "2026-06-18" },
  { id: "s8", name: "Fatima Khan", email: "finance@aheers.co.za", phone: "033 413 1240", employeeNo: "EMP-1402", jobRole: "finance_manager", title: "Finance Manager", store: "Head Office", status: "active", lastLogin: "2026-06-17" },
  { id: "s9", name: "Nosipho Cele", email: "marketing@aheers.co.za", phone: "033 413 1250", employeeNo: "EMP-1501", jobRole: "marketing_manager", title: "Marketing Manager", store: "Head Office", status: "invited", lastLogin: "—" },
  { id: "s10", name: "Ayesha Patel", email: "support@aheers.co.za", phone: "033 413 1260", employeeNo: "EMP-1608", jobRole: "support_agent", title: "Support Agent", store: "Head Office", status: "active", lastLogin: "2026-06-21" },
  { id: "s11", name: "Mike Botha", email: "trade.mgr@aheers.co.za", phone: "033 413 1270", employeeNo: "EMP-1703", jobRole: "wholesale_manager", title: "PowerTrade Manager", store: "PowerTrade", status: "active", lastLogin: "2026-06-20" },
  { id: "s12", name: "Zanele Mthembu", email: "cashier01@aheers.co.za", phone: "033 413 1280", employeeNo: "EMP-1801", jobRole: "cashier", title: "Cashier", store: "Supermarket", status: "disabled", lastLogin: "2026-05-02" },
];

export const PERMISSION_MATRIX: PermissionRow[] = [
  { resource: "Customer 360", module: "Aheers App", levels: { super_admin: "full", store_manager: "read", crm_manager: "full", support_agent: "read", service_counter: "read", marketing_manager: "read", finance_manager: "read" } },
  { resource: "Support tickets", module: "Aheers App", levels: { super_admin: "full", crm_manager: "full", support_agent: "edit", service_counter: "edit", store_manager: "read" } },
  { resource: "Lead pipeline", module: "Aheers App", levels: { super_admin: "full", crm_manager: "full", wholesale_manager: "edit", marketing_manager: "edit", store_manager: "read" } },
  { resource: "Segments & campaigns", module: "Aheers App", levels: { super_admin: "full", crm_manager: "edit", marketing_manager: "full", store_manager: "none" } },
  { resource: "Place order (on behalf)", module: "Commerce", levels: { super_admin: "full", service_counter: "edit", support_agent: "edit", store_manager: "read", cashier: "none" } },
  { resource: "Refunds", module: "Commerce", levels: { super_admin: "approve", store_manager: "approve", service_counter: "edit", cashier: "edit", finance_manager: "approve" } },
  { resource: "Promotions", module: "Marketing", levels: { super_admin: "approve", marketing_manager: "full", store_manager: "edit", crm_manager: "none" } },
  { resource: "Inventory adjust", module: "Inventory", levels: { super_admin: "full", inventory_manager: "full", store_manager: "approve", cashier: "none", finance_manager: "read" } },
  { resource: "Purchase orders", module: "Inventory", levels: { super_admin: "approve", inventory_manager: "full", wholesale_manager: "edit", finance_manager: "approve", store_manager: "edit" } },
  { resource: "Fleet assign", module: "Fleet", levels: { super_admin: "full", fleet_manager: "full", dispatcher: "full", store_manager: "edit", driver: "none" } },
  { resource: "Live GPS", module: "Fleet", levels: { super_admin: "full", fleet_manager: "full", dispatcher: "full", store_manager: "read", driver: "read" } },
  { resource: "POD capture", module: "Fleet", levels: { super_admin: "read", dispatcher: "read", driver: "full", store_manager: "read" } },
  { resource: "Reports / BI", module: "Finance", levels: { super_admin: "full", exec: "full", finance_manager: "full", store_manager: "read", crm_manager: "read" } },
  { resource: "User & role admin", module: "Settings", levels: { super_admin: "full", exec: "edit", store_manager: "none", crm_manager: "none", finance_manager: "none" } },
  { resource: "Org settings", module: "Settings", levels: { super_admin: "full", exec: "edit", finance_manager: "read", store_manager: "read" } },
  { resource: "Audit logs", module: "Settings", levels: { super_admin: "full", finance_manager: "read", exec: "read", store_manager: "none" } },
];

export const AUDIT_LOG = [
  { id: "a1", at: "2026-06-21 14:22", actor: "Thandi Nkosi", action: "Updated customer note", target: "c2 Lucrisha Polton", ip: "41.13.x.x" },
  { id: "a2", at: "2026-06-21 13:05", actor: "Priya Moodley", action: "Ticket status → pending", target: "TKT-201", ip: "41.13.x.x" },
  { id: "a3", at: "2026-06-21 11:40", actor: "Sipho Mkhize", action: "Assigned driver DRV-02", target: "ORD-1043", ip: "41.13.x.x" },
  { id: "a4", at: "2026-06-20 16:12", actor: "Sagren Aheer", action: "Changed rewards cashback %", target: "Settings → Rewards", ip: "41.13.x.x" },
  { id: "a5", at: "2026-06-20 09:01", actor: "Lerato Dlamini", action: "Created segment VIP Platinum", target: "SEG-04", ip: "41.13.x.x" },
  { id: "a6", at: "2026-06-19 15:33", actor: "Johan van Wyk", action: "Stock adjust −12", target: "sm-1 Fresh Milk 2L", ip: "41.13.x.x" },
];

export function levelLabel(level?: PermissionLevel) {
  if (!level || level === "none") return "—";
  if (level === "full") return "Full";
  if (level === "read") return "Read";
  if (level === "edit") return "Edit";
  if (level === "approve") return "Approve";
  return level;
}

export function levelClass(level?: PermissionLevel) {
  if (!level || level === "none") return "bg-gray-50 text-gray-400";
  if (level === "full") return "bg-aheers-green/10 text-aheers-green font-semibold";
  if (level === "approve") return "bg-amber-50 text-amber-800 font-semibold";
  if (level === "edit") return "bg-blue-50 text-blue-700";
  return "bg-slate-100 text-slate-600";
}
