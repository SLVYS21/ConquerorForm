import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, AUTH_COOKIE_NAME } from "@/lib/auth";
import { listSessions } from "@/lib/responses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE_NAME)?.value;
  if (!(await verifySession(token))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const sessions = await listSessions();
    sessions.sort((a, b) => (b.last_updated_at ?? "").localeCompare(a.last_updated_at ?? ""));
    return NextResponse.json({ sessions });
  } catch (err) {
    console.error("[api/admin/sessions] list failed:", err);
    return NextResponse.json({ error: "storage failed" }, { status: 500 });
  }
}
