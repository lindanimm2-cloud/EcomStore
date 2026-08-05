"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { FLEET_VEHICLES } from "@/lib/fleet";
import { STAFF_USERS, JobRole } from "@/lib/rbac-data";

const STORAGE_KEY = "aheers-fleet-ops-v1";

export interface ManagedVehicle {
  id: string;
  name: string;
  plate: string;
  capacity: string;
  type: "bakkie" | "van" | "truck" | "trailer";
  status: "idle" | "en-route" | "delivering" | "returning" | "maintenance";
  driverId: string | null;
  branch: string;
  phone: string;
}

export interface ManagedStaff {
  id: string;
  name: string;
  email: string;
  role: JobRole | string;
  branch: string;
  vehicleId: string | null;
  phone: string;
  status: "active" | "invited" | "disabled";
}

function seedVehicles(): ManagedVehicle[] {
  return FLEET_VEHICLES.map((v, i) => ({
    id: v.id,
    name: v.name,
    plate: `KZN ${1200 + i} GP`,
    capacity: v.capacity,
    type: (v.capacity.includes("8") ? "truck" : v.capacity.includes("3") ? "van" : "bakkie") as ManagedVehicle["type"],
    status: v.status,
    driverId: null,
    branch: v.name.includes("PowerTrade") ? "PowerTrade" : "Fleet Hub",
    phone: v.phone,
  }));
}

function seedStaff(): ManagedStaff[] {
  return STAFF_USERS.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.jobRole,
    branch: u.store,
    vehicleId: null,
    phone: u.phone,
    status: u.status,
  }));
}

function withInitialAssignments(vehicles: ManagedVehicle[], staff: ManagedStaff[]) {
  const nextVehicles = vehicles.map((v) => ({ ...v }));
  const nextStaff = staff.map((s) => ({ ...s }));

  const thabo = nextStaff.find((s) => s.email.includes("thabo.driver"));
  const sipho = nextStaff.find((s) => s.name.includes("Sipho"));
  const nomsa = nextStaff.find((s) => s.role === "driver" && s.id !== thabo?.id);

  if (thabo) {
    const v = nextVehicles.find((x) => x.id === "f2");
    if (v) {
      v.driverId = thabo.id;
      thabo.vehicleId = v.id;
    }
  }
  if (sipho) {
    // Sipho is dispatcher — keep as ops, assign idle truck optionally
  }
  // Ensure we have extra driver rows for demo vehicles
  const driverExtras: ManagedStaff[] = [
    {
      id: "s-drv-nomsa",
      name: "Nomsa Dlamini",
      email: "nomsa.driver@aheers.co.za",
      role: "driver",
      branch: "Fleet Hub",
      vehicleId: "f3",
      phone: "084 333 4455",
      status: "active",
    },
    {
      id: "s-drv-david",
      name: "David Pillay",
      email: "david.driver@aheers.co.za",
      role: "driver",
      branch: "PowerTrade",
      vehicleId: "f4",
      phone: "085 444 5566",
      status: "active",
    },
  ];

  for (const d of driverExtras) {
    if (!nextStaff.some((s) => s.id === d.id)) nextStaff.push(d);
    const v = nextVehicles.find((x) => x.id === d.vehicleId);
    if (v) v.driverId = d.id;
  }

  if (nomsa && !driverExtras.length) {
    /* noop */
  }

  return { vehicles: nextVehicles, staff: nextStaff };
}

interface FleetOpsContextType {
  vehicles: ManagedVehicle[];
  staff: ManagedStaff[];
  drivers: ManagedStaff[];
  addVehicle: (data: {
    name: string;
    plate: string;
    capacity: string;
    type: ManagedVehicle["type"];
    branch: string;
    phone?: string;
  }) => void;
  updateVehicle: (id: string, patch: Partial<ManagedVehicle>) => void;
  removeVehicle: (id: string) => void;
  assignDriver: (vehicleId: string, driverId: string | null) => void;
  assignUserBranch: (userId: string, branch: string) => void;
  assignUserRole: (userId: string, role: string) => void;
  addUser: (data: { name: string; email: string; role: string; branch: string; phone?: string }) => void;
  getDriverName: (driverId: string | null) => string;
  getVehicleName: (vehicleId: string | null) => string;
}

