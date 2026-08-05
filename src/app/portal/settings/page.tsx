"use client";

import { useState } from "react";
import Link from "next/link";
import { StoreSwitcher, SiteFooter } from "@/components/layout";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft } from "lucide-react";

const PREF_KEY = "aheers-customer-prefs-v1";

export default function PortalSettingsPage() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(() => {
    if (typeof window === "undefined") {
      return { sms: true, email: true, whatsapp: true, push: false };
    }
    try {
      const raw = localStorage.getItem(PREF_KEY);
      return raw ? JSON.parse(raw) : { sms: true, email: true, whatsapp: true, push: false };
    } catch {
      return { sms: true, email: true, whatsapp: true, push: false };
    }
  });
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  function save() {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <StoreSwitcher />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-aheers-green py-8 text-white">
          <div className="mx-auto max-w-lg px-4">
            <Link href="/portal" className="mb-3 inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100">
              <ArrowLeft className="h-4 w-4" /> Back to account
            </Link>
            <h1 className="font-display text-2xl font-semibold">Account settings</h1>
            <p className="mt-1 text-sm text-white/80">Profile · Marketing preferences · POPIA</p>
          </div>
        </div>
        <div className="mx-auto max-w-lg space-y-4 px-4 py-8">
          {saved && (
            <div className="rounded-xl bg-aheers-green/10 px-4 py-2 text-sm text-aheers-green">Saved (demo)</div>
          )}
          <div className="card space-y-3 p-5">
            <h2 className="font-semibold text-aheers-green-dark">Profile</h2>
            <label className="block text-sm">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              Phone
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
              />
            </label>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <div className="card space-y-2 p-5">
            <h2 className="mb-2 font-semibold text-aheers-green-dark">Marketing preferences</h2>
            {(
              [
                ["sms", "SMS specials"],
                ["email", "Email newsletters"],
                ["whatsapp", "WhatsApp updates"],
                ["push", "Push notifications"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between rounded-xl bg-aheers-mist px-3 py-2.5 text-sm">
                {label}
                <input
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })}
                  className="h-4 w-4 accent-aheers-green"
                />
              </label>
            ))}
          </div>
          <button type="button" onClick={save} className="btn-primary w-full">
            Save preferences
          </button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
