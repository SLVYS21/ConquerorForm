"use client";

import { useEffect } from "react";
import type { Choice } from "@/config/form";

type Props = {
  choices: Choice[];
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

const KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function ChoiceField({ choices, value, onChange, onSubmit }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.key === "Enter") {
        if (value) {
          e.preventDefault();
          onSubmit();
        }
        return;
      }
      const idx = KEYS.indexOf(e.key.toUpperCase());
      if (idx >= 0 && idx < choices.length) {
        e.preventDefault();
        onChange(choices[idx].value);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choices, onChange, onSubmit, value]);

  return (
    <div className="flex flex-col gap-2 w-full">
      {choices.map((c, i) => {
        const selected = value === c.value;
        return (
          <button
            key={c.value}
            type="button"
            onClick={() => onChange(c.value)}
            className="group flex items-center gap-3 text-left px-4 py-3 border-2 transition-all duration-200"
            style={{
              borderColor: selected ? "var(--accent)" : "var(--border)",
              borderRadius: "var(--radius)",
              background: selected
                ? "color-mix(in oklab, var(--accent) 10%, transparent)"
                : "transparent",
              color: "var(--text)",
            }}
          >
            <span
              className="inline-flex items-center justify-center w-7 h-7 text-[12px] font-semibold shrink-0 transition-colors"
              style={{
                border: `2px solid ${selected ? "var(--accent)" : "var(--border)"}`,
                color: selected ? "var(--accent-text)" : "var(--muted)",
                background: selected ? "var(--accent)" : "transparent",
                borderRadius: `calc(var(--radius) * 0.5)`,
              }}
            >
              {KEYS[i]}
            </span>
            <span className="text-[15px] md:text-[16px] font-medium">{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}
