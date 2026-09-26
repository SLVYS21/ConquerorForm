"use client";

import { motion } from "framer-motion";

export function ProgressBar({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const safeTotal = Math.max(1, totalSteps);
  const clampedStep = Math.min(safeTotal, Math.max(0, currentStep));
  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 px-4 py-3 backdrop-blur-md"
      style={{
        background: "color-mix(in oklab, var(--bg) 85%, transparent)",
        borderBottom: "1px solid color-mix(in oklab, var(--border) 60%, transparent)",
      }}
    >
      <div className="max-w-3xl mx-auto flex items-center gap-3">
        <div className="flex-1 flex gap-1.5">
          {Array.from({ length: safeTotal }).map((_, i) => {
            const done = i < clampedStep;
            const current = i === clampedStep;
            return (
              <motion.div
                key={i}
                className="flex-1 h-1.5 origin-left"
                style={{
                  borderRadius: "999px",
                  background: done || current
                    ? "var(--accent)"
                    : "color-mix(in oklab, var(--border) 70%, transparent)",
                  opacity: done ? 1 : current ? 0.55 : 1,
                }}
                initial={{ scaleX: current ? 0 : 1 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: current ? 0.5 : 0, ease: [0.22, 1, 0.36, 1] }}
              />
            );
          })}
        </div>
        <div
          className="text-[11px] font-medium tabular-nums shrink-0 uppercase tracking-wider"
          style={{ color: "var(--muted)" }}
        >
          {clampedStep + (clampedStep === safeTotal ? 0 : 1)}/{safeTotal}
        </div>
      </div>
    </div>
  );
}
