"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption = { value: string; label: string; hint?: string };

type MenuPos = {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
};

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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<MenuPos | null>(null);
  const [internal, setInternal] = useState(value ?? defaultValue ?? options[0]?.value ?? "");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  const updatePos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = 6;
    const spaceBelow = window.innerHeight - r.bottom - gap - 12;
    const spaceAbove = r.top - gap - 12;
    const preferDown = spaceBelow >= 160 || spaceBelow >= spaceAbove;
    const maxHeight = Math.min(256, Math.max(120, preferDown ? spaceBelow : spaceAbove));
    const width = Math.max(r.width, 148);
    const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8));
    if (preferDown) {
      setPos({ top: r.bottom + gap, left, width, maxHeight });
    } else {
      setPos({ bottom: window.innerHeight - r.top + gap, left, width, maxHeight });
    }
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [open, updatePos]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === internal);

  function choose(v: string) {
    setInternal(v);
    onChange?.(v);
    setOpen(false);
  }

  const menu = open && pos && mounted && (
    <ul
      ref={menuRef}
      role="listbox"
      id={`${id}-listbox`}
      style={{
        position: "fixed",
        top: pos.top,
        bottom: pos.bottom,
        left: pos.left,
        width: pos.width,
        maxHeight: pos.maxHeight,
        zIndex: 200,
      }}
      className={`overflow-auto p-1.5 animate-fade-up ${
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
                <span className="block truncate font-medium capitalize">{o.label}</span>
                {o.hint && (
                  <span
                    className={`block truncate text-xs ${
                      active
                        ? dark
                          ? "text-aheers-green-dark/70"
                          : "text-white/75"
                        : dark
                          ? "text-white/40"
                          : "text-gray-400"
                    }`}
                  >
                    {o.hint}
                  </span>
                )}
              </span>
              {active && (
                <Check className={`h-4 w-4 shrink-0 ${dark ? "text-aheers-green-dark" : "text-white"}`} />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div ref={rootRef} className={`relative ${open ? "z-30" : ""} ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`mb-1.5 block text-xs font-semibold uppercase tracking-wide ${
            dark ? "text-white/50" : "text-gray-500"
          }`}
        >
          {label}
        </label>
      )}
      {name && <input type="hidden" name={name} value={internal} required={required} />}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-listbox` : undefined}
        onClick={() => setOpen((o) => !o)}
        className={
          dark
            ? `flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm text-white outline-none transition ${
                open
                  ? "border-aheers-gold/50 bg-[#0b0f0d] ring-2 ring-aheers-gold/20"
                  : "border-white/10 bg-[#0b0f0d] hover:border-aheers-gold/40"
              }`
            : `menu-trigger ${open ? "!border-aheers-green ring-2 ring-aheers-green/15" : ""}`
        }
      >
        <span
          className={`truncate capitalize ${
            selected ? (dark ? "text-white" : "text-aheers-charcoal") : "text-gray-400"
          }`}
        >
          {selected?.label ?? placeholder ?? "Select…"}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""} ${
            dark ? "text-aheers-gold/80" : "text-aheers-green/70"
          }`}
        />
      </button>

      {mounted && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}
