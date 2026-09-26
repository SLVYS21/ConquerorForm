"use client";

async function loadConfetti() {
  const mod = await import("canvas-confetti");
  return mod.default;
}

let confettiPromise: ReturnType<typeof loadConfetti> | null = null;

function getConfetti(): ReturnType<typeof loadConfetti> {
  if (!confettiPromise) confettiPromise = loadConfetti();
  return confettiPromise;
}

export async function celebrate(color: string): Promise<void> {
  if (typeof window === "undefined") return;
  const confetti = await getConfetti();
  const shared = {
    spread: 70,
    ticks: 200,
    gravity: 1.1,
    decay: 0.92,
    startVelocity: 30,
    colors: [color, "#FFFFFF", "#FBBF24", "#22D3EE"],
    scalar: 0.9,
  };
  confetti({ ...shared, particleCount: 60, origin: { x: 0.2, y: 0.9 } });
  confetti({ ...shared, particleCount: 60, origin: { x: 0.8, y: 0.9 } });
  setTimeout(() => {
    confetti({ ...shared, particleCount: 40, origin: { x: 0.5, y: 0.7 } });
  }, 180);
}
