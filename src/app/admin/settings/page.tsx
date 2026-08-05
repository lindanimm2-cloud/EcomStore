"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import {
  DEFAULT_ORG,
  DEFAULT_STORES,
  DEFAULT_REWARDS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_INTEGRATIONS,
  DEFAULT_PROFILE,
  DEFAULT_SECURITY,
  DEFAULT_DISPLAY,
  SETTINGS_STORAGE_KEY,
  OrgSettings,
  StoreSettings,
  RewardsSettings,
  NotificationSettings,
  IntegrationSettings,
  ProfileSettings,
  SecuritySettings,
  DisplaySettings,
} from "@/lib/settings-data";
import { useAuth } from "@/lib/auth-context";
import { PrettySelect } from "@/components/pretty-select";
import {
  User,
  Bell,
  Shield,
  Users,
  Building2,
  CalendarDays,
  Blocks,
  Camera,
  Check,
  ExternalLink,
} from "lucide-react";

type Tab = "profile" | "notifications" | "security" | "users" | "firm" | "calendar" | "modules";

const NAV: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "users", label: "Users", icon: Users },
  { id: "firm", label: "Firm", icon: Building2 },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "modules", label: "Modules", icon: Blocks },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a89060]">
      {children}
    </span>
  );
}

function DarkInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-white/10 bg-[#14181f] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-aheers-gold/50 ${props.className ?? ""}`}
    />
  );
}

