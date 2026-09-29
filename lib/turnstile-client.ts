// Browser side of Cloudflare Turnstile. The script loads on first use of a form, and the
// widget stays invisible unless Cloudflare needs the visitor to tick a box.

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  execute: (id: string) => void;
  reset: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loading: Promise<Turnstile> | null = null;

export function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile missing")));
    s.onerror = () => {
      loading = null;
      reject(new Error("turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return loading;
}

// One widget per form. getToken() runs the check and resolves with a fresh single-use token.
export function createTurnstile(container: HTMLElement, onInteractive?: (visible: boolean) => void) {
  let id: string | null = null;
  let pending: { resolve: (t: string) => void; reject: (e: Error) => void } | null = null;

  async function ensure() {
    const ts = await loadTurnstile();
    id ??= ts.render(container, {
      sitekey: TURNSTILE_SITE_KEY,
      appearance: "interaction-only",
      execution: "execute",
      callback: (token: string) => pending?.resolve(token),
      "error-callback": () => pending?.reject(new Error("turnstile error")),
      "expired-callback": () => ts.reset(id!),
      // Cloudflare only shows a checkbox when it needs one; tell the form so it can explain it.
      "before-interactive-callback": () => onInteractive?.(true),
      "after-interactive-callback": () => onInteractive?.(false),
    });
    return ts;
  }

  return {
    warm: () => (TURNSTILE_SITE_KEY ? ensure().catch(() => {}) : undefined),
    async getToken(): Promise<string> {
      if (!TURNSTILE_SITE_KEY) return ""; // local dev without keys
      const ts = await ensure();
      return new Promise<string>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("turnstile timeout")), 30000);
        pending = {
          resolve: (t) => (clearTimeout(timer), resolve(t)),
          reject: (e) => (clearTimeout(timer), reject(e)),
        };
        ts.reset(id!);
        ts.execute(id!);
      });
    },
  };
}
