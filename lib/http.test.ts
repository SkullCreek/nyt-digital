import { describe, expect, it, vi } from "vitest";
import { fetchWithRetry } from "./http";

const res = (status: number) => new Response(null, { status });
const noSleep = async () => {};

describe("fetchWithRetry", () => {
  it("returns the first successful response", async () => {
    const f = vi.fn(async () => res(200));
    const r = await fetchWithRetry("https://x", {}, { fetch: f, sleep: noSleep });
    expect(r.status).toBe(200);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("retries 429 and 5xx, then succeeds", async () => {
    const f = vi.fn().mockResolvedValueOnce(res(503)).mockResolvedValueOnce(res(429)).mockResolvedValueOnce(res(201));
    const r = await fetchWithRetry("https://x", {}, { fetch: f, sleep: noSleep, retries: 2 });
    expect(r.status).toBe(201);
    expect(f).toHaveBeenCalledTimes(3);
  });

  it("retries network errors", async () => {
    const f = vi.fn().mockRejectedValueOnce(new TypeError("fetch failed")).mockResolvedValueOnce(res(200));
    const r = await fetchWithRetry("https://x", {}, { fetch: f, sleep: noSleep });
    expect(r.status).toBe(200);
  });

  it("does not retry other 4xx responses", async () => {
    const f = vi.fn(async () => res(400));
    const r = await fetchWithRetry("https://x", {}, { fetch: f, sleep: noSleep, retries: 3 });
    expect(r.status).toBe(400);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("gives up after the last retry", async () => {
    const f = vi.fn(async () => res(502));
    const r = await fetchWithRetry("https://x", {}, { fetch: f, sleep: noSleep, retries: 2 });
    expect(r.status).toBe(502);
    expect(f).toHaveBeenCalledTimes(3);
  });

  it("throws the last network error when every attempt fails", async () => {
    const f = vi.fn(async () => Promise.reject(new TypeError("offline")));
    await expect(fetchWithRetry("https://x", {}, { fetch: f, sleep: noSleep, retries: 1 })).rejects.toThrow("offline");
    expect(f).toHaveBeenCalledTimes(2);
  });
});
