import { FormEvent, useEffect, useState } from "react";
import { api } from "../lib/api";
import type { MonitoredUrl, NotificationEmail } from "../lib/types";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/ui/Button";
import { Input, Label } from "../components/ui/Field";

export function UrlsPage() {
  const [urls, setUrls] = useState<MonitoredUrl[]>([]);
  const [emails, setEmails] = useState<NotificationEmail[]>([]);
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [emailIds, setEmailIds] = useState<string[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const [urlList, emailList] = await Promise.all([
      api<MonitoredUrl[]>("/api/urls"),
      api<NotificationEmail[]>("/api/emails"),
    ]);
    setUrls(urlList);
    setEmails(emailList);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  function toggleEmail(id: string) {
    setEmailIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/urls", {
        method: "POST",
        body: JSON.stringify({
          url,
          label: label || null,
          emailIds,
        }),
      });
      setUrl("");
      setLabel("");
      setEmailIds([]);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this URL?")) return;
    await api(`/api/urls/${id}`, { method: "DELETE" });
    await load();
  }

  async function onToggleEnabled(item: MonitoredUrl) {
    await api(`/api/urls/${item.id}`, {
      method: "PATCH",
      body: JSON.stringify({ enabled: !item.enabled }),
    });
    await load();
  }

  return (
    <div>
      <PageHeader
        title="URLs"
        description="Hosts to check daily. Assign one or more notification emails."
      />
      {error ? <p className="mb-4 text-sm text-[var(--danger)]">{error}</p> : null}
      <form onSubmit={onCreate} className="arcade-frame mb-8 space-y-4 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Host</Label>
            <Input
              placeholder="example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Label</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Notification emails</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {emails.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">
                Add emails first.
              </p>
            ) : (
              emails.map((email) => (
                <label
                  key={email.id}
                  className={`cursor-pointer border px-3 py-2 text-sm ${
                    emailIds.includes(email.id)
                      ? "border-[var(--border-strong)] bg-[var(--surface-elevated)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={emailIds.includes(email.id)}
                    onChange={() => toggleEmail(email.id)}
                  />
                  {email.label ?? email.address}
                </label>
              ))
            )}
          </div>
        </div>
        <Button type="submit" variant="primary">
          Add URL
        </Button>
      </form>
      <div className="space-y-4">
        {urls.map((item) => {
          const last = item.checks[0];
          return (
            <article
              key={item.id}
              className="arcade-panel flex flex-wrap items-start justify-between gap-4 p-4"
            >
              <div>
                <p className="font-medium">{item.label ?? item.url}</p>
                <p className="mono-meta text-[var(--text-muted)]">{item.url}</p>
                <p className="mt-2 text-xs text-[var(--text-soft)]">
                  {item.emails.map((e) => e.email.address).join(", ") ||
                    "No emails assigned"}
                </p>
                {last ? (
                  <p
                    className={`mt-2 text-sm uppercase status-${last.status.toLowerCase()}`}
                  >
                    {last.status}
                    {last.daysRemaining !== null
                      ? ` · ${last.daysRemaining} days`
                      : ""}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => onToggleEnabled(item)}>
                  {item.enabled ? "Disable" : "Enable"}
                </Button>
                <Button variant="danger" onClick={() => onDelete(item.id)}>
                  Delete
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
