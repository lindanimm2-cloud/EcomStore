"use client";

import { FormEvent, useMemo, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatusBadge } from "@/components/admin-ui";
import { CRM_MEETINGS, CrmMeeting, MeetingStatus, MeetingType } from "@/lib/crm-activity";
import { PrettySelect } from "@/components/pretty-select";
import { Plus, MapPin, Clock, User } from "lucide-react";

const TYPE_OPTS = [
  { value: "call", label: "Phone call" },
  { value: "video", label: "Video" },
  { value: "in-person", label: "In person" },
  { value: "site-visit", label: "Site visit" },
];

const STATUS_OPTS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState(CRM_MEETINGS);
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);

  const list = useMemo(() => {
    return meetings
      .filter((m) => filter === "all" || m.status === filter)
      .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
  }, [meetings, filter]);

  function setStatus(id: string, status: MeetingStatus) {
    setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  }

  function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const neu: CrmMeeting = {
      id: `MTG-${Date.now().toString().slice(-4)}`,
      title: String(fd.get("title")),
      type: String(fd.get("type")) as MeetingType,
      status: "scheduled",
      date: String(fd.get("date")),
      startTime: String(fd.get("startTime")),
      endTime: String(fd.get("endTime")),
      withName: String(fd.get("withName")),
      company: String(fd.get("company") || "") || undefined,
      location: String(fd.get("location")),
      owner: String(fd.get("owner")),
      notes: String(fd.get("notes") || "") || undefined,
    };
    setMeetings((prev) => [neu, ...prev]);
    setShowAdd(false);
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader title="Meetings" subtitle="Aheers App · Calls · site visits · video · customer & lead appointments" />
        <div className="admin-page">
          <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["all", "scheduled", "completed", "cancelled"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`shrink-0 capitalize ${filter === f ? "chip-active" : "chip-idle"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="btn-primary min-h-10 w-full text-sm sm:w-auto"
            >
              <Plus className="h-4 w-4" /> Schedule meeting
            </button>
          </div>

          <div className="space-y-3">
            {list.map((m) => (
              <div key={m.id} className="card p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-xs text-gray-400">{m.id}</p>
                      <StatusBadge status={m.type} />
                      <StatusBadge status={m.status} />
                    </div>
                    <h3 className="mt-1 font-semibold text-gray-900">{m.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {m.withName}
                      {m.company ? ` · ${m.company}` : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {m.date} · {m.startTime}–{m.endTime}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {m.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {m.owner}
                      </span>
                    </div>
                    {m.notes && <p className="mt-2 text-xs text-gray-400">{m.notes}</p>}
                  </div>
                  <div className="w-full sm:w-40">
                    <PrettySelect
                      value={m.status}
                      onChange={(v) => setStatus(m.id, v as MeetingStatus)}
                      options={STATUS_OPTS}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <form onSubmit={onAdd} className="menu-panel max-h-[90dvh] w-full max-w-md space-y-3 overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl sm:p-6">
            <h3 className="font-display text-lg font-semibold">Schedule meeting</h3>
            <input name="title" required placeholder="Title" className="field" />
            <PrettySelect name="type" label="Type" defaultValue="call" options={TYPE_OPTS} />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <input name="date" required type="date" defaultValue="2026-08-05" className="field" />
              <input name="startTime" required type="time" defaultValue="10:00" className="field" />
              <input name="endTime" required type="time" defaultValue="10:30" className="field" />
            </div>
            <input name="withName" required placeholder="With (name)" className="field" />
            <input name="company" placeholder="Company (optional)" className="field" />
            <input name="location" required placeholder="Location / link" className="field" />
            <input name="owner" required placeholder="Owner" defaultValue="Lerato Dlamini" className="field" />
            <textarea name="notes" rows={2} placeholder="Notes" className="field" />
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
