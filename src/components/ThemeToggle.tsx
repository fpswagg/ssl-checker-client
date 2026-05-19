const KEY = "sawabo-theme";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem(KEY, next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-xs uppercase tracking-[0.08em] text-[var(--text-soft)] hover:border-[var(--border-strong)] hover:text-[var(--text)] focus-visible:shadow-[var(--focus-shadow)]"
    >
      Theme
    </button>
  );
}
