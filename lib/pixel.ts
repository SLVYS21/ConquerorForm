type FbqParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    fbq?: (
      cmd: "track" | "trackCustom",
      event: string,
      params?: FbqParams
    ) => void;
  }
}

export function trackStep(step: number, stepId: string): void {
  if (typeof window === "undefined") return;
  window.fbq?.("trackCustom", "FormStep", { step, step_id: stepId });
}

export function trackLead(): void {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Lead", { content_name: "EcomConqueror" });
}

export function trackStart(): void {
  if (typeof window === "undefined") return;
  window.fbq?.("trackCustom", "FormStart");
}
