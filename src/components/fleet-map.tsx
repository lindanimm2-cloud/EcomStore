"use client";

import { FLEET_VEHICLES, DEPOT, getStatusColor, getStatusLabel } from "@/lib/fleet";

export function FleetMap() {
  // SVG map of Greytown area — positions normalized from lat/lng
  const toX = (lng: number) => ((lng - 30.580) / 0.025) * 100;
  const toY = (lat: number) => (( -29.055 - lat) / 0.015) * 100;

  return (
    <div className="card overflow-hidden">
      <div className="relative h-96 bg-gradient-to-br from-slate-100 to-slate-200">
        {/* Grid lines */}
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          {[20, 40, 60, 80].map((p) => (
            <g key={p}>
              <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="#cbd5e1" strokeWidth="0.5" />
              <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="#cbd5e1" strokeWidth="0.5" />
            </g>
          ))}
        </svg>

        {/* Roads */}
        <div className="absolute left-[10%] top-[30%] h-1 w-[80%] rotate-12 bg-gray-300/60" />
        <div className="absolute left-[20%] top-[10%] h-[70%] w-1 bg-gray-300/60" />

        {/* Depot */}
        <div
          className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${toX(DEPOT.lng)}%`, top: `${toY(DEPOT.lat)}%` }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-aheers-green-dark text-white shadow-lg">
            🏪
          </div>
          <span className="mt-1 rounded bg-white px-2 py-0.5 text-xs font-semibold shadow">{DEPOT.name}</span>
        </div>

        {/* Vehicles */}
        {FLEET_VEHICLES.map((v) => (
          <div
            key={v.id}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${toX(v.lng)}%`, top: `${toY(v.lat)}%` }}
          >
            <div className={`relative flex h-9 w-9 items-center justify-center rounded-full ${getStatusColor(v.status)} text-white shadow-lg ring-2 ring-white`}>
              🚚
              {v.status !== "idle" && (
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 animate-pulse rounded-full bg-green-400 ring-2 ring-white" />
              )}
            </div>
            <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-1 text-xs shadow">
              <p className="font-semibold">{v.name}</p>
              <p className="text-gray-500">{getStatusLabel(v.status)}{v.eta ? ` · ETA ${v.eta}` : ""}</p>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 p-3 text-xs shadow">
          <p className="mb-2 font-semibold">Fleet Status</p>
          {(["idle", "en-route", "delivering", "returning"] as const).map((s) => (
            <div key={s} className="mb-1 flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor(s)}`} />
              {getStatusLabel(s)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FleetVehicleList() {
  return (
    <div className="space-y-3">
      {FLEET_VEHICLES.map((v) => (
        <div key={v.id} className="card p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-900">{v.name}</p>
              <p className="text-sm text-gray-500">{v.driver} · {v.phone}</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${getStatusColor(v.status)}`}>
              {getStatusLabel(v.status)}
            </span>
          </div>
          {v.destination && (
            <p className="mt-2 text-sm text-gray-600">
              📍 {v.destination} {v.eta && <span className="text-aheers-green-light">· ETA {v.eta}</span>}
            </p>
          )}
          {v.orderId && (
            <p className="mt-1 text-xs text-gray-400">Order: {v.orderId} · Capacity: {v.capacity}</p>
          )}
        </div>
      ))}
    </div>
  );
}
