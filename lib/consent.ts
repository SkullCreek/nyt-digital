// Cookie consent state, shared by the banner and the tracking loader (browser only).
//
// "strict" regions (EEA, UK, Switzerland) are opt-in: no ad measurement until Accept.
// Everywhere else is notice + opt-out: ad measurement is on until the visitor turns it off.
// The visitor's country comes from the `nyt-geo` cookie set by proxy.ts.
// Unknown country (local dev, missing header) is treated as strict.

export const GEO_COOKIE = "nyt-geo";
const KEY = "nyt-consent";
const EVENT = "nyt-consent-change";
export const OPEN_EVENT = "nyt-consent-open";

const STRICT = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
]);

export type Mode = "strict" | "notice";
export type Consent = { marketing: boolean; decided: boolean };

export function regionMode(): Mode {
  const m = document.cookie.match(new RegExp(`(?:^|; )${GEO_COOKIE}=([A-Z]{2})`));
  return m && !STRICT.has(m[1]) ? "notice" : "strict";
}

export function readConsent(): Consent {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const v = JSON.parse(raw);
      if (v?.v === 1 && typeof v.marketing === "boolean") return { marketing: v.marketing, decided: true };
    }
  } catch {
    // Storage blocked: fall through to the regional default.
  }
  return { marketing: regionMode() === "notice", decided: false };
}

export function saveConsent(marketing: boolean) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: 1, marketing, at: new Date().toISOString() }));
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  window.dispatchEvent(new CustomEvent<Consent>(EVENT, { detail: { marketing, decided: true } }));
}

export function onConsentChange(fn: (c: Consent) => void) {
  const h = (e: Event) => fn((e as CustomEvent<Consent>).detail);
  window.addEventListener(EVENT, h);
  return () => window.removeEventListener(EVENT, h);
}
