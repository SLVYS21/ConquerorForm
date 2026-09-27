"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Avatar } from "./Avatar";

type Props = {
  kind: "question" | "answer";
  children: ReactNode;
  avatarSrc?: string;
  avatarName?: string;
  showAvatar?: boolean;
  animateIn?: boolean;
};

export function ChatBubble({
  kind,
  children,
  avatarSrc,
  avatarName,
  showAvatar = true,
  animateIn = false,
}: Props) {
  const isQuestion = kind === "question";

  const initial = animateIn
    ? isQuestion
      ? { opacity: 0, y: 8, x: -6, scale: 0.96 }
      : { opacity: 0, y: 8, x: 12, scale: 0.96 }
    : false;

  return (
    <motion.div
      initial={initial}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={{ type: "spring", damping: 22, stiffness: 320, mass: 0.6 }}
      className={`flex items-end gap-2 ${isQuestion ? "" : "justify-end"}`}
    >
      {isQuestion && showAvatar ? (
        <Avatar src={avatarSrc} name={avatarName} size={32} />
      ) : isQuestion ? (
        <div style={{ width: 32 }} />
      ) : null}
      <div
        className="max-w-[85%] px-4 py-3 text-[15px] leading-relaxed"
        style={{
          background: isQuestion ? "var(--bubble-bg)" : "var(--accent)",
          color: isQuestion ? "var(--bubble-text)" : "var(--accent-text)",
          borderRadius: "var(--radius)",
          borderTopLeftRadius: isQuestion ? `calc(var(--radius) * 0.35)` : "var(--radius)",
          borderTopRightRadius: isQuestion ? "var(--radius)" : `calc(var(--radius) * 0.35)`,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
