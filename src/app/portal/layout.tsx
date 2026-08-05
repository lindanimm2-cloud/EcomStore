"use client";

import { RequireAuth } from "@/components/require-auth";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth roles={["customer"]} loginHref="/login/customer">
      {children}
    </RequireAuth>
  );
}
