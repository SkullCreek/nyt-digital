// Ad measurement events. Events wait in a small queue until the pixels announce they're
// ready (see components/Tracking.tsx). Without consent the pixels never load, so nothing
// is ever sent. Purchase is not sent from here: Whop tracks its own checkout.

type Fbq = (...args: unknown[]) => void;
type Whop = { track: (...args: unknown[]) => void };
declare global {
  interface Window {
    fbq?: Fbq;
    whop?: Whop;
  }
}

export const READY_EVENT = "nyt-pixels-ready";
export type Money = { value: number; currency: string };

const pending: (() => void)[] = [];

function send(fn: () => void) {
  if (window.fbq || window.whop) return fn();
  if (pending.length < 20) pending.push(fn);
}

if (typeof window !== "undefined") {
  window.addEventListener(READY_EVENT, () => pending.splice(0).forEach((fn) => fn()));
}

export function trackViewContent(id: string, name: string, money: Money) {
  send(() => window.fbq?.("track", "ViewContent", { content_ids: [id], content_name: name, content_type: "product", ...money }));
}

export function trackInitiateCheckout(id: string, money: Money) {
  send(() => window.fbq?.("track", "InitiateCheckout", { content_ids: [id], num_items: 1, ...money }));
}

export function trackLead(source: string) {
  send(() => {
    window.fbq?.("track", "Lead", { content_name: source });
    window.whop?.track("lead");
  });
}
