import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { AdminNav } from "@/components/admin/AdminNav";

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
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-6">
          <Link href="/form-admin" className="text-[15px] font-semibold tracking-tight shrink-0">
            <span className="hidden sm:inline">ConquerorForm · Admin</span>
            <span className="sm:hidden">Admin</span>
          </Link>
          <AdminNav />
          <div className="ml-auto shrink-0">
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">{children}</main>
    </div>
  );
}
