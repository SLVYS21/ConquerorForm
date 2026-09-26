import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifySession, AUTH_COOKIE_NAME } from "@/lib/auth";
import { getTheme, saveTheme } from "@/lib/theme";
import { DEFAULT_THEME } from "@/data/theme.default";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const hex = z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/);
const optionalUrl = z.string().refine(
  (v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v),
  { message: "must be empty, a path starting with '/', or an http(s) URL" }
);

const themeSchema = z.object({
  bg: hex,
  text: hex,
  muted: hex,
  accent: hex,
  accentText: hex,
  border: hex,
  borderFocus: hex,
  bubbleBg: hex,
  bubbleText: hex,
  radius: z.number().int().min(0).max(40),
  font: z.enum(["inter", "space", "dm", "instrument", "fraunces"]),
  buttonStyle: z.enum(["filled", "outline", "soft"]),
  progressBar: z.boolean(),

  welcomeTitle: z.string().min(1).max(200),
  welcomeDescription: z.string().max(600),
  welcomeCta: z.string().min(1).max(60),

  doneTitle: z.string().min(1).max(200),
  doneDescription: z.string().max(400),

  redirectUrl: optionalUrl,

  avatarUrl: optionalUrl,
  avatarName: z.string().max(60),
});

async function requireAuth() {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE_NAME)?.value;
  return verifySession(token);
}

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const theme = await getTheme();
    return NextResponse.json({ theme, defaults: DEFAULT_THEME });
  } catch {
    return NextResponse.json({ theme: DEFAULT_THEME, defaults: DEFAULT_THEME });
  }
}

export async function PUT(req: Request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = themeSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid theme", details: parsed.error.flatten() }, { status: 400 });
  }
  try {
    await saveTheme(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/theme] save failed:", err);
    return NextResponse.json({ error: "storage failed" }, { status: 500 });
  }
}
