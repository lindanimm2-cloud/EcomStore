"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FLEET_VEHICLES, DEPOT, getStatusLabel } from "@/lib/fleet";
import { formatCurrency } from "@/lib/data";
import { FleetVehicle } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import {
  loadQueue,
  saveQueue,
  queueByStatus,
  DeliveryJob,
  QueueJobStatus,
} from "@/lib/delivery-queue";
import {
  Truck,
  MapPin,
  CheckCircle,
  Camera,
  Navigation,
  Fuel,
  LogOut,
  Settings,
  Clock,
  ExternalLink,
  Crosshair,
  Package,
  Flag,
  ListOrdered,
  Menu,
  X,
  LayoutDashboard,
  FileWarning,
  Users,
  MessageCircle,
  Phone,
  User,
  Play,
  Pause,
  ChevronRight,
} from "lucide-react";

const DRIVER_VEHICLE = FLEET_VEHICLES[1];
const PREFS_KEY = "aheers-driver-prefs-v1";

type DriverStatus = FleetVehicle["status"];
type View = "dashboard" | "queue" | "profile";

type DriverPrefs = {
  autoNavigate: boolean;
  requirePod: boolean;
  shareLiveLocation: boolean;
  soundAlerts: boolean;
};

const DEFAULT_PREFS: DriverPrefs = {
  autoNavigate: true,
  requirePod: true,
  shareLiveLocation: true,
  soundAlerts: true,
};

const STATUS_OPTS: { value: DriverStatus; label: string; hint: string }[] = [
  { value: "idle", label: "Available", hint: "Ready for next job" },
  { value: "en-route", label: "En route", hint: "Driving to stop" },
  { value: "delivering", label: "On scene", hint: "At customer" },
  { value: "returning", label: "Returning", hint: "Back to depot" },
];

