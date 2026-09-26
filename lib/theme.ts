import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { readRange, writeRange, ensureTabs } from "@/lib/sheets";
import { DEFAULT_THEME, type Theme } from "@/data/theme.default";

const THEME_TAG = "theme";
const THEME_RANGE = "theme!A1";

function mergeWithDefaults(partial: Partial<Theme>): Theme {
  return { ...DEFAULT_THEME, ...partial };
}

async function fetchThemeFromSheet(): Promise<Theme> {
  try {
    const rows = await readRange(THEME_RANGE);
    const raw = rows?.[0]?.[0];
    if (!raw) return DEFAULT_THEME;
    const parsed = JSON.parse(raw) as Partial<Theme>;
    return mergeWithDefaults(parsed);
  } catch (err) {
    console.warn("[theme] fetch failed, using defaults:", (err as Error).message);
    return DEFAULT_THEME;
  }
}

const cachedFetch = unstable_cache(fetchThemeFromSheet, ["theme"], {
  tags: [THEME_TAG],
  revalidate: 300,
});

export async function getTheme(): Promise<Theme> {
  if (!process.env.GOOGLE_SHEET_ID) return DEFAULT_THEME;
  return cachedFetch();
}

export async function saveTheme(theme: Theme): Promise<void> {
  await ensureTabs(["theme"]);
  await writeRange(THEME_RANGE, [[JSON.stringify(theme)]]);
  revalidateTag(THEME_TAG);
}
