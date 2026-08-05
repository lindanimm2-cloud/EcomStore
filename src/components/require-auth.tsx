"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/lib/auth-context";
import { PageLoader } from "@/components/loading-ui";

export function RequireAuth({
  children,
  roles,
  loginHref = "/login/customer",
}: {
  children: React.ReactNode;
  roles?: UserRole[];
  loginHref?: string;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(loginHref);
      return;
    }
    if (roles && !roles.includes(user.role)) {
      router.replace("/login");
    }
  }, [user, loading, roles, router, loginHref]);

  if (loading) return <PageLoader label="Checking session…" />;
  if (!user) return <PageLoader label="Redirecting to login…" />;
  if (roles && !roles.includes(user.role)) return <PageLoader label="Wrong portal…" />;

  return <>{children}</>;
}
