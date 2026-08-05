import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { Gift, Sparkles } from "lucide-react";

export default function CustomerLoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7faf7] via-[#eef5ef] to-[#dceadf]" />
      <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-aheers-gold/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-aheers-green/15 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(27,94,59,0.12) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <section className="hidden flex-col justify-between p-10 text-aheers-green-dark lg:flex lg:p-14">
          <Link href="/" className="font-display text-2xl font-semibold">
            Aheers
          </Link>
          <div className="max-w-md animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-aheers-green ring-1 ring-aheers-green/10">
              <Sparkles className="h-3.5 w-3.5 text-aheers-gold" /> Infinity Rewards
            </p>
            <h2 className="mt-6 font-display text-4xl font-semibold leading-tight xl:text-5xl">
              Shop every store.
              <span className="block text-aheers-green">One beautiful account.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-aheers-charcoal/65">
              Cashback, wallet, live delivery tracking and member pricing — signed in once across Supermarket, PowerTrade, Hardware and Grab n Go.
            </p>
            <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white/80 p-4 shadow-soft ring-1 ring-aheers-green/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-aheers-gold/20 text-aheers-green-dark">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">Platinum demo ready</p>
                <p className="text-xs text-gray-500">R 224 cashback · digital card in portal</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-aheers-charcoal/40">Greytown · KZN · Customer Super App</p>
        </section>

        <section className="flex flex-col justify-center px-5 py-12 sm:px-10 lg:bg-white/40 lg:px-14 lg:backdrop-blur-sm">
          <Link href="/" className="mb-8 font-display text-xl font-semibold text-aheers-green-dark lg:hidden">
            Aheers
          </Link>
          <LoginForm
            variant="customer"
            brandLabel="Welcome back"
            title="Customer sign in"
            subtitle="Rewards, orders, wallet and delivery — your personal Aheers account."
            allowedRoles={["customer"]}
            showOtp
            footerExtra={
              <Link href="/" className="font-medium text-aheers-green hover:underline">
                Continue as guest
              </Link>
            }
          />
        </section>
      </div>
    </main>
  );
}
