"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const params = useSearchParams();
  const from = params.get("from") || "/form-admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = from;
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error === "invalid password" ? "Mot de passe incorrect." : "Erreur serveur.");
    } catch {
      setError("Impossible de se connecter.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-dvh flex items-center justify-center px-6"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="mb-8">
          <div className="text-[13px] uppercase tracking-wide mb-2" style={{ color: "var(--muted)" }}>
            Admin
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Accès sécurisé</h1>
        </div>
        <label className="block mb-2 text-[13px] font-medium" style={{ color: "var(--muted)" }}>
          Mot de passe
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full text-[18px] py-3 px-4 border-2 mb-4"
          style={{
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            background: "transparent",
            color: "var(--text)",
          }}
        />
        {error ? (
          <div className="mb-4 text-[14px] font-medium" style={{ color: "#DC2626" }}>
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-3 font-semibold text-[15px] transition-all disabled:opacity-40"
          style={{
            background: "var(--accent)",
            color: "var(--accent-text)",
            borderRadius: "var(--radius)",
          }}
        >
          {loading ? "…" : "Entrer"}
        </button>
      </form>
    </main>
  );
}
