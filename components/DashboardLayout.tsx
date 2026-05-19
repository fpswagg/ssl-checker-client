"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/Button";
import { setToken } from "@/lib/api";

const links = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/emails", label: "Emails" },
  { href: "/dashboard/urls", label: "URLs" },
  { href: "/dashboard/history", label: "History" },
  { href: "/dashboard/reports", label: "Reports" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function signOut() {
    setToken(null);
    router.push("/login");
  }

  return (
    <div className="min-h-screen md:flex">
      <aside className="arcade-frame flex flex-col gap-4 p-4 md:w-56 md:shrink-0">
        <div>
          <p className="display-pixel text-[var(--accent)]">ssl checker</p>
          <p className="mono-meta mt-2 text-[var(--text-muted)]">dashboard</p>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border px-3 py-2 text-sm uppercase tracking-[0.08em] transition-colors ${
                  active
                    ? "border-[var(--border-strong)] bg-[var(--surface-elevated)] text-[var(--text)]"
                    : "border-transparent text-[var(--text-soft)] hover:border-[var(--border)] hover:text-[var(--text)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <ThemeToggle />
          <Button variant="ghost" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-5 md:p-10">{children}</main>
    </div>
  );
}
