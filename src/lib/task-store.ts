/** Persisted CRM tasks so dashboard complete/undo/status stay in sync. */

import { CRM_TASKS, type CrmTask, type TaskPriority, type TaskStatus } from "@/lib/crm-activity";

const KEY = "aheers-tasks-v1";
export const TASKS_EVENT = "aheers-tasks";

function read(): CrmTask[] {
  if (typeof window === "undefined") return CRM_TASKS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return CRM_TASKS;
    const parsed = JSON.parse(raw) as CrmTask[];
    if (!Array.isArray(parsed) || !parsed.length) return CRM_TASKS;
    const ids = new Set(parsed.map((t) => t.id));
    return [...parsed, ...CRM_TASKS.filter((t) => !ids.has(t.id))];
  } catch {
    return CRM_TASKS;
  }
}

function write(tasks: CrmTask[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(tasks));
  window.dispatchEvent(new CustomEvent(TASKS_EVENT, { detail: tasks }));
}

export function listTasks(): CrmTask[] {
  return [...read()];
}

export function subscribeTasks(onChange: (tasks: CrmTask[]) => void) {
  const emit = () => onChange(listTasks());
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) emit();
  };
  window.addEventListener(TASKS_EVENT, emit as EventListener);
  window.addEventListener("storage", onStorage);
  emit();
  return () => {
    window.removeEventListener(TASKS_EVENT, emit as EventListener);
    window.removeEventListener("storage", onStorage);
  };
}

export function patchTask(id: string, patch: Partial<CrmTask>) {
  write(read().map((t) => (t.id === id ? { ...t, ...patch } : t)));
}

export function setTaskStatus(id: string, status: TaskStatus) {
  patchTask(id, { status });
}

export function addTask(input: {
  title: string;
  description?: string;
  dueDate: string;
  owner: string;
  relatedTo?: string;
  priority?: TaskPriority;
  category?: CrmTask["category"];
}) {
  const neu: CrmTask = {
    id: `TSK-${Date.now().toString().slice(-4)}`,
    title: input.title,
    description: input.description ?? "",
    status: "todo",
    priority: input.priority ?? "medium",
    dueDate: input.dueDate,
    owner: input.owner,
    relatedTo: input.relatedTo ?? "—",
    category: input.category ?? "internal",
  };
  write([neu, ...read()]);
  return neu;
}
