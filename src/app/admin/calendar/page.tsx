"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatusBadge } from "@/components/admin-ui";
import {
  CRM_MEETINGS,
  CRM_TASKS,
  CrmMeeting,
  CrmTask,
  meetingsOnDate,
  tasksDueOnDate,
} from "@/lib/crm-activity";
import { ChevronLeft, ChevronRight, CalendarDays, CheckSquare, Video } from "lucide-react";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function monthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function CalendarPage() {
  const [cursor, setCursor] = useState(() => new Date(2026, 7, 1)); // Aug 2026
  const [selected, setSelected] = useState("2026-08-05");
  const [meetings] = useState<CrmMeeting[]>(CRM_MEETINGS);
  const [tasks] = useState<CrmTask[]>(CRM_TASKS);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => monthMatrix(year, month), [year, month]);
  const label = cursor.toLocaleDateString("en-ZA", { month: "long", year: "numeric" });

  const dayMeetings = meetingsOnDate(selected, meetings);
  const dayTasks = tasksDueOnDate(selected, tasks);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader
          title="CRM — Calendar"
          subtitle="Meetings · task due dates · team schedule across stores"
        />
        <div className="admin-page grid gap-5 lg:grid-cols-5">
          <div className="card p-4 sm:p-5 lg:col-span-3">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-aheers-green-dark sm:text-xl">{label}</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-gray-200 p-2 hover:bg-aheers-mist"
                  onClick={() => setCursor(new Date(year, month - 1, 1))}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-aheers-mist"
                  onClick={() => {
                    setCursor(new Date(2026, 7, 1));
                    setSelected("2026-08-05");
                  }}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-gray-200 p-2 hover:bg-aheers-mist"
                  onClick={() => setCursor(new Date(year, month + 1, 1))}
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:gap-1 sm:text-[11px]">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-1">
                  <span className="sm:hidden">{d.slice(0, 1)}</span>
                  <span className="hidden sm:inline">{d}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} className="min-h-11 rounded-lg bg-transparent sm:min-h-[72px] sm:rounded-xl" />;
                const key = toKey(year, month, day);
                const mCount = meetingsOnDate(key, meetings).length;
                const tCount = tasksDueOnDate(key, tasks).length;
                const isSelected = key === selected;
                const isToday = key === "2026-08-05";
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelected(key)}
                    className={`min-h-11 rounded-lg border p-1 text-left transition sm:min-h-[72px] sm:rounded-xl sm:p-2 ${
                      isSelected
                        ? "border-aheers-green bg-aheers-green text-white shadow-soft"
                        : isToday
                          ? "border-aheers-gold/50 bg-aheers-gold/10 hover:bg-aheers-gold/20"
                          : "border-transparent bg-white hover:border-aheers-green/20 hover:bg-aheers-mist"
                    }`}
                  >
                    <span className={`text-xs font-semibold sm:text-sm ${isSelected ? "text-white" : "text-gray-800"}`}>{day}</span>
                    <div className="mt-0.5 flex flex-wrap gap-0.5 sm:mt-1 sm:block sm:space-y-0.5">
                      {mCount > 0 && (
                        <>
                          <span className={`inline-block h-1.5 w-1.5 rounded-full sm:hidden ${isSelected ? "bg-white" : "bg-aheers-green"}`} />
                          <span
                            className={`hidden truncate text-[10px] font-medium sm:block ${
                              isSelected ? "text-white/90" : "text-aheers-green"
                            }`}
                          >
                            {mCount} meet
                          </span>
                        </>
                      )}
                      {tCount > 0 && (
                        <>
                          <span className={`inline-block h-1.5 w-1.5 rounded-full sm:hidden ${isSelected ? "bg-aheers-gold" : "bg-amber-500"}`} />
                          <span
                            className={`hidden truncate text-[10px] font-medium sm:block ${
                              isSelected ? "text-white/80" : "text-amber-700"
                            }`}
                          >
                            {tCount} task
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
              <Link href="/admin/meetings" className="inline-flex items-center gap-1 font-medium text-aheers-green hover:underline">
                <Video className="h-3.5 w-3.5" /> All meetings
              </Link>
              <Link href="/admin/tasks" className="inline-flex items-center gap-1 font-medium text-aheers-green hover:underline">
                <CheckSquare className="h-3.5 w-3.5" /> All tasks
              </Link>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="card p-5">
              <div className="mb-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-aheers-green" />
                <h3 className="font-semibold text-gray-900">
                  {new Date(selected + "T12:00:00").toLocaleDateString("en-ZA", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </h3>
              </div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Meetings</p>
              {dayMeetings.length === 0 ? (
                <p className="mb-4 text-sm text-gray-400">No meetings</p>
              ) : (
                <ul className="mb-4 space-y-2">
                  {dayMeetings.map((m) => (
                    <li key={m.id} className="rounded-xl bg-aheers-mist/80 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">{m.title}</p>
                        <StatusBadge status={m.status} />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {m.startTime}–{m.endTime} · {m.location}
                      </p>
                      <p className="text-xs text-gray-400">
                        {m.withName}
                        {m.company ? ` · ${m.company}` : ""} · {m.owner}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Tasks due</p>
              {dayTasks.length === 0 ? (
                <p className="text-sm text-gray-400">No tasks due</p>
              ) : (
                <ul className="space-y-2">
                  {dayTasks.map((t) => (
                    <li key={t.id} className="rounded-xl border border-gray-100 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900">{t.title}</p>
                        <StatusBadge status={t.status} />
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        {t.owner} · <StatusBadge status={t.priority} />
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
