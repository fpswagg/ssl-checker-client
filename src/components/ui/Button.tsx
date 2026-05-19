import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--primary)] text-[var(--primary-contrast)] border border-[var(--border-strong)] hover:brightness-110",
  secondary:
    "bg-[var(--surface-elevated)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--border-strong)]",
  danger:
    "bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)] hover:brightness-110",
  ghost:
    "bg-transparent text-[var(--text-soft)] border border-transparent hover:border-[var(--border)] hover:text-[var(--text)]",
};

export function Button({
  variant = "secondary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex min-h-[44px] items-center justify-center px-4 py-2 text-sm font-medium uppercase tracking-[0.08em] transition-[background,border,color] duration-150 ease-out focus-visible:outline-none focus-visible:shadow-[var(--focus-shadow)] disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
