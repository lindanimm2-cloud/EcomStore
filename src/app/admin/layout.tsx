"use client";

import { RequireAuth } from "@/components/require-auth";
import { FleetOpsProvider } from "@/lib/fleet-ops-context";
import { SettingsFab } from "@/components/settings-fab";
import { CrmSmartLens } from "@/components/crm-smart-lens";
import { AdminMobileNav } from "@/components/admin-mobile-nav";
import { OpsFab } from "@/components/ops-fab";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function AdminChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isChat = pathname.startsWith("/admin/chat");

  return (
    <>
      <div
        className={`min-h-dvh bg-[#f7f8f9] lg:bg-transparent ${
          isChat
            ? "pt-[calc(3.5rem+env(safe-area-inset-top))] lg:pt-0"
            : "pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-[calc(7.35rem+env(safe-area-inset-top))] lg:pb-0 lg:pt-0"
        }`}
      >
        {children}
      </div>
      <AdminMobileNav onOpenMenu={() => window.dispatchEvent(new Event("aheers:open-admin-menu"))} />
      <OpsFab />
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
