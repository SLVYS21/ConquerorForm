import { NextResponse } from "next/server";
import { z } from "zod";
import { AUTH_COOKIE_NAME, AUTH_MAX_AGE_SEC, signSession, timingSafeEqual } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({ password: z.string().min(1).max(200) });

export async function POST(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 6) {
    return NextResponse.json(
      { error: "server misconfigured: ADMIN_PASSWORD missing or too short" },
      { status: 500 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  if (!timingSafeEqual(parsed.data.password, expected)) {
    return NextResponse.json({ error: "invalid password" }, { status: 401 });
  }

  const token = await signSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: AUTH_MAX_AGE_SEC,
  });
  return res;
}
