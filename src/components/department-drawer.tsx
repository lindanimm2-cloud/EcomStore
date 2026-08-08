"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { categoryEmoji } from "@/lib/category-emoji";
import { SUPERMARKET_DEPARTMENTS, departmentEmoji } from "@/lib/supermarket-taxonomy";

type Mode = "flat" | "taxonomy";

export function DepartmentDrawer({
  open,
  onClose,
  categories,
  storeName,
  onSelect,
  mode = "flat",
  onSelectDepartment,
}: {
  open: boolean;
  onClose: () => void;
  categories: string[];
  storeName: string;
  /** Select a leaf category (or "" for all) */
  onSelect: (category: string) => void;
  mode?: Mode;
  /** Select a whole department aisle */
  onSelectDepartment?: (department: string) => void;
}) {
  const [activeDept, setActiveDept] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setActiveDept(null);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeDept) setActiveDept(null);
        else onClose();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, activeDept]);

  if (!open) return null;

  const dept = SUPERMARKET_DEPARTMENTS.find((d) => d.name === activeDept);
  const leafCats: string[] =
    dept?.categories.map((c) => c.name).filter((c) => categories.includes(c)) ??
    categories.filter((c) => !activeDept);

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close departments"
        className="absolute inset-0 bg-black/45 animate-fade-in"
        onClick={onClose}
      />
      <aside className="absolute inset-y-0 left-0 flex w-[min(100vw,22rem)] animate-slide-in-left flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">{storeName}</p>
            <h2 className="truncate text-sm font-bold uppercase tracking-wide text-aheers-charcoal">
              {activeDept ?? "Shop by department"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {mode === "taxonomy" && activeDept && (
          <button
            type="button"
            onClick={() => setActiveDept(null)}
            className="flex items-center gap-1 border-b border-gray-100 px-4 py-2.5 text-xs font-semibold text-aheers-green hover:bg-aheers-mist"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> All departments
          </button>
        )}

        <ul className="flex-1 overflow-y-auto">
          {!activeDept && (
            <li>
              <button
                type="button"
                onClick={() => {
                  onSelect("");
                  onClose();
                }}
                className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3.5 text-left transition hover:bg-aheers-mist"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-aheers-mist text-lg">✦</span>
                <span className="flex-1 text-sm font-semibold text-aheers-charcoal">All products</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </li>
          )}

          {mode === "taxonomy" && !activeDept &&
            SUPERMARKET_DEPARTMENTS.filter((d) =>
              categories.some((c) => d.categories.some((dc) => dc.name === c))
            ).map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setActiveDept(d.name)}
                  className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3.5 text-left transition hover:bg-aheers-mist"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f3f5f4] text-lg">
                    {d.icon}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-aheers-charcoal">{d.name}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </li>
            ))}

          {mode === "taxonomy" && activeDept && (
            <>
              {onSelectDepartment && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectDepartment(activeDept);
                      onClose();
                    }}
                    className="flex w-full items-center gap-3 border-b border-gray-100 bg-aheers-mist/60 px-4 py-3.5 text-left transition hover:bg-aheers-mist"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg">
                      {departmentEmoji(activeDept)}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-aheers-charcoal">
                      Shop all {activeDept}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </li>
              )}
              {leafCats.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(cat);
                      onClose();
                    }}
                    className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3.5 text-left transition hover:bg-aheers-mist"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f3f5f4] text-lg">
                      {categoryEmoji(cat)}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-aheers-charcoal">{cat}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </li>
              ))}
            </>
          )}

          {mode === "flat" &&
            categories.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(cat);
                    onClose();
                  }}
                  className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3.5 text-left transition hover:bg-aheers-mist"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f3f5f4] text-lg">
                    {categoryEmoji(cat)}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-aheers-charcoal">{cat}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </li>
            ))}
        </ul>
      </aside>
    </div>
  );
}
