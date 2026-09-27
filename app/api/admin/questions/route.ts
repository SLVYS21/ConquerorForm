import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifySession, AUTH_COOKIE_NAME } from "@/lib/auth";
import { getQuestions, saveQuestions } from "@/lib/questions";
import { DEFAULT_QUESTIONS } from "@/data/questions.default";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELD_TYPES = ["text", "email", "phone", "country_phone", "choice", "number", "textarea"] as const;

const idSchema = z
  .string()
  .min(1)
  .max(60)
  .regex(/^[a-z0-9_]+$/, "id must match [a-z0-9_]+");

const choiceSchema = z.object({
  value: z.string().min(1).max(60),
  label: z.string().min(1).max(200),
});

const questionSchema = z.object({
  id: idSchema,
  type: z.enum(FIELD_TYPES),
  label: z.string().min(1).max(300),
  hint: z.string().max(400).optional(),
  placeholder: z.string().max(200).optional(),
  required: z.boolean(),
  choices: z.array(choiceSchema).max(20).optional(),
});

const bodySchema = z
  .array(questionSchema)
  .min(1, "at least one question required")
  .max(50)
  .refine(
    (arr) => new Set(arr.map((q) => q.id)).size === arr.length,
    { message: "duplicate question id" }
  )
  .refine(
    (arr) =>
      arr.every((q) =>
        q.type !== "choice"
          ? true
          : Array.isArray(q.choices) && q.choices.length >= 2
      ),
    { message: "choice questions need at least 2 choices" }
  );

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
    const questions = await getQuestions();
    return NextResponse.json({ questions, defaults: DEFAULT_QUESTIONS });
  } catch {
    return NextResponse.json({ questions: DEFAULT_QUESTIONS, defaults: DEFAULT_QUESTIONS });
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
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid questions", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  try {
    await saveQuestions(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/questions] save failed:", err);
    return NextResponse.json({ error: "storage failed" }, { status: 500 });
  }
}
