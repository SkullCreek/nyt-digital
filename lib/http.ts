// fetch with a timeout and retries for transient failures (network errors, 429, 5xx).
// Other 4xx responses are returned immediately: retrying them can't help.

type Opts = {
  retries?: number;
  timeoutMs?: number;
  fetch?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
};

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const transient = (status: number) => status === 429 || status >= 500;

export async function fetchWithRetry(url: string, init: RequestInit, opts: Opts = {}): Promise<Response> {
  const { retries = 2, timeoutMs = 8000, fetch: f = fetch, sleep = wait } = opts;
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await sleep(300 * 2 ** (attempt - 1) + Math.random() * 100);
    try {
      const res = await f(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
      if (!transient(res.status) || attempt === retries) return res;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}
