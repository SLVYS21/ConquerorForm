"use client";

import { motion } from "framer-motion";
import { Avatar } from "./Avatar";

type Props = {
  avatarSrc?: string;
  avatarName?: string;
};

export function TypingIndicator({ avatarSrc, avatarName }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-end gap-2"
    >
      <Avatar src={avatarSrc} name={avatarName} size={32} />
      <div
        className="px-4 py-3 flex items-center gap-1.5"
        style={{
          background: "var(--bubble-bg)",
          borderRadius: "var(--radius)",
          borderTopLeftRadius: `calc(var(--radius) * 0.35)`,
        }}
        aria-label="En train d’écrire"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: "color-mix(in oklab, var(--bubble-text) 55%, transparent)" }}
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
