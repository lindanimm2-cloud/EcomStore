"use client";

import { RequireAuth } from "@/components/require-auth";

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth roles={["trade"]} loginHref="/login/trade">
      {children}
    </RequireAuth>
  );
}
