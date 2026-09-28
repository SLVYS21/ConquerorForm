declare global {
  interface Window {
    fbq?: (cmd: "track", event: string) => void;
  }
}

export function trackSubmitApplication(): void {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "SubmitApplication");
}
