import "server-only";
import { readRange, writeRange, appendRow, ensureTabs } from "@/lib/sheets";
import { getQuestions } from "@/lib/questions";

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

export type SessionRow = Record<string, string>;

function columnLetter(index: number): string {
  let n = index;
  let s = "";
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}

async function readHeader(): Promise<string[]> {
  const rows = await readRange(`${TAB}!1:1`);
  return rows?.[0] ?? [];
}

async function writeHeader(cols: string[]): Promise<void> {
  const last = columnLetter(cols.length - 1);
  await writeRange(`${TAB}!A1:${last}1`, [cols]);
}

async function getColumns(extraIds: string[] = []): Promise<string[]> {
  await ensureTabs([TAB]);
  const existing = await readHeader();
  if (existing.length === 0) {
    const questions = await getQuestions();
    const seed = [...CORE_COLUMNS, ...questions.map((q) => q.id)];
    const merged = mergeUnique(seed, extraIds);
    await writeHeader(merged);
    return merged;
  }
  const missing = extraIds.filter((id) => !existing.includes(id));
  if (missing.length === 0) return existing;
  const merged = [...existing, ...missing];
  await writeHeader(merged);
  return merged;
}

function mergeUnique(base: readonly string[], extras: string[]): string[] {
  const out = [...base];
  for (const e of extras) if (!out.includes(e)) out.push(e);
  return out;
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

function toValues(cols: string[], record: SessionRow): string[] {
  return cols.map((col) => record[col] ?? "");
}

function rowToRecord(cols: string[], arr: string[] | undefined): SessionRow {
  const record: SessionRow = {};
  cols.forEach((col, i) => {
    record[col] = arr?.[i] ?? "";
  });
  return record;
}

export type UpsertInput = {
  sessionId: string;
  currentStep: number;
  patch: Record<string, string>;
  meta?: Record<string, string>;
  completed?: boolean;
};

export async function upsertSession(input: UpsertInput): Promise<void> {
  const patchKeys = Object.keys({ ...(input.meta ?? {}), ...input.patch });
  const cols = await getColumns(patchKeys);
  const lastCol = columnLetter(cols.length - 1);
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
    await appendRow(TAB, toValues(cols, row));
    return;
  }

  const existingRows = await readRange(`${TAB}!A${rowIndex}:${lastCol}${rowIndex}`);
  const existing = rowToRecord(cols, existingRows[0]);

  const prevStep = Number.parseInt(existing.current_step || "0", 10) || 0;
  const merged: SessionRow = {
    ...existing,
    ...input.patch,
    last_updated_at: nowIso,
    current_step: String(Math.max(prevStep, input.currentStep)),
    completed_at: input.completed ? nowIso : existing.completed_at,
  };

  await writeRange(
    `${TAB}!A${rowIndex}:${lastCol}${rowIndex}`,
    [toValues(cols, merged)]
  );
}

export async function listSessions(): Promise<SessionRow[]> {
  const cols = await getColumns();
  const lastCol = columnLetter(cols.length - 1);
  const rows = await readRange(`${TAB}!A2:${lastCol}`);
  return rows.map((r) => rowToRecord(cols, r));
}

export async function getSession(sessionId: string): Promise<SessionRow | null> {
  const rowIndex = await findRowIndex(sessionId);
  if (rowIndex === null) return null;
  const cols = await getColumns();
  const lastCol = columnLetter(cols.length - 1);
  const rows = await readRange(`${TAB}!A${rowIndex}:${lastCol}${rowIndex}`);
  if (!rows[0]) return null;
  return rowToRecord(cols, rows[0]);
}
