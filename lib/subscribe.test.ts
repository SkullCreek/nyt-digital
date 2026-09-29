import { describe, expect, it, vi } from "vitest";
import { COOLDOWN_MS, handleSubscribe, type SubscribeDeps } from "./subscribe";

const NOW = new Date("2026-09-29T12:00:00Z");

function deps(overrides: Partial<SubscribeDeps> = {}) {
  const store = new Map<string, { sentAt?: Date }>();
  const d: SubscribeDeps = {
    verifyHuman: vi.fn(async () => true),
    getContact: vi.fn(async (email: string) => store.get(email) ?? null),
    upsertContact: vi.fn(async (email: string) => {
      if (!store.has(email)) store.set(email, {});
    }),
    sendFreePrompt: vi.fn(async () => {}),
    markSent: vi.fn(async (email: string, at: Date) => {
      store.set(email, { sentAt: at });
    }),
    now: () => NOW,
    ...overrides,
  };
  return { d, store };
}

const valid = { email: "Ana@Studio.com ", source: "ai-video-prompts-interior-design-reels", company: "", token: "tok" };

describe("handleSubscribe", () => {
  it("happy path: verifies, adds the contact, sends once and records the send", async () => {
    const { d } = deps();
    const r = await handleSubscribe(valid, "1.2.3.4", d);
    expect(r).toEqual({ ok: true, status: 200, sent: true });
    expect(d.verifyHuman).toHaveBeenCalledWith("tok", "1.2.3.4");
    expect(d.upsertContact).toHaveBeenCalledWith("ana@studio.com", "ai-video-prompts-interior-design-reels");
    expect(d.sendFreePrompt).toHaveBeenCalledWith("ana@studio.com");
    expect(d.markSent).toHaveBeenCalledWith("ana@studio.com", NOW);
  });

  it("rejects an invalid email without calling any service", async () => {
    const { d } = deps();
    const r = await handleSubscribe({ ...valid, email: "ana@" }, "ip", d);
    expect(r).toMatchObject({ ok: false, status: 400, reason: "invalid" });
    expect(d.verifyHuman).not.toHaveBeenCalled();
  });

  it("rejects a malformed body", async () => {
    const { d } = deps();
    expect(await handleSubscribe(null, "ip", d)).toMatchObject({ ok: false, status: 400 });
    expect(await handleSubscribe({ email: 42 }, "ip", d)).toMatchObject({ ok: false, status: 400 });
    expect(await handleSubscribe({ ...valid, source: "../../etc" }, "ip", d)).toMatchObject({ ok: false, status: 400 });
  });

  it("silently accepts but ignores honeypot submissions", async () => {
    const { d } = deps();
    const r = await handleSubscribe({ ...valid, company: "Acme Bots" }, "ip", d);
    expect(r).toEqual({ ok: true, status: 200, sent: false });
    expect(d.verifyHuman).not.toHaveBeenCalled();
    expect(d.sendFreePrompt).not.toHaveBeenCalled();
  });

  it("rejects when the human check fails", async () => {
    const { d } = deps({ verifyHuman: vi.fn(async () => false) });
    const r = await handleSubscribe(valid, "ip", d);
    expect(r).toMatchObject({ ok: false, status: 403, reason: "bot" });
    expect(d.upsertContact).not.toHaveBeenCalled();
  });

  it("is idempotent: a repeat within the cooldown does not send again", async () => {
    const { d } = deps();
    await handleSubscribe(valid, "ip", d);
    const r = await handleSubscribe(valid, "ip", d);
    expect(r).toEqual({ ok: true, status: 200, sent: false });
    expect(d.sendFreePrompt).toHaveBeenCalledTimes(1);
  });

  it("sends again once the cooldown has passed", async () => {
    const { d, store } = deps();
    store.set("ana@studio.com", { sentAt: new Date(NOW.getTime() - COOLDOWN_MS - 1000) });
    const r = await handleSubscribe(valid, "ip", d);
    expect(r).toMatchObject({ ok: true, sent: true });
  });

  it("does not record a send that failed, so a retry sends", async () => {
    const send = vi.fn().mockRejectedValueOnce(new Error("brevo down")).mockResolvedValueOnce(undefined);
    const { d } = deps({ sendFreePrompt: send });
    const first = await handleSubscribe(valid, "ip", d);
    expect(first).toMatchObject({ ok: false, status: 502, reason: "upstream" });
    expect(d.markSent).not.toHaveBeenCalled();
    const retry = await handleSubscribe(valid, "ip", d);
    expect(retry).toMatchObject({ ok: true, sent: true });
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("reports an upstream error when the contact lookup fails", async () => {
    const { d } = deps({ getContact: vi.fn(async () => Promise.reject(new Error("timeout"))) });
    expect(await handleSubscribe(valid, "ip", d)).toMatchObject({ ok: false, status: 502 });
  });
});
