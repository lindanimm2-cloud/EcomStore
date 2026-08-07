import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { Shield } from "lucide-react";

export default function StaffLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070c0a] px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,162,39,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 bg-aheers-green/20 blur-[100px]" />
      <div className="absolute bottom-0 right-0 h-72 w-72 bg-aheers-gold/10 blur-[90px]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-aheers-gold">
            <Shield className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Operations access</span>
          </div>
          <Link href="/" className="text-xs text-white/35 transition hover:text-white/70">
            ← Super App
          </Link>
        </div>

        <LoginForm
          variant="staff"
          brandLabel="Aheers Ops"
          title="Employee login"
          subtitle="Aheers App · inventory · fleet · service desk. Authorised staff only."
          allowedRoles={["staff", "service_counter", "dispatcher"]}
          demoHint="sagren@ · thandi@ · crm@ · counter@ · dispatch@ / aheers123"
          hideRegister
          footerExtra={
            <Link href="/login/driver" className="font-medium text-aheers-gold hover:underline">
              Driver app →
            </Link>
          }
        />

        <p className="mt-10 text-center text-[10px] uppercase tracking-[0.2em] text-white/25">
          Secure session · Audit logged · POPIA
        </p>
      </div>
    </main>
  );
}
