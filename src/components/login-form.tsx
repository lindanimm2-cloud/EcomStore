"use client";

import { FormEvent, useState, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, UserRole, DEMO_USERS } from "@/lib/auth-context";
import { ReportThisButton, reportAppError } from "@/components/report-issue";

const ROLE_HOME: Record<UserRole, string> = {
  customer: "/portal",
  staff: "/admin",
  service_counter: "/admin/service-desk",
  driver: "/driver",
  dispatcher: "/admin/fleet",
  trade: "/trade",
};

export type LoginVariant = "customer" | "staff" | "driver" | "trade";

const THEMES: Record<
  LoginVariant,
  {
    brand: string;
    input: string;
    button: string;
    tabWrap: string;
    tabActive: string;
    tabIdle: string;
    label: string;
    hint: string;
    link: string;
    panel: string;
    error: string;
  }
> = {
  customer: {
    brand: "font-display text-4xl font-semibold tracking-tight text-aheers-green-dark",
    input:
      "mt-1.5 w-full rounded-2xl border border-aheers-green/15 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-aheers-gold focus:ring-2 focus:ring-aheers-gold/25",
    button:
      "inline-flex w-full items-center justify-center rounded-2xl bg-aheers-green px-5 py-3.5 text-sm font-semibold text-white shadow-lift transition hover:bg-aheers-green-light disabled:opacity-60",
    tabWrap: "mt-6 flex gap-1 rounded-2xl bg-white/60 p-1 ring-1 ring-aheers-green/10",
    tabActive: "flex-1 rounded-xl bg-aheers-green px-3 py-2.5 text-sm font-semibold text-white shadow-soft",
    tabIdle: "flex-1 rounded-xl px-3 py-2.5 text-sm font-medium text-aheers-charcoal/60",
    label: "text-[11px] font-semibold uppercase tracking-[0.16em] text-aheers-green/70",
    hint: "text-center text-xs text-aheers-charcoal/45",
    link: "font-medium text-aheers-green hover:underline",
    panel: "mt-6 space-y-4 rounded-3xl border border-white/70 bg-white/75 p-7 shadow-lift backdrop-blur-xl",
    error: "rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-700",
  },
  staff: {
    brand: "font-display text-3xl font-semibold tracking-tight text-white",
    input:
      "mt-1.5 w-full rounded-lg border border-white/10 bg-[#0c1612] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-aheers-gold/60 focus:ring-1 focus:ring-aheers-gold/40",
    button:
      "inline-flex w-full items-center justify-center rounded-lg bg-aheers-gold px-5 py-3 text-sm font-bold uppercase tracking-wide text-aheers-green-dark transition hover:brightness-110 disabled:opacity-60",
    tabWrap: "",
    tabActive: "",
    tabIdle: "",
    label: "text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40",
    hint: "text-center text-[11px] text-white/35",
    link: "font-medium text-aheers-gold hover:underline",
    panel: "mt-8 space-y-4 rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md",
    error: "rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200",
  },
  driver: {
    brand: "font-display text-3xl font-semibold tracking-tight text-white",
    input:
      "mt-1.5 w-full rounded-xl border border-amber-500/20 bg-black/40 px-3.5 py-3 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20",
    button:
      "inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3.5 text-sm font-bold text-black transition hover:bg-amber-300 disabled:opacity-60",
    tabWrap: "",
    tabActive: "",
    tabIdle: "",
    label: "text-[10px] font-bold uppercase tracking-[0.22em] text-amber-400/80",
    hint: "text-center text-xs text-white/40",
    link: "font-medium text-amber-300 hover:underline",
    panel: "mt-6 space-y-4 rounded-2xl border border-amber-500/20 bg-zinc-900/80 p-6 shadow-[0_0_40px_rgba(251,191,36,0.08)]",
    error: "rounded-xl bg-red-500/15 px-3 py-2 text-sm text-red-300",
  },
  trade: {
    brand: "font-display text-3xl font-semibold tracking-tight text-[#1a1208]",
    input:
      "mt-1.5 w-full rounded-none border border-[#1a1208]/20 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-powertrade-orange focus:ring-1 focus:ring-powertrade-orange/30",
    button:
      "inline-flex w-full items-center justify-center rounded-none bg-powertrade-orange px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-powertrade-dark disabled:opacity-60",
    tabWrap: "",
    tabActive: "",
    tabIdle: "",
    label: "text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1208]/50",
    hint: "text-center text-xs text-[#1a1208]/45",
    link: "font-semibold text-powertrade-orange hover:underline",
    panel: "mt-6 space-y-4 border border-[#1a1208]/15 bg-white p-7 shadow-[8px_8px_0_#1a1208]",
    error: "border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700",
  },
};

