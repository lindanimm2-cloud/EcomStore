"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

export function QuickSheet({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      <button type="button" className="absolute inset-0 bg-black/45" aria-label="Close" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-[1.75rem] border-t border-aheers-gold/25 bg-aheers-green-dark px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 text-white shadow-[0_-16px_50px_rgba(13,61,38,0.45)]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-aheers-gold">
              {title}
            </p>
            {subtitle && <p className="mt-1 truncate text-sm text-white/70">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
