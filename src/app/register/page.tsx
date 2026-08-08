"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { useAuth } from "@/lib/auth-context";
import { ReportThisButton, reportAppError } from "@/components/report-issue";
import { HCaptchaBox } from "@/components/hcaptcha-box";

const fieldClass =
  "w-full rounded-full border border-aheers-green/35 bg-white px-4 py-3 text-sm text-aheers-charcoal outline-none transition placeholder:text-gray-400 focus:border-aheers-green focus:ring-2 focus:ring-aheers-green/15";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    const confirm = String(fd.get("confirmPassword") ?? "");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!captchaToken) {
      setError("Please complete the hCaptcha check");
      return;
    }

    setBusy(true);
    const res = await register({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      password,
    });
    setBusy(false);
    if (!res.ok) {
      const msg = res.error ?? "Registration failed";
      setError(msg);
      reportAppError(msg);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <>
        <StoreSwitcher />
        <main className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-aheers-green">Welcome to Aheers</h1>
          <p className="mt-2 text-gray-500">Account created. You are signed in.</p>
          <button type="button" onClick={() => router.push("/portal")} className="btn-primary mt-6">
            Go to my account
          </button>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <StoreSwitcher />
      <main className="mx-auto max-w-md px-4 py-10">
        <h1 className="font-display text-3xl font-semibold text-aheers-green-dark">Register</h1>
        <p className="mt-2 text-sm text-gray-500">One account for all Aheers stores and rewards.</p>
        <form className="card mt-6 space-y-4 p-6" onSubmit={onSubmit}>
          <input name="name" required placeholder="Full name" className={fieldClass} autoComplete="name" />
          <input
            name="phone"
            required
            type="tel"
            placeholder="Mobile number"
            className={fieldClass}
            autoComplete="tel"
          />
          <input
            name="email"
            required
            type="email"
            placeholder="Email"
            className={fieldClass}
            autoComplete="email"
          />
          <input
            name="password"
            required
            type="password"
            minLength={6}
            placeholder="Password"
            className={fieldClass}
            autoComplete="new-password"
          />
          <input
            name="confirmPassword"
            required
            type="password"
            minLength={6}
            placeholder="Confirm password"
            className={fieldClass}
            autoComplete="new-password"
          />

          <HCaptchaBox
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken("")}
          />

          <label className="flex items-start gap-2 text-xs text-gray-600">
            <input type="checkbox" required className="mt-0.5 rounded border-aheers-green/40" />
            I agree to marketing preferences under POPIA and Infinity Rewards terms.
          </label>
          {error && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <span>{error}</span>
              <ReportThisButton context={error} className="shrink-0 text-red-800" />
            </div>
          )}
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? "Creating…" : "Create account"}
          </button>
          <p className="text-center text-xs text-gray-500">
            Already registered?{" "}
            <Link href="/login/customer" className="text-aheers-green hover:underline">
              Login
            </Link>
          </p>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}
