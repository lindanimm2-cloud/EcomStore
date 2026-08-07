"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Wrench,
  X,
  Truck,
  UserPlus,
  UserCog,
  Settings,
  Car,
  Bug,
} from "lucide-react";
import { useFleetOps } from "@/lib/fleet-ops-context";
import { JOB_ROLE_LABELS, JobRole } from "@/lib/rbac-data";
import { PrettySelect } from "@/components/pretty-select";

const BRANCHES = ["All stores", "Supermarket", "PowerTrade", "Hardware", "Grab n Go", "Fleet Hub", "Warehouse", "Head Office"];
const BRANCH_OPTS = BRANCHES.map((b) => ({ value: b, label: b }));
const TYPE_OPTS = [
  { value: "bakkie", label: "Bakkie" },
  { value: "van", label: "Van" },
  { value: "truck", label: "Truck" },
  { value: "trailer", label: "Trailer" },
];

type Panel = "menu" | "add-vehicle" | "assign-driver" | "assign-user" | null;

export function SettingsFab() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    vehicles,
    drivers,
    staff,
    addVehicle,
    assignDriver,
    assignUserBranch,
    assignUserRole,
    addUser,
    getDriverName,
  } = useFleetOps();

  const [panel, setPanel] = useState<Panel>(null);
  const [toast, setToast] = useState("");

  if (!pathname.startsWith("/admin")) return null;
  // Keep chat mobile clean — wrench lives in Settings hub / Lens
  if (pathname.startsWith("/admin/chat")) return null;

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function onAddVehicle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addVehicle({
      name: String(fd.get("name")),
      plate: String(fd.get("plate")),
      capacity: String(fd.get("capacity")),
      type: String(fd.get("type")) as "bakkie" | "van" | "truck" | "trailer",
      branch: String(fd.get("branch")),
      phone: String(fd.get("phone") || ""),
    });
    flash("Vehicle added");
    setPanel("menu");
  }

  function onAssignDriver(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const vehicleId = String(fd.get("vehicleId"));
    const driverId = String(fd.get("driverId"));
    assignDriver(vehicleId, driverId === "none" ? null : driverId);
    flash("Driver assigned");
    setPanel("menu");
  }

  function onAssignUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const mode = String(fd.get("mode"));
    if (mode === "existing") {
      const userId = String(fd.get("userId"));
      assignUserRole(userId, String(fd.get("role")));
      assignUserBranch(userId, String(fd.get("branch")));
      flash("User assignment updated");
    } else {
      addUser({
        name: String(fd.get("name")),
        email: String(fd.get("email")),
        role: String(fd.get("role")),
        branch: String(fd.get("branch")),
        phone: String(fd.get("phone") || ""),
      });
      flash("User invited");
    }
    setPanel("menu");
  }

  const input = "field mt-1";

  return (
    <>
      {toast && (
        <div className="fixed bottom-24 right-6 z-[60] rounded-full bg-aheers-green-dark px-4 py-2 text-sm font-medium text-white shadow-lift">
          {toast}
        </div>
      )}

      {panel && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/30 p-4 sm:items-center sm:justify-center" onClick={() => setPanel(null)}>
          <div
            className="w-full max-w-md animate-fade-up rounded-3xl bg-white shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="font-display text-lg font-semibold text-aheers-green-dark">
                {panel === "menu" && "Settings"}
                {panel === "add-vehicle" && "Add vehicle"}
                {panel === "assign-driver" && "Assign driver"}
                {panel === "assign-user" && "Assign user"}
              </h3>
              <button type="button" onClick={() => setPanel(null)} className="rounded-full p-2 hover:bg-gray-100" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5">
              {panel === "menu" && (
                <div className="space-y-2">
                  {[
                    { id: "add-vehicle" as const, label: "Add vehicle", desc: "Register bakkie, van or truck", icon: Car },
                    { id: "assign-driver" as const, label: "Assign driver", desc: "Link a driver to a vehicle", icon: Truck },
                    { id: "assign-user" as const, label: "Assign user", desc: "Set role & branch for staff", icon: UserCog },
                  ].map(({ id, label, desc, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPanel(id)}
                      className="menu-option"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-aheers-green/10 text-aheers-green">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block font-semibold text-gray-900">{label}</span>
                        <span className="text-xs text-gray-500">{desc}</span>
                      </span>
                    </button>
                  ))}
                  <Link
                    href="/admin/settings/vehicles"
                    onClick={() => setPanel(null)}
                    className="menu-option"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                      <Settings className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block font-semibold text-gray-900">Open settings hub</span>
                      <span className="text-xs text-gray-500">Vehicles · drivers · users · company</span>
                    </span>
                  </Link>
                  <Link
                    href="/admin/dev-issues"
                    onClick={() => setPanel(null)}
                    className="menu-option"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                      <Bug className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block font-semibold text-gray-900">Dev issue inbox</span>
                      <span className="text-xs text-gray-500">Reports from the site</span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setPanel(null);
                      window.dispatchEvent(new Event("aheers:report-issue"));
                    }}
                    className="menu-option"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-aheers-charcoal text-aheers-gold">
                      <Bug className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block font-semibold text-gray-900">Report issue</span>
                      <span className="text-xs text-gray-500">Send a bug to the developer</span>
                    </span>
                  </button>
                </div>
              )}

              {panel === "add-vehicle" && (
                <form onSubmit={onAddVehicle} className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Vehicle name
                    <input name="name" required placeholder="Aheers Delivery 5" className={input} />
                  </label>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Plate
                    <input name="plate" required placeholder="KZN 1234 GP" className={input} />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <PrettySelect name="type" defaultValue="bakkie" options={TYPE_OPTS} label="Type" />
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Capacity
                      <input name="capacity" required placeholder="1.5 ton" className={input} />
                    </label>
                  </div>
                  <PrettySelect name="branch" defaultValue={BRANCHES[0]} options={BRANCH_OPTS} label="Branch" />
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Contact phone
                    <input name="phone" placeholder="082 …" className={input} />
                  </label>
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setPanel("menu")} className="btn-secondary flex-1">
                      Back
                    </button>
                    <button type="submit" className="btn-primary flex-1">
                      Add vehicle
                    </button>
                  </div>
                </form>
              )}

              {panel === "assign-driver" && (
                <form onSubmit={onAssignDriver} className="space-y-3">
                  <PrettySelect
                    name="vehicleId"
                    required
                    label="Vehicle"
                    options={vehicles.map((v) => ({
                      value: v.id,
                      label: v.name,
                      hint: getDriverName(v.driverId),
                    }))}
                  />
                  <PrettySelect
                    name="driverId"
                    required
                    label="Driver"
                    defaultValue="none"
                    options={[
                      { value: "none", label: "Unassigned" },
                      ...drivers.map((d) => ({
                        value: d.id,
                        label: d.name,
                        hint: d.vehicleId ? "Has vehicle" : undefined,
                      })),
                    ]}
                  />
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setPanel("menu")} className="btn-secondary flex-1">
                      Back
                    </button>
                    <button type="submit" className="btn-primary flex-1">
                      Assign driver
                    </button>
                  </div>
                </form>
              )}

              {panel === "assign-user" && (
                <AssignUserForm
                  staff={staff}
                  input={input}
                  onBack={() => setPanel("menu")}
                  onSubmit={onAssignUser}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setPanel(panel ? null : "menu")}
        className="fixed bottom-6 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-aheers-green-dark text-aheers-gold shadow-lift ring-1 ring-aheers-gold/25 transition hover:-translate-y-0.5 hover:bg-aheers-green sm:left-auto sm:right-6 sm:h-14 sm:w-14 sm:bg-white sm:text-aheers-charcoal sm:ring-black/5"
        aria-label="Settings"
      >
        {panel ? <X className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
      </button>
    </>
  );
}

