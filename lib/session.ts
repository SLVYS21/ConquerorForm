import { customAlphabet } from "nanoid";

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nano = customAlphabet(ALPHABET, 16);

const STORAGE_KEY = "conqueror_session_id";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  const existing = window.sessionStorage.getItem(STORAGE_KEY);
  if (existing) return existing;
  const fresh = nano();
  window.sessionStorage.setItem(STORAGE_KEY, fresh);
  return fresh;
}

export function clearSessionId(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function collectContext(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const utm: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
    const v = url.searchParams.get(k);
    if (v) utm[k] = v;
  });
  return {
    user_agent: navigator.userAgent,
    referrer: document.referrer || "",
    landing_url: window.location.href,
    ...utm,
  };
}
