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
  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
