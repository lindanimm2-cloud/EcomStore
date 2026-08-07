"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NexusRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin");
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-aheers-mist text-sm text-gray-500">
      Opening Aheers App…
    </div>
  );
}
