"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { MonitoredUrl, SslCheckResult } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { Label, Select } from "@/components/ui/Field";

export default function HistoryPage() {
  const [urls, setUrls] = useState<MonitoredUrl[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [checks, setChecks] = useState<SslCheckResult[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<MonitoredUrl[]>("/api/urls")
      .then((list) => {
        setUrls(list);
        if (list[0]) setSelectedId(list[0].id);
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    api<{ checks: SslCheckResult[] }>(`/api/urls/${selectedId}/checks`)
      .then((res) => setChecks(res.checks))
      .catch((e) => setError(e.message));
  }, [selectedId]);

  return (
    <div>
      <PageHeader
        title="History"
        description="Past SSL check results per host."
      />
      {error ? <p className="mb-4 text-sm text-[var(--danger)]">{error}</p> : null}
      {urls.length === 0 ? (
        <p className="text-sm text-[var(--text-soft)]">
          No URLs yet. Add hosts on the URLs page.
        </p>
      ) : (
        <>
          <div className="arcade-frame mb-6 max-w-md p-4">
            <Label>Host</Label>
            <Select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {urls.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label ?? u.url}
                </option>
              ))}
            </Select>
          </div>
          <div className="arcade-panel overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--surface-elevated)] text-xs uppercase tracking-[0.08em] text-[var(--text-soft)]">
                <tr>
                  <th className="p-3">Checked</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Days</th>
                  <th className="p-3">Error</th>
                </tr>
              </thead>
              <tbody>
                {checks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-3 text-[var(--text-muted)]">
                      No checks recorded for this host.
                    </td>
                  </tr>
                ) : (
                  checks.map((row) => (
                    <tr key={row.id} className="border-t border-[var(--border)]">
                      <td className="mono-meta p-3">
                        {new Date(row.checkedAt).toLocaleString()}
                      </td>
                      <td
                        className={`p-3 uppercase status-${row.status.toLowerCase()}`}
                      >
                        {row.status}
                      </td>
                      <td className="p-3">{row.daysRemaining ?? "—"}</td>
                      <td className="p-3 text-[var(--text-soft)]">
                        {row.errorMessage ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
