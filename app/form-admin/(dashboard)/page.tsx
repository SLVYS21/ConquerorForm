import { listSessions } from "@/lib/responses";
import { QUESTIONS } from "@/config/form";
import { SessionsTable } from "@/components/admin/SessionsTable";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  let sessions: Record<string, string>[] = [];
  let error: string | null = null;
  try {
    sessions = await listSessions();
    sessions.sort((a, b) => (b.last_updated_at ?? "").localeCompare(a.last_updated_at ?? ""));
  } catch (err) {
    error = (err as Error).message;
  }

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <div className="text-[12px] md:text-[13px] uppercase tracking-wide mb-1.5 md:mb-2" style={{ color: "var(--muted)" }}>
          Sessions
        </div>
        <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">
          {sessions.length} entrée{sessions.length !== 1 ? "s" : ""}
        </h1>
      </div>
      {error ? (
        <div
          className="px-4 py-3 mb-6 text-[14px]"
          style={{
            background: "color-mix(in oklab, #DC2626 8%, transparent)",
            color: "#DC2626",
            borderRadius: "var(--radius)",
          }}
        >
          Erreur de chargement des sessions : {error}
        </div>
      ) : null}
      <SessionsTable sessions={sessions} totalQuestions={QUESTIONS.length} />
    </div>
  );
}