function AssignUserForm({
  staff,
  input,
  onBack,
  onSubmit,
}: {
  staff: { id: string; name: string; email: string; role: string; branch: string }[];
  input: string;
  onBack: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const roles = Object.keys(JOB_ROLE_LABELS) as JobRole[];
  const roleOpts = roles.map((r) => ({ value: r, label: JOB_ROLE_LABELS[r] }));

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input type="hidden" name="mode" value={mode} />
      <div className="flex gap-1 rounded-full bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setMode("existing")}
          className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium ${mode === "existing" ? "bg-white shadow-sm" : ""}`}
        >
          Existing
        </button>
        <button
          type="button"
          onClick={() => setMode("new")}
          className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium ${mode === "new" ? "bg-white shadow-sm" : ""}`}
        >
          Invite new
        </button>
      </div>

      {mode === "existing" ? (
        <PrettySelect
          name="userId"
          required
          label="User"
          options={staff.map((s) => ({ value: s.id, label: s.name, hint: s.email }))}
        />
      ) : (
        <>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Name
            <input name="name" required className={input} />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Email
            <input name="email" type="email" required className={input} />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Phone
            <input name="phone" className={input} />
          </label>
        </>
      )}

      <PrettySelect name="role" required defaultValue="driver" options={roleOpts} label="Role" />
      <PrettySelect name="branch" required defaultValue={BRANCHES[0]} options={BRANCH_OPTS} label="Branch" />
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onBack} className="btn-secondary flex-1">
          Back
        </button>
        <button type="submit" className="btn-primary flex-1">
          {mode === "existing" ? "Save assignment" : "Invite user"}
        </button>
      </div>
    </form>
  );
}
