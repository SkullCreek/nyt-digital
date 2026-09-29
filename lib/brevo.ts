// Brevo adapter (server only). Needs contact attributes SOURCE (text) and
// FREE_PROMPT_SENT_AT (text, ISO timestamp) to exist in the Brevo account; see README.
import "server-only";
import { fetchWithRetry } from "./http";
import { freePromptEmail } from "./free-prompt";
import { CONTACT, SITE } from "./site";

const API = "https://api.brevo.com/v3";

function config() {
  const key = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!key || !Number.isInteger(listId)) throw new Error("Brevo is not configured (BREVO_API_KEY, BREVO_LIST_ID)");
  return { key, listId };
}

async function call(path: string, init: RequestInit & { okStatuses?: number[] } = {}) {
  const { key } = config();
  const res = await fetchWithRetry(`${API}${path}`, {
    ...init,
    headers: { "api-key": key, accept: "application/json", "content-type": "application/json", ...init.headers },
  });
  if (!res.ok && !(init.okStatuses ?? []).includes(res.status)) {
    // Log the endpoint and status only: paths and bodies can contain the email address.
    console.error(`Brevo ${init.method ?? "GET"} /${path.split("/")[1]} failed: ${res.status}`);
    throw new Error(`Brevo ${res.status}`);
  }
  return res;
}

export async function getContact(email: string): Promise<{ sentAt?: Date } | null> {
  const res = await call(`/contacts/${encodeURIComponent(email)}`, { okStatuses: [404] });
  if (res.status === 404) return null;
  const body = (await res.json()) as { attributes?: Record<string, unknown> };
  const raw = body.attributes?.FREE_PROMPT_SENT_AT;
  const sentAt = typeof raw === "string" ? new Date(raw) : undefined;
  return { sentAt: sentAt && !Number.isNaN(sentAt.getTime()) ? sentAt : undefined };
}

export async function upsertContact(email: string, source: string) {
  const { listId } = config();
  await call("/contacts", {
    method: "POST",
    body: JSON.stringify({ email, listIds: [listId], updateEnabled: true, attributes: { SOURCE: source } }),
  });
}

export async function sendFreePrompt(email: string) {
  const { subject, html, text } = freePromptEmail();
  await call("/smtp/email", {
    method: "POST",
    body: JSON.stringify({
      sender: { name: "NYT Studios", email: CONTACT.email },
      replyTo: { email: CONTACT.email },
      to: [{ email }],
      subject,
      htmlContent: html,
      textContent: text,
      tags: ["free-prompt", new URL(SITE.url).hostname],
    }),
  });
}

export async function markSent(email: string, at: Date) {
  await call(`/contacts/${encodeURIComponent(email)}`, {
    method: "PUT",
    body: JSON.stringify({ attributes: { FREE_PROMPT_SENT_AT: at.toISOString() } }),
  });
}