function mapsUrl(address: string, lat?: number, lng?: number) {
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function osmEmbed(lat: number, lng: number) {
  const d = 0.012;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function statusBadge(status: QueueJobStatus) {
  const map: Record<QueueJobStatus, string> = {
    new: "bg-violet-100 text-violet-800",
    next: "bg-blue-100 text-blue-800",
    active: "bg-amber-100 text-amber-900",
    delivered: "bg-green-100 text-green-800",
  };
  return map[status];
}

export default function DriverPortalPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isDispatcher = user?.role === "dispatcher";

  const [view, setView] = useState<View>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState<DriverStatus>(DRIVER_VEHICLE.status);
  const [shiftOn, setShiftOn] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<DriverPrefs>(DEFAULT_PREFS);
  const [queue, setQueue] = useState<DeliveryJob[]>([]);
  const [queueTab, setQueueTab] = useState<QueueJobStatus | "all">("all");
  const [deliverNote, setDeliverNote] = useState("");
  const [deliverTarget, setDeliverTarget] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [live, setLive] = useState({
    lat: DRIVER_VEHICLE.lat,
    lng: DRIVER_VEHICLE.lng,
    updatedAt: new Date(),
  });

  useEffect(() => {
    setQueue(loadQueue());
    const refresh = () => setQueue(loadQueue());
    window.addEventListener("aheers:delivery-queue", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("aheers:delivery-queue", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!prefs.shareLiveLocation || !shiftOn) return;
    const id = setInterval(() => {
      setLive((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.00035,
        lng: prev.lng + (Math.random() - 0.5) * 0.00035,
        updatedAt: new Date(),
      }));
    }, 4000);
    return () => clearInterval(id);
  }, [prefs.shareLiveLocation, shiftOn]);

  const activeJob = queue.find((j) => j.status === "active") ?? null;
  const nextJobs = queueByStatus(queue, "next");
  const newJobs = queueByStatus(queue, "new");
  const deliveredJobs = queueByStatus(queue, "delivered");
  const openCount = newJobs.length + nextJobs.length + (activeJob ? 1 : 0);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  function patchQueue(updater: (jobs: DeliveryJob[]) => DeliveryJob[]) {
    setQueue((prev) => {
      const next = updater(prev);
      saveQueue(next);
      return next;
    });
  }

  function setDriverStatus(next: DriverStatus) {
    setStatus(next);
    flash(`Status → ${STATUS_OPTS.find((s) => s.value === next)?.label ?? next}`);
  }

  function promoteToActive(id: string) {
    patchQueue((jobs) =>
      jobs.map((j) => {
        if (j.id === id) return { ...j, status: "active" as const };
        if (j.status === "active") return { ...j, status: "next" as const };
        return j;
      })
    );
    setDriverStatus("en-route");
    setView("dashboard");
    flash("Accepted · now active delivery");
  }

  function setAsNext(id: string) {
    patchQueue((jobs) => jobs.map((j) => (j.id === id ? { ...j, status: "next" as const } : j)));
    flash("Queued as next");
  }

  function openDeliverNote(id: string) {
    setDeliverTarget(id);
    setDeliverNote("");
  }

  function confirmDelivered() {
    if (!deliverTarget) return;
    if (prefs.requirePod && !deliverNote.trim()) {
      flash("Add a delivery note (POD required)");
      return;
    }
    patchQueue((jobs) =>
      jobs.map((j) =>
        j.id === deliverTarget
          ? {
              ...j,
              status: "delivered" as const,
              deliveredNote: deliverNote.trim() || "Delivered · POD captured",
            }
          : j
      )
    );
    setDeliverTarget(null);
    setDeliverNote("");
    setDriverStatus("returning");
    flash("Delivered · note saved");
  }

  function finishTrip() {
    if (activeJob) {
      openDeliverNote(activeJob.id);
      return;
    }
    setStatus("idle");
    setLive({ lat: DEPOT.lat, lng: DEPOT.lng, updatedAt: new Date() });
    flash("Trip finished · available");
  }

  function savePrefs(next: DriverPrefs) {
    setPrefs(next);
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    flash("Settings saved");
  }

  const address = activeJob?.address ?? DEPOT.name;
  const navigateHref = mapsUrl(address, live.lat, live.lng);
  const filteredQueue = queueTab === "all" ? queue : queue.filter((j) => j.status === queueTab);

  const sceneLabel =
    status === "delivering" ? "ON SCENE" : status === "idle" ? "AVAILABLE" : getStatusLabel(status).toUpperCase();

  const NAV_ITEMS = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "queue" as const, label: "Delivery queue", icon: ListOrdered },
    { id: "nav" as const, label: "Navigation", icon: Navigation, action: () => window.open(navigateHref, "_blank") },
    { id: "team" as const, label: "Team chat", icon: Users, action: () => flash("Team chat (demo)") },
    { id: "dispatch" as const, label: "Dispatch chat", icon: MessageCircle, action: () => flash("Dispatch chat (demo)") },
    { id: "calls" as const, label: "Calls", icon: Phone, action: () => flash("Calling dispatch (demo)") },
    { id: "incident" as const, label: "Incident report", icon: FileWarning, action: () => flash("Incident logged (demo)") },
    { id: "profile" as const, label: "Profile & shift", icon: User },
  ];

  function go(id: string) {
    setMenuOpen(false);
    const item = NAV_ITEMS.find((n) => n.id === id);
    if (item && "action" in item && item.action) {
      item.action();
      return;
    }
    if (id === "dashboard" || id === "queue" || id === "profile") setView(id);
  }

  return (
    <div className="min-h-screen bg-aheers-mist">
      {/* Side drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-[min(88vw,17rem)] flex-col bg-[#0d1512] text-white shadow-lift">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-aheers-gold">Aheers Driver</p>
                <p className="font-display text-sm font-semibold">{user?.name?.split(" ")[0] ?? "Driver"}</p>
              </div>
              <button type="button" onClick={() => setMenuOpen(false)} className="rounded-lg p-2 hover:bg-white/10" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 p-3">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const active = view === id || (id === "queue" && view === "queue");
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => go(id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      active ? "bg-aheers-green text-white" : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                    {id === "queue" && newJobs.length > 0 && (
                      <span className="ml-auto rounded-full bg-aheers-gold px-1.5 text-[10px] font-bold text-aheers-green-dark">
                        {newJobs.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
            <div className="border-t border-white/10 p-4">
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/login/driver");
                }}
                className="flex w-full items-center gap-2 text-xs text-white/50 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      <header className="bg-aheers-green-dark px-4 py-4 text-white">
        <div className="mx-auto max-w-lg">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button type="button" onClick={() => setMenuOpen(true)} className="rounded-xl bg-white/10 p-2.5 hover:bg-white/15" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="truncate font-display text-lg font-semibold">
                Hello, {user?.name?.split(" ")[0] ?? DRIVER_VEHICLE.driver.split(" ")[0]}
              </p>
              <p className="text-xs text-white/55">Fleet Hub · Greytown</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                status === "idle"
                  ? "bg-aheers-green/40 text-aheers-gold"
                  : status === "delivering"
                    ? "bg-amber-400/90 text-aheers-green-dark"
                    : "bg-white/15 text-white"
              }`}
            >
              {sceneLabel}
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-aheers-gold" />
                <div>
                  <p className="text-sm font-semibold">Shift · Wed 5 Aug</p>
                  <p className="text-xs text-white/55">06:00 – 15:00 · {DRIVER_VEHICLE.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShiftOn((v) => !v);
                  flash(shiftOn ? "Shift paused" : "On shift");
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                  shiftOn ? "bg-aheers-gold text-aheers-green-dark" : "bg-white/15 text-white"
                }`}
              >
                {shiftOn ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {shiftOn ? "On shift" : "Off"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-5 pb-12">
        {view === "dashboard" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4">
                <p className="text-xs text-gray-500">Active jobs</p>
                <p className="mt-1 text-3xl font-bold text-aheers-charcoal">{openCount}</p>
              </div>
              <div className="rounded-2xl border border-aheers-green/20 bg-aheers-green/5 p-4">
                <p className="text-xs text-aheers-green">Completed today</p>
                <p className="mt-1 text-3xl font-bold text-aheers-green-dark">{deliveredJobs.length}</p>
              </div>
            </div>

            {!activeJob ? (
              <div className="card p-5">
                <h2 className="font-semibold text-gray-900">No active assignment</h2>
                <p className="mt-1 text-sm text-gray-500">You are available. Check the delivery queue for new dispatches and customer requests.</p>
                <button type="button" onClick={() => setView("queue")} className="btn-primary mt-4 w-full">
                  View queue
                </button>
              </div>
            ) : (
              <div className="card p-4">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-gray-900">Current delivery</h2>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                    {sceneLabel}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-aheers-red" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activeJob.address}</p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {activeJob.orderId} · {activeJob.customerName}
                    </p>
                    {activeJob.note && <p className="mt-1 text-xs italic text-gray-400">{activeJob.note}</p>}
                    {activeJob.requestedBy === "customer" && (
                      <span className="mt-1 inline-block rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-800">
                        Customer request
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 rounded-xl bg-aheers-mist/80 p-3">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-aheers-green-dark">
                    <Package className="h-4 w-4" />
                    Ordered · {activeJob.units} units
                    {activeJob.total > 0 ? ` · ${formatCurrency(activeJob.total)}` : ""}
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a href={navigateHref} target="_blank" rel="noreferrer" className="btn-primary text-sm">
                    <Navigation className="h-4 w-4" /> Navigate
                  </a>
                  <button type="button" onClick={() => flash("POD camera (demo)")} className="btn-secondary text-sm">
                    <Camera className="h-4 w-4" /> POD Photo
                  </button>
                </div>
                <a
                  href={mapsUrl(activeJob.address)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-aheers-green/20 bg-white px-3 py-2.5 text-sm font-semibold text-aheers-green-dark hover:bg-aheers-mist"
                >
                  <ExternalLink className="h-4 w-4" /> Show address on map
                </a>
                <button
                  type="button"
                  onClick={() => openDeliverNote(activeJob.id)}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-aheers-green px-3 py-3 text-sm font-bold text-white hover:bg-aheers-green-light"
                >
                  <CheckCircle className="h-4 w-4" /> Mark delivered + note
                </button>
                <button
                  type="button"
                  onClick={finishTrip}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-aheers-green-dark px-3 py-2.5 text-sm font-semibold text-white"
                >
                  <Flag className="h-4 w-4" /> Finish trip
                </button>
              </div>
            )}

            {nextJobs[0] && (
              <button
                type="button"
                onClick={() => setView("queue")}
                className="card flex w-full items-center justify-between p-4 text-left hover:bg-white"
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">Next up</p>
                  <p className="font-semibold text-gray-900">{nextJobs[0].customerName}</p>
                  <p className="text-xs text-gray-500">{nextJobs[0].address}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            )}

            <div className="card overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Crosshair className={`h-4 w-4 ${prefs.shareLiveLocation && shiftOn ? "text-aheers-green" : "text-gray-400"}`} />
                  <div>
                    <h2 className="text-sm font-semibold">Live location</h2>
                    <p className="text-[11px] text-gray-400">
                      {prefs.shareLiveLocation && shiftOn
                        ? `Updating · ${live.updatedAt.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                        : "Sharing paused"}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    prefs.shareLiveLocation && shiftOn ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {prefs.shareLiveLocation && shiftOn ? "Live" : "Off"}
                </span>
              </div>
              <div className="h-40 bg-gray-100">
                <iframe title="map" className="h-full w-full border-0" src={osmEmbed(live.lat, live.lng)} loading="lazy" />
              </div>
            </div>

            <div className="card p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Trip status</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {STATUS_OPTS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setDriverStatus(s.value)}
                    className={`rounded-xl px-2 py-2.5 text-center text-xs font-semibold transition ${
                      status === s.value ? "bg-aheers-green text-white" : "bg-aheers-mist text-gray-600 ring-1 ring-gray-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {view === "queue" && (
          <>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["all", "All", queue.length],
                  ["new", "New", newJobs.length],
                  ["next", "Next", nextJobs.length],
                  ["active", "Active", activeJob ? 1 : 0],
                  ["delivered", "Delivered", deliveredJobs.length],
                ] as const
              ).map(([id, label, count]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setQueueTab(id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    queueTab === id ? "bg-aheers-green text-white" : "bg-white text-gray-600 ring-1 ring-gray-200"
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>

            <ul className="space-y-3">
              {filteredQueue.length === 0 && (
                <li className="card p-8 text-center text-sm text-gray-400">No jobs in this filter</li>
              )}
              {filteredQueue.map((j) => (
                <li key={j.id} className="card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusBadge(j.status)}`}>
                          {j.status}
                        </span>
                        {j.requestedBy === "customer" && (
                          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-800">
                            Customer req
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 font-semibold text-gray-900">{j.customerName}</p>
                      <p className="text-xs text-gray-500">{j.address}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {j.orderId} · {j.units} units
                        {j.total > 0 ? ` · ${formatCurrency(j.total)}` : ""}
                      </p>
                      {j.note && <p className="mt-1 text-xs italic text-gray-400">{j.note}</p>}
                      {j.deliveredNote && (
                        <p className="mt-2 rounded-lg bg-aheers-mist px-2.5 py-1.5 text-xs text-aheers-green-dark">
                          Delivery note: {j.deliveredNote}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {j.status === "new" && (
                      <>
                        <button type="button" onClick={() => setAsNext(j.id)} className="btn-secondary text-xs">
                          Set as next
                        </button>
                        <button type="button" onClick={() => promoteToActive(j.id)} className="btn-primary text-xs">
                          Accept / start
                        </button>
                      </>
                    )}
                    {j.status === "next" && (
                      <button type="button" onClick={() => promoteToActive(j.id)} className="btn-primary text-xs">
                        Start delivery
                      </button>
                    )}
                    {j.status === "active" && (
                      <button type="button" onClick={() => openDeliverNote(j.id)} className="btn-primary text-xs">
                        Deliver + note
                      </button>
                    )}
                    <a
                      href={mapsUrl(j.address)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-aheers-green"
                    >
                      <MapPin className="h-3 w-3" /> Map
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {view === "profile" && (
          <>
            <div className="card p-5">
              <h2 className="font-display text-xl font-semibold text-aheers-green-dark">{user?.name ?? DRIVER_VEHICLE.driver}</h2>
              <p className="text-sm text-gray-500">{user?.email ?? "thabo.driver@aheers.co.za"}</p>
              <p className="mt-2 text-sm text-gray-600">
                {DRIVER_VEHICLE.name} · {DRIVER_VEHICLE.capacity} · {DRIVER_VEHICLE.phone}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => flash("Fuel log saved")} className="card flex items-center justify-center gap-2 p-4 text-sm font-medium">
                <Fuel className="h-4 w-4 text-aheers-green" /> Fuel log
              </button>
              <button type="button" onClick={() => flash("Vehicle check started")} className="card flex items-center justify-center gap-2 p-4 text-sm font-medium">
                <Truck className="h-4 w-4 text-aheers-green" /> Vehicle check
              </button>
            </div>
            <button type="button" onClick={() => setShowSettings((s) => !s)} className="card flex w-full items-center gap-2 p-4 text-sm font-medium">
              <Settings className="h-4 w-4" /> Driver settings
            </button>
            {showSettings && (
              <div className="card space-y-2 p-4">
                {(
                  [
                    ["shareLiveLocation", "Share live location", "Visible to dispatch"],
                    ["autoNavigate", "Auto-open navigate", "When status = En route"],
                    ["requirePod", "Require delivery note", "Before mark delivered"],
                    ["soundAlerts", "Sound alerts", "New queue jobs"],
                  ] as [keyof DriverPrefs, string, string][]
                ).map(([key, label, hint]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => savePrefs({ ...prefs, [key]: !prefs[key] })}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-100 px-3 py-2.5 text-left"
                  >
                    <span>
                      <span className="block text-sm font-medium">{label}</span>
                      <span className="text-xs text-gray-400">{hint}</span>
                    </span>
                    <span className={`relative h-6 w-11 rounded-full ${prefs[key] ? "bg-aheers-green" : "bg-gray-200"}`}>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${prefs[key] ? "left-5" : "left-0.5"}`} />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {isDispatcher && (
          <Link href="/admin/fleet" className="block text-center text-sm font-medium text-aheers-green hover:underline">
            Dispatcher view →
          </Link>
        )}
      </main>

      {/* Deliver note modal */}
      {deliverTarget && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lift">
            <h3 className="font-display text-lg font-semibold text-aheers-green-dark">Delivery note</h3>
            <p className="mt-1 text-sm text-gray-500">Customer and dispatch can see this note on the completed job.</p>
            <textarea
              value={deliverNote}
              onChange={(e) => setDeliverNote(e.target.value)}
              rows={3}
              placeholder="e.g. Left with security · POD photo taken · customer signed"
              className="field mt-3"
            />
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setDeliverTarget(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="button" onClick={confirmDelivered} className="btn-primary flex-1">
                Confirm delivered
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-aheers-green-dark px-4 py-2 text-sm font-medium text-white shadow-lift">
          {toast}
        </div>
      )}
    </div>
  );
}
