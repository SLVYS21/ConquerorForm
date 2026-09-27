"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

const LINKS: { href: Route; label: string }[] = [
  { href: "/form-admin", label: "Sessions" },
  { href: "/form-admin/questions" as Route, label: "Questions" },
  { href: "/form-admin/theme", label: "Paramètres" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center gap-1 p-1 text-[13px] md:text-[14px] font-medium overflow-x-auto no-scrollbar"
      style={{
        background: "color-mix(in oklab, var(--border) 35%, transparent)",
        borderRadius: "calc(var(--radius) * 0.85)",
      }}
    >
      {LINKS.map((l) => {
        const active =
          l.href === "/form-admin"
            ? pathname === "/form-admin"
            : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className="px-3 py-1.5 whitespace-nowrap transition-all"
            style={{
              background: active ? "var(--bg)" : "transparent",
              color: active ? "var(--text)" : "var(--muted)",
              borderRadius: "calc(var(--radius) * 0.7)",
              boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
