"use client";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/form-admin/login";
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="text-[13px] px-3 py-1.5 transition-colors hover:opacity-70"
      style={{ color: "var(--muted)", borderRadius: "var(--radius)" }}
    >
      Déconnexion
    </button>
  );
}
