"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import {
  DEFAULT_SECURITY,
  SETTINGS_STORAGE_KEY,
} from "@/lib/settings-data";
import { getOpsSnapshot } from "@/lib/ops-snapshot";
import { buildFarewellReply } from "@/lib/ops-assistant";
import { takeLogoutFarewell } from "@/lib/ops-session";

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
  /** Minutes of inactivity before auto sign-out */
  sessionTimeoutMin: number;
}

const STORAGE_KEY = "aheers-auth-v1";
const META_KEY = "aheers-auth-meta-v1";
const EXPIRED_FLAG = "aheers-session-expired";

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
    title: "Aheers App Manager",
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

function readTimeoutMin(): number {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const min = Number(data?.security?.sessionTimeoutMin);
      if (Number.isFinite(min) && min >= 1) return Math.min(240, Math.floor(min));
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_SECURITY.sessionTimeoutMin;
}

function readLastActive(): number | null {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return null;
    const meta = JSON.parse(raw) as { lastActiveAt?: number };
    return typeof meta.lastActiveAt === "number" ? meta.lastActiveAt : null;
  } catch {
    return null;
  }
}

function writeLastActive(at: number) {
  localStorage.setItem(META_KEY, JSON.stringify({ lastActiveAt: at }));
}

function clearMeta() {
  localStorage.removeItem(META_KEY);
}

function isExpired(lastActiveAt: number | null, timeoutMin: number) {
  if (lastActiveAt == null) return true;
  return Date.now() - lastActiveAt > timeoutMin * 60 * 1000;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionTimeoutMin, setSessionTimeoutMin] = useState(DEFAULT_SECURITY.sessionTimeoutMin);
  const userRef = useRef<AuthUser | null>(null);
  const timeoutRef = useRef(sessionTimeoutMin);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    timeoutRef.current = sessionTimeoutMin;
  }, [sessionTimeoutMin]);

  const persist = useCallback((u: AuthUser | null, touch = true) => {
    setUser(u);
    userRef.current = u;
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      if (touch) writeLastActive(Date.now());
    } else {
      localStorage.removeItem(STORAGE_KEY);
      clearMeta();
    }
  }, []);

  const expireSession = useCallback(() => {
    if (!userRef.current) return;
    try {
      sessionStorage.setItem(EXPIRED_FLAG, "1");
    } catch {
      /* ignore */
    }
    persist(null, false);
  }, [persist]);

  const touchActivity = useCallback(() => {
    if (!userRef.current) return;
    writeLastActive(Date.now());
  }, []);

  const checkIdle = useCallback(() => {
    if (!userRef.current) return;
    const last = readLastActive();
    if (isExpired(last, timeoutRef.current)) {
      expireSession();
    }
  }, [expireSession]);

  // Restore session or drop if idle timeout already passed
  useEffect(() => {
    try {
      const timeoutMin = readTimeoutMin();
      setSessionTimeoutMin(timeoutMin);
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const last = readLastActive();
        if (isExpired(last, timeoutMin)) {
          localStorage.removeItem(STORAGE_KEY);
          clearMeta();
          try {
            sessionStorage.setItem(EXPIRED_FLAG, "1");
          } catch {
            /* ignore */
          }
          setUser(null);
        } else {
          setUser(JSON.parse(raw) as AuthUser);
          writeLastActive(Date.now());
        }
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  // Pick up security timeout changes from Settings
  useEffect(() => {
    function syncTimeout() {
      setSessionTimeoutMin(readTimeoutMin());
    }
    window.addEventListener("aheers:settings", syncTimeout);
    window.addEventListener("storage", syncTimeout);
    return () => {
      window.removeEventListener("aheers:settings", syncTimeout);
      window.removeEventListener("storage", syncTimeout);
    };
  }, []);

  // Idle watchers while signed in
  useEffect(() => {
    if (!user) return;

    const activityEvents = ["pointerdown", "keydown", "touchstart", "scroll", "mousemove"] as const;
    let throttleUntil = 0;
    function onActivity() {
      const now = Date.now();
      if (now < throttleUntil) return;
      throttleUntil = now + 15_000;
      touchActivity();
    }

    activityEvents.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));

    const interval = window.setInterval(checkIdle, 20_000);

    function onVisibility() {
      if (document.visibilityState === "visible") checkIdle();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      activityEvents.forEach((ev) => window.removeEventListener(ev, onActivity));
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [user, touchActivity, checkIdle]);

  const login = useCallback(
    async (email: string, password: string, allowedRoles?: UserRole[]) => {
      await delay(600);
      const found = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      if (!found) return { ok: false, error: "Invalid email or password" };
      if (allowedRoles?.length && !allowedRoles.includes(found.role)) {
        return { ok: false, error: `This portal is for ${allowedRoles.join(" / ")} accounts only` };
      }
      const { password: _, ...safe } = found;
      try {
        sessionStorage.removeItem(EXPIRED_FLAG);
      } catch {
        /* ignore */
      }
      persist(safe);
      return { ok: true, user: safe };
    },
    [persist]
  );

  const loginOtp = useCallback(
    async (phone: string, code: string, allowedRoles?: UserRole[]) => {
      await delay(500);
      const digits = phone.replace(/\D/g, "");
      if (code !== "123456") return { ok: false, error: "Invalid OTP — use 123456 for demo" };
      const found = DEMO_USERS.find((u) => u.phone?.replace(/\D/g, "") === digits);
      if (!found) return { ok: false, error: "Phone not registered" };
      if (allowedRoles?.length && !allowedRoles.includes(found.role)) {
        return { ok: false, error: `This portal is for ${allowedRoles.join(" / ")} accounts only` };
      }
      const { password: _, ...safe } = found;
      try {
        sessionStorage.removeItem(EXPIRED_FLAG);
      } catch {
        /* ignore */
      }
      persist(safe);
      return { ok: true, user: safe };
    },
    [persist]
  );

  const logout = useCallback(() => {
    const current = userRef.current;
    if (
      current &&
      (current.role === "staff" || current.role === "service_counter" || current.role === "dispatcher")
    ) {
      try {
        const snap = getOpsSnapshot({ email: current.email, name: current.name });
        takeLogoutFarewell(current.id, buildFarewellReply(snap));
      } catch {
        /* ignore */
      }
    }
    try {
      sessionStorage.removeItem(EXPIRED_FLAG);
    } catch {
      /* ignore */
    }
    persist(null, false);
  }, [persist]);

  const register = useCallback(
    async (data: { name: string; email: string; phone: string; password: string }) => {
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
      try {
        sessionStorage.removeItem(EXPIRED_FLAG);
      } catch {
        /* ignore */
      }
      persist(newUser);
      return { ok: true };
    },
    [persist]
  );

  const requireRole = useCallback(
    (roles: UserRole[]) => !!user && roles.includes(user.role),
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginOtp, logout, register, requireRole, sessionTimeoutMin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** One-shot: read & clear “session expired” banner flag */
export function consumeSessionExpiredFlag(): boolean {
  try {
    if (sessionStorage.getItem(EXPIRED_FLAG) === "1") {
      sessionStorage.removeItem(EXPIRED_FLAG);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}
