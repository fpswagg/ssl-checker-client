import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-soft)]">
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:shadow-[var(--focus-shadow)]"
      {...props}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="w-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus-visible:outline-none focus-visible:shadow-[var(--focus-shadow)]"
      {...props}
    />
  );
}
