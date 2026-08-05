"use client";

import { RequireAuth } from "@/components/require-auth";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth roles={["driver", "dispatcher"]} loginHref="/login/driver">
      {children}
    </RequireAuth>
  );
}
