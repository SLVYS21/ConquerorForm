import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { readRange, writeRange, ensureTabs } from "@/lib/sheets";
import { DEFAULT_QUESTIONS, type Question } from "@/data/questions.default";

const QUESTIONS_TAG = "questions";
const QUESTIONS_RANGE = "questions!A1";

async function fetchQuestionsFromSheet(): Promise<Question[]> {
  try {
    const rows = await readRange(QUESTIONS_RANGE);
    const raw = rows?.[0]?.[0];
    if (!raw) return DEFAULT_QUESTIONS;
    const parsed = JSON.parse(raw) as Question[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_QUESTIONS;
    return parsed;
  } catch (err) {
    console.warn("[questions] fetch failed, using defaults:", (err as Error).message);
    return DEFAULT_QUESTIONS;
  }
}

const cachedFetch = unstable_cache(fetchQuestionsFromSheet, ["questions"], {
  tags: [QUESTIONS_TAG],
  revalidate: 300,
});

export async function getQuestions(): Promise<Question[]> {
  if (!process.env.GOOGLE_SHEET_ID) return DEFAULT_QUESTIONS;
  return cachedFetch();
}

export async function saveQuestions(questions: Question[]): Promise<void> {
  await ensureTabs(["questions"]);
  await writeRange(QUESTIONS_RANGE, [[JSON.stringify(questions)]]);
  revalidateTag(QUESTIONS_TAG);
}
