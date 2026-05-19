"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { NotificationEmail, SendReportResponse } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Field";

type RecipientMode = "fallback" | "emails" | "both";

export default function ReportsPage() {
  const [emails, setEmails] = useState<NotificationEmail[]>([]);
  const [recipientMode, setRecipientMode] = useState<RecipientMode>("fallback");
  const [emailIds, setEmailIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api<NotificationEmail[]>("/api/emails")
      .then(setEmails)
      .catch((e) => setError(e.message));
  }, []);

  function toggleEmail(id: string) {
    setEmailIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSending(true);

    try {
      const result = await api<SendReportResponse>("/api/reports/send", {
        method: "POST",
        body: JSON.stringify({ recipientMode, emailIds }),
      });
      setSuccess(`Report sent to ${result.sentTo.join(", ")}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send report");
    } finally {
      setSending(false);
    }
  }

  const showEmailPicker =
    recipientMode === "emails" || recipientMode === "both";

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Send the current SSL status table to the fallback address and/or selected notification emails."
      />

      {error ? (
        <p className="mb-4 text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p
          className="mb-4 text-sm text-[var(--success)]"
          role="status"
        >
          {success}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="arcade-frame max-w-2xl space-y-6 p-4">
        <fieldset className="space-y-3">
          <legend className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-soft)]">
            Recipients
          </legend>
          {(
            [
              {
                value: "fallback" as const,
                label: "Fallback email only",
                hint: "Uses FALLBACK_EMAIL from server config",
              },
              {
                value: "emails" as const,
                label: "Selected notification emails",
                hint: "Pick one or more addresses below",
              },
              {
                value: "both" as const,
                label: "Fallback + selected emails",
                hint: "Sends to both groups (deduplicated)",
              },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer flex-col gap-1 border px-3 py-3 text-sm transition-colors ${
                recipientMode === option.value
                  ? "border-[var(--border-strong)] bg-[var(--surface-elevated)]"
                  : "border-[var(--border)]"
              }`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="recipientMode"
                  value={option.value}
                  checked={recipientMode === option.value}
                  onChange={() => setRecipientMode(option.value)}
                  className="accent-[var(--accent)]"
                />
                <span className="uppercase tracking-[0.06em]">
                  {option.label}
                </span>
              </span>
              <span className="mono-meta pl-6 text-[var(--text-muted)]">
                {option.hint}
              </span>
            </label>
          ))}
        </fieldset>

        {showEmailPicker ? (
          <div>
            <Label>Notification emails</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {emails.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">
                  No emails yet. Add them on the Emails page.
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
        ) : null}

        <Button
          type="submit"
          variant="primary"
          disabled={
            sending ||
            (showEmailPicker && emails.length > 0 && emailIds.length === 0)
          }
        >
          {sending ? "Sending…" : "Send report now"}
        </Button>
      </form>

      <p className="mono-meta mt-6 max-w-2xl text-[var(--text-muted)]">
        The report lists every monitored host with latest status, days remaining,
        and last check time. Weekly cron still sends to the fallback address
        automatically.
      </p>
    </div>
  );
}
