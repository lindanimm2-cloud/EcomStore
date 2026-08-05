"use client";

import { FormEvent, useMemo, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatusBadge } from "@/components/admin-ui";
import { CRM_TASKS, CrmTask, TaskPriority, TaskStatus } from "@/lib/crm-activity";
import { PrettySelect } from "@/components/pretty-select";
import { Plus } from "lucide-react";

const COLUMNS: { key: TaskStatus; title: string }[] = [
  { key: "todo", title: "To do" },
  { key: "in_progress", title: "In progress" },
  { key: "overdue", title: "Overdue" },
  { key: "done", title: "Done" },
];

const PRIORITY_OPTS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const STATUS_OPTS = COLUMNS.map((c) => ({ value: c.key, label: c.title }));

const CATEGORY_OPTS = [
  { value: "follow-up", label: "Follow-up" },
  { value: "quote", label: "Quote" },
  { value: "delivery", label: "Delivery" },
  { value: "support", label: "Support" },
  { value: "internal", label: "Internal" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(CRM_TASKS);
  const [view, setView] = useState<"board" | "list">("board");
  const [showAdd, setShowAdd] = useState(false);

  const byStatus = useMemo(() => {
    const map: Record<TaskStatus, CrmTask[]> = {
      todo: [],
      in_progress: [],
      overdue: [],
      done: [],
    };
    for (const t of tasks) map[t.status].push(t);
    return map;
  }, [tasks]);

  function setStatus(id: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const neu: CrmTask = {
      id: `TSK-${Date.now().toString().slice(-4)}`,
      title: String(fd.get("title")),
      description: String(fd.get("description") || ""),
      status: "todo",
      priority: String(fd.get("priority")) as TaskPriority,
      dueDate: String(fd.get("dueDate")),
      owner: String(fd.get("owner")),
      relatedTo: String(fd.get("relatedTo") || "—"),
      category: String(fd.get("category")) as CrmTask["category"],
    };
    setTasks((prev) => [neu, ...prev]);
    setShowAdd(false);
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50">
        <AdminHeader title="CRM — Tasks" subtitle="Follow-ups · quotes · delivery chases · support actions" />
        <div className="p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 rounded-full bg-white p-1 ring-1 ring-gray-200">
              <button
                type="button"
                onClick={() => setView("board")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${view === "board" ? "bg-aheers-green text-white" : "text-gray-600"}`}
              >
                Board
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${view === "list" ? "bg-aheers-green text-white" : "text-gray-600"}`}
              >
                List
              </button>
            </div>
            <button type="button" onClick={() => setShowAdd(true)} className="btn-primary text-sm">
              <Plus className="h-4 w-4" /> Add task
            </button>
          </div>

          {view === "board" ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {COLUMNS.map((col) => (
                <div key={col.key} className="w-64 shrink-0">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">{col.title}</h3>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-500 ring-1 ring-gray-200">
                      {byStatus[col.key].length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {byStatus[col.key].map((t) => (
                      <div key={t.id} className="card p-3">
                        <p className="text-sm font-semibold text-gray-900">{t.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-gray-500">{t.description}</p>
                        <p className="mt-2 text-xs text-gray-400">
                          Due {t.dueDate} · {t.owner}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-1">
                          <StatusBadge status={t.priority} />
                          <StatusBadge status={t.category} />
                        </div>
                        <PrettySelect
                          className="mt-2"
                          value={t.status}
                          onChange={(v) => setStatus(t.id, v as TaskStatus)}
                          options={STATUS_OPTS}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    <th className="px-5 py-3.5">Task</th>
                    <th className="px-5 py-3.5">Related</th>
                    <th className="px-5 py-3.5">Owner</th>
                    <th className="px-5 py-3.5">Due</th>
                    <th className="px-5 py-3.5">Priority</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tasks.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/80">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">{t.title}</p>
                        <p className="text-xs text-gray-400">{t.id}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{t.relatedTo}</td>
                      <td className="px-5 py-4 text-gray-600">{t.owner}</td>
                      <td className="px-5 py-4 text-gray-600">{t.dueDate}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={t.priority} />
                      </td>
                      <td className="px-5 py-4">
                        <PrettySelect
                          className="min-w-[8rem]"
                          value={t.status}
                          onChange={(v) => setStatus(t.id, v as TaskStatus)}
                          options={STATUS_OPTS}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={onAdd} className="menu-panel w-full max-w-md space-y-3 p-6">
            <h3 className="font-display text-lg font-semibold">Add task</h3>
            <input name="title" required placeholder="Title" className="field" />
            <textarea name="description" rows={2} placeholder="Description" className="field" />
            <PrettySelect name="priority" label="Priority" defaultValue="medium" options={PRIORITY_OPTS} />
            <PrettySelect name="category" label="Category" defaultValue="follow-up" options={CATEGORY_OPTS} />
            <input name="dueDate" required type="date" defaultValue="2026-08-06" className="field" />
            <input name="owner" required placeholder="Owner" defaultValue="Lerato Dlamini" className="field" />
            <input name="relatedTo" placeholder="Related to (lead / ticket / customer)" className="field" />
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
