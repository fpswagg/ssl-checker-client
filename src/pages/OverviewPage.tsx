import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Overview } from "../lib/types";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/ui/Button";

export function OverviewPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setData(await api<Overview>("/api/overview"));
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function runChecks() {
    setRunning(true);
    setError("");
    try {
      await api("/api/checks/run", { method: "POST" });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Run failed");
    } finally {
      setRunning(false);
    }
  }

  if (!data) {
    return <p className="text-[var(--text-muted)]">Loading…</p>;
  }

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Monitor certificate health across your hosts."
        actions={
          <Button variant="primary" onClick={runChecks} disabled={running}>
            {running ? "Running…" : "Run checks now"}
          </Button>
        }
      />
      {error ? (
        <p className="mb-4 text-sm text-[var(--danger)]">{error}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Emails", value: data.emailCount },
          { label: "URLs", value: data.urlCount },
          { label: "Enabled", value: data.enabledCount },
        ].map((stat) => (
          <div key={stat.label} className="arcade-panel p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-soft)]">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
      <p className="mono-meta mt-6 text-[var(--text-muted)]">
        Last run:{" "}
        {data.lastRunAt
          ? new Date(data.lastRunAt).toLocaleString()
          : "never"}
      </p>
      <section className="arcade-frame mt-8 p-4">
        <h2 className="text-lg font-semibold">Failing hosts</h2>
        {data.failing.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            No failing hosts.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {data.failing.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-2 border border-[var(--border)] p-3"
              >
                <span>{row.label ?? row.url}</span>
                <span className={`status-${row.status.toLowerCase()} text-sm uppercase`}>
                  {row.status}
                  {row.daysRemaining !== null ? ` · ${row.daysRemaining}d` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
