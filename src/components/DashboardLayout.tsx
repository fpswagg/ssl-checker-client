import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/Button";
import { setToken } from "../lib/api";

const links = [
  { to: "/dashboard", label: "Overview", end: true },
  { to: "/dashboard/emails", label: "Emails" },
  { to: "/dashboard/urls", label: "URLs" },
  { to: "/dashboard/history", label: "History" },
];

export function DashboardLayout() {
  const navigate = useNavigate();

  function signOut() {
    setToken(null);
    navigate("/login");
  }

  return (
    <div className="min-h-screen md:flex">
      <aside className="arcade-frame flex flex-col gap-4 p-4 md:w-56 md:shrink-0">
        <div>
          <p className="display-pixel text-[var(--accent)]">ssl checker</p>
          <p className="mono-meta mt-2 text-[var(--text-muted)]">dashboard</p>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `border px-3 py-2 text-sm uppercase tracking-[0.08em] transition-colors ${
                  isActive
                    ? "border-[var(--border-strong)] bg-[var(--surface-elevated)] text-[var(--text)]"
                    : "border-transparent text-[var(--text-soft)] hover:border-[var(--border)] hover:text-[var(--text)]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <ThemeToggle />
          <Button variant="ghost" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-5 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
