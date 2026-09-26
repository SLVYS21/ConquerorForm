import type { Theme, FontKey } from "@/data/theme.default";

export const FONT_VAR_BY_KEY: Record<FontKey, string> = {
  inter: "--font-inter",
  space: "--font-space",
  dm: "--font-dm",
  instrument: "--font-instrument",
  fraunces: "--font-fraunces",
};

export const FONT_LABEL_BY_KEY: Record<FontKey, string> = {
  inter: "Inter",
  space: "Space Grotesk",
  dm: "DM Sans",
  instrument: "Instrument Sans",
  fraunces: "Fraunces",
};

export function themeToCssVars(theme: Theme): string {
  return [
    `--bg: ${theme.bg};`,
    `--text: ${theme.text};`,
    `--muted: ${theme.muted};`,
    `--accent: ${theme.accent};`,
    `--accent-text: ${theme.accentText};`,
    `--border: ${theme.border};`,
    `--border-focus: ${theme.borderFocus};`,
    `--bubble-bg: ${theme.bubbleBg};`,
    `--bubble-text: ${theme.bubbleText};`,
    `--radius: ${theme.radius}px;`,
  ].join("\n");
}
