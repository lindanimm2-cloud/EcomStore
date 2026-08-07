"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AlertTriangle, X, Send } from "lucide-react";
import { addDevIssue, IssueSeverity } from "@/lib/dev-issues";
import { useAuth } from "@/lib/auth-context";
import { PrettySelect } from "@/components/pretty-select";

type AppErrorDetail = { message?: string };

/** Open the report modal from anywhere */
export function openReportIssue() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("aheers:report-issue"));
  }
}

/** Show the on-error report chip (and optionally open modal later) */
export function reportAppError(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<AppErrorDetail>("aheers:app-error", { detail: { message } })
  );
}

/** Compact “Report this” control for inline error messages */
export function ReportThisButton({
  className = "",
  label = "Report this",
  context,
}: {
  className?: string;
  label?: string;
  context?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (context) {
          try {
            sessionStorage.setItem("aheers-report-prefill", context);
          } catch {
            /* ignore */
          }
        }
        openReportIssue();
      }}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold underline-offset-2 hover:underline ${className}`}
    >
      <AlertTriangle className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

/**
 * Modal only — no always-on floating button.
 * A different chip appears when an app error is reported.
 */
export function ReportIssueButton() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [prefill, setPrefill] = useState("");

  useEffect(() => {
    const openModal = () => {
      setSent(false);
      try {
        const saved = sessionStorage.getItem("aheers-report-prefill");
        if (saved) {
          setPrefill(saved);
          sessionStorage.removeItem("aheers-report-prefill");
        }
      } catch {
        /* ignore */
      }
      setOpen(true);
    };
    const onAppError = (e: Event) => {
      const detail = (e as CustomEvent<AppErrorDetail>).detail;
      const msg = detail?.message?.trim() || "Something went wrong";
      setErrorBanner(msg);
      setPrefill(msg);
    };
    const onWindowError = (e: ErrorEvent) => {
      setErrorBanner(e.message || "Unexpected error");
      setPrefill(e.message || "Unexpected error");
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      const msg =
        typeof reason === "string"
          ? reason
          : reason?.message || "Unhandled promise error";
      setErrorBanner(String(msg));
      setPrefill(String(msg));
    };

    window.addEventListener("aheers:report-issue", openModal);
    window.addEventListener("aheers:app-error", onAppError as EventListener);
    window.addEventListener("error", onWindowError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("aheers:report-issue", openModal);
      window.removeEventListener("aheers:app-error", onAppError as EventListener);
      window.removeEventListener("error", onWindowError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

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
    setErrorBanner(null);
  }

  const input =
    "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-aheers-green focus:ring-2 focus:ring-aheers-green/15";

  return (
    <>
      {/* Only visible when an error was detected */}
      {errorBanner && !open && (
        <div className="fixed bottom-6 left-1/2 z-40 flex w-[min(calc(100vw-2rem),24rem)] -translate-x-1/2 items-start gap-3 rounded-2xl border border-red-200 bg-white px-3.5 py-3 shadow-lift sm:left-6 sm:translate-x-0">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">Something went wrong</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{errorBanner}</p>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setOpen(true);
              }}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-aheers-green px-3 py-1.5 text-xs font-bold text-white hover:bg-aheers-green-light"
            >
              Report to developer
            </button>
          </div>
          <button
            type="button"
            onClick={() => setErrorBanner(null)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
                  <input
                    name="title"
                    required
                    defaultValue={prefill ? prefill.slice(0, 80) : ""}
                    placeholder="e.g. Cart clears when switching store"
                    className={input}
                    key={prefill || "empty"}
                  />
                </label>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  What happened?
                  <textarea
                    name="description"
                    required
                    rows={4}
                    defaultValue={prefill}
                    placeholder="Steps to reproduce, expected vs actual…"
                    className={input}
                    key={`desc-${prefill || "empty"}`}
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <PrettySelect
                    name="severity"
                    label="Severity"
                    defaultValue={prefill ? "high" : "medium"}
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
