import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { Building2 } from "lucide-react";

export default function TradeLoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3ebe3]">
      <div className="absolute inset-y-0 left-0 hidden w-[42%] bg-[#1a1208] lg:block" />
      <div className="absolute inset-y-0 left-0 hidden w-[42%] bg-gradient-to-br from-powertrade-orange/30 to-transparent lg:block" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl lg:grid-cols-5">
        <section className="hidden flex-col justify-between p-12 text-white lg:col-span-2 lg:flex">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-powertrade-orange">PowerTrade</p>
            <h2 className="mt-6 font-display text-4xl font-semibold leading-tight">
              Wholesale
              <span className="mt-2 block text-white/70">for serious buyers.</span>
            </h2>
          </div>
          <ul className="space-y-4 text-sm text-white/65">
            <li className="flex gap-3"><Building2 className="mt-0.5 h-4 w-4 text-powertrade-orange" /> Credit facilities & statements</li>
            <li className="flex gap-3"><Building2 className="mt-0.5 h-4 w-4 text-powertrade-orange" /> Case & pallet pricing</li>
            <li className="flex gap-3"><Building2 className="mt-0.5 h-4 w-4 text-powertrade-orange" /> Truck delivery & POD docs</li>
          </ul>
          <p className="text-xs text-white/35">Aheers Group · Greytown cash & carry</p>
        </section>

        <section className="flex flex-col justify-center px-5 py-12 sm:px-10 lg:col-span-3 lg:px-16">
          <Link href="/" className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-[#1a1208]/45 hover:text-[#1a1208]">
            ← Aheers home
          </Link>
          <LoginForm
            variant="trade"
            brandLabel="PowerTrade"
            title="Business login"
            subtitle="VAT accounts, RFQ, credit and bulk ordering — not a retail checkout."
            allowedRoles={["trade"]}
            demoHint="orders@greytownspaza.co.za / aheers123"
            hideRegister
            footerExtra={
              <Link href="/contact?topic=trade" className="font-semibold text-powertrade-orange hover:underline">
                Apply for trade account
              </Link>
            }
          />
        </section>
      </div>
    </main>
  );
}
