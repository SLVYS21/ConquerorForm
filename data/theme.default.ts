export type FontKey =
  | "inter"
  | "space"
  | "dm"
  | "instrument"
  | "fraunces";

export type ButtonStyle = "filled" | "outline" | "soft";

export type Theme = {
  bg: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  border: string;
  borderFocus: string;
  bubbleBg: string;
  bubbleText: string;
  radius: number;
  font: FontKey;
  buttonStyle: ButtonStyle;
  progressBar: boolean;

  // Welcome screen
  welcomeTitle: string;
  welcomeDescription: string;
  welcomeCta: string;

  // Done screen
  doneTitle: string;
  doneDescription: string;

  // Redirect after submit (optional). If empty, stays on the "done" screen.
  redirectUrl: string;

  // Avatar shown next to each question (chat-style).
  avatarUrl: string;
  avatarName: string;
};

export const DEFAULT_THEME: Theme = {
  bg: "#FFFFFF",
  text: "#0A0A0A",
  muted: "#6B7280",
  accent: "#7C3AED",
  accentText: "#FFFFFF",
  border: "#E5E7EB",
  borderFocus: "#7C3AED",
  bubbleBg: "#F4F4F6",
  bubbleText: "#0A0A0A",
  radius: 16,
  font: "inter",
  buttonStyle: "filled",
  progressBar: true,

  welcomeTitle: "Rejoins la formation EcomConqueror",
  welcomeDescription:
    "Réponds à quelques questions rapides pour qu'on comprenne ton profil et ce que tu veux accomplir. Il te faut environ 2 minutes.",
  welcomeCta: "Commencer",

  doneTitle: "Merci, c'est enregistré",
  doneDescription: "On revient vers toi très vite.",

  redirectUrl: "",

  avatarUrl:
    "https://cdn.discordapp.com/icons/1414692824070357015/7204abb21658e53ce0e8bb701aa47f71.webp?size=256",
  avatarName: "EcomConqueror",
};
