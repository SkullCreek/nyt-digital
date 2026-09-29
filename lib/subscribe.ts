// "Try a prompt free" signup: domain logic only. Brevo, Turnstile and HTTP live elsewhere
// and are passed in, so this can be tested without any network.
import { z } from "zod";

export const COOLDOWN_MS = 24 * 60 * 60 * 1000; // one free-prompt email per address per day

export type SubscribeDeps = {
  verifyHuman: (token: string, ip: string) => Promise<boolean>;
  getContact: (email: string) => Promise<{ sentAt?: Date } | null>;
  upsertContact: (email: string, source: string) => Promise<void>;
  sendFreePrompt: (email: string) => Promise<void>;
  markSent: (email: string, at: Date) => Promise<void>;
  now: () => Date;
};

export type SubscribeResult =
  | { ok: true; status: 200; sent: boolean }
  | { ok: false; status: 400 | 403 | 502; reason: "invalid" | "bot" | "upstream" };

const Body = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  source: z.string().regex(/^[a-z0-9-]{1,64}$/),
  company: z.string().max(200).optional().default(""), // honeypot
  token: z.string().max(4096).optional().default(""),
});

export async function handleSubscribe(input: unknown, ip: string, deps: SubscribeDeps): Promise<SubscribeResult> {
  const parsed = Body.safeParse(input);
  if (!parsed.success) return { ok: false, status: 400, reason: "invalid" };
  const { email, source, company, token } = parsed.data;

  // Bots fill the hidden field. Look successful so they don't adapt; do nothing.
  if (company.trim() !== "") return { ok: true, status: 200, sent: false };

  if (!(await deps.verifyHuman(token, ip))) return { ok: false, status: 403, reason: "bot" };

  try {
    const existing = await deps.getContact(email);
    if (existing?.sentAt && deps.now().getTime() - existing.sentAt.getTime() < COOLDOWN_MS) {
      // Already sent recently: same answer, no second email (idempotent, and no inbox flooding).
      return { ok: true, status: 200, sent: false };
    }
    await deps.upsertContact(email, source);
    await deps.sendFreePrompt(email);
    await deps.markSent(email, deps.now());
    return { ok: true, status: 200, sent: true };
  } catch {
    return { ok: false, status: 502, reason: "upstream" };
  }
}
