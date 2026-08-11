"use client";

import { RequireAuth } from "@/components/require-auth";
import { FleetOpsProvider } from "@/lib/fleet-ops-context";
import { SettingsFab } from "@/components/settings-fab";
import { CrmSmartLens } from "@/components/crm-smart-lens";
import { AdminMobileNav } from "@/components/admin-mobile-nav";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function AdminChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isChat = pathname.startsWith("/admin/chat");

  return (
    <>
      <div
        className={`min-h-dvh bg-[#f7f8f9] lg:bg-transparent ${
          isChat ? "pt-14 lg:pt-0" : "pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-14 lg:pb-0 lg:pt-0"
        }`}
      >
        {children}
      </div>
      <AdminMobileNav onOpenMenu={() => window.dispatchEvent(new Event("aheers:open-admin-menu"))} />
      <CrmSmartLens />
      <div className="hidden lg:contents">
        <SettingsFab />
      </div>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth roles={["staff", "service_counter", "dispatcher"]} loginHref="/login/staff">
      <FleetOpsProvider>
        <AdminChrome>{children}</AdminChrome>
      </FleetOpsProvider>
    </RequireAuth>
  );
}
