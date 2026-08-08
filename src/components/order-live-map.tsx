"use client";

import { DEPOT, getStatusColor, getStatusLabel } from "@/lib/fleet";
import { FleetVehicle } from "@/lib/types";

/** Focused live map for one vehicle + delivery pin */
export function OrderLiveMap({
  vehicle,
  destinationLabel,
}: {
  vehicle?: FleetVehicle | null;
  destinationLabel?: string;
}) {
  const toX = (lng: number) => ((lng - 30.58) / 0.025) * 100;
  const toY = (lat: number) => ((-29.055 - lat) / 0.015) * 100;

  const destLat = vehicle?.lat != null ? vehicle.lat + 0.003 : DEPOT.lat + 0.004;
  const destLng = vehicle?.lng != null ? vehicle.lng + 0.004 : DEPOT.lng + 0.006;

  return (
    <div className="overflow-hidden rounded-2xl border border-aheers-green/10 bg-white shadow-soft">
      <div className="relative h-64 bg-gradient-to-br from-[#e8efe9] via-[#f3f6f4] to-[#dfe8e2] sm:h-80">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          {[25, 50, 75].map((p) => (
            <g key={p}>
              <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="#c5d5cb" strokeWidth="0.5" />
              <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="#c5d5cb" strokeWidth="0.5" />
            </g>
          ))}
        </svg>
        <div className="absolute left-[8%] top-[35%] h-1 w-[70%] rotate-[8deg] rounded-full bg-white/70" />
        <div className="absolute left-[42%] top-[8%] h-[75%] w-1 rounded-full bg-white/70" />

        {/* Depot */}
        <div
          className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${toX(DEPOT.lng)}%`, top: `${toY(DEPOT.lat)}%` }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-aheers-green-dark text-sm text-white shadow-lift">
            🏪
          </div>
          <span className="mt-1 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-semibold text-aheers-green-dark shadow">
            Depot
          </span>
        </div>

        {/* Destination */}
        <div
          className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${toX(destLng)}%`, top: `${toY(destLat)}%` }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-aheers-gold text-aheers-green-dark shadow-lift ring-2 ring-white">
            📍
          </div>
          <span className="mt-1 max-w-[7rem] truncate rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-semibold text-gray-700 shadow">
            {destinationLabel ?? vehicle?.destination ?? "Delivery"}
          </span>
        </div>

        {/* Vehicle */}
        {vehicle && (
          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 animate-float"
            style={{ left: `${toX(vehicle.lng)}%`, top: `${toY(vehicle.lat)}%` }}
          >
            <div
              className={`relative flex h-11 w-11 items-center justify-center rounded-full text-lg text-white shadow-lift ring-2 ring-white ${getStatusColor(vehicle.status)}`}
            >
              🚚
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 animate-ping rounded-full bg-emerald-400 ring-2 ring-white" />
            </div>
            <div className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-xl bg-aheers-green-dark px-2.5 py-1.5 text-center text-[10px] text-white shadow-lift">
              <p className="font-semibold">{vehicle.driver}</p>
              <p className="text-white/60">
                {getStatusLabel(vehicle.status)}
                {vehicle.eta ? ` · ETA ${vehicle.eta}` : ""}
              </p>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 rounded-xl bg-white/95 px-3 py-2 text-[10px] shadow-soft">
          <p className="font-semibold text-aheers-green-dark">Live · Greytown</p>
          <p className="text-gray-500">Demo map · fleet updates from drivers</p>
        </div>
      </div>
    </div>
  );
}