const FleetOpsContext = createContext<FleetOpsContextType | null>(null);

export function FleetOpsProvider({ children }: { children: ReactNode }) {
  const seeded = useMemo(() => withInitialAssignments(seedVehicles(), seedStaff()), []);
  const [vehicles, setVehicles] = useState<ManagedVehicle[]>(seeded.vehicles);
  const [staff, setStaff] = useState<ManagedStaff[]>(seeded.staff);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.vehicles?.length) setVehicles(data.vehicles);
        if (data.staff?.length) setStaff(data.staff);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ vehicles, staff }));
  }, [vehicles, staff, hydrated]);

  const addVehicle: FleetOpsContextType["addVehicle"] = useCallback((data) => {
    setVehicles((prev) => [
      {
        id: `f-${Date.now()}`,
        driverId: null,
        status: "idle",
        name: data.name,
        plate: data.plate,
        capacity: data.capacity,
        type: data.type,
        branch: data.branch,
        phone: data.phone ?? "",
      },
      ...prev,
    ]);
  }, []);

  const updateVehicle = useCallback((id: string, patch: Partial<ManagedVehicle>) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }, []);

  const removeVehicle = useCallback((id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    setStaff((prev) => prev.map((s) => (s.vehicleId === id ? { ...s, vehicleId: null } : s)));
  }, []);

  const assignDriver = useCallback((vehicleId: string, driverId: string | null) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) return { ...v, driverId };
        if (driverId && v.driverId === driverId) return { ...v, driverId: null };
        return v;
      })
    );
    setStaff((prev) =>
      prev.map((s) => {
        if (driverId && s.id === driverId) return { ...s, vehicleId };
        if (s.vehicleId === vehicleId) return { ...s, vehicleId: null };
        return s;
      })
    );
  }, []);

  const assignUserBranch = useCallback((userId: string, branch: string) => {
    setStaff((prev) => prev.map((s) => (s.id === userId ? { ...s, branch } : s)));
  }, []);

  const assignUserRole = useCallback((userId: string, role: string) => {
    setStaff((prev) => prev.map((s) => (s.id === userId ? { ...s, role } : s)));
  }, []);

  const addUser = useCallback(
    (data: { name: string; email: string; role: string; branch: string; phone?: string }) => {
      setStaff((prev) => [
        {
          id: `s-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: data.role,
          branch: data.branch,
          phone: data.phone ?? "",
          vehicleId: null,
          status: "invited",
        },
        ...prev,
      ]);
    },
    []
  );

  const getDriverName = useCallback(
    (driverId: string | null) => {
      if (!driverId) return "Unassigned";
      return staff.find((s) => s.id === driverId)?.name ?? "Unknown";
    },
    [staff]
  );

  const getVehicleName = useCallback(
    (vehicleId: string | null) => {
      if (!vehicleId) return "—";
      return vehicles.find((v) => v.id === vehicleId)?.name ?? "—";
    },
    [vehicles]
  );

  const drivers = useMemo(() => staff.filter((s) => s.role === "driver"), [staff]);

  return (
    <FleetOpsContext.Provider
      value={{
        vehicles,
        staff,
        drivers,
        addVehicle,
        updateVehicle,
        removeVehicle,
        assignDriver,
        assignUserBranch,
        assignUserRole,
        addUser,
        getDriverName,
        getVehicleName,
      }}
    >
      {children}
    </FleetOpsContext.Provider>
  );
}

export function useFleetOps() {
  const ctx = useContext(FleetOpsContext);
  if (!ctx) throw new Error("useFleetOps must be used within FleetOpsProvider");
  return ctx;
}