export function LoginForm({
  title,
  subtitle,
  allowedRoles,
  showOtp = false,
  demoHint,
  variant = "customer",
  brandLabel = "Aheers",
  footerExtra,
  hideRegister = false,
}: {
  title: string;
  subtitle: string;
  allowedRoles?: UserRole[];
  showOtp?: boolean;
  demoHint?: string;
  variant?: LoginVariant;
  brandLabel?: string;
  footerExtra?: ReactNode;
  hideRegister?: boolean;
}) {
  const { login, loginOtp } = useAuth();
  const router = useRouter();
  const theme = THEMES[variant];
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState(
    allowedRoles?.[0]
      ? DEMO_USERS.find((u) => allowedRoles.includes(u.role))?.email ?? ""
      : "lucrisha.p@gmail.com"
  );
  const [password, setPassword] = useState("aheers123");
  const [phone, setPhone] = useState("0834567890");
  const [otp, setOtp] = useState("123456");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "otp") {
        const res = await loginOtp(phone, otp, allowedRoles);
        if (!res.ok) {
          const msg = res.error ?? "OTP failed";
          setError(msg);
          reportAppError(msg);
          return;
        }
        const role = res.user?.role ?? "customer";
        router.push(ROLE_HOME[role] ?? "/portal");
        return;
      }
      const res = await login(email, password, allowedRoles);
      if (!res.ok || !res.user) {
        const msg = res.error ?? "Login failed";
        setError(msg);
        reportAppError(msg);
        return;
      }
      router.push(ROLE_HOME[res.user.role]);
    } finally {
      setBusy(false);
    }
  }

  const titleColor =
    variant === "customer"
      ? "text-aheers-charcoal"
      : variant === "trade"
        ? "text-[#1a1208]"
        : "text-white";
  const subColor =
    variant === "customer"
      ? "text-gray-500"
      : variant === "trade"
        ? "text-[#1a1208]/60"
        : "text-white/55";

  return (
    <div className="w-full max-w-md animate-fade-up">
      <p className={theme.brand}>{brandLabel}</p>
      <h1 className={`mt-4 font-display text-2xl font-semibold md:text-3xl ${titleColor}`}>{title}</h1>
      <p className={`mt-2 text-sm leading-relaxed ${subColor}`}>{subtitle}</p>

      {showOtp && (
        <div className={theme.tabWrap}>
          <button type="button" onClick={() => setMode("password")} className={mode === "password" ? theme.tabActive : theme.tabIdle}>
            Email
          </button>
          <button type="button" onClick={() => setMode("otp")} className={mode === "otp" ? theme.tabActive : theme.tabIdle}>
            Phone OTP
          </button>
        </div>
      )}

      <form onSubmit={onSubmit} className={theme.panel}>
        {mode === "password" ? (
          <>
            <div>
              <label className={theme.label}>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={theme.input} />
            </div>
            <div>
              <label className={theme.label}>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={theme.input} />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className={theme.label}>Mobile</label>
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={theme.input} />
            </div>
            <div>
              <label className={theme.label}>OTP</label>
              <input required value={otp} onChange={(e) => setOtp(e.target.value)} className={theme.input} />
            </div>
          </>
        )}

        {error && (
          <div className={`${theme.error} flex flex-wrap items-center justify-between gap-2`}>
            <span>{error}</span>
            <ReportThisButton
              context={error}
              className={
                variant === "customer" || variant === "trade"
                  ? "text-red-800 shrink-0"
                  : "text-red-200 shrink-0"
              }
            />
          </div>
        )}

        <button type="submit" disabled={busy} className={theme.button}>
          {busy ? "Signing in…" : variant === "staff" ? "Access operations" : variant === "driver" ? "Start shift" : variant === "trade" ? "Enter trade portal" : "Sign in"}
        </button>

        <p className={theme.hint}>{demoHint ?? "Demo password: aheers123 · OTP: 123456"}</p>
      </form>

      <div className={`mt-6 text-center text-sm ${subColor}`}>
        {footerExtra}
        {!hideRegister && (
          <>
            {footerExtra ? " · " : null}
            <Link href="/register" className={theme.link}>
              Create account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
