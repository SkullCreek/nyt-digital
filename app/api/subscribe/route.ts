// POST /api/subscribe: HTTP adapter for the free-prompt signup.
import { NextResponse, type NextRequest } from "next/server";
import { handleSubscribe } from "@/lib/subscribe";
import { getContact, markSent, sendFreePrompt, upsertContact } from "@/lib/brevo";
import { verifyHuman } from "@/lib/turnstile";

export const runtime = "nodejs";

// Best-effort per-instance rate limit. Turnstile is the real bot defence; this just blunts bursts.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(ip: string, now: number) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  if (limited(ip, Date.now())) {
    return NextResponse.json({ ok: false, reason: "rate_limited" }, { status: 429, headers: { "Retry-After": "600" } });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const result = await handleSubscribe(body, ip, {
    verifyHuman,
    getContact,
    upsertContact,
    sendFreePrompt,
    markSent,
    now: () => new Date(),
  });

  return NextResponse.json(result.ok ? { ok: true } : { ok: false, reason: result.reason }, { status: result.status });
}
