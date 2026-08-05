import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { Navigation } from "lucide-react";

export default function DriverLoginPage() {
  return (
    <main className="relative flex min-h-screen items-end justify-center overflow-hidden bg-zinc-950 sm:items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.18),_transparent_50%),linear-gradient(180deg,#09090b_0%,#18181b_55%,#27272a_100%)]" />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(251,191,36,0.15) 40px, rgba(251,191,36,0.15) 42px)",
        }}
      />
      <div className="absolute left-1/2 top-16 h-40 w-40 -translate-x-1/2 animate-float rounded-full bg-amber-400/20 blur-3xl" />

      <div className="relative w-full max-w-md px-5 pb-10 pt-16 sm:px-6 sm:py-12">
        <div className="mb-6 flex items-center justify-between text-amber-300/80">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]">On the road</span>
          </div>
          <Link href="/" className="text-xs text-white/40 hover:text-white/70">
            Exit
          </Link>
        </div>

        <LoginForm
          variant="driver"
          brandLabel="Driver"
          title="Start your route"
          subtitle="Today’s stops, navigation, POD photos and vehicle checks."
          allowedRoles={["driver", "dispatcher"]}
          demoHint="Driver: thabo.driver@aheers.co.za · Dispatcher: dispatch@aheers.co.za / aheers123"
          hideRegister
          footerExtra={
            <Link href="/login/staff" className="font-medium text-amber-300 hover:underline">
              Dispatcher login
            </Link>
          }
        />
      </div>
    </main>
  );
}
