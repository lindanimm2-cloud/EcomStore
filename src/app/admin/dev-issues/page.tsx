"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader, StatusBadge } from "@/components/admin-ui";
import {
  DevIssue,
  IssueStatus,
  loadDevIssues,
  updateDevIssueStatus,
} from "@/lib/dev-issues";
import { Bug } from "lucide-react";

export default function DevIssuesPage() {
  const [issues, setIssues] = useState<DevIssue[]>([]);
  const [filter, setFilter] = useState<"all" | IssueStatus>("all");

  useEffect(() => {
    setIssues(loadDevIssues());
  }, []);

  function setStatus(id: string, status: IssueStatus) {
    setIssues(updateDevIssueStatus(id, status));
  }

  const list = issues.filter((i) => filter === "all" || i.status === filter);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-[#f4f5f7]">
        <AdminHeader
          title="Dev issues"
          subtitle="Reports sent via “Report issue to developer” — inbox for this demo browser"
        />
        <div className="p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {(["all", "open", "in_progress", "resolved"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`capitalize ${filter === f ? "chip-active" : "chip-idle"}`}
              >
                {f.replace("_", " ")}
                {f !== "all" && (
                  <span className="ml-1 text-xs opacity-70">
                    ({issues.filter((i) => i.status === f).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
              <Bug className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="font-semibold text-gray-800">No issues yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Use the black “Report issue” button (bottom-left) anywhere on the site.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((issue) => (
                <article key={issue.id} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-gray-400">{issue.id}</span>
                        <StatusBadge status={issue.severity} />
                        <StatusBadge status={issue.status} />
                      </div>
                      <h2 className="mt-2 font-display text-lg font-semibold text-aheers-green-dark">
                        {issue.title}
                      </h2>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{issue.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
                    <span>
                      From {issue.reporterName || "Anonymous"}
                      {issue.reporterEmail ? ` · ${issue.reporterEmail}` : ""}
                    </span>
                    <span>Role: {issue.roleHint}</span>
                    <span className="font-mono">{issue.pageUrl}</span>
                    <span>{new Date(issue.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(["open", "in_progress", "resolved"] as IssueStatus[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(issue.id, s)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${
                          issue.status === s
                            ? "bg-aheers-green text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-aheers-mist"
                        }`}
                      >
                        {s.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
