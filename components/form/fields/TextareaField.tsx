"use client";

import { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
};

export function TextareaField({ value, onChange, onSubmit, placeholder }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSubmit();
        }
      }}
      placeholder={placeholder}
      rows={4}
      className="w-full text-[16px] md:text-[15px] font-medium px-4 py-3 border-2 transition-colors placeholder:opacity-40 resize-none"
      style={{
        borderColor: value ? "var(--border-focus)" : "var(--border)",
        borderRadius: "var(--radius)",
        background: "transparent",
        color: "var(--text)",
        caretColor: "var(--accent)",
      }}
    />
  );
}
