import "server-only";
import { readRange, writeRange, appendRow, ensureTabs } from "@/lib/sheets";
import { QUESTIONS } from "@/config/form";

const TAB = "responses";
const CORE_COLUMNS = [
  "session_id",
  "started_at",
  "last_updated_at",
  "completed_at",
  "current_step",
  "user_agent",
  "referrer",
  "landing_url",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const ANSWER_COLUMNS = QUESTIONS.map((q) => q.id);
export const ALL_COLUMNS: string[] = [...CORE_COLUMNS, ...ANSWER_COLUMNS];

export type SessionRow = Record<string, string>;

const A1_COL_COUNT = ALL_COLUMNS.length;

function columnLetter(index: number): string {
  let n = index;
  let s = "";
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}

const LAST_COL_LETTER = columnLetter(A1_COL_COUNT - 1);

let headerEnsured = false;
async function ensureHeader(): Promise<void> {
  if (headerEnsured) return;
  await ensureTabs([TAB]);
  const rows = await readRange(`${TAB}!A1:${LAST_COL_LETTER}1`);
  if (!rows[0] || rows[0].length === 0) {
    await writeRange(`${TAB}!A1:${LAST_COL_LETTER}1`, [ALL_COLUMNS]);
  }
  headerEnsured = true;
}

const rowIndexCache = new Map<string, number>();

async function findRowIndex(sessionId: string): Promise<number | null> {
  const cached = rowIndexCache.get(sessionId);
  if (cached) return cached;
  const rows = await readRange(`${TAB}!A2:A`);
  for (let i = 0; i < rows.length; i++) {
    if (rows[i]?.[0] === sessionId) {
      const rowIndex = i + 2;
      rowIndexCache.set(sessionId, rowIndex);
      return rowIndex;
    }
  }
  return null;
}

function toValues(record: SessionRow): string[] {
  return ALL_COLUMNS.map((col) => record[col] ?? "");
}

export type UpsertInput = {
  sessionId: string;
  currentStep: number;
  patch: Record<string, string>;
  meta?: Record<string, string>;
  completed?: boolean;
};

export async function upsertSession(input: UpsertInput): Promise<void> {
  await ensureHeader();
  const nowIso = new Date().toISOString();
  const rowIndex = await findRowIndex(input.sessionId);

  if (rowIndex === null) {
    const row: SessionRow = {
      session_id: input.sessionId,
      started_at: nowIso,
      last_updated_at: nowIso,
      completed_at: input.completed ? nowIso : "",
      current_step: String(input.currentStep),
      ...(input.meta ?? {}),
      ...input.patch,
    };
    await appendRow(TAB, toValues(row));
    return;
  }

  const existingRows = await readRange(`${TAB}!A${rowIndex}:${LAST_COL_LETTER}${rowIndex}`);
  const existingArr = existingRows[0] ?? [];
  const existing: SessionRow = {};
  ALL_COLUMNS.forEach((col, i) => {
    existing[col] = existingArr[i] ?? "";
  });

  const prevStep = Number.parseInt(existing.current_step || "0", 10) || 0;
  const merged: SessionRow = {
    ...existing,
    ...input.patch,
    last_updated_at: nowIso,
    current_step: String(Math.max(prevStep, input.currentStep)),
    completed_at: input.completed ? nowIso : existing.completed_at,
  };

  await writeRange(
    `${TAB}!A${rowIndex}:${LAST_COL_LETTER}${rowIndex}`,
    [toValues(merged)]
  );
}

export async function listSessions(): Promise<SessionRow[]> {
  await ensureHeader();
  const rows = await readRange(`${TAB}!A2:${LAST_COL_LETTER}`);
  return rows.map((r) => {
    const record: SessionRow = {};
    ALL_COLUMNS.forEach((col, i) => {
      record[col] = r[i] ?? "";
    });
    return record;
  });
}

export async function getSession(sessionId: string): Promise<SessionRow | null> {
  const rowIndex = await findRowIndex(sessionId);
  if (rowIndex === null) return null;
  const rows = await readRange(`${TAB}!A${rowIndex}:${LAST_COL_LETTER}${rowIndex}`);
  const arr = rows[0];
  if (!arr) return null;
  const record: SessionRow = {};
  ALL_COLUMNS.forEach((col, i) => {
    record[col] = arr[i] ?? "";
  });
  return record;
}
