"use client";

import { useEffect, useRef } from "react";

type Props = {
  type?: "text" | "email" | "tel" | "number";
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  autoComplete?: string;
};

export function TextField({
  type = "text",
  value,
  onChange,
  onSubmit,
  placeholder,
  autoComplete,
}: Props) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onSubmit();
        }
      }}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className="w-full text-[16px] md:text-[17px] font-medium px-4 py-3 border-2 transition-colors placeholder:opacity-40"
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
