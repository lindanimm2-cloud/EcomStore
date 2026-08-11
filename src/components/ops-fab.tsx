"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { addTask } from "@/lib/task-store";
import { addWorkNote } from "@/lib/workbench-store";
import { QuickSheet } from "@/components/quick-sheet";

export function OpsFab() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(false);
  const [draft, setDraft] = useState("");

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/chat")) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-[calc(5.85rem+env(safe-area-inset-bottom))] right-4 z-[45] flex h-12 w-12 items-center justify-center rounded-full bg-aheers-gold text-aheers-green-dark shadow-[0_10px_28px_rgba(201,162,39,0.45)] lg:hidden"
        aria-label="Quick create"
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
      </button>

      <QuickSheet open={open} title="What do you want to do?" onClose={() => setOpen(false)}>
        <div className="grid grid-cols-1 gap-1.5">
          {[
            ["New task", () => {
              addTask({
                title: "Follow-up",
                dueDate: "2026-08-12",
                owner: user?.name ?? "Staff",
              });
              setOpen(false);
              router.push("/admin/tasks");
            }],
            ["New order chase", () => {
              setOpen(false);
              router.push("/admin/orders");
            }],
            ["Add client", () => {
              setOpen(false);
              router.push("/admin/customers");
            }],
            ["Add note", () => {
              setOpen(false);
              setNote(true);
            }],
            ["Schedule meeting", () => {
              setOpen(false);
              router.push("/admin/meetings");
            }],
            ["Send message", () => {
              setOpen(false);
              router.push("/admin/chat");
            }],
          ].map(([label, fn]) => (
            <button
              key={String(label)}
              type="button"
              onClick={fn as () => void}
              className="rounded-2xl bg-white/8 px-4 py-3.5 text-left text-sm font-semibold text-white hover:bg-white/12"
            >
              ＋ {label as string}
            </button>
          ))}
        </div>
      </QuickSheet>

      <QuickSheet open={note} title="Add note" onClose={() => setNote(false)}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write note…"
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/35 outline-none"
        />
        <button
          type="button"
          disabled={!draft.trim()}
          onClick={() => {
            addWorkNote(
              { entityId: "general", entityLabel: "Ops desk", text: draft.trim(), private: false },
              user?.name ?? "Staff"
            );
            setDraft("");
            setNote(false);
          }}
          className="mt-3 w-full rounded-full bg-aheers-gold py-3 text-sm font-bold text-aheers-green-dark disabled:opacity-40"
        >
          Save
        </button>
      </QuickSheet>
    </>
  );
}
