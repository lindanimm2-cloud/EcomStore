"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Rewards deep-link → customer portal (works with static export) */
export default function RewardsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/portal");
  }, [router]);
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
      Opening Infinity Rewards…
    </div>
  );
}
