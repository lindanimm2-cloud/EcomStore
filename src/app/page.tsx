import { Suspense } from "react";
import HomeClient from "./home-client";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="page-shell py-16 text-center text-sm text-gray-400">Loading Aheers…</div>}>
      <HomeClient />
    </Suspense>
  );
}
