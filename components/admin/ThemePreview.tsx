"use client";

import { useState } from "react";
import type { Theme } from "@/data/theme.default";
import { FONT_VAR_BY_KEY } from "@/lib/theme-css";

type PreviewMode = "chat" | "welcome" | "done";

export function ThemePreview({ theme }: { theme: Theme }) {
  const [mode, setMode] = useState<PreviewMode>("chat");
  const style: React.CSSProperties & Record<string, string> = {
    "--bg": theme.bg,
    "--text": theme.text,
    "--muted": theme.muted,
    "--accent": theme.accent,
    "--accent-text": theme.accentText,
    "--border": theme.border,
    "--border-focus": theme.borderFocus,
    "--bubble-bg": theme.bubbleBg,
    "--bubble-text": theme.bubbleText,
    "--radius": `${theme.radius}px`,
    background: theme.bg,
    color: theme.text,
    fontFamily: `var(${FONT_VAR_BY_KEY[theme.font]})`,
  };

  return (
    <div
      className="sticky top-24 border overflow-hidden"
      style={{ borderColor: theme.border, borderRadius: theme.radius }}
    >
      <div
        className="px-3 py-2 flex items-center gap-2"
        style={{
          background: "color-mix(in oklab, var(--border) 50%, transparent)",
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <span className="w-2 h-2 rounded-full" style={{ background: "#FF5F57" }} />
        <span className="w-2 h-2 rounded-full" style={{ background: "#FEBC2E" }} />
        <span className="w-2 h-2 rounded-full" style={{ background: "#28C840" }} />
        <div className="ml-3 flex gap-1 text-[10px]">
          {(["welcome", "chat", "done"] as PreviewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-2 py-0.5 uppercase tracking-wider font-medium transition-colors"
              style={{
                background: mode === m ? "var(--bg)" : "transparent",
                color: mode === m ? "var(--text)" : "var(--muted)",
                borderRadius: 4,
              }}
            >
              {m === "welcome" ? "Accueil" : m === "chat" ? "Question" : "Fin"}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6 h-[560px] overflow-hidden flex flex-col justify-center" style={style}>
        {mode === "welcome" ? <WelcomePreview theme={theme} /> : null}
        {mode === "chat" ? <ChatPreview theme={theme} /> : null}
        {mode === "done" ? <DonePreview theme={theme} /> : null}
      </div>
    </div>
  );
}

function AvatarBubble({ theme, size = 32 }: { theme: Theme; size?: number }) {
  const initial = (theme.avatarName?.[0] || "E").toUpperCase();
  return (
    <div
      className="shrink-0 overflow-hidden"
      style={{ width: size, height: size, borderRadius: "9999px", background: theme.bubbleBg }}
    >
      {theme.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={theme.avatarUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-semibold"
          style={{ fontSize: size * 0.42, background: theme.accent, color: theme.accentText }}
        >
          {initial}
        </div>
      )}
    </div>
  );
}

function WelcomePreview({ theme }: { theme: Theme }) {
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: theme.radius * 1.2,
      }}
    >
      <div
        className="relative h-[80px]"
        style={{
          background: `linear-gradient(135deg, ${theme.accent} 0%, color-mix(in oklab, ${theme.accent} 65%, #000000) 100%)`,
        }}
      >
        <div className="absolute top-2 right-2 p-1 rounded-full" style={{ background: theme.bg }}>
          <AvatarBubble theme={theme} size={36} />
        </div>
      </div>
      <div className="px-4 py-4">
        <div
          className="text-[9px] uppercase tracking-widest font-semibold mb-1.5"
          style={{ color: theme.accent }}
        >
          {theme.avatarName || "Nom"}
        </div>
        <div className="text-[16px] font-bold leading-tight mb-1.5" style={{ color: theme.text }}>
          {theme.welcomeTitle || "Titre"}
        </div>
        <div className="text-[11px] mb-3" style={{ color: theme.muted }}>
          {theme.welcomeDescription || "Description"}
        </div>
        <div
          className="inline-flex items-center gap-1 px-3 py-1.5 font-semibold text-[11px]"
          style={{ background: theme.accent, color: theme.accentText, borderRadius: theme.radius }}
        >
          {theme.welcomeCta || "Commencer"} <span aria-hidden>→</span>
        </div>
      </div>
    </div>
  );
}

function ChatPreview({ theme }: { theme: Theme }) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-end gap-2">
        <AvatarBubble theme={theme} />
        <div
          className="max-w-[85%] px-4 py-3 text-[13px]"
          style={{
            background: theme.bubbleBg,
            color: theme.bubbleText,
            borderRadius: theme.radius,
            borderTopLeftRadius: theme.radius * 0.35,
          }}
        >
          Quel est ton prénom ?
        </div>
      </div>
      <div className="flex justify-end">
        <div
          className="max-w-[85%] px-4 py-3 text-[13px]"
          style={{
            background: theme.accent,
            color: theme.accentText,
            borderRadius: theme.radius,
            borderTopRightRadius: theme.radius * 0.35,
          }}
        >
          Sylvanus
        </div>
      </div>
      <div className="flex items-end gap-2">
        <AvatarBubble theme={theme} />
        <div
          className="max-w-[85%] px-4 py-3 text-[13px]"
          style={{
            background: theme.bubbleBg,
            color: theme.bubbleText,
            borderRadius: theme.radius,
            borderTopLeftRadius: theme.radius * 0.35,
          }}
        >
          Ton meilleur email ?
        </div>
      </div>
      <div className="pl-[40px] mt-1">
        <input
          readOnly
          defaultValue="toi@exemple.com"
          className="w-full text-[13px] font-medium px-3 py-2 border-2"
          style={{
            borderColor: theme.borderFocus,
            borderRadius: theme.radius,
            background: "transparent",
            color: theme.text,
          }}
        />
        <div className="mt-3 flex items-center gap-2">
          <div
            className="inline-flex items-center gap-1 px-3 py-1.5 font-semibold text-[12px]"
            style={{ background: theme.accent, color: theme.accentText, borderRadius: theme.radius }}
          >
            OK <span aria-hidden>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DonePreview({ theme }: { theme: Theme }) {
  return (
    <div className="text-center flex flex-col items-center">
      <div
        className="inline-flex items-center justify-center mb-4"
        style={{
          width: 56,
          height: 56,
          background: theme.accent,
          color: theme.accentText,
          borderRadius: "9999px",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="text-[18px] font-bold mb-1.5" style={{ color: theme.text }}>
        {theme.doneTitle || "Merci"}
      </div>
      <div className="text-[12px] max-w-[260px]" style={{ color: theme.muted }}>
        {theme.doneDescription || "On revient vers toi vite."}
      </div>
      {theme.redirectUrl ? (
        <div
          className="mt-4 text-[10px] font-mono truncate max-w-[240px]"
          style={{ color: theme.muted }}
        >
          Redirige vers : {theme.redirectUrl}
        </div>
      ) : null}
    </div>
  );
}
