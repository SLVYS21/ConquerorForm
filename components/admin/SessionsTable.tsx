"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Session = Record<string, string>;

type Filter = "all" | "completed" | "in_progress";

function fmtDate(iso: string): string {
  if (!iso) return "·";
  try {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function SessionsTable({
  sessions,
  totalQuestions,
}: {
  sessions: Session[];
  totalQuestions: number;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const isCompleted = Boolean(s.completed_at);
      if (filter === "completed" && !isCompleted) return false;
      if (filter === "in_progress" && isCompleted) return false;
      if (q) {
        const needle = q.toLowerCase();
        if (
          !(s.first_name ?? "").toLowerCase().includes(needle) &&
          !(s.email ?? "").toLowerCase().includes(needle) &&
          !(s.whatsapp ?? "").toLowerCase().includes(needle)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [sessions, filter, q]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-4">
        <div
          className="flex items-center gap-1 p-1 self-start sm:self-auto overflow-x-auto no-scrollbar"
          style={{
            background: "color-mix(in oklab, var(--border) 40%, transparent)",
            borderRadius: "var(--radius)",
          }}
        >
          {(["all", "in_progress", "completed"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-[13px] font-medium transition-all whitespace-nowrap"
              style={{
                background: filter === f ? "var(--bg)" : "transparent",
                color: filter === f ? "var(--text)" : "var(--muted)",
                borderRadius: `calc(var(--radius) * 0.7)`,
                boxShadow: filter === f ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {f === "all" ? "Toutes" : f === "completed" ? "Terminées" : "En cours"}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher…"
          className="flex-1 sm:min-w-[240px] px-4 py-2 text-[14px] border transition-colors"
          style={{
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            background: "transparent",
            color: "var(--text)",
          }}
        />
        <a
          href="/api/admin/sessions"
          download="sessions.json"
          className="text-[13px] px-3 py-2 border transition-colors hover:opacity-70 text-center self-start sm:self-auto"
          style={{ borderColor: "var(--border)", borderRadius: "var(--radius)", color: "var(--muted)" }}
        >
          Export JSON
        </a>
      </div>

      {/* Desktop: table */}
      <div
        className="hidden md:block overflow-x-auto border"
        style={{ borderColor: "var(--border)", borderRadius: "var(--radius)" }}
      >
        <table className="w-full text-[14px]">
          <thead>
            <tr style={{ background: "color-mix(in oklab, var(--border) 30%, transparent)" }}>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--muted)" }}>Prénom</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--muted)" }}>Email</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--muted)" }}>WhatsApp</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--muted)" }}>Étape</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--muted)" }}>Statut</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--muted)" }}>Maj</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center" style={{ color: "var(--muted)" }}>
                  Aucune session pour ce filtre.
                </td>
              </tr>
            ) : (
              filtered.map((s) => {
                const isCompleted = Boolean(s.completed_at);
                const step = Number(s.current_step ?? 0);
                const progress = Math.round((step / totalQuestions) * 100);
                return (
                  <tr key={s.session_id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td className="px-4 py-3 font-medium">{s.first_name || "·"}</td>
                    <td className="px-4 py-3">{s.email || "·"}</td>
                    <td className="px-4 py-3" style={{ color: "var(--muted)" }}>{s.whatsapp || "·"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                          <div className="h-full" style={{ background: "var(--accent)", width: `${isCompleted ? 100 : progress}%` }} />
                        </div>
                        <span className="text-[12px]" style={{ color: "var(--muted)" }}>
                          {isCompleted ? "100%" : `${progress}%`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill isCompleted={isCompleted} />
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--muted)" }}>{fmtDate(s.last_updated_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/form-admin/${s.session_id}`}
                        className="text-[13px] font-medium hover:opacity-70"
                        style={{ color: "var(--accent)" }}
                      >
                        Voir →
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div
            className="px-4 py-10 text-center border text-[14px]"
            style={{ color: "var(--muted)", borderColor: "var(--border)", borderRadius: "var(--radius)" }}
          >
            Aucune session pour ce filtre.
          </div>
        ) : (
          filtered.map((s) => {
            const isCompleted = Boolean(s.completed_at);
            const step = Number(s.current_step ?? 0);
            const progress = Math.round((step / totalQuestions) * 100);
            return (
              <Link
                key={s.session_id}
                href={`/form-admin/${s.session_id}`}
                className="block p-4 border transition-colors active:opacity-70"
                style={{ borderColor: "var(--border)", borderRadius: "var(--radius)" }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-semibold truncate">
                      {s.first_name || "Anonyme"}
                    </div>
                    <div className="text-[13px] truncate" style={{ color: "var(--muted)" }}>
                      {s.email || s.whatsapp || "·"}
                    </div>
                  </div>
                  <StatusPill isCompleted={isCompleted} />
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div
                    className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--border)" }}
                  >
                    <div
                      className="h-full transition-all"
                      style={{ background: "var(--accent)", width: `${isCompleted ? 100 : progress}%` }}
                    />
                  </div>
                  <span className="text-[12px] tabular-nums" style={{ color: "var(--muted)" }}>
                    {isCompleted ? "100%" : `${progress}%`}
                  </span>
                </div>
                <div className="mt-2 text-[12px]" style={{ color: "var(--muted)" }}>
                  {fmtDate(s.last_updated_at)}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}

function StatusPill({ isCompleted }: { isCompleted: boolean }) {
  return (
    <span
      className="inline-block px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide whitespace-nowrap"
      style={{
        background: isCompleted
          ? "color-mix(in oklab, var(--accent) 12%, transparent)"
          : "color-mix(in oklab, var(--muted) 12%, transparent)",
        color: isCompleted ? "var(--accent)" : "var(--muted)",
        borderRadius: `calc(var(--radius) * 0.5)`,
      }}
    >
      {isCompleted ? "Terminée" : "En cours"}
    </span>
  );
}
