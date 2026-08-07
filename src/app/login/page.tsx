import Link from "next/link";
import { Truck, Users, Package, Building2, ArrowRight } from "lucide-react";

const PORTALS = [
  {
    title: "Customer",
    desc: "Rewards, shopping & delivery — warm retail experience",
    href: "/login/customer",
    icon: Users,
    className: "from-[#1B5E3B] to-[#2D8A5E]",
    cta: "Shopper sign in",
  },
  {
    title: "Employee",
    desc: "Dark ops console for Aheers App, stock and service desk",
    href: "/login/staff",
    icon: Building2,
    className: "from-[#070c0a] to-[#1a2e24]",
    cta: "Staff access",
  },
  {
    title: "Driver",
    desc: "Route-ready night UI for POD and vehicle checks",
    href: "/login/driver",
    icon: Truck,
    className: "from-zinc-950 to-zinc-800",
    cta: "Start shift",
  },
  {
    title: "PowerTrade",
    desc: "Industrial B2B portal for credit and bulk orders",
    href: "/login/trade",
    icon: Package,
    className: "from-[#1a1208] to-[#E65100]",
    cta: "Trade login",
  },
];

export default function LoginHubPage() {
  return (
    <main className="min-h-screen bg-[#0a0f0d] text-white">
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
        <Link href="/" className="text-sm text-white/40 transition hover:text-white">
          ← Aheers home
        </Link>
        <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Choose your doorway
        </h1>
        <p className="mt-3 max-w-xl text-white/50">
          Each portal is designed for how you work — shoppers, staff, drivers and trade partners don’t share the same lobby.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {PORTALS.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${p.className} p-7 transition hover:-translate-y-1 hover:shadow-lift`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(255,255,255,0.15),transparent_40%)]" />
              <div className="relative">
                <p.icon className="h-7 w-7 text-white/90" />
                <h2 className="mt-5 font-display text-2xl font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm text-white/70">{p.desc}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  {p.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-white/30">Demo password for all accounts: aheers123</p>
      </div>
    </main>
  );
}
