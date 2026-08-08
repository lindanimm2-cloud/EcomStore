"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

/**
 * Demo hCaptcha widget — visual match for the real checkbox challenge.
 * Uses a click-to-verify flow so the proposal works offline without API keys.
 * Swap for @hcaptcha/react-hcaptcha + site key when going live.
 */
export function HCaptchaBox({
  onVerify,
  onExpire,
}: {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "checking" | "ok">("idle");

  function verify() {
    if (status !== "idle") return;
    setStatus("checking");
    window.setTimeout(() => {
      setStatus("ok");
      onVerify(`demo-hcaptcha-${Date.now()}`);
    }, 900);
  }

  function reset() {
    setStatus("idle");
    onExpire?.();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#d7dde5] bg-[#fafafa] shadow-sm">
      <div className="flex items-center gap-3 px-3.5 py-3">
        <button
          type="button"
          onClick={status === "ok" ? reset : verify}
          aria-label={status === "ok" ? "Verified — click to reset" : "Verify you are human"}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition ${
            status === "ok"
              ? "border-[#00838f] bg-[#00838f] text-white"
              : status === "checking"
                ? "border-[#00838f]/40 bg-white"
                : "border-[#c5cdd8] bg-white hover:border-[#00838f]"
          }`}
        >
          {status === "checking" && <Loader2 className="h-4 w-4 animate-spin text-[#00838f]" />}
          {status === "ok" && <Check className="h-4 w-4" strokeWidth={3} />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#455a64]">
            {status === "ok" ? "Verified" : "I am human"}
          </p>
          <p className="text-[10px] text-[#90a4ae]">hCaptcha · Privacy · Terms</p>
        </div>
        <div className="flex shrink-0 flex-col items-center text-[9px] leading-tight text-[#90a4ae]">
          <span className="font-bold tracking-tight text-[#00838f]">hCaptcha</span>
          <span>Protected</span>
        </div>
      </div>
    </div>
  );
}
