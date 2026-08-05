export type IssueSeverity = "low" | "medium" | "high" | "blocker";
export type IssueStatus = "open" | "in_progress" | "resolved";

export interface DevIssue {
  id: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  pageUrl: string;
  reporterName: string;
  reporterEmail: string;
  roleHint: string;
  createdAt: string;
  updatedAt: string;
}

export const DEV_ISSUES_KEY = "aheers-dev-issues-v1";

export function loadDevIssues(): DevIssue[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DEV_ISSUES_KEY);
    return raw ? (JSON.parse(raw) as DevIssue[]) : [];
  } catch {
    return [];
  }
}

export function saveDevIssues(issues: DevIssue[]) {
  localStorage.setItem(DEV_ISSUES_KEY, JSON.stringify(issues));
}

export function addDevIssue(
  input: Omit<DevIssue, "id" | "status" | "createdAt" | "updatedAt">
): DevIssue {
  const now = new Date().toISOString();
  const issue: DevIssue = {
    ...input,
    id: `ISS-${Date.now()}`,
    status: "open",
    createdAt: now,
    updatedAt: now,
  };
  const all = loadDevIssues();
  saveDevIssues([issue, ...all]);
  return issue;
}

export function updateDevIssueStatus(id: string, status: IssueStatus) {
  const all = loadDevIssues().map((i) =>
    i.id === id ? { ...i, status, updatedAt: new Date().toISOString() } : i
  );
  saveDevIssues(all);
  return all;
}
