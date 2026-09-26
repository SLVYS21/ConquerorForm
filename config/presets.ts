import type { Theme } from "@/data/theme.default";

export type Preset = {
  id: string;
  name: string;
  patch: Partial<Theme>;
};

export const PRESETS: Preset[] = [
  {
    id: "classic",
    name: "Classic",
    patch: {
      bg: "#FFFFFF",
      text: "#0A0A0A",
      muted: "#6B7280",
      accent: "#7C3AED",
      accentText: "#FFFFFF",
      border: "#E5E7EB",
      borderFocus: "#7C3AED",
      bubbleBg: "#F4F4F6",
      bubbleText: "#0A0A0A",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    patch: {
      bg: "#0B0B10",
      text: "#F5F5F7",
      muted: "#8B8B96",
      accent: "#22D3EE",
      accentText: "#0B0B10",
      border: "#1F1F2A",
      borderFocus: "#22D3EE",
      bubbleBg: "#161623",
      bubbleText: "#F5F5F7",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    patch: {
      bg: "#FFFFFF",
      text: "#0F172A",
      muted: "#64748B",
      accent: "#2563EB",
      accentText: "#FFFFFF",
      border: "#E2E8F0",
      borderFocus: "#2563EB",
      bubbleBg: "#EEF4FF",
      bubbleText: "#0F172A",
    },
  },
  {
    id: "forest",
    name: "Forest",
    patch: {
      bg: "#FAFAF7",
      text: "#0F5132",
      muted: "#6B7B72",
      accent: "#84CC16",
      accentText: "#0F5132",
      border: "#E2E5DD",
      borderFocus: "#84CC16",
      bubbleBg: "#EFF5E4",
      bubbleText: "#0F5132",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    patch: {
      bg: "#FFFBF5",
      text: "#1F1310",
      muted: "#8A6F65",
      accent: "#EA580C",
      accentText: "#FFFFFF",
      border: "#F0E4D9",
      borderFocus: "#EA580C",
      bubbleBg: "#FFF1E4",
      bubbleText: "#1F1310",
    },
  },
  {
    id: "rose",
    name: "Rose",
    patch: {
      bg: "#FDF2F8",
      text: "#111111",
      muted: "#7A6672",
      accent: "#DB2777",
      accentText: "#FFFFFF",
      border: "#F3D9E7",
      borderFocus: "#DB2777",
      bubbleBg: "#FCE7F3",
      bubbleText: "#111111",
    },
  },
  {
    id: "mono",
    name: "Mono",
    patch: {
      bg: "#FFFFFF",
      text: "#0A0A0A",
      muted: "#525252",
      accent: "#0A0A0A",
      accentText: "#FFFFFF",
      border: "#0A0A0A",
      borderFocus: "#0A0A0A",
      bubbleBg: "#F4F4F5",
      bubbleText: "#0A0A0A",
    },
  },
];
