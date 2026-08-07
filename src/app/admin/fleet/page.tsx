import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatCard } from "@/components/admin-ui";
import { FleetMap, FleetVehicleList } from "@/components/fleet-map";
import { FLEET_VEHICLES } from "@/lib/fleet";

export default function FleetPage() {
  const active = FLEET_VEHICLES.filter((v) => v.status !== "idle");
  const delivering = FLEET_VEHICLES.filter((v) => v.status === "delivering" || v.status === "en-route");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader
          title="Fleet Tracker"
          subtitle="Live GPS · Route monitoring · Driver management · Greytown fleet"
        />
        <div className="admin-page">
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <StatCard label="Total Vehicles" value={String(FLEET_VEHICLES.length)} icon="truck" color="blue" />
            <StatCard label="Active Now" value={String(active.length)} icon="mapPin" color="green" />
            <StatCard label="Delivering" value={String(delivering.length)} icon="clock" color="amber" />
            <StatCard label="Drivers" value={String(FLEET_VEHICLES.length)} icon="users" color="gold" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <FleetMap />
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Vehicle List</h3>
              <FleetVehicleList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
