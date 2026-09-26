import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "color-mix(in oklab, var(--bg) 80%, transparent)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
          <Link href="/form-admin" className="text-[15px] font-semibold tracking-tight">
            ConquerorForm · Admin
          </Link>
          <nav className="flex items-center gap-4 text-[14px]" style={{ color: "var(--muted)" }}>
            <Link href="/form-admin" className="hover:opacity-100 transition-opacity">
              Sessions
            </Link>
            <Link href="/form-admin/theme" className="hover:opacity-100 transition-opacity">
              Paramètres
            </Link>
          </nav>
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
