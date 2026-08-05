"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const res = await register({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      password: String(fd.get("password") ?? ""),
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Registration failed");
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
        <h1 className="text-3xl font-bold">Register</h1>
        <p className="mt-2 text-sm text-gray-500">One account for all Aheers stores and rewards.</p>
        <form className="card mt-6 space-y-4 p-6" onSubmit={onSubmit}>
          <input name="name" required placeholder="Full name" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input name="phone" required type="tel" placeholder="Mobile number" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input name="email" required type="email" placeholder="Email" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input name="password" required type="password" minLength={6} placeholder="Password" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <label className="flex items-start gap-2 text-xs text-gray-600">
            <input type="checkbox" required className="mt-0.5" />
            I agree to marketing preferences under POPIA and Infinity Rewards terms.
          </label>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
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
