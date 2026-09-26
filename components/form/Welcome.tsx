"use client";

import { motion } from "framer-motion";
import { Avatar } from "./Avatar";

type Props = {
  title: string;
  description: string;
  ctaLabel: string;
  onStart: () => void;
  avatarSrc?: string;
  avatarName?: string;
};

export function Welcome({ title, description, ctaLabel, onStart, avatarSrc, avatarName }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-2xl overflow-hidden"
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "calc(var(--radius) * 1.2)",
        boxShadow: "0 30px 60px -30px rgba(0,0,0,0.15)",
      }}
    >
      {/* Bannière avec logo top-right, style profil social */}
      <div
        className="relative h-[160px] md:h-[200px]"
        style={{
          background:
            "linear-gradient(135deg, var(--accent) 0%, color-mix(in oklab, var(--accent) 65%, #000000) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0px, transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.35) 0px, transparent 45%)",
          }}
        />
        <div className="absolute top-4 right-4 md:top-5 md:right-5">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="p-1 rounded-full"
            style={{
              background: "var(--bg)",
              boxShadow: "0 10px 24px -8px rgba(0,0,0,0.25)",
            }}
          >
            <Avatar src={avatarSrc} name={avatarName} size={64} />
          </motion.div>
        </div>
      </div>

      {/* Contenu sous la bannière */}
      <div className="px-6 md:px-10 py-8 md:py-10">
        {avatarName ? (
          <div
            className="text-[12px] uppercase tracking-widest font-semibold mb-3"
            style={{ color: "var(--accent)" }}
          >
            {avatarName}
          </div>
        ) : null}
        <h1 className="text-[28px] md:text-[36px] font-bold tracking-tight leading-tight mb-4">
          {title}
        </h1>
        <p
          className="text-[15px] md:text-[16px] leading-relaxed mb-8 max-w-xl"
          style={{ color: "var(--muted)" }}
        >
          {description}
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 px-7 py-4 font-semibold text-[15px] transition-all hover:brightness-95 active:brightness-90"
            style={{
              background: "var(--accent)",
              color: "var(--accent-text)",
              borderRadius: "var(--radius)",
              boxShadow: "0 12px 30px -12px var(--accent)",
            }}
          >
            {ctaLabel}
            <span aria-hidden>→</span>
          </button>
          <div className="text-[12px]" style={{ color: "var(--muted)" }}>
            Environ 2 minutes.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
