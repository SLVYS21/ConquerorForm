import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, AUTH_COOKIE_NAME } from "@/lib/auth";
import { getSession } from "@/lib/responses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE_NAME)?.value;
  if (!(await verifySession(token))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const session = await getSession(id);
    if (!session) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ session });
  } catch (err) {
    console.error("[api/admin/sessions/id] get failed:", err);
    return NextResponse.json({ error: "storage failed" }, { status: 500 });
  }
}
