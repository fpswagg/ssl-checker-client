import { FormEvent, useEffect, useState } from "react";
import { api } from "../lib/api";
import type { NotificationEmail } from "../lib/types";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/ui/Button";
import { Input, Label } from "../components/ui/Field";

export function EmailsPage() {
  const [emails, setEmails] = useState<NotificationEmail[]>([]);
  const [address, setAddress] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setEmails(await api<NotificationEmail[]>("/api/emails"));
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/emails", {
        method: "POST",
        body: JSON.stringify({ address, label: label || null }),
      });
      setAddress("");
      setLabel("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this email?")) return;
    await api(`/api/emails/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Emails"
        description="Notification addresses linked to monitored URLs."
      />
      {error ? <p className="mb-4 text-sm text-[var(--danger)]">{error}</p> : null}
      <form onSubmit={onCreate} className="arcade-frame mb-8 grid gap-4 p-4 md:grid-cols-3">
        <div>
          <Label>Address</Label>
          <Input
            type="email"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Label</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div className="flex items-end">
          <Button type="submit" variant="primary">
            Add email
          </Button>
        </div>
      </form>
      <div className="arcade-panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-elevated)] text-xs uppercase tracking-[0.08em] text-[var(--text-soft)]">
            <tr>
              <th className="p-3">Address</th>
              <th className="p-3">Label</th>
              <th className="p-3">URLs</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr key={email.id} className="border-t border-[var(--border)]">
                <td className="mono-meta p-3">{email.address}</td>
                <td className="p-3">{email.label ?? "—"}</td>
                <td className="p-3">{email._count?.urls ?? 0}</td>
                <td className="p-3 text-right">
                  <Button variant="danger" onClick={() => onDelete(email.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
