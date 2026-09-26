"use client";

import { forwardRef } from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { children, variant = "primary", className = "", ...rest },
  ref
) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold text-[15px] leading-none transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const primary =
    "px-5 py-3 shadow-[0_1px_0_rgba(0,0,0,0.05),0_10px_30px_-10px_var(--accent)] hover:brightness-95 active:brightness-90";
  const ghost =
    "px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5";
  const style =
    variant === "primary"
      ? {
          background: "var(--accent)",
          color: "var(--accent-text)",
          borderRadius: "var(--radius)",
        }
      : {
          color: "var(--muted)",
          borderRadius: "var(--radius)",
        };

  return (
    <button
      ref={ref}
      className={`${base} ${variant === "primary" ? primary : ghost} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
});
