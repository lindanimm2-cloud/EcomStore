"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption = { value: string; label: string; hint?: string };

export function PrettySelect({
  name,
  value,
  defaultValue,
  options,
  onChange,
  placeholder,
  required,
  className = "",
  label,
  dark,
}: {
  name?: string;
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  label?: string;
  dark?: boolean;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(value ?? defaultValue ?? options[0]?.value ?? "");

  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = options.find((o) => o.value === internal);

  function choose(v: string) {
    setInternal(v);
    onChange?.(v);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`mb-1.5 block text-xs font-semibold uppercase tracking-wide ${dark ? "text-white/50" : "text-gray-500"}`}
        >
          {label}
        </label>
      )}
      {name && <input type="hidden" name={name} value={internal} required={required} />}
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={
          dark
            ? "flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#0b0f0d] px-3.5 py-2.5 text-left text-sm text-white outline-none transition hover:border-aheers-gold/40 focus-visible:border-aheers-gold/50"
            : "menu-trigger"
        }
      >
        <span className={`truncate ${selected ? (dark ? "text-white" : "text-aheers-charcoal") : "text-gray-400"}`}>
          {selected?.label ?? placeholder ?? "Select…"}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""} ${dark ? "text-aheers-gold/80" : "text-aheers-green/70"}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className={`absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-64 overflow-auto p-1.5 ${
            dark
              ? "rounded-2xl border border-white/10 bg-[#141a17] shadow-lift ring-1 ring-black/40"
              : "menu-panel"
          }`}
        >
          {options.map((o) => {
            const active = o.value === internal;
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => choose(o.value)}
                  className={
                    dark
                      ? `flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                          active ? "bg-aheers-gold text-aheers-green-dark" : "text-white/90 hover:bg-white/5"
                        }`
                      : `menu-option ${active ? "menu-option-active" : ""}`
                  }
                >
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate font-medium">{o.label}</span>
                    {o.hint && (
                      <span
                        className={`block truncate text-xs ${
                          active ? (dark ? "text-aheers-green-dark/70" : "text-white/75") : dark ? "text-white/40" : "text-gray-400"
                        }`}
                      >
                        {o.hint}
                      </span>
                    )}
                  </span>
                  {active && <Check className={`h-4 w-4 shrink-0 ${dark ? "text-aheers-green-dark" : "text-white"}`} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
