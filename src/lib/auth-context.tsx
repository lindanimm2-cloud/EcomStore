"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export type UserRole =
  | "customer"
  | "staff"
  | "driver"
  | "trade"
  | "dispatcher"
  | "service_counter";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  customerId?: string;
  employeeNo?: string;
  title?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, allowedRoles?: UserRole[]) => Promise<{ ok: boolean; error?: string; user?: AuthUser }>;
  loginOtp: (phone: string, code: string, allowedRoles?: UserRole[]) => Promise<{ ok: boolean; error?: string; user?: AuthUser }>;
  logout: () => void;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  requireRole: (roles: UserRole[]) => boolean;
}

const STORAGE_KEY = "aheers-auth-v1";

/** Demo accounts — password is always `aheers123` or OTP `123456` */
export const DEMO_USERS: (AuthUser & { password: string })[] = [
  {
    id: "u-c2",
    name: "Lucrisha Polton",
    email: "lucrisha.p@gmail.com",
    phone: "0834567890",
    role: "customer",
    customerId: "c2",
    password: "aheers123",
    title: "VIP Customer",
  },
  {
    id: "u-c1",
    name: "Hayley Holst",
    email: "hayley.h@email.co.za",
    phone: "0823456789",
    role: "customer",
    customerId: "c1",
    password: "aheers123",
    title: "Retail Customer",
  },
  {
    id: "u-ceo",
    name: "Sagren Aheer",
    email: "sagren@aheers.co.za",
    phone: "0334131156",
    role: "staff",
    employeeNo: "EMP-0001",
    password: "aheers123",
    title: "CEO / Super Admin",
  },
  {
    id: "u-crm",
    name: "Lerato Dlamini",
    email: "crm@aheers.co.za",
    role: "staff",
    employeeNo: "EMP-1205",
    password: "aheers123",
    title: "CRM Manager",
  },
  {
    id: "u-staff",
    name: "Thandi Nkosi",
    email: "thandi@aheers.co.za",
    phone: "0334131200",
    role: "staff",
    employeeNo: "EMP-1042",
    password: "aheers123",
    title: "Store Manager",
  },
  {
    id: "u-counter",
    name: "Priya Moodley",
    email: "counter@aheers.co.za",
    role: "service_counter",
    employeeNo: "EMP-1088",
    password: "aheers123",
    title: "Service Counter",
  },
  {
    id: "u-driver",
    name: "Thabo Nkosi",
    email: "thabo.driver@aheers.co.za",
    phone: "0832223344",
    role: "driver",
    employeeNo: "DRV-02",
    password: "aheers123",
    title: "Delivery Driver",
  },
  {
    id: "u-dispatch",
    name: "Sipho Mkhize",
    email: "dispatch@aheers.co.za",
    role: "dispatcher",
    employeeNo: "EMP-1101",
    password: "aheers123",
    title: "Dispatcher",
  },
  {
    id: "u-trade",
    name: "Greytown Spaza Shop",
    email: "orders@greytownspaza.co.za",
    phone: "0331234567",
    role: "trade",
    customerId: "c4",
    password: "aheers123",
    title: "Trade Account",
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = useCallback(async (email: string, password: string, allowedRoles?: UserRole[]) => {
    await delay(600);
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: "Invalid email or password" };
    if (allowedRoles?.length && !allowedRoles.includes(found.role)) {
      return { ok: false, error: `This portal is for ${allowedRoles.join(" / ")} accounts only` };
    }
    const { password: _, ...safe } = found;
    persist(safe);
    return { ok: true, user: safe };
  }, []);

  const loginOtp = useCallback(async (phone: string, code: string, allowedRoles?: UserRole[]) => {
    await delay(500);
    const digits = phone.replace(/\D/g, "");
    if (code !== "123456") return { ok: false, error: "Invalid OTP — use 123456 for demo" };
    const found = DEMO_USERS.find((u) => u.phone?.replace(/\D/g, "") === digits);
    if (!found) return { ok: false, error: "Phone not registered" };
    if (allowedRoles?.length && !allowedRoles.includes(found.role)) {
      return { ok: false, error: `This portal is for ${allowedRoles.join(" / ")} accounts only` };
    }
    const { password: _, ...safe } = found;
    persist(safe);
    return { ok: true, user: safe };
  }, []);

  const logout = useCallback(() => {
    persist(null);
  }, []);

  const register = useCallback(async (data: { name: string; email: string; phone: string; password: string }) => {
    await delay(700);
    if (DEMO_USERS.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: "Email already registered — try logging in" };
    }
    const newUser: AuthUser = {
      id: `u-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "customer",
      title: "New Customer",
    };
    persist(newUser);
    return { ok: true };
  }, []);

  const requireRole = useCallback(
    (roles: UserRole[]) => !!user && roles.includes(user.role),
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, loginOtp, logout, register, requireRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
