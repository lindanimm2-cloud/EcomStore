"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bug, X, Send } from "lucide-react";
import { addDevIssue, IssueSeverity } from "@/lib/dev-issues";
import { useAuth } from "@/lib/auth-context";
import { PrettySelect } from "@/components/pretty-select";

export function ReportIssueButton() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("aheers:report-issue", handler);
    return () => window.removeEventListener("aheers:report-issue", handler);
  }, []);

  // Keep clear of admin wrench (right) and fleet badge (right)
  const bottomClass = pathname.startsWith("/admin") ? "bottom-6 left-6" : "bottom-6 left-6";

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    addDevIssue({
      title: String(fd.get("title")),
      description: String(fd.get("description")),
      severity: String(fd.get("severity")) as IssueSeverity,
      pageUrl: typeof window !== "undefined" ? window.location.href : pathname,
      reporterName: String(fd.get("name") || user?.name || "Anonymous"),
      reporterEmail: String(fd.get("email") || user?.email || ""),
      roleHint: user?.role ?? String(fd.get("roleHint") || "guest"),
    });
    setBusy(false);
    setSent(true);
  }

  const input =
    "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-aheers-green focus:ring-2 focus:ring-aheers-green/15";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSent(false);
          setOpen(true);
        }}
        className={`fixed ${bottomClass} z-40 inline-flex items-center gap-2 rounded-full bg-aheers-charcoal px-4 py-2.5 text-sm font-semibold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-black`}
        aria-label="Report issue to developer"
      >
        <Bug className="h-4 w-4 text-aheers-gold" />
        <span className="hidden sm:inline">Report issue</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg animate-fade-up overflow-hidden rounded-3xl bg-white shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-aheers-green-dark px-5 py-4 text-white">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-aheers-gold">Developer</p>
                <h2 className="font-display text-xl font-semibold">Report an issue</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/10" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            {sent ? (
              <div className="space-y-4 p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-aheers-green/10 text-aheers-green">
                  <Send className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold text-aheers-green-dark">Sent to developer</h3>
                <p className="text-sm text-gray-500">
                  Saved in this browser&apos;s developer inbox. Open{" "}
                  <a href="/admin/dev-issues" className="font-semibold text-aheers-green hover:underline">
                    Admin → Dev issues
                  </a>{" "}
                  to review.
                </p>
                <button type="button" onClick={() => setOpen(false)} className="btn-primary">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3 p-5 sm:p-6">
                <p className="text-sm text-gray-500">
                  Found a bug or missing feature? Send it straight to the demo developer inbox.
                </p>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Title
                  <input name="title" required placeholder="e.g. Cart clears when switching store" className={input} />
                </label>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  What happened?
                  <textarea
                    name="description"
                    required
                    rows={4}
                    placeholder="Steps to reproduce, expected vs actual…"
                    className={input}
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <PrettySelect
                    name="severity"
                    label="Severity"
                    defaultValue="medium"
                    options={[
                      { value: "low", label: "Low" },
                      { value: "medium", label: "Medium" },
                      { value: "high", label: "High" },
                      { value: "blocker", label: "Blocker" },
                    ]}
                  />
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Your role
                    <input
                      name="roleHint"
                      className={input}
                      defaultValue={user?.role ?? "guest"}
                      placeholder="customer / staff / …"
                    />
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                    <input name="name" className={input} defaultValue={user?.name ?? ""} placeholder="Optional" />
                  </label>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                    <input
                      name="email"
                      type="email"
                      className={input}
                      defaultValue={user?.email ?? ""}
                      placeholder="you@email.com"
                    />
                  </label>
                </div>
                <p className="rounded-xl bg-aheers-mist px-3 py-2 text-xs text-gray-500">
                  Page: <span className="font-mono text-gray-700">{pathname}</span>
                </p>
                <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
                  {busy ? "Sending…" : "Send to developer"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/** Open the report modal from anywhere: window.dispatchEvent(new Event("aheers:report-issue")) */
export function openReportIssue() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("aheers:report-issue"));
  }
}
