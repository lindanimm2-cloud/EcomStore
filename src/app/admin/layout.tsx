"use client";

import { RequireAuth } from "@/components/require-auth";
import { FleetOpsProvider } from "@/lib/fleet-ops-context";
import { SettingsFab } from "@/components/settings-fab";
import { CrmSmartLens } from "@/components/crm-smart-lens";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth roles={["staff", "service_counter", "dispatcher"]} loginHref="/login/staff">
      <FleetOpsProvider>
        <div className="pt-14 lg:pt-0">{children}</div>
        <CrmSmartLens />
        <SettingsFab />
      </FleetOpsProvider>
    </RequireAuth>
  );
}
