"use client";

import { motion } from "framer-motion";

type Props = { title: string; description: string };

export function Done({ title, description }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-xl text-center"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="inline-flex items-center justify-center w-20 h-20 mb-6"
        style={{
          background: "var(--accent)",
          color: "var(--accent-text)",
          borderRadius: "9999px",
          boxShadow: "0 12px 30px -8px var(--accent)",
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12l5 5L20 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      <h1 className="text-[30px] md:text-[36px] font-bold tracking-tight mb-3">{title}</h1>
      <p className="text-[16px]" style={{ color: "var(--muted)" }}>
        {description}
      </p>
    </motion.div>
  );
}
