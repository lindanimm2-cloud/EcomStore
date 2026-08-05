"use client";

import { useState } from "react";
import { ChefHat, Clock } from "lucide-react";

const STEPS = [
  { id: "received", label: "Order received" },
  { id: "prep", label: "Kitchen preparing" },
  { id: "ready", label: "Ready for pickup" },
  { id: "done", label: "Collected / out for delivery" },
];

export function KitchenStatus() {
  const [step, setStep] = useState(1);

  return (
    <div className="card mb-8 border-l-4 border-l-grabngo-teal p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 font-semibold text-gray-900">
            <ChefHat className="h-5 w-5 text-grabngo-teal" />
            Grab n Go kitchen status (demo)
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Live preparation tracking · Est. ready in ~10 minutes
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-grabngo-teal/10 px-3 py-1 text-xs font-medium text-grabngo-teal">
          <Clock className="h-3.5 w-3.5" /> Express
        </span>
      </div>
      <ol className="mt-4 grid gap-2 sm:grid-cols-4">
        {STEPS.map((s, i) => (
          <li
            key={s.id}
            className={`rounded-lg px-3 py-2 text-center text-xs font-medium ${
              i <= step ? "bg-grabngo-teal text-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            {s.label}
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => setStep((s) => (s + 1) % STEPS.length)}
        className="mt-3 text-xs font-medium text-grabngo-teal hover:underline"
      >
        Simulate next kitchen step →
      </button>
    </div>
  );
}
