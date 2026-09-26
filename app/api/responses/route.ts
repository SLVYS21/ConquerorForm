import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSession } from "@/lib/responses";
import { QUESTIONS } from "@/config/form";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KNOWN_ANSWER_IDS = new Set(QUESTIONS.map((q) => q.id));
const KNOWN_META_KEYS = new Set([
  "user_agent",
  "referrer",
  "landing_url",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
]);

const bodySchema = z.object({
  session_id: z.string().min(4).max(64),
  current_step: z.number().int().min(0).max(100),
  patch: z.record(z.string(), z.string()),
  meta: z.record(z.string(), z.string()).optional(),
  completed: z.boolean().optional(),
});

function pickKnown(obj: Record<string, string>, allowed: Set<string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (allowed.has(k)) out[k] = typeof v === "string" ? v.slice(0, 2000) : "";
  }
  return out;
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { session_id, current_step, patch, meta, completed } = parsed.data;

  const safePatch = pickKnown(patch, KNOWN_ANSWER_IDS);
  const safeMeta = meta ? pickKnown(meta, KNOWN_META_KEYS) : undefined;

  try {
    await upsertSession({
      sessionId: session_id,
      currentStep: current_step,
      patch: safePatch,
      meta: safeMeta,
      completed: completed ?? false,
    });
  } catch (err) {
    console.error("[api/responses] upsert failed:", err);
    return NextResponse.json({ error: "storage failed" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
