"use client";

// Link to Whop checkout. On click, forwards the visitor's ad tracking params
// (utm_*, fbclid) so Whop can attribute the sale to the ad that brought them.
import type { BuyInfo } from "@/lib/products";
import { trackInitiateCheckout } from "@/lib/track";

const TRACKED = /^(utm_[a-z]+|fbclid)$/;

function withTracking(href: string): string {
  const url = new URL(href);
  new URLSearchParams(window.location.search).forEach((v, k) => {
    if (TRACKED.test(k) && !url.searchParams.has(k)) url.searchParams.set(k, v);
  });
  return url.toString();
}

export default function BuyLink({ product, label = "Get the prompts", size, id }: { product: BuyInfo; label?: string; size?: "small"; id?: string }) {
  const { amount, compareAt } = product.price;
  return (
    <a
      id={id}
      className={size === "small" ? "buy small" : "buy"}
      href={product.whopUrl}
      onClick={(e) => {
        e.currentTarget.href = withTracking(product.whopUrl);
        trackInitiateCheckout(product.slug, { value: amount, currency: product.price.currency });
      }}
    >
      <span className="label">{label}</span>
      <span className="price">
        ${amount}
        {compareAt && size !== "small" ? <s><span className="sr-only">, was </span>${compareAt}</s> : null}
      </span>
      <span className="sr-only">, opens Whop checkout</span>
      <i className="corner" /><i className="corner" /><i className="corner" /><i className="corner" />
    </a>
  );
}