/** Gold checkbox card — state always reflects checked visually */
function CheckCard({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition ${
        checked ? "border-aheers-gold/35 bg-aheers-gold/5" : "border-white/10 bg-transparent hover:border-white/20"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
          checked
            ? "border-aheers-gold bg-aheers-gold text-aheers-green-dark"
            : "border-white/25 bg-transparent text-transparent"
        }`}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-white">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-white/40">{hint}</span>}
      </span>
    </button>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-white">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-white/40">{subtitle}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [org, setOrg] = useState(DEFAULT_ORG);
  const [stores, setStores] = useState(DEFAULT_STORES);
  const [rewards, setRewards] = useState(DEFAULT_REWARDS);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [integrations, setIntegrations] = useState(DEFAULT_INTEGRATIONS);
  const [profile, setProfile] = useState(() => ({
    ...DEFAULT_PROFILE,
    fullName: user?.name ?? DEFAULT_PROFILE.fullName,
    email: user?.email ?? DEFAULT_PROFILE.email,
    title: user?.title ?? DEFAULT_PROFILE.title,
    initials: (user?.name ?? "LD")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  }));
  const [security, setSecurity] = useState(DEFAULT_SECURITY);
  const [display, setDisplay] = useState(DEFAULT_DISPLAY);
  const [moduleTab, setModuleTab] = useState<"stores" | "rewards" | "commerce" | "fleet" | "integrations">("stores");
  const [returnDays, setReturnDays] = useState(14);
  const [freeDeliveryOver, setFreeDeliveryOver] = useState(500);
  const [maxStops, setMaxStops] = useState(18);
  const [reorderDays, setReorderDays] = useState(7);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.org) setOrg(data.org);
      if (data.stores) setStores(data.stores);
      if (data.rewards) setRewards(data.rewards);
      if (data.notifications) setNotifications(data.notifications);
      if (data.integrations) setIntegrations(data.integrations);
      if (data.profile) setProfile(data.profile);
      if (data.security) setSecurity(data.security);
      if (data.display) setDisplay(data.display);
      if (data.returnDays) setReturnDays(data.returnDays);
      if (data.freeDeliveryOver) setFreeDeliveryOver(data.freeDeliveryOver);
      if (data.maxStops) setMaxStops(data.maxStops);
      if (data.reorderDays) setReorderDays(data.reorderDays);
    } catch {
      /* ignore */
    }
  }, []);

  function flash(msg: string) {
    setSaved(msg);
    setTimeout(() => setSaved(""), 2500);
  }

  function persist(extra?: Record<string, unknown>) {
    const payload = {
      org,
      stores,
      rewards,
      notifications,
      integrations,
      profile,
      security,
      display,
      returnDays,
      freeDeliveryOver,
      maxStops,
      reorderDays,
      ...extra,
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new Event("aheers:settings"));
  }

  function saveAll(msg = "Settings saved") {
    persist();
    flash(msg);
  }

  function patchOrg(key: keyof OrgSettings, value: string) {
    setOrg((o) => ({ ...o, [key]: value }));
  }

  function patchStore(id: string, patch: Partial<StoreSettings>) {
    setStores((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function patchProfile<K extends keyof ProfileSettings>(key: K, value: ProfileSettings[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function patchSecurity<K extends keyof SecuritySettings>(key: K, value: SecuritySettings[K]) {
    setSecurity((s) => {
      const next = { ...s, [key]: value };
      persist({ security: next });
      return next;
    });
  }

  function patchDisplay<K extends keyof DisplaySettings>(key: K, value: DisplaySettings[K]) {
    setDisplay((d) => {
      const next = { ...d, [key]: value };
      persist({ display: next });
      return next;
    });
  }

  function patchNotifications<K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) {
    setNotifications((n) => {
      const next = { ...n, [key]: value };
      persist({ notifications: next });
      return next;
    });
  }

  function patchIntegrations<K extends keyof IntegrationSettings>(key: K, value: IntegrationSettings[K]) {
    setIntegrations((n) => {
      const next = { ...n, [key]: value };
      persist({ integrations: next });
      return next;
    });
  }

  const field = "space-y-1.5";

  return (
    <div className="flex min-h-screen bg-[#0b0c0e]">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col pt-14 text-white">
        <div className="px-4 pb-2 md:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-aheers-gold/80">Aheers Ops</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Settings</h1>
        </div>

        <div className="mx-4 mb-6 flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0f1218] md:mx-8">
          {/* Left nav */}
          <aside className="hidden w-52 shrink-0 flex-col border-r border-white/8 p-4 sm:flex">
            <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">Settings</p>
            <nav className="space-y-0.5">
              {NAV.map(({ id, label, icon: Icon }) => {
                const active = tab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      active
                        ? "bg-aheers-gold/15 font-semibold text-aheers-gold"
                        : "text-white/50 hover:bg-white/5 hover:text-white/80"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </nav>
            <div className="mt-auto space-y-2 border-t border-white/8 pt-4">
              <Link
                href="/admin/settings/vehicles"
                className="block rounded-lg px-3 py-2 text-xs text-white/40 hover:bg-white/5 hover:text-aheers-gold"
              >
                Vehicles →
              </Link>
              <Link
                href="/admin/settings/drivers"
                className="block rounded-lg px-3 py-2 text-xs text-white/40 hover:bg-white/5 hover:text-aheers-gold"
              >
                Drivers →
              </Link>
            </div>
          </aside>

          {/* Mobile tab strip */}
          <div className="flex w-full flex-col sm:hidden">
            <div className="flex gap-1 overflow-x-auto border-b border-white/8 p-2">
              {NAV.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                    tab === id ? "bg-aheers-gold text-aheers-green-dark" : "bg-white/5 text-white/60"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-5">{renderTab()}</div>
          </div>

          {/* Desktop content */}
          <div className="hidden min-w-0 flex-1 overflow-y-auto p-6 md:p-8 sm:block">{renderTab()}</div>
        </div>

        {saved && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-aheers-gold px-4 py-2 text-sm font-semibold text-aheers-green-dark shadow-lift">
            {saved}
          </div>
        )}
      </div>
    </div>
  );

  function renderTab() {
    if (tab === "profile") {
      return (
        <div>
          <SectionTitle title="Your profile" subtitle={profile.email} />
          <div className="mb-6 flex flex-wrap items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1a1f28] text-2xl font-bold text-aheers-gold ring-2 ring-aheers-gold/30 shadow-[0_0_24px_rgba(201,162,39,0.25)]">
              {profile.initials}
            </div>
            <button
              type="button"
              onClick={() => flash("Photo upload (demo)")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3.5 py-2 text-sm text-white/80 transition hover:border-aheers-gold/40 hover:text-aheers-gold"
            >
              <Camera className="h-4 w-4" /> Add photo
            </button>
          </div>
          <button
            type="button"
            onClick={() => flash("Public profile (demo)")}
            className="mb-6 text-sm font-medium text-aheers-gold hover:underline"
          >
            View public team profile →
          </button>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={field}>
              <FieldLabel>Full name</FieldLabel>
              <DarkInput value={profile.fullName} onChange={(e) => patchProfile("fullName", e.target.value)} />
            </label>
            <label className={field}>
              <FieldLabel>Title</FieldLabel>
              <DarkInput value={profile.title} onChange={(e) => patchProfile("title", e.target.value)} />
            </label>
            <label className={field}>
              <FieldLabel>Phone</FieldLabel>
              <DarkInput value={profile.phone} onChange={(e) => patchProfile("phone", e.target.value)} />
            </label>
            <label className={field}>
              <FieldLabel>Hourly rate (ZAR)</FieldLabel>
              <DarkInput
                type="number"
                value={profile.hourlyRate}
                onChange={(e) => patchProfile("hourlyRate", Number(e.target.value))}
              />
            </label>
            <label className={`${field} sm:col-span-2`}>
              <FieldLabel>Email</FieldLabel>
              <DarkInput value={profile.email} onChange={(e) => patchProfile("email", e.target.value)} />
            </label>
          </div>
          <button
            type="button"
            onClick={() => saveAll("Profile saved")}
            className="mt-8 rounded-lg bg-aheers-gold px-6 py-3 text-sm font-bold text-aheers-green-dark transition hover:bg-[#d4b03a]"
          >
            Save profile
          </button>
        </div>
      );
    }

    if (tab === "notifications") {
      return (
        <div>
          <SectionTitle title="Notifications" subtitle="Channels for orders, stock and CRM alerts" />
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a89060]">Alert channels</p>
          <div className="space-y-2">
            {(
              [
                ["orderSms", "Order SMS", "Customer SMS on order status"],
                ["orderEmail", "Order email", "Email receipts & updates"],
                ["orderWhatsapp", "Order WhatsApp", "WhatsApp Business templates"],
                ["promoSms", "Promo SMS", "POPIA opt-in only"],
                ["lowStockAlert", "Low stock alerts", "Ops inbox when SKUs drop"],
                ["lateDeliveryAlert", "Late delivery alerts", "Fleet ETA slips"],
                ["ticketSlaAlert", "Ticket SLA alerts", "CRM support queue"],
              ] as [keyof NotificationSettings, string, string][]
            ).map(([key, label, hint]) => (
              <CheckCard
                key={key}
                checked={notifications[key]}
                onChange={(v) => patchNotifications(key, v)}
                label={label}
                hint={hint}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => saveAll("Notification prefs saved")}
            className="mt-8 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-aheers-gold/50 hover:text-aheers-gold"
          >
            Save notification options
          </button>
        </div>
      );
    }

    if (tab === "security") {
      return (
        <div>
          <SectionTitle title="Security" subtitle="Access controls for staff accounts" />
          <div className="mb-6">
            <FieldLabel>Session timeout (minutes)</FieldLabel>
            <DarkInput
              type="number"
              value={security.sessionTimeoutMin}
              onChange={(e) => patchSecurity("sessionTimeoutMin", Number(e.target.value))}
              className="max-w-xs"
            />
          </div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a89060]">Protections</p>
          <div className="space-y-2">
            <CheckCard
              checked={security.twoFactor}
              onChange={(v) => patchSecurity("twoFactor", v)}
              label="Two-factor authentication"
              hint="OTP on staff login (demo)"
            />
            <CheckCard
              checked={security.requireStrongPassword}
              onChange={(v) => patchSecurity("requireStrongPassword", v)}
              label="Require strong passwords"
              hint="Min 10 chars · mixed case · number"
            />
            <CheckCard
              checked={security.loginAlerts}
              onChange={(v) => patchSecurity("loginAlerts", v)}
              label="Login alerts"
              hint="Email when a new device signs in"
            />
          </div>
          <button
            type="button"
            onClick={() => saveAll("Security settings saved")}
            className="mt-8 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-aheers-gold/50 hover:text-aheers-gold"
          >
            Save security options
          </button>
        </div>
      );
    }

    if (tab === "users") {
      return (
        <div>
          <SectionTitle title="Users" subtitle="Staff directory, roles and branch assignment" />
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/admin/settings/users", title: "Assign users", desc: "Role · branch · invite" },
              { href: "/admin/users", title: "Users & access", desc: "Full staff directory" },
              { href: "/admin/roles", title: "Roles & permissions", desc: "RBAC matrix" },
              { href: "/admin/settings/drivers", title: "Drivers", desc: "Fleet driver assignment" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group rounded-xl border border-white/10 bg-[#14181f] p-5 transition hover:border-aheers-gold/40"
              >
                <p className="font-semibold text-white group-hover:text-aheers-gold">{c.title}</p>
                <p className="mt-1 text-xs text-white/40">{c.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-aheers-gold">
                  Open <ExternalLink className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    if (tab === "firm") {
      return (
        <div>
          <SectionTitle title="Firm" subtitle="Legal entity and trading details" />
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["companyName", "Legal name"],
                ["tradingAs", "Trading as"],
                ["vatNumber", "VAT number"],
                ["regNumber", "Registration"],
                ["phone", "Phone"],
                ["email", "Email"],
                ["timezone", "Timezone"],
                ["currency", "Currency"],
              ] as [keyof OrgSettings, string][]
            ).map(([key, label]) => (
              <label key={key} className={field}>
                <FieldLabel>{label}</FieldLabel>
                <DarkInput value={org[key]} onChange={(e) => patchOrg(key, e.target.value)} />
              </label>
            ))}
            <label className={`${field} sm:col-span-2`}>
              <FieldLabel>Address</FieldLabel>
              <DarkInput value={org.address} onChange={(e) => patchOrg("address", e.target.value)} />
            </label>
          </div>
          <button
            type="button"
            onClick={() => saveAll("Firm profile saved")}
            className="mt-8 rounded-lg bg-aheers-gold px-6 py-3 text-sm font-bold text-aheers-green-dark transition hover:bg-[#d4b03a]"
          >
            Save firm
          </button>
        </div>
      );
    }

    if (tab === "calendar") {
      return (
        <div>
          <SectionTitle title="Display" subtitle="Calendar and CRM workspace preferences" />
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a89060]">
            Preferred calendar view
          </p>
          <div className="mb-8 max-w-xs">
            <PrettySelect
              dark
              value={display.calendarView}
              onChange={(v) => patchDisplay("calendarView", v as DisplaySettings["calendarView"])}
              options={[
                { value: "month", label: "Month" },
                { value: "week", label: "Week" },
                { value: "day", label: "Day" },
                { value: "agenda", label: "Agenda" },
              ]}
            />
          </div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a89060]">Workspace</p>
          <div className="space-y-2">
            <CheckCard
              checked={display.compactSidebar}
              onChange={(v) => patchDisplay("compactSidebar", v)}
              label="Compact sidebar"
              hint="Tighter navigation spacing."
            />
            <CheckCard
              checked={display.showMeetingPreviews}
              onChange={(v) => patchDisplay("showMeetingPreviews", v)}
              label="Show meeting previews"
              hint="Hover cards on calendar events."
            />
            <CheckCard
              checked={display.denserTables}
              onChange={(v) => patchDisplay("denserTables", v)}
              label="Denser tables"
              hint="More rows on tickets, leads and orders."
            />
            <CheckCard
              checked={display.smartLensOnLaunch}
              onChange={(v) => patchDisplay("smartLensOnLaunch", v)}
              label="Open Aheers Lens on launch"
              hint="Show the floating CRM bar when Ops Hub loads."
            />
          </div>
          <p className="mt-4 text-xs text-white/35">
            Active view: <span className="text-aheers-gold">{display.calendarView}</span>
            {display.compactSidebar ? " · compact sidebar on" : ""}
            {display.denserTables ? " · dense tables on" : ""}
          </p>
          <button
            type="button"
            onClick={() => saveAll("Display options saved")}
            className="mt-8 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-aheers-gold/50 hover:text-aheers-gold"
          >
            Save display options
          </button>
        </div>
      );
    }

    // modules
    return (
      <div>
        <SectionTitle title="Modules" subtitle="Stores · rewards · commerce · fleet · integrations" />
        <div className="mb-5 flex flex-wrap gap-1.5">
          {(
            [
              ["stores", "Stores"],
              ["rewards", "Rewards"],
              ["commerce", "Commerce"],
              ["fleet", "Fleet & stock"],
              ["integrations", "Integrations"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setModuleTab(id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                moduleTab === id
                  ? "bg-aheers-gold text-aheers-green-dark"
                  : "bg-white/5 text-white/55 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {moduleTab === "stores" && (
          <div className="space-y-3">
            {stores.map((s) => (
              <div key={s.id} className="rounded-xl border border-white/10 bg-[#14181f] p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-white">{s.name}</h3>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={s.enabled}
                    onClick={() => {
                      const next = stores.map((x) => (x.id === s.id ? { ...x, enabled: !s.enabled } : x));
                      setStores(next);
                      persist({ stores: next });
                    }}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      s.enabled
                        ? "bg-aheers-gold/20 text-aheers-gold ring-1 ring-aheers-gold/40"
                        : "bg-white/5 text-white/40 ring-1 ring-white/10"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        s.enabled ? "border-aheers-gold bg-aheers-gold text-aheers-green-dark" : "border-white/25"
                      }`}
                    >
                      {s.enabled && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                    </span>
                    {s.enabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
                  {(
                    [
                      ["open", "Open", s.open],
                      ["close", "Close", s.close],
                    ] as const
                  ).map(([key, label, val]) => (
                    <label key={key} className={field}>
                      <FieldLabel>{label}</FieldLabel>
                      <DarkInput value={val} onChange={(e) => patchStore(s.id, { [key]: e.target.value })} />
                    </label>
                  ))}
                  <label className={field}>
                    <FieldLabel>Min order</FieldLabel>
                    <DarkInput
                      type="number"
                      value={s.minOrder}
                      onChange={(e) => patchStore(s.id, { minOrder: Number(e.target.value) })}
                    />
                  </label>
                  <label className={field}>
                    <FieldLabel>Delivery fee</FieldLabel>
                    <DarkInput
                      type="number"
                      value={s.deliveryFee}
                      onChange={(e) => patchStore(s.id, { deliveryFee: Number(e.target.value) })}
                    />
                  </label>
                  <label className={field}>
                    <FieldLabel>Radius km</FieldLabel>
                    <DarkInput
                      type="number"
                      value={s.deliveryRadiusKm}
                      onChange={(e) => patchStore(s.id, { deliveryRadiusKm: Number(e.target.value) })}
                    />
                  </label>
                  <label className={field}>
                    <FieldLabel>VAT %</FieldLabel>
                    <DarkInput
                      type="number"
                      value={s.taxRate}
                      onChange={(e) => patchStore(s.id, { taxRate: Number(e.target.value) })}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {moduleTab === "rewards" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["cashbackPercent", "Cashback %"],
                  ["pointsPerRand", "Points per R1"],
                  ["platinumThreshold", "Platinum threshold"],
                  ["goldThreshold", "Gold threshold"],
                  ["silverThreshold", "Silver threshold"],
                  ["expiryMonths", "Expiry months"],
                ] as [keyof RewardsSettings, string][]
              ).map(([key, label]) => (
                <label key={key} className={field}>
                  <FieldLabel>{label}</FieldLabel>
                  <DarkInput
                    type="number"
                    value={Number(rewards[key])}
                    onChange={(e) => setRewards({ ...rewards, [key]: Number(e.target.value) })}
                  />
                </label>
              ))}
            </div>
            <CheckCard
              checked={rewards.infinityApiLive}
              onChange={(v) => {
                const next = { ...rewards, infinityApiLive: v };
                setRewards(next);
                persist({ rewards: next });
              }}
              label="Infinity Rewards API live mode"
              hint="Demo uses mock balances until API credentials are connected"
            />
          </div>
        )}

        {moduleTab === "commerce" && (
          <div className="grid max-w-lg gap-4 sm:grid-cols-2">
            <label className={field}>
              <FieldLabel>Free delivery over (R)</FieldLabel>
              <DarkInput type="number" value={freeDeliveryOver} onChange={(e) => setFreeDeliveryOver(Number(e.target.value))} />
            </label>
            <label className={field}>
              <FieldLabel>Return window (days)</FieldLabel>
              <DarkInput type="number" value={returnDays} onChange={(e) => setReturnDays(Number(e.target.value))} />
            </label>
          </div>
        )}

        {moduleTab === "fleet" && (
          <div className="grid max-w-lg gap-4 sm:grid-cols-2">
            <label className={field}>
              <FieldLabel>Max stops per route</FieldLabel>
              <DarkInput type="number" value={maxStops} onChange={(e) => setMaxStops(Number(e.target.value))} />
            </label>
            <label className={field}>
              <FieldLabel>Reorder lead days</FieldLabel>
              <DarkInput type="number" value={reorderDays} onChange={(e) => setReorderDays(Number(e.target.value))} />
            </label>
          </div>
        )}

        {moduleTab === "integrations" && (
          <div className="space-y-2">
            {(
              [
                ["payfast", "PayFast"],
                ["ozow", "Ozow"],
                ["yoco", "Yoco"],
                ["whatsappBusiness", "WhatsApp Business"],
                ["infinityRewards", "Infinity Rewards"],
                ["googleMaps", "Google Maps / routing"],
                ["smsGateway", "SMS gateway"],
              ] as [keyof IntegrationSettings, string][]
            ).map(([key, label]) => (
              <CheckCard
                key={key}
                checked={integrations[key]}
                onChange={(v) => patchIntegrations(key, v)}
                label={label}
                hint={integrations[key] ? "Connected (demo)" : "Disconnected"}
              />
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => saveAll("Module settings saved")}
            className="rounded-lg bg-aheers-gold px-6 py-3 text-sm font-bold text-aheers-green-dark transition hover:bg-[#d4b03a]"
          >
            Save modules
          </button>
          <button
            type="button"
            onClick={() => {
              setOrg(DEFAULT_ORG);
              setStores(DEFAULT_STORES);
              setRewards(DEFAULT_REWARDS);
              setNotifications(DEFAULT_NOTIFICATIONS);
              setIntegrations(DEFAULT_INTEGRATIONS);
              setSecurity(DEFAULT_SECURITY);
              setDisplay(DEFAULT_DISPLAY);
              localStorage.removeItem(SETTINGS_STORAGE_KEY);
              flash("Reset to defaults");
            }}
            className="rounded-lg border border-white/15 px-5 py-3 text-sm text-white/60 hover:border-white/30 hover:text-white"
          >
            Reset defaults
          </button>
        </div>
      </div>
    );
  }
}
