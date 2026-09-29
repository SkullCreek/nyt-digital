// Cloudflare Turnstile server-side check (server only).
import "server-only";
import { fetchWithRetry } from "./http";

export async function verifyHuman(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Fail closed in production; allow local development without keys.
    if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
      console.error("TURNSTILE_SECRET_KEY is not set");
      return false;
    }
    return true;
  }
  if (!token) return false;
  try {
    const res = await fetchWithRetry("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
    }, { retries: 1, timeoutMs: 5000 });
    if (!res.ok) return false;
    const body = (await res.json()) as { success?: boolean };
    return body.success === true;
  } catch {
    return false;
  }
}
